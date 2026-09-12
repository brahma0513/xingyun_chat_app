import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const file = fs.readFileSync(new URL('../pages/im/conversations.nvue', import.meta.url), 'utf8');
const script = file.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^import .*$/gm, '').replace('export default', 'module.exports =');
const context = { module: { exports: {} }, status: {}, ConversationList: {}, ContactsList: {} };
vm.runInNewContext(script, context);
const component = context.module.exports;
const mixinSource = fs.readFileSync(new URL('../utils/im/page-status.js', import.meta.url), 'utf8');
const mixin = (await import('data:text/javascript;base64,' + Buffer.from(mixinSource).toString('base64'))).default;
function fixture(status = 'ready') {
    const page = { ...mixin.data(), pageVisible: true, waitingForStatus: false, imStatus: { status, foreground: true }, retries: 0 };
    for (const [key, fn] of Object.entries(component.computed)) Object.defineProperty(page, key, { get: () => fn.call(page) });
    page.retryChat = () => page.retries++;
    return page;
}
test('leaving a ready list does not replace it with connecting/retry text', () => {
    const page = fixture(); assert.equal(page.showListStatus, false);
    mixin.onHide.call(page);
    assert.equal(mixin.computed.imReady.call(page), false);
    assert.equal(page.showListStatus, false); assert.equal(page.listStatusActionable, false);
    component.methods.handleListStatusTap.call(page); assert.equal(page.retries, 0);
    assert.match(file, /v-else-if="showListStatus"/);
    assert.match(file, /v-if="listStatusActionable"/);
});
test('pending handshake and background never display stale status prompts', () => {
    for (const status of ['ready', 'connecting', 'idle', 'kicked', 'error']) {
        const page = fixture(status); page.waitingForStatus = true;
        assert.equal(page.showListStatus, false);
        page.waitingForStatus = false; page.imStatus.foreground = false;
        assert.equal(page.showListStatus, false);
    }
});
test('confirmed connecting state shows a hint but cannot trigger forced login', () => {
    const page = fixture('connecting'); assert.equal(page.showListStatus, true);
    assert.equal(page.listStatusActionable, false);
    component.methods.handleListStatusTap.call(page); assert.equal(page.retries, 0);
});
test('confirmed failure/login prompts remain visible and actionable', () => {
    for (const status of ['idle', 'kicked', 'error']) {
        const page = fixture(status); assert.equal(page.showListStatus, true);
        assert.equal(page.listStatusActionable, true);
        component.methods.handleListStatusTap.call(page); assert.equal(page.retries, 1);
    }
});
