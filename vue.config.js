module.exports = {
    configureWebpack(config) {
        // HBuilderX normally includes every TS file in the project, including
        // the unused Vue3/uni-app-x/live demo sources distributed with TUIKit.
        function visit(rules) {
            (rules || []).forEach(rule => {
                (Array.isArray(rule.use) ? rule.use : []).forEach(use => {
                    if (use.loader && use.loader.includes('ts-loader')) {
                        use.options = Object.assign({}, use.options, { onlyCompileBundledFiles: true });
                    }
                });
                visit(rule.oneOf);
                visit(rule.rules);
            });
        }
        visit(config.module && config.module.rules);
    }
};
