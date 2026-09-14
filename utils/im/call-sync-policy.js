export function shouldDeferCallAccountSync({ account, imStatus, callSetupInProgress, callSource }) {
    if (!account || !imStatus || imStatus.status !== 'ready') return false;
    const expectedUserID = 'user_' + String(account.userID);
    return imStatus.userID === expectedUserID && !!(callSetupInProgress || callSource);
}
