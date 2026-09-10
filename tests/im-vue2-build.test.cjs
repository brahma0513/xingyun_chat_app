const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const config = require('../vue.config.js');

test('only bundled TS is checked; existing loader options and unrelated rules survive', () => {
    const ts = { loader: '/hbuilder/ts-loader/index.js', options: { transpileOnly: false, appendTsSuffixTo: [/\.vue$/] } };
    const babel = { loader: 'babel-loader', options: { cacheDirectory: true } };
    const webpack = { module: { rules: [{ oneOf: [{ use: [ts, babel] }] }] } };
    config.configureWebpack(webpack);
    assert.equal(ts.options.onlyCompileBundledFiles, true);
    assert.equal(ts.options.transpileOnly, false);
    assert.equal(ts.options.appendTsSuffixTo.length, 1);
    assert.deepEqual(babel.options, { cacheDirectory: true });
});

test('tsconfig does not scan unused vendor samples or turn off strict checking', () => {
    const ts = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8'));
    assert.equal(ts.compilerOptions.strict, true);
    assert.deepEqual(ts.include, ['types/**/*.d.ts']);
    assert.ok(ts.exclude.includes('unpackage'));
});

test('Vue2 compatibility helpers no longer import missing Vue3 named exports', () => {
    for (const file of ['reactiveCompat.ts', 'lifecycleCompat.ts']) {
        const source = fs.readFileSync(path.join(root, 'uni_modules/tuikit-atomic-x/utils', file), 'utf8');
        assert.match(source, /import Vue from 'vue'/);
        assert.doesNotMatch(source, /import[^;]*\{[^;]*\}\s*from\s*['"]vue['"]/);
    }
});
