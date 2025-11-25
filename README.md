# SpeedController Extension
A Simple Chrome extension for controlling playback speed on YouTube, Prime Video, and others.

# Features
- Playback speed control via keyboard shortcuts (d / s / r)
- On-screen speed indicator
- Supports YouTube + Prime Video and more
- Auto-detect video change and re-apply speed
- Otter run on the popup

# How to install
1. Clone this repository
1. Open `chrome://extensions`
1. Turn on Developer Mode
1. Click "Load unpacked" and select this folder

# Usage
d -> speed up
s -> slow down
r -> reset to 1.0x

# Structure
``` css
/img
/src
    ├ content.js
    └ popup.js
manifest.json
```