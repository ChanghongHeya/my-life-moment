#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent};
use tauri::{ActivationPolicy, Emitter, Manager, Runtime, WebviewWindow, WindowEvent};
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_positioner::init())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(ActivationPolicy::Accessory);
                let _tray = create_tray(app)?;
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            #[cfg(target_os = "macos")]
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    let _ = window.hide();
                }
                WindowEvent::Focused(focused) => {
                    let _ = window.emit("window-focus-changed", *focused);
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
fn create_tray<R: Runtime>(app: &tauri::App<R>) -> Result<TrayIcon<R>, Box<dyn std::error::Error>> {
    let quit_item = MenuItem::with_id(app, "quit", "退出 Life Moment", true, None::<&str>)?;
    let show_item = MenuItem::with_id(app, "show", "显示主窗口", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;

    let menu = Menu::with_items(app, &[&show_item, &separator, &quit_item])?;

    let tray = TrayIconBuilder::with_id("main-tray")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id().as_ref() {
            "quit" => app.exit(0),
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.center();
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            eprintln!("[tray event] {:?}", event);
            // Forward event to positioner plugin to capture tray position
            tauri_plugin_positioner::on_tray_event(tray.app_handle(), &event);

            if let TrayIconEvent::Click {
                button,
                button_state,
                ..
            } = event
            {
                eprintln!("[tray click] button={:?} state={:?}", button, button_state);
                if button == MouseButton::Left && button_state == MouseButtonState::Up {
                    eprintln!("[tray] triggering toggle_popover");
                    toggle_popover(tray.app_handle());
                }
            }
        })
        .icon(load_tray_icon())
        .icon_as_template(false)
        .tooltip("Life Moment")
        .build(app)?;

    Ok(tray)
}

#[cfg(not(target_os = "macos"))]
fn create_tray<R: Runtime>(_app: &tauri::App<R>) -> Result<TrayIcon<R>, Box<dyn std::error::Error>> {
    unreachable!()
}

#[cfg(target_os = "macos")]
fn toggle_popover<R: Runtime>(app: &tauri::AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        let visible = window.is_visible().unwrap_or(false);
        eprintln!("[toggle_popover] window visible={}", visible);
        if visible {
            let _ = window.hide();
            eprintln!("[toggle_popover] hid window");
        } else {
            // Position below tray icon
            match window.move_window(Position::TrayCenter) {
                Ok(_) => eprintln!("[toggle_popover] moved to TrayCenter"),
                Err(e) => eprintln!("[toggle_popover] move failed: {:?}", e),
            }
            let _ = window.show();
            let _ = window.set_focus();
            eprintln!("[toggle_popover] showed window");
        }
    } else {
        eprintln!("[toggle_popover] ERROR: main window not found");
    }
}

fn load_tray_icon() -> tauri::image::Image<'static> {
    let png_bytes = include_bytes!("../icons/tray-icon.png");
    let mut decoder = png::Decoder::new(std::io::Cursor::new(png_bytes));
    decoder.set_transformations(png::Transformations::normalize_to_color8());
    let mut reader = decoder.read_info().expect("valid tray icon PNG");
    let mut buf = vec![0u8; reader.output_buffer_size()];
    let info = reader.next_frame(&mut buf).expect("valid tray icon frame");
    buf.truncate(info.buffer_size());
    let width = info.width;
    let height = info.height;
    let rgba = match info.color_type {
        png::ColorType::Rgba => buf,
        png::ColorType::Rgb => {
            let mut out = Vec::with_capacity((width * height * 4) as usize);
            for px in buf.chunks_exact(3) {
                out.extend_from_slice(&[px[0], px[1], px[2], 255]);
            }
            out
        }
        png::ColorType::Grayscale => {
            let mut out = Vec::with_capacity((width * height * 4) as usize);
            for &g in &buf {
                out.extend_from_slice(&[g, g, g, 255]);
            }
            out
        }
        png::ColorType::GrayscaleAlpha => {
            let mut out = Vec::with_capacity((width * height * 4) as usize);
            for px in buf.chunks_exact(2) {
                out.extend_from_slice(&[px[0], px[0], px[0], px[1]]);
            }
            out
        }
        other => panic!("unsupported tray icon color type: {:?}", other),
    };
    tauri::image::Image::new_owned(rgba, width, height)
}
