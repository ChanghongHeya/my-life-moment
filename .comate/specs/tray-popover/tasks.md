# 菜单栏弹出浮窗改造

- [x] Task 1: 修改窗口配置为 popover 风格
    - 1.1: tauri.conf.json 中设置 `decorations: false`、`alwaysOnTop: true`、`visible: false`、`skipTaskbar: true`
    - 1.2: 保持窗口尺寸 380x600，移除 `center: true`

- [x] Task 2: 实现 tray 点击定位与失焦隐藏
    - 2.1: tray click handler 中捕获 `rect` 参数并传递给 `toggle_window`
    - 2.2: `show_window` 中根据 tray rect 计算窗口位置（水平居中对齐图标、紧贴下方）
    - 2.3: 移除 setup 中首次启动居中显示逻辑
    - 2.4: `on_window_event` 中增加 `Focused(false)` 事件处理，失焦时隐藏窗口

- [x] Task 3: 前端样式适配无标题栏
    - 3.1: App.tsx 顶部增加 padding 补偿标题栏消失的空间
    - 3.2: 验证整体布局在无装饰窗口下显示正常

- [x] Task 4: 构建验证
    - 4.1: 执行 cargo check 确认 Rust 编译通过
    - 4.2: 执行 npm run build 确认前端构建通过
