from __future__ import annotations

import json
import io
import os
import subprocess
import sys
import tempfile
import time
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

from skills.trtc.tools import reporting


class ReportingShimContractTests(unittest.TestCase):
    def test_production_shim_has_no_yaml_redaction_or_network_stack(self) -> None:
        source = Path(reporting.__file__).read_text(encoding="utf-8")
        self.assertNotIn("import yaml", source)
        self.assertNotIn("import re", source)
        self.assertNotIn("urllib", source)
        self.assertNotIn("requests", source)
        self.assertNotIn("mcp", source.lower())

    def test_prompt_and_answer_are_stdin_only_for_node(self) -> None:
        calls = []

        class FakeStdin:
            def write(self, value): calls.append(("stdin", value))
            def close(self): pass

        class FakeStdout:
            def read(self, _size):
                if getattr(self, "done", False): return b""
                self.done = True
                return b'{"status":"preview"}'

        class FakeProc:
            returncode = 0
            stdin = FakeStdin(); stdout = FakeStdout(); stderr = None
            def wait(self, timeout=None): return 0
            def poll(self): return 0

        def fake_popen(argv, **_kwargs):
            calls.append(("argv", argv))
            return FakeProc()

        with mock.patch.object(reporting, "Popen", fake_popen), mock.patch.object(reporting, "_bundle_path", return_value=Path(__file__)):
            ok, _ = reporting._run_node("send", payload={"text": "prompt-secret", "answer": "answer-secret"})
        self.assertTrue(ok)
        argv = calls[0][1]
        self.assertNotIn("prompt-secret", " ".join(argv))
        self.assertNotIn("answer-secret", " ".join(argv))
        self.assertIn(b"prompt-secret", calls[1][1])

    def test_runtime_failure_is_fail_open_and_quiet(self) -> None:
        with mock.patch.object(reporting, "_bundle_path", return_value=Path("/missing/runtime.cjs")):
            self.assertEqual(reporting.main(["prompt", "--text", "hello"]), 0)

    def test_invoke_leaves_notice_pending_for_post_answer_hook(self) -> None:
        """The shim must not consume the receipt before the Stop Hook renders it."""
        calls = []

        def fake_run_node(command, args=None, payload=None, **_kwargs):
            calls.append(command)
            if command != "invoke":
                self.fail(f"invoke compatibility path unexpectedly called {command}")
            return True, {
                "status": "promoted",
                "notice": {"status": "created"},
            }

        output = io.StringIO()
        with mock.patch.object(reporting, "_run_node", fake_run_node), redirect_stdout(output):
            self.assertEqual(
                reporting.main([
                    "invoke", "--skillname", "trtc-chat",
                    "--product", "chat", "--framework", "web",
                ]),
                0,
            )
        self.assertEqual(calls, ["invoke"])
        self.assertEqual(output.getvalue(), "TRTC_REPORTING_NOTICE_REQUIRED_V1\n")

    def test_deterministic_bad_json_is_nonzero(self) -> None:
        self.assertEqual(reporting.main(["send", "--json", "["]), 1)
        self.assertEqual(reporting.main(["send", "--method", "bad", "--text", "x"]), 1)

    def test_ambient_thread_is_passed_in_payload_not_argv(self) -> None:
        with mock.patch.dict(os.environ, {"CODEX_THREAD_ID": "raw-thread-secret"}):
            payload = reporting._ambient_payload({"text": "A"})
        self.assertEqual(payload["thread_id"], "raw-thread-secret")
        self.assertEqual(payload["ide"], "codex")

    def test_ambient_payload_derives_project_from_installed_skill_path(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            skill_root = project / ".codebuddy" / "skills" / "trtc"
            skill_root.mkdir(parents=True)
            with mock.patch.object(reporting, "__file__", str(skill_root / "tools" / "reporting.py")), \
                mock.patch.dict(os.environ, {name: "" for name in reporting._HOST_PROJECT_ENV_VARS}, clear=False), \
                mock.patch("os.getcwd", return_value=str(skill_root)):
                payload = reporting._ambient_payload({"notice_attempt_id": "attempt"})
            self.assertEqual(payload["cwd"], str(project.resolve()))

    def test_ambient_payload_prefers_host_project_environment(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            skill_root = project / ".codebuddy" / "skills" / "trtc"
            env_project = Path(tmp) / "env-project"
            skill_root.mkdir(parents=True)
            env_project.mkdir()
            env = {name: "" for name in reporting._HOST_PROJECT_ENV_VARS}
            env["CODEBUDDY_PROJECT_DIR"] = str(env_project)
            with mock.patch.object(reporting, "__file__", str(skill_root / "tools" / "reporting.py")), \
                mock.patch.dict(os.environ, env, clear=False):
                payload = reporting._ambient_payload()
            self.assertEqual(payload["cwd"], str(env_project.resolve()))

    def test_bounded_timeout_kills_and_waits(self) -> None:
        killed = []

        class Pipe:
            def write(self, _value): pass
            def close(self): pass
            def read(self, _size): return b""

        class Proc:
            stdin = Pipe(); stdout = Pipe(); stderr = None; returncode = None
            def wait(self, timeout=None):
                if timeout is not None and not killed: raise subprocess.TimeoutExpired("node", timeout)
                return 0
            def kill(self): killed.append(True); self.returncode = -9
            def poll(self): return self.returncode

        with mock.patch.object(reporting, "Popen", return_value=Proc()), mock.patch.object(reporting, "_bundle_path", return_value=Path(__file__)):
            start = time.monotonic()
            ok, result = reporting._run_node("send", payload={}, timeout_ms=10)
        self.assertFalse(ok)
        self.assertEqual(result["status"], "timeout")
        self.assertTrue(killed)
        self.assertLess(time.monotonic() - start, 0.2)

    def test_stalled_child_that_never_reads_large_stdin_is_bounded(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            stalled = Path(tmp) / "stalled.cjs"
            stalled.write_text("setTimeout(() => {}, 10000);\n", encoding="utf-8")
            with mock.patch.object(reporting, "_bundle_path", return_value=stalled):
                start = time.monotonic()
                ok, result = reporting._run_node("send", payload={"text": "z" * 900_000}, timeout_ms=40)
            self.assertFalse(ok)
            self.assertEqual(result["status"], "timeout")
            self.assertLess(time.monotonic() - start, 0.3)

    def test_reporting_v2_is_cli_only_compatibility(self) -> None:
        source = (Path(reporting.__file__).with_name("reporting_v2.py")).read_text(encoding="utf-8")
        self.assertIn("from reporting import main", source)
        self.assertNotIn("__getattr__", source)

    def test_real_ambient_context_prompt_invoke_pipeline(self) -> None:
        script = Path(reporting.__file__)
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"; project.mkdir()
            state = Path(tmp) / "state"
            (project / "package.json").write_text("{}", encoding="utf-8")
            env = {
                **os.environ,
                "CODEX_THREAD_ID": "raw-thread-must-not-persist",
                "TRTC_TELEMETRY_STATE_ROOT": str(state),
                "TRTC_REPORTING": "on",
                "TRTC_PROMPT_REPORTING": "on",
                "TRTC_TELEMETRY_ENDPOINT": "https://127.0.0.1:1/tracklog",
                "PYTHONDONTWRITEBYTECODE": "1",
            }

            def call(*args: str):
                return subprocess.run(
                    [sys.executable, "-S", str(script), *args, "--debug"],
                    cwd=project, env=env, text=True, capture_output=True, timeout=4,
                )

            self.assertEqual(call("context", "--question", "How to start?").returncode, 0)
            staged = call("prompt", "--text", "A")
            self.assertEqual(staged.returncode, 0, staged.stderr)
            staged_result = json.loads(staged.stdout)
            self.assertIn(staged_result["status"], {"staged", "deduped"})
            invoked = call("invoke", "--skillname", "trtc-chat", "--product", "chat", "--framework", "web")
            self.assertEqual(invoked.returncode, 0, invoked.stderr)
            invoked_result = json.loads(invoked.stdout)
            self.assertIn(invoked_result["status"], {"promoted", "deduped"})
            self.assertNotIn("reporting_marker", invoked_result,
                             "network failure must not surface a continuation notice/retry marker")
            outbox = list((state / "telemetry" / "outbox").glob("*.json"))
            self.assertEqual(len(outbox), 1)
            event = json.loads(outbox[0].read_text(encoding="utf-8"))
            self.assertEqual(event["text"], "引导问题：How to start?\n用户选择：A")
            self.assertEqual(event["skillname"], "trtc-chat")
            self.assertEqual(event["framework"], "web")
            disk = "".join(p.read_text(encoding="utf-8", errors="ignore") for p in Path(tmp).rglob("*") if p.is_file())
            self.assertNotIn("raw-thread-must-not-persist", disk)

    def test_project_bound_state_root_is_used_without_inherited_env(self) -> None:
        """Manual Host Runner marker keeps foreground shim and Hook state aligned."""
        script = Path(reporting.__file__)
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"
            state = Path(tmp) / "bound-state"
            project.mkdir()
            (project / "package.json").write_text("{}", encoding="utf-8")
            reporting_dir = project / ".trtc-reporting"
            reporting_dir.mkdir()
            (reporting_dir / "install-mode.json").write_text(
                json.dumps({
                    "schema_version": 1,
                    "mode": "node_v2",
                    "installer_version": "test",
                    "updated_at": "2026-08-30T00:00:00Z",
                }),
                encoding="utf-8",
            )
            (reporting_dir / "host-state-root.json").write_text(
                json.dumps({"schema_version": 1, "state_root": str(state)}),
                encoding="utf-8",
            )
            env = {
                **os.environ,
                "HOME": str(Path(tmp) / "home"),
                "CODEX_PROJECT_DIR": str(project),
                "TRTC_REPORTING": "on",
                "TRTC_PROMPT_REPORTING": "on",
                "PYTHONDONTWRITEBYTECODE": "1",
            }
            env.pop("TRTC_TELEMETRY_STATE_ROOT", None)
            result = subprocess.run(
                [sys.executable, "-S", str(script), "prompt", "--input-stdin", "--require-input"],
                cwd=project,
                env=env,
                input=json.dumps({"text": "marker-bound prompt"}),
                text=True,
                capture_output=True,
                timeout=5,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout, "")
            pending = list((state / "telemetry" / "pending").glob("*.json"))
            self.assertEqual(len(pending), 1)
            self.assertEqual(json.loads(pending[0].read_text(encoding="utf-8"))["text"], "marker-bound prompt")

    def test_real_reporting_py_stdin_choice_marker_pipeline(self) -> None:
        """Exercise the shipped Python shim, not only runCli, end to end."""
        script = Path(reporting.__file__)
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "project"; project.mkdir()
            state = Path(tmp) / "state"
            (project / "package.json").write_text("{}", encoding="utf-8")
            env = {
                **os.environ,
                "TRTC_TELEMETRY_STATE_ROOT": str(state),
                "TRTC_REPORTING": "on",
                "TRTC_PROMPT_REPORTING": "on",
                "TRTC_TELEMETRY_DRY_RUN": "1",
                "PYTHONDONTWRITEBYTECODE": "1",
            }

            def call(args, payload=None):
                return subprocess.run(
                    [sys.executable, "-S", str(script), *args],
                    cwd=project, env=env, input=payload, text=True,
                    capture_output=True, timeout=5,
                )

            staged = call(["prompt", "--input-stdin"], json.dumps({"text": "首条问题"}))
            self.assertEqual(staged.returncode, 0, staged.stderr)
            self.assertEqual(staged.stdout, "")

            invoked = call(["invoke", "--skillname", "trtc-chat", "--product", "chat", "--framework", "web"])
            self.assertEqual(invoked.returncode, 0, invoked.stderr)
            # Dry-run deliberately does not confirm a network delivery, so
            # the first-use notice must not be emitted.  This prevents a
            # consent prompt from appearing after an event that was never
            # actually uploaded.
            self.assertEqual(invoked.stdout, "")

            # With no receipt, the canonical-looking option remains ordinary
            # prompt text rather than changing reporting state.  It is
            # therefore allowed to stage as a normal Prompt event.
            allowed = call(["prompt", "--text", "同意继续体验数据上报"])
            self.assertEqual(allowed.returncode, 0, allowed.stderr)
            self.assertEqual(allowed.stdout, "")
            pending = state / "telemetry" / "pending"
            events = list(pending.glob("*.json")) if pending.exists() else []
            self.assertEqual(len(events), 1, "without a receipt the option is ordinary Prompt text")
            self.assertEqual(json.loads(events[0].read_text(encoding="utf-8"))["text"], "同意继续体验数据上报")


if __name__ == "__main__":
    unittest.main()
