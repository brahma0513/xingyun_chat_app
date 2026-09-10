// Adapter for the existing serial session controller. No second Web SDK login.
export function createNativeSDK({ getLoginState, watchStatus }) {
    const EVENT = { SDK_READY: 'ready', SDK_NOT_READY: 'offline', KICKED_OUT: 'kicked' };
    return {
        EVENT,
        create({ SDKAppID }) {
            const state = getLoginState();
            const handlers = {};
            let ready = false, disposed = false, pending = null, loggedStatus;
            let profileQueue = Promise.resolve();
            const emit = (name, data) => { if (!disposed && handlers[name]) handlers[name]({ data }); };
            const stop = watchStatus(state, (value) => {
                if (!ready || value == null) return;
                const normalized = String(value).replace(/[^a-z]/gi, '').toLowerCase();
                // The success callback may precede the LOGIN_IN -> LOGGED_IN notification.
                if (normalized.includes('loggingin') || normalized.includes('connecting')) return;
                if (normalized.includes('loggedin')) { loggedStatus = value; return; }
                if (loggedStatus == null) { loggedStatus = value; return; }
                if (value !== loggedStatus) {
                    ready = false;
                    emit(EVENT.KICKED_OUT, { type: 'native-login-status-changed' });
                }
            });
            return {
                on(name, callback) { handlers[name] = callback; },
                setLogLevel() {},
                isReady: () => ready && !disposed,
                setProfile(profile) {
                    const task = profileQueue.catch(() => {}).then(() => {
                        if (disposed || !ready) throw { code: 'IM_NOT_READY' };
                        return new Promise((resolve, reject) => state.setSelfInfo({
                            userProfile: profile, success: resolve, fail: code => reject({ code })
                        }));
                    });
                    profileQueue = task;
                    return task;
                },
                login({ userID, userSig }) {
                    pending = new Promise((resolve, reject) => {
                        state.login({ sdkAppID: SDKAppID, userID, userSig,
                            success() {
                                if (!disposed) {
                                    ready = true;
                                    loggedStatus = state.state.loginStatus;
                                    emit(EVENT.SDK_READY);
                                }
                                resolve();
                            },
                            fail(code) { reject({ code }); }
                        });
                    });
                    return pending;
                },
                async destroy() {
                    disposed = true;
                    ready = false;
                    stop();
                    // Never let an outstanding native login complete after a new account logs in.
                    // If the native bridge never responds, fail closed until the App is restarted.
                    if (pending) await pending.catch(() => {});
                    await profileQueue.catch(() => {});
                    await new Promise((resolve, reject) => state.logout({ success: resolve, fail: code => reject({ code }) }));
                }
            };
        }
    };
}
