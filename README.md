# SpeedController Extension
A Simple Chrome extension for controlling playback speed on YouTube, Prime Video, and others.

## Features
- Playback speed control via keyboard shortcuts (d / s / r)
- On-screen speed indicator
- Supports YouTube + Prime Video and more
- Auto-detect video change and re-apply speed
- Otter run on the popup

## How to install
You can install this extension in two ways: **Download ZIP** or **Clone**.

### Option 1: Download ZIP
1. Go to the GitHub repo and click **"Code" -> "Download ZIP"**.
1. Extract the ZIP anywhere on your PC.
1. Open `chrome://extensions/`
1. Turn on **Developer mode** (top right).
1. Click **"Load unpacked"** and select the extracted folder.

### Option 2: Clone this repository
1. Clone this repo:
    ``` bash
    git clone hhttps://github.com/nukko0529/speed_controller.git
    ```
1. Open `chrome://extensions/`
1. Turn on **Developer mode**.
1. Click **"Load unpacked"** and select the cloned folder.

## Usage
### Keyboard Shortcuts
The following shortcuts work while a video is focused:

- **d** -> Increase playback speed
- **s** -> Decrease playback speed
- **r** -> Reset playback speed to **1.0x**

The step amount (e.g., +0.1 / -0.1) can be customized in the popup.

---

### Popup Features
Click the extension icon to open the popup:

- **Current speed is displayed** at the top
- **Adjust the speed step** (e.g., 0.05 / 0.1 / 0.25 / etc.)
- **Cute otter animation** reacts to the current playback speed
    (sleep -> walk -> run -> swim)

The popup settings are saved automatically.

## Structure
``` css
/src
    ├ /img
    ├ content.js
    └ popup.js
manifest.json
```

## License
This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

## Author
Created by **nukkko**
Feel free to open issues or suggestions.