# App 消息列表与单聊

## 本次范围

### 2026-09-11 头像与昵称显示修复

- 单聊消息开启昵称显示；会话页及聊天标题主动刷新当前 IM 资料。
- 消息展示合并当前资料，不修改 SDK 原消息对象；自己的头像昵称优先使用当前登录账号的业务资料，避免历史消息的旧资料快照。
- `profile-reader.js` 通过独立 Contact 实例读取 getContactInfo，兼容两层响应结构；超时/失败清理实例。App 服务仅向 nvue 广播公开资料，并拒绝账号切换前的迟到结果；页面销毁清理监听，忽略旧请求响应。
- 补充 uploads / attachment / images 相对地址、空格和 HTML 查询分隔符处理，不把本地临时文件路径上传到 IM。
- 控制台 `[IM] 资料同步完成` 和 `[IM] 资料校验` 仅打印字段是否存在和是否一致，不输出地址、token、UserSig。读取失败输出 `[IM] 最新资料读取失败` 及错误码。
- 验收：用现有基座重新运行，双方各重新登录；检查旧消息和新消息的头像、昵称，会话列表及聊天标题；切号后不能显示旧账号资料。本轮没有原生插件变更，不必因本轮修复重打基座。
- 自动测试新增 `tests/im-profile-display.test.mjs`，真机图片 URL 可访问性仍需在设备上验收。

- 个人中心右下角「消息」打开 `/pages/im/conversations`。
- 官方 ConversationList 展示单聊头像、昵称、摘要、时间和未读数。
- 输入对方业务数字 ID（或 `user_数字ID`）发起单聊。对方应已登录本 App。
- `/pages/im/chat` 使用官方 MessageList / MessageInput：文字、表情、历史、收发状态、失败重试。
- 暂不开放群聊、媒体发送、通话、离线通知。后台/杀进程通知不在本次验收范围。
- 页面在 onHide 时卸载消息组件，避免后台页面持续清未读；切换账号后旧聊天页禁用。
- IM 登录就绪后同步当前用户的业务昵称、公开头像地址；编辑个人资料后自动同步。未登录过新版的其他用户仍可能显示 ID/默认头像。

## 业务聊天入口、资料与未读数（2026-09-10）

- 「我的团队」成员列表及成员详情增加「发消息」，自动使用该成员业务 ID，隐藏发给自己的按钮。
- `utils/im/profile.js` 仅同步 userID / nickname / avatarURL，不传手机号、token 等业务数据。相同资料去重；失败在下次前台同步时重试。
- `utils/im/unread.js` 使用独立 ConversationList 原生实例和监听器，个人中心「消息」显示总未读数（超过 99 显示 99+）；不依赖会话列表是否打开。退出/切换账号清零并忽略旧回调。
- MessageList 首次展示及前台收到消息时清除当前会话未读；销毁时不再清除未读。计数来自 SDK 总未读，不是本地累加，也不是系统桌面角标。
- 本轮未改原生插件，无须因这些改动重打基座；复用已经成功聊天的基座，停止运行后重新运行到手机。

验收：A/B 分别重新登录一次以同步资料；从团队成员发起聊天，检查标题、昵称和头像；B 停在个人中心时由 A 发消息，检查消息角标增加；B 进入该聊天后对应未读清除（其他会话未读保留）；退出聊天后再发消息应重新增加。修改昵称/头像后重新打开对方会话验证。离线通知尚未接入。

自动测试：`node --test tests/im-session.test.mjs tests/im-native.test.mjs tests/im-vue2-build.test.cjs tests/im-extras.test.mjs`。模拟桥接测试不能代替真机测试。

## 登录实现

后台签名接口及业务认证不变；App 服务通过 `native-sdk.js` 适配原生 LoginState，复用原串行 session 控制器。
只有一套原生 IM 登录。UserSig 不放 Vuex、URL、storage，也不打印原生调用参数。
nvue 通过 `im:request-status` / `im:status` 获取脱敏状态，`im:retry` 显式重登。
原生桥接若一直不回调，保持登录队列阻塞，防止迟到的旧登录覆盖新账号；此时需重启 App。
原生登录状态变化/被踢的最终行为需要双设备真机验证。

## Vue2 适配

`node scripts/prepare-im-vue2.cjs` 将厂商 `_compatible` 下 components/state/server 同步到标准导入路径。
原始目录保留，没有删除组件文件；较大的 diff 主要来自官方 Vue3 → Vue2 版本切换。
少量本地修正同步维护在 `_compatible`：禁用工具栏时隐藏加号、会话分页加载。
升级插件后必须 review 差异；UTS 两端 callAPI 的参数日志已去掉，不要恢复。

## HBuilderX / 真机步骤

1. HBuilderX >= 4.66；本地 5.24 满足版本要求。
2. 安装官方 TypeScript 编译插件：https://ext.dcloud.net.cn/plugin?name=compile-typescript 。2026-09-10 已确认本机安装 1.0.6（TypeScript 5.0.4）。
3. 使用 HBuilderX 运行菜单「运行到手机或模拟器 → 制作自定义调试基座」。此次引入原生 UTS，必须重打；热更新 JS 不够。
4. 选择新基座运行。正常登录业务账号，观察 `[IM] SDK_READY user_…`（此时来自原生登录适配）。
5. 当前插件要求 Android >= 5.0；本地 iOS 插件 deploymentTarget 为 14。

本轮只有文字发送，不新增相机/录音权限，不自动开通腾讯付费能力，也未发起云打包/发布。

## 验收清单

两台手机登录不同账号 A/B：

- A 从消息页输入 B 的数字 ID，发送文字；B 在前台收到。
- B 停在会话列表，A 发消息：摘要/时间/未读增加；B 进入聊天后未读清零。
- B 退出聊天页或切后台后，A 发消息：不可被隐藏页面自动标记已读。
- 返回会话、重启 App 后可加载历史；下拉加载更早历史。
- 断网发送出现失败状态，恢复网络后点击失败图标重试。
- 退出账号、切换账号不展示旧消息；同账号异地登录、显式重试需要真机确认。
- 检查安卓和 iOS 键盘弹出/收起、返回键、安全区，不遮挡最后一条消息。

自动测试：`node --test tests/im-session.test.mjs tests/im-native.test.mjs tests/im-vue2-build.test.cjs`。
测试使用模拟原生桥，不能代替 UTS 原生编译及真机消息验收。

## Vue2 TypeScript 编译修复（2026-09-10）

项目原先无 tsconfig，HBuilderX 默认扫描整包 TS，导致未引用的 LiveSeatState / RoomState 等 Vue3 文件报错。
新增 `tsconfig.json` 只预加载项目声明；`vue.config.js` 将 ts-loader 设为 `onlyCompileBundledFiles: true`，其余依赖由实际打包引用决定。
保留 strict/type checking，没有将 transpileOnly 强制打开，也没有删除未使用的厂商源码。
`types/uni-components.d.ts` 声明由 HBuilderX 提供的 nvue/vue 组件与 UTS 原生模块边界。
两个兼容工具不再静态导入 Vue2.6 缺少的 ref/reactive/onMounted/onUnmounted。
本地 HBuilderX 5.24 + 自带 Node18 的 App 资源编译通过（`unpackage/im-build-check`）；产物不含 LiveSeatState/RoomParticipantState。
这仅代表 JS/nvue 资源编译通过，不代表 Android/iOS 云打包或真机登录已验收。仍须重新制作自定义基座。
