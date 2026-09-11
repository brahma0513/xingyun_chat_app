// nvue contexts receive public profile fields only; credentials stay in App service.
let sequence = 0;
export default {
    data() { return { currentProfiles: {} }; },
    watch: { profileIDs() { this.requestCurrentProfiles(); } },
    created() {
        this._profileRequest = 'profile-view-' + Date.now() + '-' + (++sequence);
        this._profileHandler = event => {
            if (event.requestID !== this._profileRequest) return;
            const map = {};
            (event.profiles || []).forEach(p => { map[p.userID] = p; });
            this.currentProfiles = map;
        };
        this._profileRefresh = () => this.requestCurrentProfiles();
        uni.$on('im:profiles', this._profileHandler);
        uni.$on('im:profile-updated', this._profileRefresh);
        this.requestCurrentProfiles();
    },
    beforeDestroy() {
        uni.$off('im:profiles', this._profileHandler);
        uni.$off('im:profile-updated', this._profileRefresh);
        this._profileRequest = '';
    },
    methods: {
        requestCurrentProfiles() {
            if (!this._profileRequest) return;
            this._profileRequest = 'profile-view-' + Date.now() + '-' + (++sequence);
            uni.$emit('im:request-profiles', { requestID: this._profileRequest, userIDs: this.profileIDs });
        }
    }
};
