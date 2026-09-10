export function unreadCount(value) {
    const count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

// Dedicated native store/listener: page components may freely destroy their own stores.
export function createUnreadMonitor({ callAPI, addListener, removeListener, publish }) {
    let stopCurrent = null, sequence = 0, identity = null;
    return {
        start(client) {
            if (identity === client) return;
            this.stop(); identity = client;
            const createStoreParams = JSON.stringify({ storeName: 'ConversationList', instanceId: 'xingyun-unread-' + (++sequence) });
            const options = { type: '', store: 'ConversationList', name: 'totalUnreadCount',
                listenerID: 'xingyun-unread', params: { createStoreParams } };
            let alive = true;
            const destroy = () => callAPI(JSON.stringify({ api: 'destroyStore', params: { createStoreParams } }), () => {});
            stopCurrent = () => { alive = false; removeListener(options); destroy(); };
            callAPI(JSON.stringify({ api: 'createStore', params: { createStoreParams } }), response => {
                if (!alive) { destroy(); return; }
                try {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    if (result.code !== 0) { this.stop(); return; }
                    addListener(options, data => {
                        if (!alive) return;
                        try { publish(unreadCount((typeof data === 'string' ? JSON.parse(data) : data).totalUnreadCount)); } catch (_) {}
                    });
                    callAPI(JSON.stringify({ api: 'loadConversations', params: { createStoreParams, option: JSON.stringify({ pageSize: 100 }) } }), () => {});
                } catch (_) { this.stop(); }
            });
        },
        stop() {
            if (stopCurrent) stopCurrent();
            stopCurrent = null; identity = null; publish(0);
        }
    };
}
