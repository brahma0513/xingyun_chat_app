// App's recorder is a singleton and does not support removing all listeners.
// Bind once, and keep ownership until native stop/error acknowledges completion.
export function createRecorderBridge(recorder) {
    let owner = null;
    recorder.onStart(() => { if (owner) owner.started(); });
    recorder.onStop(result => { const current = owner; owner = null; if (current) current.stopped(result); });
    recorder.onError(error => { const current = owner; owner = null; if (current) current.failed(error); });
    if (typeof recorder.onInterruptionBegin === 'function') recorder.onInterruptionBegin(() => { if (owner) owner.interrupted(); });
    return {
        start(current) {
            if (owner) throw new Error('上一段录音正在结束，请稍后重试');
            owner = current;
            try { recorder.start({ duration: 61000, sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 48000, format: 'mp3' }); }
            catch (error) { owner = null; throw error; }
        },
        stop(current) { if (owner === current) recorder.stop(); }
    };
}

export function getVoiceRecorderBridge(api) {
    if (!api.__xingyunVoiceRecorderBridge) api.__xingyunVoiceRecorderBridge = createRecorderBridge(api.getRecorderManager());
    return api.__xingyunVoiceRecorderBridge;
}

export function createVoiceRecorder({ permission, bridge, canRecord, send, notify, update,
    now = Date.now, every = setInterval, clear = clearInterval }) {
    let task = null, disposed = false;
    const valid = current => !disposed && task === current && canRecord();
    function stop(current) {
        try { if (current.bridge) current.bridge.stop(current); }
        catch (_) { if (!disposed) notify('录音未正常结束，请退出聊天后重试'); }
    }
    function reset(current) {
        if (current.timer != null) clear(current.timer);
        if (task === current) { task = null; if (!disposed) update({ recording: false, seconds: 0, cancel: false }); }
    }
    function cancel() {
        const current = task;
        if (!current) return;
        current.cancelled = true; current.held = false; current.submit = false;
        if (!current.bridge) { reset(current); return; }
        if (current.timer != null) clear(current.timer);
        if (!disposed) update({ recording: false, seconds: 0, cancel: false });
        stop(current);
    }
    function release() {
        const current = task;
        if (!current || !current.held) return;
        current.held = false;
        if (!current.bridge) { reset(current); return; } // Permission callback cannot start after release.
        current.submit = !current.cancelled && !current.cancelArea && valid(current) && current.startTime != null;
        stop(current);
    }
    return {
        async start(y) {
            if (disposed || task || !canRecord()) return;
            const current = { held: true, cancelled: false, submit: false, cancelArea: false, y, startTime: null, timer: null, bridge: null };
            task = current;
            current.started = () => {
                if (!valid(current) || !current.held || current.cancelled) { current.cancelled = true; stop(current); return; }
                current.startTime = now();
                update({ recording: true, seconds: 0, cancel: current.cancelArea });
                current.timer = every(() => {
                    if (!valid(current)) { cancel(); return; }
                    const seconds = Math.min(60, Math.floor((now() - current.startTime) / 1000));
                    update({ recording: true, seconds, cancel: current.cancelArea });
                    if (seconds >= 60) release();
                }, 100);
            };
            current.stopped = result => {
                const duration = current.startTime == null ? 0 : now() - current.startTime;
                const shouldSend = valid(current) && current.submit && !current.cancelled;
                reset(current);
                if (!shouldSend) return; // Interruptions never imply consent to send.
                if (duration < 1000) { notify('录音时间太短，请按住至少 1 秒'); return; }
                if (!result || !result.tempFilePath) { notify('录音文件不可用，请重新录制'); return; }
                Promise.resolve().then(() => {
                    if (!disposed && canRecord()) return send(result.tempFilePath, Math.min(60, Math.max(1, Math.round(duration / 1000))));
                }).catch(() => { if (!disposed && canRecord()) notify('语音发送失败，可点击红色叹号重发'); });
            };
            current.failed = () => { const report = valid(current) && !current.cancelled; reset(current); if (report) notify('录音失败，请检查麦克风权限后重试'); };
            current.interrupted = cancel;
            try {
                const granted = await permission();
                if (!valid(current) || !current.held || !granted) { reset(current); return; }
                current.bridge = bridge();
                current.bridge.start(current);
            } catch (_) { const report = valid(current); reset(current); if (report) notify('无法开始录音，请检查权限或稍后重试'); }
        },
        move(y) {
            if (task && task.held) {
                task.cancelArea = task.y - y > 80;
                if (task.startTime != null) update({ recording: true, seconds: Math.min(60, Math.floor((now() - task.startTime) / 1000)), cancel: task.cancelArea });
            }
        },
        release, cancel,
        dispose() { cancel(); disposed = true; }
    };
}
