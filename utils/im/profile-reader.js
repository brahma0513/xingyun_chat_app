// Read current public profiles instead of relying on historical message snapshots.
export function contactProfiles(response) {
    const result = typeof response === 'string' ? JSON.parse(response) : response;
    if (!result || result.code !== 0) throw { code: result && result.code };
    const data = result.data || {};
    const list = data.contactInfoList || (data.data && data.data.contactInfoList);
    if (!Array.isArray(list)) throw { code: 'IM_PROFILE_RESPONSE_INVALID' };
    return list.map(p => ({ userID: p.userID, nickname: p.nickname || '',
        avatarURL: p.avatarURL || '', friendRemark: p.friendRemark || '' }));
}

let sequence = 0;
export function readProfiles(callAPI, userIDs) {
    const createStoreParams = JSON.stringify({ storeName: 'Contact', instanceId: 'xingyun-profile-' + (++sequence) });
    return new Promise((resolve, reject) => {
        let finished = false;
        const destroy = () => callAPI(JSON.stringify({ api: 'destroyStore', params: { createStoreParams } }), () => {});
        const finish = (error, value) => {
            if (finished) return;
            finished = true; clearTimeout(timer); destroy();
            if (error) reject(error); else resolve(value);
        };
        const timer = setTimeout(() => finish({ code: 'IM_PROFILE_TIMEOUT' }), 10000);
        try {
            callAPI(JSON.stringify({ api: 'createStore', params: { createStoreParams } }), raw => {
                if (finished) { destroy(); return; }
                try {
                    const result = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (!result || result.code !== 0) { finish({ code: result && result.code }); return; }
                    callAPI(JSON.stringify({ api: 'getContactInfo', params: { createStoreParams, userIDList: JSON.stringify(userIDs) } }), response => {
                        if (finished) return;
                        try { finish(null, contactProfiles(response)); } catch (error) { finish(error); }
                    });
                } catch (error) { finish(error); }
            });
        } catch (error) { finish(error); }
    });
}

export function mergeProfile(snapshot, current) {
    return { ...snapshot, ...(current || {}),
        nickname: (current && current.nickname) || snapshot.nickname || '',
        avatarURL: (current && current.avatarURL) || snapshot.avatarURL || '',
        friendRemark: (current && current.friendRemark) || snapshot.friendRemark || '' };
}
