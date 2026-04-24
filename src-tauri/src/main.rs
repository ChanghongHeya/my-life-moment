// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{ActivationPolicy, Manager, PhysicalPosition, Position, Runtime, TrayIcon, TrayIconBuilder, WebviewWindow};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Set activation policy to Accessory for menu bar app behavior
            #[cfg(target_os = "macos")]
            app.set_activation_policy(ActivationPolicy::Accessory);

            // Create the tray icon
            let tray = create_tray(app)?;
            
            // Handle tray icon events
            tray.on_tray_icon_event(|tray, event| {
                if let tauri::tray::TrayIconEvent::Click { .. } = event {
                    toggle_window(tray.app_handle());
                }
            });

            // Get the main window and hide it initially
            let window = app.get_webview_window("main").unwrap();
            
            // Position window near the menu bar on macOS
            #[cfg(target_os = "macos")]
            {
                position_window_near_tray(&window);
            }
            
            // Hide window initially (menu bar style)
            window.hide().unwrap();

            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                // Hide window when it loses focus (click outside)
                tauri::WindowEvent::Focused(is_focused) => {
                    if !is_focused {
                        window.hide().unwrap();
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn create_tray<R: Runtime>(app: &tauri::App<R>) -> Result Result<TrayIcon<R>, Box<dyn std::error::Error>> {
    // Create menu items
    let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "显示 Life Moment", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    
    // Create menu
    let menu = Menu::with_items(app, &[
        &show_i,
        &separator,
        &quit_i,
    ])?;

    // Build tray icon
    let tray = TrayIconBuilder::new()
        .menu(&menu)
        .on_menu_event(|app, event| {
            match event.id().as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    toggle_window(app);
                }
                _ => {}
            }
        })
        .icon(app.default_window_icon().unwrap().clone())
        .icon_as_template(true)
        .tooltip("Life Moment - 美好时刻")
        .build(app)?;

    Ok(tray)
}

fn toggle_window<R: Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            window.hide().unwrap();
        } else {
            #[cfg(target_os = "macos")]
            position_window_near_tray(&window);
            window.show().unwrap();
            window.set_focus().unwrap();
        }
    }
}

#[cfg(target_os = "macos")]
fn position_window_near_tray<R: Runtime>(window: &WebviewWindow<R>) {
    use tauri::Monitor;
    
    if let Ok(Some(monitor)) = window.current_monitor() {
        let monitor_size = monitor.size();
        let monitor_pos = monitor.position();
        
        // Get window size
        let window_size = window.outer_size().unwrap_or(tauri::Size::Physical(tauri::PhysicalSize { 
            width: 380, 
            height: 600 
        }));
        
        // Position in the top-right area (menu bar area)
        let x = monitor_pos.x + (monitor_size.width as i32) - (window_size.width as i32) - 10;
        let y = 25; // Offset from top for menu bar
        
        window.set_position(Position::Physical(PhysicalPosition { x, y })).ok();
    }
}

#[cfg(not(target_os = "macos"))]
fn position_window_near_tray<R: Runtime>(_window: &WebviewWindow<R>) {
    // No-op for non-macOS platforms
}
