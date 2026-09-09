from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
REPORTING_PY = Path(__file__).resolve().parents[1] / "tools" / "reporting.py"


class ReportingInstructionContractTests(unittest.TestCase):
    def test_production_skill_docs_do_not_execute_legacy_reporting_commands(self) -> None:
        """Only executable legacy commands are forbidden; compatibility prose is allowed."""
        legacy_command = re.compile(
            r"(?:python3[^\n`]*reporting\.py\s+(?:send|send-query|send-docs-query)"
            r"|reporting\.py\s+(?:send|send-query|send-docs-query)\s+--"
            r"|mcp__tencent-rtc-skill-tool__skill_analysis)"
        )
        runtime_docs = {
            ROOT / "skills" / "trtc" / "runtime" / "REPORTING.md",
            ROOT / "skills" / "trtc" / "runtime" / "RUNTIME.md",
        }
        for path in (ROOT / "skills").rglob("*.md"):
            if path in runtime_docs:
                continue
            text = path.read_text(encoding="utf-8")
            in_fence = False
            for line_no, line in enumerate(text.splitlines(), 1):
                if line.strip().startswith("```"):
                    in_fence = not in_fence
                    continue
                # Fenced lines and shell-looking blockquotes are executable
                # documentation. Plain prose such as "不得调用 send" is allowed.
                shell_line = re.sub(r"^\s*>\s*", "", line).lstrip()
                executable = in_fence or bool(
                    re.match(r"(?:\$\s*)?(?:python3|reporting\.py)\b", shell_line)
                )
                if executable and legacy_command.search(line):
                    self.fail(
                        f"legacy executable reporting command in {path.relative_to(ROOT)}:{line_no}: {line.strip()}"
                    )

    def test_root_has_one_prompt_reporting_command(self) -> None:
        text = (ROOT / "skills" / "trtc" / "SKILL.md").read_text(encoding="utf-8")
        self.assertEqual(text.count('reporting.py" prompt --input-stdin'), 1)
        self.assertEqual(text.count('invoke --skillname'), 1)

    def test_business_skills_keep_reporting_instructions_compact(self) -> None:
        skill_paths = [
            "skills/trtc-docs/SKILL.md",
            "skills/trtc-conference/SKILL.md",
            "skills/trtc-ai-service/SKILL.md",
            "skills/trtc-ai-oral-coach/SKILL.md",
            "skills/trtc-ai-realtime-interpreter/SKILL.md",
            "skills/trtc-push/SKILL.md",
        ]
        for relative in skill_paths:
            with self.subTest(skill=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertLessEqual(text.count("tools/reporting.py"), 1)
                self.assertLessEqual(text.count("context --question"), 1)

    def test_host_bootstraps_have_one_reporting_command(self) -> None:
        for relative in ("AGENTS.md", "CLAUDE.md", "CODEBUDDY.md"):
            with self.subTest(host=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertEqual(text.count("tools/reporting.py"), 3)
                self.assertIn("preference --enabled off", text)
                self.assertIn("prompt --input-stdin --require-input", text)
                self.assertIn("prompt --control-choice allow|deny", text)
                self.assertIn("empty, unknown, or failed output continues", text)
                self.assertIn("TRTC_REPORTING_NOTICE_REQUIRED_V1", text)
                self.assertIn("MUST run", text)
                self.assertIn("invoke --skillname", text)
                self.assertIn("MUST NOT invoke this command or perform network I/O", text)

        cursor_rule = (
            ROOT / ".cursor" / "rules" / "ui-mode.mdc"
        ).read_text(encoding="utf-8")
        self.assertEqual(cursor_rule.count("trtc/tools/reporting.py"), 3)
        self.assertIn("preference --enabled off", cursor_rule)
        self.assertIn("prompt --input-stdin --require-input", cursor_rule)
        self.assertIn("prompt --control-choice allow|deny", cursor_rule)
        self.assertIn("failed output continues", cursor_rule)
        self.assertIn("TRTC_REPORTING_NOTICE_REQUIRED_V1", cursor_rule)
        self.assertIn(".cursor/skills/trtc/SKILL.md", cursor_rule)
        self.assertIn("MUST run", cursor_rule)
        self.assertIn("invoke --skillname", cursor_rule)
        self.assertIn("MUST NOT invoke this command or perform network I/O", cursor_rule)

    def test_workflow_docs_never_call_reporting_mcp_directly(self) -> None:
        protocol = ROOT / "skills" / "trtc" / "runtime" / "REPORTING.md"
        for path in (ROOT / "skills").rglob("*.md"):
            if path == protocol:
                continue
            with self.subTest(path=path.relative_to(ROOT)):
                text = path.read_text(encoding="utf-8")
                self.assertNotIn(
                    "mcp__tencent-rtc-skill-tool__skill_analysis", text
                )

    def test_hook_configs_never_run_foreground_invoke(self) -> None:
        # Hooks are intentionally local-only. The foreground dispatcher owns
        # promote/flush so an IDE hook cannot create a hidden network path.
        for relative in ("hooks/hooks.json", "hooks/hooks-cursor.json"):
            with self.subTest(hooks=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertNotIn("--skillname", text)
                self.assertNotRegex(text, r"(?:^|\s)invoke(?:\s|\"|$)")

    def test_workflow_docs_use_unified_reporting_cli(self) -> None:
        for path in (ROOT / "skills").rglob("*.md"):
            with self.subTest(path=path.relative_to(ROOT)):
                text = path.read_text(encoding="utf-8")
                if path.name == "REPORTING.md":
                    continue
                self.assertNotIn("reporting_v2.py", text)

    def test_continuation_notice_resource_is_packaged_and_matches_projection(self) -> None:
        runtime = ROOT / "skills" / "trtc" / "runtime"
        spec = json.loads((runtime / "continuation-notice.json").read_text(encoding="utf-8"))
        projection = (runtime / "continuation-notice.md").read_text(encoding="utf-8")
        self.assertIsInstance(spec.get("version"), int)
        self.assertIsInstance(spec.get("body"), str)
        self.assertIn(spec["body"], projection)
        self.assertIn(spec["allow_label"], projection)
        self.assertIn(spec["deny_label"], projection)
        self.assertIn("continuation-notice.json", (ROOT / "package.json").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()


class ReportingC20aStdinContractTests(unittest.TestCase):
    """Real subprocess tests for C20.1a stdin safety protocol.

    Each test runs reporting.py as a child process and asserts
    stdout == b'' and stderr == b'' in non-debug mode for all
    prompt command paths (--input-stdin, --control-choice, and
    mutual-exclusion errors).
    """

    def setUp(self):
        self.tmpdir = tempfile.mkdtemp(prefix="c20a-")
        self.env = {**os.environ, "TRTC_TELEMETRY_STATE_ROOT": self.tmpdir}

    def tearDown(self):
        shutil.rmtree(self.tmpdir, ignore_errors=True)

    def _run(self, args, *, stdin_data=None):
        return subprocess.run(
            [sys.executable, str(REPORTING_PY)] + args,
            input=stdin_data,
            capture_output=True,
            env=self.env,
            cwd=self.tmpdir,
        )

    def _pending_count(self):
        pending = Path(self.tmpdir) / "telemetry" / "pending"
        if not pending.exists():
            return 0
        return sum(1 for p in pending.rglob("*") if p.is_file())

    def test_c20a_1_input_stdin_normal_stdout_stderr_empty(self):
        """--input-stdin normal path: stdout and stderr are empty."""
        payload = json.dumps({"text": "测试 prompt"}).encode()
        r = self._run(["prompt", "--input-stdin"], stdin_data=payload)
        self.assertEqual(r.stdout, b"", "stdout must be empty")
        self.assertEqual(r.stderr, b"", "stderr must be empty in non-debug mode")
        self.assertEqual(r.returncode, 0)

    def test_c20a_1b_require_input_rejects_empty_stdin(self):
        """Foreground callers must not treat an empty pipe as a successful report."""
        r = self._run(["prompt", "--input-stdin", "--require-input"], stdin_data=b"")
        self.assertEqual(r.stdout, b"")
        self.assertNotEqual(r.returncode, 0)
        self.assertIn(b"prompt stdin invalid", r.stderr)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_1c_require_input_accepts_valid_stdin(self):
        """The foreground guard only rejects missing/invalid input."""
        payload = json.dumps({"text": "required prompt"}).encode()
        r = self._run(["prompt", "--input-stdin", "--require-input"], stdin_data=payload)
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)

    def test_c20a_2_input_stdin_and_text_mutually_exclusive(self):
        """--input-stdin + --text together: argparse rejects, stdout empty, stderr has error."""
        r = self._run(
            ["prompt", "--input-stdin", "--text", "hello"],
            stdin_data=json.dumps({"text": "hello"}).encode(),
        )
        self.assertNotEqual(r.returncode, 0, "must exit non-zero when args conflict")
        self.assertEqual(r.stdout, b"", "stdout must be empty even for argparse errors")
        self.assertGreater(len(r.stderr), 0, "argparse error must appear on stderr")

    def test_c20a_3_input_stdin_and_control_choice_mutually_exclusive(self):
        """--input-stdin + --control-choice together: argparse rejects, stdout empty."""
        r = self._run(
            ["prompt", "--input-stdin", "--control-choice", "allow"],
            stdin_data=json.dumps({"text": "hello"}).encode(),
        )
        self.assertNotEqual(r.returncode, 0)
        self.assertEqual(r.stdout, b"")
        self.assertGreater(len(r.stderr), 0)

    def test_c20a_4_oversized_input_stdout_stderr_empty(self):
        """Input > 32768 bytes: invalid immediately; stdout, stderr, and pending all empty."""
        big_payload = json.dumps({"text": "x" * 33000}).encode()
        self.assertGreater(len(big_payload), 32768)
        r = self._run(["prompt", "--input-stdin"], stdin_data=big_payload)
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0, "no pending files on oversized input")

    def test_c20a_5_invalid_utf8_stdout_stderr_empty(self):
        """Non-UTF-8 bytes: invalid; stdout, stderr, and pending all empty."""
        r = self._run(["prompt", "--input-stdin"], stdin_data=b"\xff\xfe bad utf-8 \x80\x81")
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_6_nul_byte_stdout_stderr_empty(self):
        """Raw NUL byte in decoded payload: invalid; stdout, stderr, and pending all empty."""
        payload = b'{"text": "hello\x00world"}'
        r = self._run(["prompt", "--input-stdin"], stdin_data=payload)
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_6b_escaped_nul_in_text_field_invalid(self):
        """JSON-escaped \\u0000 in text value: invalid after JSON parse, no pending files.

        The raw-string NUL scan passes (no literal 0x00 in the bytes), but
        json.loads produces 'hello\\x00world'. The post-parse check must catch it.
        """
        payload = b'{"text": "hello\\u0000world"}'
        r = self._run(["prompt", "--input-stdin"], stdin_data=payload)
        self.assertEqual(r.stdout, b"", "stdout must be empty")
        self.assertEqual(r.stderr, b"", "stderr must be empty in non-debug mode")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0, "escaped NUL must not produce a pending file")

    def test_c20a_7_injection_chars_stdout_stderr_empty(self):
        """Shell metacharacters in text: stdout and stderr empty (no shell expansion)."""
        text = "$() `rm -rf /tmp/evil` 'single' \"double\" \n newline \r carriage"
        payload = json.dumps({"text": text}).encode()
        r = self._run(["prompt", "--input-stdin"], stdin_data=payload)
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)

    def test_c20a_8_empty_object_stdout_stderr_empty(self):
        """Empty JSON object: missing text field; stdout, stderr, and pending all empty."""
        r = self._run(["prompt", "--input-stdin"], stdin_data=b"{}")
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_9_missing_text_field_stdout_stderr_empty(self):
        """JSON without 'text' key: invalid; stdout, stderr, and pending all empty."""
        payload = json.dumps({"other": "value"}).encode()
        r = self._run(["prompt", "--input-stdin"], stdin_data=payload)
        self.assertEqual(r.stdout, b"")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_10_control_choice_allow_stdout_stderr_empty(self):
        """--control-choice allow without a receipt is retryable, never ordinary Prompt."""
        r = self._run(["prompt", "--control-choice", "allow"])
        self.assertEqual(r.stdout, b"TRTC_REPORTING_CHOICE_RETRY_V1\n")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)

    def test_c20a_11_control_choice_deny_stdout_stderr_empty(self):
        """--control-choice deny without a receipt is retryable, never ordinary Prompt."""
        r = self._run(["prompt", "--control-choice", "deny"])
        self.assertEqual(r.stdout, b"TRTC_REPORTING_CHOICE_RETRY_V1\n")
        self.assertEqual(r.stderr, b"")
        self.assertEqual(r.returncode, 0)
        self.assertEqual(self._pending_count(), 0)
