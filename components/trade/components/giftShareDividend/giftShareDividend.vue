<template>
  <view
    v-if="datas.type == 'trade301781' || datas.type == '30178_1'"
    class="gsd-exchange-box"
    :style="
      'padding:' +
      paddingTop +
      'px 15px ' +
      paddingBottom +
      'px;background-color:' +
      bgColor
    "
  >
    <view class="gsd-wallet-card" :style="cardBgStyle">
      <view class="gsd-wallet-body">
        <view class="gsd-balance-label">{{ pointsDisplayName }}</view>
        <view class="gsd-balance-money">{{ balanceMoney }}</view>
        <view class="gsd-wallet-btns">
          <button
            type="button"
            class="gsd-wallet-btn gsd-btn-exchange"
            :style="'background-color:' + btnExchangeColor"
            @tap="openExchangeModal"
          >
            {{ btnExchangeText }}
          </button>
          <button
            type="button"
            class="gsd-wallet-btn gsd-btn-jump"
            :style="'background-color:' + btnJumpColor"
            @tap="goExchangeLogin"
          >
            {{ btnJumpText }}
          </button>
        </view>
      </view>
    </view>

    <view
      v-if="showExchangeModal"
      class="gsd-modal-mask"
      @tap.self="closeExchangeModal"
    >
      <view class="gsd-modal-panel" @tap.stop>
        <view class="gsd-modal-title">兑换{{ pointsDisplayName }}</view>
        <view class="gsd-modal-row">
          <text class="gsd-modal-label">兑换金额</text>
          <input
            type="digit"
            class="gsd-modal-input"
            v-model="exchangeAmount"
            placeholder="请输入金额，不小于10"
          />
        </view>
        <text class="gsd-modal-tip"
          >兑换金额需 ≥ 10，将扣减{{
            pointsDisplayName
          }}并兑换为后台配置的交易所资产</text
        >
        <view class="gsd-modal-actions">
          <button
            type="button"
            class="gsd-modal-btn cancel"
            @tap="closeExchangeModal"
          >
            取消
          </button>
          <button
            type="button"
            class="gsd-modal-btn confirm"
            :disabled="exchanging"
            @tap="submitExchange"
          >
            {{ exchanging ? "兑换中..." : "确认兑换" }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "giftShareDividend",
  props: {
    datas: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      money: "",
      exchangeName: "",
      phone: "",
      pointsDisplayName: "数字积分",
      showExchangeModal: false,
      exchangeAmount: "",
      exchanging: false,
    };
  },
  computed: {
    content() {
      return this.datas.content || {};
    },
    paddingTop() {
      return this.content.padding_top !== undefined
        ? this.content.padding_top
        : 15;
    },
    paddingBottom() {
      return this.content.padding_bottom !== undefined
        ? this.content.padding_bottom
        : 15;
    },
    bgColor() {
      return this.content.bg_color || "#FFF5EB";
    },
    cardBgStyle() {
      return this.content.card_bg_color
        ? "background:" + this.content.card_bg_color
        : "";
    },
    btnExchangeColor() {
      return this.content.btn_exchange_color || "#96563B";
    },
    btnJumpColor() {
      return this.content.btn_jump_color || "#96563B";
    },
    btnExchangeText() {
      return this.content.btn_exchange_text || "兑换资产";
    },
    btnJumpText() {
      if (this.content.btn_jump_text) {
        return this.content.btn_jump_text;
      }
      return "进入" + (this.exchangeName || this.content.name || "交易所");
    },
    balanceMoney() {
      if (
        this.money !== "" &&
        this.money !== undefined &&
        this.money !== null
      ) {
        return this.money;
      }
      return "--";
    },
  },
  created() {
    this.initContent();
    this.tryAutoExchangeRegister();
    this.loadComponentData();
  },
  methods: {
    initContent() {
      const c = this.datas.content;
      if (!c) return;
      if (c.points_display_name) {
        this.pointsDisplayName = c.points_display_name;
      } else if (
        c.balance_label &&
        c.balance_label !== "¥" &&
        c.balance_label !== "￥" &&
        c.balance_label !== "余额"
      ) {
        this.pointsDisplayName = c.balance_label;
      }
    },
    getUserId() {
      return this.vuex_user && this.vuex_user.user_id
        ? this.vuex_user.user_id
        : "";
    },
    getRegisterStorageKey(userId) {
      return "gift_share_dividend_exchange_reg_" + userId;
    },
    isRegisterDoneMsg(msg) {
      if (!msg) return false;
      return /已注册|已存在|重复|exist|already/i.test(msg);
    },
    markRegisterDone(userId) {
      if (!userId) return;
      try {
        uni.setStorageSync(this.getRegisterStorageKey(userId), "1");
      } catch (e) {}
    },
    hasRegisterDone(userId) {
      if (!userId) return false;
      try {
        return uni.getStorageSync(this.getRegisterStorageKey(userId)) === "1";
      } catch (e) {
        return false;
      }
    },
    tryAutoExchangeRegister() {
      const userId = this.getUserId();
      if (!userId || this.hasRegisterDone(userId)) return;
      this.$common
        .requestData({
          url: "/gift_share_dividend/web/index.php?m=personal_center&a=exchange_auto_register",
          data: {},
          method: "POST",
          needToken: true,
        })
        .then((res) => {
          if (res.errcode == 0 || this.isRegisterDoneMsg(res.errmsg)) {
            this.markRegisterDone(userId);
          }
        });
    },
    loadComponentData() {
      this.$common
        .requestData({
          url: "/gift_share_dividend/web/index.php?m=personal_center&a=compontent_data",
          data: {},
          method: "POST",
          needToken: true,
        })
        .then((res) => {
          if (res.errcode == 0 && res.data) {
            this.money = res.data.money;
            this.exchangeName = res.data.name || "";
            this.phone = res.data.phone || "";
            if (res.data.points_display_name) {
              this.pointsDisplayName = res.data.points_display_name;
              if (this.datas.content) {
                this.datas.content.points_display_name =
                  res.data.points_display_name;
                this.datas.content.balance_label = res.data.points_display_name;
              }
            }
            if (this.datas.content) {
              this.datas.content.money = res.data.money;
              this.datas.content.name = res.data.name;
              this.datas.content.phone = res.data.phone;
            }
          }
        });
    },
    openExchangeModal() {
      this.exchangeAmount = "";
      this.showExchangeModal = true;
    },
    closeExchangeModal() {
      this.showExchangeModal = false;
      this.exchanging = false;
    },
    submitExchange() {
      const amount = parseFloat(this.exchangeAmount);
      if (isNaN(amount) || amount < 10) {
        uni.showToast({ title: "请输入不小于10的兑换金额", icon: "none" });
        return;
      }
      this.exchanging = true;
      this.$common
        .requestData({
          url: "/gift_share_dividend/web/index.php?m=personal_center&a=exchange_change_assets",
          data: { asMoney: amount },
          method: "POST",
          needToken: true,
        })
        .then((res) => {
          this.exchanging = false;
          if (res.errcode == 0) {
            uni.showToast({ title: res.errmsg || "兑换成功", icon: "none" });
            this.closeExchangeModal();
            this.loadComponentData();
          } else {
            uni.showToast({ title: res.errmsg || "兑换失败", icon: "none" });
          }
        })
        .catch(() => {
          this.exchanging = false;
          uni.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        });
    },
    goExchangeLogin() {
      const userId = this.getUserId();
      const openLogin = () => {
        this.$common
          .requestData({
            url: "/gift_share_dividend/web/index.php?m=personal_center&a=exchange_login_url",
            data: {},
            method: "POST",
            needToken: true,
          })
          .then((res) => {
            if (res.errcode == 0 && res.data && res.data.login_url) {
              this.$common.diyLinkJump(res.data.login_url, "h5", true);
            } else {
              uni.showToast({
                title: res.errmsg || "获取交易所链接失败",
                icon: "none",
              });
            }
          })
          .catch(() => {
            uni.showToast({ title: "网络异常，请稍后重试", icon: "none" });
          });
      };
      if (this.hasRegisterDone(userId)) {
        openLogin();
        return;
      }
      this.$common
        .requestData({
          url: "/gift_share_dividend/web/index.php?m=personal_center&a=exchange_auto_register",
          data: {},
          method: "POST",
          needToken: true,
        })
        .then((res) => {
          if (res.errcode == 0 || this.isRegisterDoneMsg(res.errmsg)) {
            this.markRegisterDone(userId);
          }
          openLogin();
        })
        .catch(() => {
          openLogin();
        });
    },
  },
};
</script>

