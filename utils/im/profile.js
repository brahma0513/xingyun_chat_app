export function businessProfile(user, baseURL = '') {
    if (!user || !/^[1-9]\d*$/.test(String(user.user_id || ''))) return null;
    const userID = 'user_' + user.user_id;
    const nickname = Array.from(String(user.weixin_name || user.name || user.nickname || userID).trim()).slice(0, 64).join('') || userID;
    let avatarURL = String(user.headimgurl || '').trim().replace(/&amp;/g, '&');
    const origin = (baseURL.match(/^https?:\/\/[^/]+/i) || [''])[0];
    if (avatarURL.startsWith('//')) avatarURL = (/^http:/.test(baseURL) ? 'http:' : 'https:') + avatarURL;
    else if (avatarURL.startsWith('/') && !avatarURL.startsWith('/static/')) avatarURL = origin + avatarURL;
    else if (origin && /^(?:\.\/)?(?:uploads?|attachment|images?)\//i.test(avatarURL)) avatarURL = origin + '/' + avatarURL.replace(/^\.\//, '');
    avatarURL = avatarURL.replace(/ /g, '%20');
    if (!/^https?:\/\/[^\s]+$/i.test(avatarURL)) avatarURL = '';
    return { userID, nickname, avatarURL };
}

// Deduplicate per native client, keep failure retryable, never apply a stale result to a new account.
export function createProfileSync({ getClient, getProfile, report = () => {} }) {
    let client, completed = '', pending = '', queue = Promise.resolve();
    return function syncProfile() {
        const current = getClient(), profile = getProfile();
        if (!current || !profile) return Promise.resolve();
        if (client !== current) { client = current; completed = ''; pending = ''; }
        const key = JSON.stringify(profile);
        if (key === completed || key === pending) return queue;
        pending = key;
        queue = queue.then(async () => {
            if (getClient() !== current) return;
            try {
                await current.setProfile(profile);
                if (getClient() === current) { completed = key; report('ready'); }
            } catch (error) { if (getClient() === current) report('error', error && error.code); }
            finally { if (client === current && pending === key) pending = ''; }
        });
        return queue;
    };
}
