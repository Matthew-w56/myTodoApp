#[cfg_attr(mobile, tauri::mobile_entry_point)]

use log::{info, error};
use tauri::{Manager};
use std::path::PathBuf;
use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use std::fs::{/*metadata, */copy, create_dir_all};

struct JavaServer(Mutex<Option<Child>>);

// This is a very useful function to get info on a file that isn't behaving right
// fn check_file_metadata(file_path: &PathBuf) {
// 	match metadata(file_path) {
// 		Ok(metadata) => {
// 			// Check if the path is a file
// 			if metadata.is_file() {
// 				info!("File exists: {:?}", file_path);
// 				info!("File size: {} bytes", metadata.len());
// 				info!("Permissions: {:?}", metadata.permissions());
// 			} else {
// 				info!("The path exists, but it's not a file: {:?}", file_path);
// 			}
// 		}
// 		Err(_e) => {}
// 	}
// }

fn claude_get_jar_path(app: &tauri::App) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let jar_name = "myTodoAppJavaSide-0.0.1-SNAPSHOT.jar";
		
		// Try development paths
    let dev_paths = vec![
        PathBuf::from(format!("java/target/{}", jar_name)),
        PathBuf::from(format!("../java/target/{}", jar_name))
    ];
    
    for path in dev_paths {
        if path.exists() {
            return Ok(path);
        }
    }
    
    // First try resource path (production)
    if let Ok(resource_path) = app.path().resource_dir() {
				// Try direct resource directory as fallback
        let jar_path = resource_path.join(jar_name);
        if jar_path.exists() {
            return Ok(jar_path);
        }
        
        // Check the resources subdirectory
        let resources_subdir = resource_path.join("resources");
        
        if resources_subdir.exists() {
            // List contents of resources subdirectory
            if let Ok(entries) = std::fs::read_dir(&resources_subdir) {
                for entry in entries {
                    if let Ok(entry) = entry {
                        // Check if this is our JAR file
                        if entry.path().file_name()
                            .and_then(|n| n.to_str())
                            .map(|n| n == jar_name)
                            .unwrap_or(false) 
                        {
                            return Ok(entry.path());
                        }
                    }
                }
            }
        }
    }
    
    Err("JAR file not found in any expected location".into())
}

fn copy_jar_to_app_data(app: &tauri::App) -> Result<(), String> {
	// Get location we want to store the JAR
	let Ok(mut real_server_path) = app.path().app_data_dir() else { panic!("Could not find real server path"); };
	real_server_path.push("java");
	
	// Find where the JAR is now
	let current_jar_path = claude_get_jar_path(app).map_err(|e| e.to_string())?;
	
	// Make sure the directory exists
	match create_dir_all(real_server_path.clone()) {
		Ok(_s) => {info!("Created directory successfully!");}
		Err(_e) => {error!("Failed to create directory!");}
	}
	
	// Add JAR name to target path
	let java_name: String = "myTodoAppJavaSide-0.0.1-SNAPSHOT.jar".to_owned();
	real_server_path.push(&java_name);
	
	// Copy the JAR
	match copy(current_jar_path, real_server_path) {
		Ok(_s) => {info!("Copied jar successfully!");}
		Err (_e) => {error!("Did not copy JAR successfull!  FAILED!");}
	}
	
	Ok(())
}

pub fn run() {
	// env_logger::init();
  tauri::Builder::default()
		.plugin(tauri_plugin_log::Builder::default()
			.level(log::LevelFilter::Info)
			.build()
		)
    .setup(|app| {
			// Copy the JAR to our App data directory
			let _ = copy_jar_to_app_data(app);
			
			// Java server stuff
			let server = JavaServer(Mutex::new(None));
			// Construct the path of the JAR file after that copy statement earlier
			let Ok(mut real_server_path) = app.path().app_data_dir() else { panic!("Could not find real server path"); };
			let java_name: String = "myTodoAppJavaSide-0.0.1-SNAPSHOT.jar".to_owned();
			real_server_path.push("java");
			real_server_path.push(&java_name);
			
			// Set up command
			let mut jar_comm = Command::new("java");
			// If on windows, mark command not to create a window
			#[cfg(target_os = "windows")]
			{
				use std::os::windows::process::CommandExt;
				const CREATE_NO_WINDOW: u32 = 0x08000000;
				jar_comm.creation_flags(CREATE_NO_WINDOW);
			}
			// Don't use standard in or output (Help make sure no window is created)
			// jar_comm
			// 		.stdout(Stdio::null())
			// 		.stderr(Stdio::null());
			
			if let Ok(child) =jar_comm
					.arg("-jar")
					.arg(real_server_path)
					.spawn() {
				*server.0.lock().unwrap() = Some(child);
				app.manage(server);
			} else {
				error!("Failed to start Java server!");
			}
			
			// Done doing setup!
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
