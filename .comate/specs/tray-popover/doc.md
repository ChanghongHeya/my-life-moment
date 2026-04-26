# tray-popover: 菜单栏弹出浮窗

## 需求场景

将 Life Moment 的主窗口改造为 macOS 菜单栏弹出面板（popover）样式：
- 点击菜单栏图标时，窗口从图标正下方弹出，而非居中显示
- 窗口无标题栏装饰，呈现浮窗效果
- 窗口始终置顶，失焦时自动收起
- 窗口尺寸紧凑，适合快速查看

## 技术方案

### 1. 窗口配置调整 (tauri.conf.json)

将主窗口改造为 popover 风格：
- `decorations: false` — 去掉标题栏
- `alwaysOnTop: true` — 始终置顶
- `visible: false` — 启动时隐藏（由 tray 点击触发显示）
- `skipTaskbar: true` — 不在 Dock 显示
- `resizable: false` — 不可调整大小
- 尺寸保持 380x600，适合展示会议列表

### 2. Rust 端窗口定位逻辑 (main.rs)

**获取 tray icon 位置**：Tauri v2 的 `TrayIconEvent::Click` 事件包含 `rect` 字段（`tauri::Rect`），表示图标在屏幕上的位置和尺寸。

**计算窗口位置**：
- x = tray_rect.position.x + tray_rect.size.width/2 - window_width/2（水平居中对齐图标）
- y = tray_rect.position.y + tray_rect.size.height（紧贴图标下方）

**关键代码改动**：
```rust
// 在 tray click handler 中捕获 rect
tray.on_tray_icon_event(|tray, event| {
    if let tauri::tray::TrayIconEvent::Click {
        button, button_state, rect, ..
    } = event {
        if button == MouseButton::Left && button_state == MouseButtonState::Up {
            toggle_window(tray.app_handle(), Some(rect));
        }
    }
});
```

**show_window 函数**使用 `window.set_position()` 将窗口定位到 tray icon 下方：
```rust
fn show_window<R: Runtime>(app: &tauri::AppHandle<R>, tray_rect: Option<Rect>) {
    if let Some(window) = app.get_webview_window("main") {
        if let Some(rect) = tray_rect {
            let win_width = 380.0;
            let x = rect.position.x + (rect.size.width / 2.0) - (win_width / 2.0);
            let y = rect.position.y + rect.size.height;
            let _ = window.set_position(tauri::Position::Logical(
                tauri::LogicalPosition::new(x, y)
            ));
        }
        let _ = window.show();
        let _ = window.set_focus();
    }
}
```

### 3. 失焦自动隐藏

监听窗口 `Focused(false)` 事件，当窗口失焦时自动隐藏：

```rust
.on_window_event(|window, event| {
    match event {
        WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            let _ = window.hide();
        }
        WindowEvent::Focused(false) => {
            let _ = window.hide();
        }
        _ => {}
    }
})
```

### 4. 移除首次启动居中显示

当前 setup 中有首次启动居中显示逻辑，需移除，改为启动时不显示窗口（等用户点击 tray icon）。

### 5. 前端样式适配

去掉标题栏后需要微调前端样式：
- 顶部增加少量 padding 避免内容紧贴窗口边缘
- 可选：添加圆角和阴影增强浮窗视觉效果

## 受影响文件

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src-tauri/tauri.conf.json` | 修改 | 窗口配置：无装饰、置顶、隐藏启动 |
| `src-tauri/src/main.rs` | 修改 | tray 点击定位、失焦隐藏、移除首次居中 |
| `src/components/App.tsx` | 修改 | 顶部 padding 适配无标题栏 |

## 边界条件

- 多显示器：`Rect` 坐标是全局屏幕坐标，多显示器场景下仍正确
- 窗口超出屏幕底部：380x600 在大多数屏幕上不会超出，菜单栏在顶部
- 右键菜单不受影响：右键仍弹出原有菜单（退出/显示）

## 预期效果

点击菜单栏图标 -> 窗口从图标下方弹出 -> 显示完整应用内容 -> 点击窗口外部 -> 窗口自动收起
