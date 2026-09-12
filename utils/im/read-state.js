// A read request is valid only for the foreground page and the current login generation.
export function createReadState({ getStatus, isForeground, clear, report = () => {} }) {
    let visible = null, running = false, dirty = false, generation = 0;
    function valid(event) {
        const status = getStatus();
        return event && status.status === 'ready' && isForeground() &&
            event.sessionID === status.sessionID && /^c2c_user_[1-9]\d*$/.test(event.conversationID);
    }
    function matches(event) {
        return visible && event && visible.pageID === event.pageID &&
            visible.sessionID === event.sessionID && visible.conversationID === event.conversationID;
    }
    async function drain() {
        if (running || !dirty || !valid(visible)) return;
        running = true; dirty = false;
        const current = generation, page = visible;
        try { await clear(page.conversationID); }
        catch (error) { if (current === generation) report(error); }
        finally {
            if (current === generation) { running = false; if (dirty) drain(); }
        }
    }
    return {
        reset() { generation++; visible = null; running = false; dirty = false; },
        show(event) {
            if (!valid(event)) return;
            if (matches(event)) { this.read(event); return; }
            this.reset(); visible = { ...event }; dirty = true; drain();
        },
        hide(event) { if (matches(event)) this.reset(); },
        read(event) { if (matches(event) && valid(event)) { dirty = true; drain(); } }
    };
}
