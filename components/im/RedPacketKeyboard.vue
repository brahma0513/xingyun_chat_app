<template>
    <view class="keyboard" :class="{ password: passwordMode }" @touchmove.stop.prevent="">
        <view class="digits">
            <button v-for="key in keys" :key="key" class="key" :class="{ zero: !passwordMode && key === '0', blank: key === 'blank' }"
                :disabled="disabled || key === 'blank'" @tap="$emit('key', key)">
                <u-icon v-if="key === 'delete'" name="backspace" size="25" color="#202020" />
                <text v-else-if="key !== 'blank'">{{ key }}</text>
            </button>
        </view>
        <view v-if="!passwordMode" class="actions">
            <button class="key delete" :disabled="disabled" @tap="$emit('key', 'delete')"><u-icon name="backspace" size="25" color="#202020" /></button>
            <button class="confirm" :disabled="disabled" @tap="$emit('confirm')">确定</button>
        </view>
    </view>
</template>
<script>
export default {
    props: { passwordMode: Boolean, integral: Boolean, disabled: Boolean },
    computed: { keys() { return ['1','2','3','4','5','6','7','8','9', ...(this.passwordMode ? ['blank','0','delete'] : ['0', this.integral ? 'blank' : '.'])]; } }
};
</script>
<style scoped>
.keyboard { display: flex; gap: 12rpx; padding: 16rpx 14rpx calc(18rpx + env(safe-area-inset-bottom)); background: #f5f5f6; box-sizing: border-box; width: 100%; }
.digits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; flex: 1; }.actions { display: flex; flex-direction: column; gap: 12rpx; width: 23%; }
.key { display: flex; align-items: center; justify-content: center; height: 82rpx; padding: 0; margin: 0; border-radius: 7rpx; background: #fff; color: #171717; font-size: 38rpx; font-weight: 500; line-height: 1; }.key::after,.confirm::after { border: none; }
.zero { grid-column: span 2; }.blank { background: transparent; }.confirm { flex: 1; display: flex; align-items: center; justify-content: center; margin: 0; padding: 0; background: #ff6048; color: white; font-size: 30rpx; border-radius: 7rpx; }.confirm[disabled] { background: #efab9e; color: #fff; }
.delete-icon { width: 38rpx; height: 30rpx; }.password .key { height: 86rpx; }.key[disabled] { color: #aaa; }
</style>
