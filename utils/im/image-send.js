// Keep album results on the page, never in a global SDK/account store.
export function createImageSender({ context, choose, info, send, notify }) {
    let job = null;
    let running = false;
    let disposed = false;
    const same = task => !disposed && job === task && context().sessionID === task.sessionID && context().conversationID === task.conversationID;
    async function resume() {
        const task = job;
        if (!task || running || !task.paths) return;
        if (!same(task)) { job = null; return; }
        if (!context().ready) return;
        running = true;
        try {
            while (task.paths.length && same(task) && context().ready) {
                const path = task.paths[0];
                let image;
                try { image = await info(path); }
                catch (_) { task.paths.shift(); if (same(task)) notify('图片读取失败，请重新选择'); continue; }
                if (!same(task) || !context().ready) break;
                task.paths.shift(); // Never automatically retry a submitted native send.
                try {
                    await send({ type: 'image', imagePath: String(image.path || path).replace(/^file:\/\//, ''),
                        imageWidth: image.width, imageHeight: image.height });
                } catch (_) { if (same(task)) notify('图片发送失败，可点击消息旁的红色叹号重发'); }
            }
        } finally {
            running = false;
            if (job === task && (!same(task) || !task.paths.length)) job = null;
        }
    }
    return {
        async select() {
            if (disposed || job || !context().ready) return;
            const task = { ...context(), paths: null };
            job = task;
            try {
                const result = await choose();
                if (!same(task)) return;
                task.paths = (result.tempFilePaths || []).filter(p => typeof p === 'string' && p).slice(0, 9);
                await resume();
            } catch (error) {
                if (same(task) && !/cancel/i.test(String(error && error.errMsg))) notify('无法打开相册，请检查照片权限后重试');
                if (job === task) job = null;
            } finally { if (!same(task) && job === task) job = null; }
        },
        resume,
        retry(path) {
            if (disposed || job || !path || !context().ready) return;
            job = { ...context(), paths: [path] };
            return resume();
        },
        dispose() { disposed = true; job = null; }
    };
}
