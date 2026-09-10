# IM 登录接入（第一步）

当前本地目录：

- 前端：`E:\云平台项目代码库\xingyun_app\xingyun_chat_app`
- 后端：`E:\云平台项目代码库\yunpingtai\xingyun_chat`

后续开发和部署以以上 E 盘目录为准。

前端：Vue2 uni-app，仅 Android/iOS App；现使用 `tuikit-atomic-x` 4.3.3 原生 TUIKit。
原 `lite-chat` 登录已切换为原生登录适配，不会同时登录两套 SDK。
官方参考：https://cloud.tencent.com/document/product/269/64507

## 运行

1. 项目根目录执行 `npm install`。部署配置 `utils/config_deploy.js` 保持本地配置。
2. 将后端 `xingyun_chat/api/controller/im.php` 的登录鉴权修改部署到对应服务。
3. 后台 IM 基础配置填写 SDKAppID 和 SecretKey。前端不填写 SecretKey。
4. 安装 HBuilderX 的 TypeScript 编译插件，重新制作包含 UTS 插件的自定义调试基座，然后运行到 App。
5. 观察控制台 `[IM] SDK_READY user_用户编号`。只有 SDK_READY 才表示聊天能力已就绪。

签名接口：`POST {apiUrl}/xingyun_chat/api/index.php?m=im&a=login_info`。
请求沿用业务 `third_token` / `mini_user_token`；服务端以鉴权结果决定 UserID。
返回 `data.sdkAppID`、`data.userID`、`data.userSig`。UserSig 仅用于内存中的 SDK 登录。

## 页面使用

`this.$store.state.vuex_im` 提供 `status/userID/sdkAppID/error/code`。
状态包括 `idle`（未登录）、`connecting`、`ready`、`error`、`kicked`。
也可监听 `uni.$on('im:status', handler)`；页面卸载时须用 `$off` 移除相同 handler。

```js
import { retryIMLogin } from '@/utils/im';
// 页面使用官方原生组件，不再通过 getIMClient 调用 Web SDK 消息 API。
// 用户点击重连/重新登录聊天时调用。
await retryIMLogin();
```

业务登录态恢复、登录成功、退出、切换账号都会触发同步。
返回前台或网络恢复会重试失败的登录。被踢（包括 UserSig 过期）后保持下线，
由用户显式重试获取新签名，避免多端互相抢登。

## 验证

`node --test tests/im-session.test.mjs` 使用模拟 SDK 验证异步登录与清理逻辑。
真机还需验证：普通登录、杀进程后恢复登录、切换账号、退出登录、断网恢复、
同账号另一端登录导致被踢、后台配置错误、业务凭据过期。
后端还需验证：缺少凭据拒绝签发；传入另一人的 user_id 时只能签发已认证用户的签名。

2026-09-09 已通过截图确认旧 lite-chat 真机登录成功（user_133131079）。
原生 TUIKit 的真机登录、收发消息仍待重新制作基座后验证；旧 SDK 登录成功不能替代此次验收。
2026-09-10 安装 TypeScript 插件后，修正项目检查范围与 Vue2 导出兼容，HBuilderX Node18 App 资源编译通过。
详见 `docs/im-chat.md`。

## 官方 skills 安装

腾讯官方 `npx @tencent-rtc/trtc-agent-skills@latest add --ide codex` 已运行。
入口为 `.codex/skills/trtc/SKILL.md`。项目内 `.venv` 已装 PyYAML，
执行 Python 工具时可从 `.codex/skills/trtc` 使用 `.venv/Scripts/python.exe -m tools...`。
系统 `python3` 仍不可用；官方安装器在 Windows 路径上生成 hooks 失败，
未生成 `.codex/hooks.json`。技能正文可读取，Python 工具可显式运行，自动 hooks 未启用。
