// A page-owned native store prevents contact data crossing account sessions.
export function createContactsReader({ callAPI, addListener, removeListener, onChange, onError, timeout = 10000 }) {
    const id = JSON.stringify({ storeName: 'Contact', instanceId: 'address-book-' + Date.now() + '-' + Math.random().toString(36).slice(2) });
    const listener = { type: '', store: 'Contact', name: 'friendList', params: { createStoreParams: id } };
    let disposed = false, bound = false, created = false, timer;
    const parse = value => typeof value === 'string' ? JSON.parse(value) : value;
    function fail() { clearTimeout(timer); if (!disposed) onError(); }
    function invoke(api, callback) {
        try {
            callAPI(JSON.stringify({ api, params: { createStoreParams: id } }), response => {
                try { callback(parse(response)); } catch (_) { fail(); }
            });
        } catch (_) { fail(); }
    }
    function destroy() { invoke('destroyStore', () => {}); }
    function load() {
        if (disposed || !created) return;
        clearTimeout(timer);
        timer = setTimeout(fail, timeout);
        invoke('loadFriends', result => {
            if (disposed) return;
            if (result.code !== 0) fail();
            // The friendList listener supplies the actual data, including [].
        });
    }
    timer = setTimeout(fail, timeout);
    invoke('createStore', result => {
        if (result.code !== 0) { fail(); return; }
        created = true;
        if (disposed) { destroy(); return; }
        addListener(listener, value => {
            if (disposed) return;
            try {
                const event = parse(value), list = parse(event.friendList);
                if (!Array.isArray(list)) throw new Error('Invalid contact list');
                clearTimeout(timer);
                const seen = new Set();
                onChange(list.filter(p => p && /^user_[1-9]\d*$/.test(p.userID) && !seen.has(p.userID) && seen.add(p.userID)));
            } catch (_) { fail(); }
        });
        bound = true;
        load();
    });
    return {
        reload: load,
        dispose() {
            if (disposed) return;
            disposed = true;
            clearTimeout(timer);
            if (bound) removeListener(listener);
            if (created) destroy();
        }
    };
}
