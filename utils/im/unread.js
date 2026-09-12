export function unreadCount(value) {
    const count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

// Dedicated native store/listener: page components may freely destroy their own stores.
export function createUnreadMonitor({ callAPI, addListener, removeListener, publish, onReady = () => {} }) {
    let stopCurrent = null, sequence = 0, identity = null, currentAPI = null;
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
                    currentAPI = (api, extra = {}) => new Promise((resolve, reject) => {
                        if (!alive) { reject({ code: 'IM_STORE_STOPPED' }); return; }
                        const timer = setTimeout(() => reject({ code: 'IM_UNREAD_TIMEOUT' }), 10000);
                        try {
                            callAPI(JSON.stringify({ api, params: { createStoreParams, ...extra } }), raw => {
                                clearTimeout(timer);
                                try {
                                    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
                                    if (!alive || !value || value.code !== 0) reject({ code: value && value.code });
                                    else resolve();
                                } catch (error) { reject(error); }
                            });
                        } catch (error) { clearTimeout(timer); reject(error); }
                    });
                    addListener(options, data => {
                        if (!alive) return;
                        try { publish(unreadCount((typeof data === 'string' ? JSON.parse(data) : data).totalUnreadCount)); } catch (_) {}
                    });
                    this.refresh();
                    onReady();
                } catch (_) { this.stop(); }
            });
        },
        refresh() {
            if (currentAPI) currentAPI('loadConversations', { option: JSON.stringify({ pageSize: 100 }) }).catch(() => {});
        },
        clear(conversationID) {
            if (!currentAPI) return Promise.reject({ code: 'IM_UNREAD_NOT_READY' });
            return currentAPI('clearConversationUnreadCount', { conversationID });
        },
        stop() {
            currentAPI = null;
            if (stopCurrent) stopCurrent();
            stopCurrent = null; identity = null; publish(0);
        }
    };
}
