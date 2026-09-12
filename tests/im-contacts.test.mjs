import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../utils/im/contacts.js', import.meta.url), 'utf8');
const { createContactsReader } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
function setup(timeout = 100) {
    const calls = [], changes = [], errors = [], removed = [];
    let listener;
    const reader = createContactsReader({ timeout,
        callAPI(raw, callback) { calls.push({ ...JSON.parse(raw), callback }); },
        addListener(options, callback) { listener = callback; },
        removeListener(options) { removed.push(options); },
        onChange(value) { changes.push(value); }, onError() { errors.push(true); }
    });
    return { reader, calls, changes, errors, removed, emit: value => listener(JSON.stringify({ friendList: value })) };
}
test('loads only valid unique app contacts and handles an empty list', () => {
    const s = setup();
    s.calls[0].callback('{"code":0}');
    assert.equal(s.calls[1].api, 'loadFriends');
    s.emit(JSON.stringify([{ userID: 'user_123' }, { userID: 'user_123' }, { userID: 'other' }]));
    assert.deepEqual(s.changes[0], [{ userID: 'user_123' }]);
    s.emit([]);
    assert.deepEqual(s.changes[1], []);
    s.reader.dispose();
});
test('late creation is destroyed after page exit and never binds a listener', () => {
    const s = setup();
    s.reader.dispose();
    s.calls[0].callback('{"code":0}');
    assert.equal(s.calls[1].api, 'destroyStore');
    assert.equal(s.changes.length, 0);
});
test('disposed page ignores queued updates and cleans up only once', () => {
    const s = setup();
    s.calls[0].callback('{"code":0}');
    s.reader.dispose(); s.reader.dispose();
    s.emit([{ userID: 'user_123' }]);
    assert.equal(s.changes.length, 0);
    assert.equal(s.removed.length, 1);
    assert.equal(s.calls.filter(c => c.api === 'destroyStore').length, 1);
});
test('native errors and timeout surface a retryable failure', async () => {
    const s = setup();
    s.calls[0].callback('{"code":-1}');
    assert.equal(s.errors.length, 1);
    s.reader.dispose();
    const stalled = setup(5);
    await new Promise(resolve => setTimeout(resolve, 15));
    assert.equal(stalled.errors.length, 1);
    stalled.reader.dispose();
});
