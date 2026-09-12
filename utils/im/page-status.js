// Safe status bridge between the App service and nvue pages.
export default {
    data() { return { imStatus: { status: 'connecting', userID: '', error: '' }, pageVisible: false, waitingForStatus: true }; },
    computed: {
        imReady() { return !this.waitingForStatus && this.pageVisible && this.imStatus.foreground !== false && this.imStatus.status === 'ready'; },
        imStatusText() {
            if (this.imStatus.status === 'idle') return '请先登录账号';
            if (this.imStatus.status === 'kicked') return '聊天已下线，请点击重新登录';
            if (this.imStatus.status === 'error') return '聊天连接失败，请重试；首次接入需重新制作自定义基座';
            return '正在连接聊天服务…';
        }
    },
    onLoad() {
        this._imStatusHandler = value => {
            if (this.onIMStatusChange) this.onIMStatusChange(value);
            this.imStatus = value;
            this.waitingForStatus = false;
        };
        uni.$on('im:status', this._imStatusHandler);
        uni.$emit('im:request-status');
    },
    onShow() { this.waitingForStatus = true; uni.$emit('im:request-status'); this.pageVisible = true; },
    onHide() { this.pageVisible = false; this.waitingForStatus = true; },
    onUnload() { uni.$off('im:status', this._imStatusHandler); },
    methods: {
        retryChat() {
            if (this.imStatus.status === 'idle') uni.navigateTo({ url: '/public/pages/user/login' });
            else uni.$emit('im:retry');
        }
    }
};
