// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, Modifiers, Shortcut, GlobalShortcutExt};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // Create the shortcut: Ctrl+Shift+P
            let shortcut = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::KeyP);

            // Register the shortcut
            app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
                match event.state() {
                    tauri_plugin_global_shortcut::ShortcutState::Pressed => {
                        if window.is_visible().unwrap_or(true) {
                            let _ = window.hide();
                        } else {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    _ => {}
                }
            })?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}