<style scoped>
.gsd-exchange-box {
  font-size: 14px;
  color: #2d1c16;
  background-color: #fff5eb;
}

.gsd-wallet-card {
  border-radius: 16px;
  padding: 16px 14px;
  box-sizing: border-box;
  background: linear-gradient(90deg, #fdebd0 0%, #fffaf0 100%);
}

.gsd-wallet-body {
  flex: 1;
  min-width: 0;
}

.gsd-balance-label {
  font-size: 14px;
  color: #6b4a3a;
  line-height: 1.2;
}

.gsd-balance-money {
  font-size: 28px;
  font-weight: 700;
  color: #2d1c16;
  line-height: 1.3;
  margin: 4px 0 12px;
  word-break: break-all;
}

.gsd-wallet-btns {
  display: flex;
  gap: 8px;
}

.gsd-wallet-btn {
  flex: 1;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 16px;
  color: #fff;
  font-size: 12px;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #96563b;
}

.gsd-wallet-btn::after {
  border: none;
}

.gsd-modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 28, 22, 0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.gsd-modal-panel {
  width: 100%;
  max-width: 320px;
  background: #fffaf0;
  border-radius: 12px;
  padding: 20px 16px;
  box-sizing: border-box;
}

.gsd-modal-title {
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #2d1c16;
}

.gsd-modal-row {
  margin-bottom: 12px;
}

.gsd-modal-label {
  display: block;
  font-size: 13px;
  color: #6b4a3a;
  margin-bottom: 6px;
}

.gsd-modal-input {
  width: 100%;
  height: 40px;
  border: 1px solid #e8d4bc;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 15px;
  box-sizing: border-box;
  background: #fff;
  color: #2d1c16;
}

.gsd-modal-tip {
  font-size: 12px;
  color: #8a6b55;
  margin: 0 0 16px;
  display: block;
}

.gsd-modal-actions {
  display: flex;
  gap: 10px;
}

.gsd-modal-btn {
  flex: 1;
  height: 40px;
  line-height: 40px;
  border: none;
  border-radius: 20px;
  font-size: 15px;
}

.gsd-modal-btn::after {
  border: none;
}

.gsd-modal-btn.cancel {
  background: #f0e6d8;
  color: #6b4a3a;
}

.gsd-modal-btn.confirm {
  background: #96563b;
  color: #fff;
}

.gsd-modal-btn.confirm[disabled] {
  opacity: 0.6;
}
</style>
