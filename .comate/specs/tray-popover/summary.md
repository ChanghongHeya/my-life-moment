# tray-popover 完成总结

## 改动概述

将 Life Moment 从普通窗口模式改造为 macOS 菜单栏弹出浮窗（popover）模式。

## 改动文件

### src-tauri/tauri.conf.json
- `decorations: false` — 去掉标题栏，呈现浮窗效果
- `alwaysOnTop: true` — 窗口始终置顶
- `visible: false` — 启动时不显示窗口
- `skipTaskbar: true` — 不在 Dock 中显示
- `minimizable: false` — 浮窗不需要最小化

### src-tauri/src/main.rs
- tray click handler 捕获 `rect`（图标位置），传递给 `toggle_window`
- `show_window` 根据 tray icon 位置计算窗口坐标，使窗口水平居中对齐图标、紧贴图标下方弹出
- 正确处理 `Position`/`Size` 枚举（Physical/Logical 两种变体）
- 移除首次启动居中显示逻辑
- 新增 `WindowEvent::Focused(false)` 处理：窗口失焦时自动隐藏

### src/components/App.tsx
- 新增 `data-tauri-drag-region` 拖拽区域，替代标题栏拖拽功能
- 添加顶部 2px 拖拽条
- header 区域也支持拖拽
- 窗口容器增加 `rounded-xl overflow-hidden` 圆角效果

## 行为变化

| 操作 | 之前 | 之后 |
|------|------|------|
| 启动 | 窗口居中显示 | 不显示，等待 tray 点击 |
| 点击 tray | 窗口居中弹出 | 窗口从图标正下方弹出 |
| 点击窗口外部 | 无反应 | 窗口自动收起 |
| 窗口外观 | 有标题栏 | 无标题栏，浮窗风格 |
