let sequence = 0;

// nvue-safe bridge. Only the phone and a request ID cross to the App service;
// business credentials remain in the App context.
export function resolvePhoneUserID(phone) {
    const requestID = 'phone-search-' + Date.now() + '-' + (++sequence);
    return new Promise((resolve, reject) => {
        let finished = false;
        const done = (error, userID) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            uni.$off('im:search-phone-result', listener);
            error ? reject(new Error(error)) : resolve(userID || '');
        };
        const listener = event => {
            if (!event || event.requestID !== requestID) return;
            done(event.error || '', event.userID || '');
        };
        const timer = setTimeout(() => done('查找超时，请检查网络后重试'), 18000);
        uni.$on('im:search-phone-result', listener);
        uni.$emit('im:search-phone', { requestID, phone });
    });
}
