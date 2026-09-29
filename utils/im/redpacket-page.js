import status from './page-status.js';
import { requestRedPacket } from './redpacket.js';
import { readRedPacketRoute, decodeRedPacketParam } from './redpacket-ui.js';

// Both pages preserve the account captured when the user entered the flow.
export default {
    mixins: [status],
    data() { return { context: null, receiverName: '对方', peerAvatar: '', busy: false, error: '', errorCode: 0, invalid: false, disposed: false,
        statusBar: uni.getSystemInfoSync().statusBarHeight || 0 }; },
    computed: {
        receiverID() { return this.context ? this.context.conversationID.replace(/^c2c_user_/, '') : ''; },
        canOperate() { return !this.disposed && !this.invalid && this.imReady && this.context && this.imStatus.userID === this.context.userID && this.imStatus.accountSessionID === this.context.accountSessionID; }
    },
    onLoad(options) {
        this.context = readRedPacketRoute(options);
        this.receiverName = decodeRedPacketParam(options.name || '对方').slice(0, 80);
        this.peerAvatar = decodeRedPacketParam(options.avatar);
        if (!this.context) { this.invalid = true; this.error = '红包页面参数无效，请返回聊天重新打开'; }
    },
    onHide() { if ('password' in this) this.password = ''; },
    onUnload() { this.disposed = true; if ('password' in this) this.password = ''; },
    methods: {
        onIMStatusChange(value) {
            if (this.context && value.accountSessionID != null &&
                (value.accountSessionID !== this.context.accountSessionID || (value.userID && value.userID !== this.context.userID))) {
                this.invalid = true; this.error = '登录状态已变化，请返回聊天重新打开';
                if ('password' in this) this.password = '';
            }
        },
        async run(action, data) {
            if (this.busy || !this.canOperate) return null;
            this.busy = true; this.error = ''; this.errorCode = 0;
            try {
                const result = await requestRedPacket(action, { ...data, receiver_id: this.receiverID }, this.context);
                return this.canOperate ? result : null;
            } catch (error) {
                if (!this.disposed && !this.invalid) { this.error = error.message; this.errorCode = Number(error.code || 0); }
                return null;
            } finally { this.busy = false; if ('password' in this) this.password = ''; }
        },
        back() { if (!this.busy) uni.navigateBack(); }
    }
};
