# Ad Destroyer and Login Bypass Chrome Extension

A powerful Chrome extension that removes blur effects, bypasses login/paywall overlays, and blocks advertisements on websites.

## 🚀 Features

- **Blur Removal**: Clears blur filters used to hide content behind paywalls  
- **Paywall Bypass**: Removes signup/login overlays and modals  
- **Ad Blocking**: Blocks most ads with toggle functionality  
- **Scroll Restoration**: Restores normal scrolling on restricted pages  
- **No Tracking**: 100% privacy-friendly — no data collection  
- **Lightweight**: Minimal performance impact  

## 🛠️ Installation

### From Source Code

1. Download or clone this repository:
   ```bash
   git https://github.com/VirusVrund/chrome-extension-ad-blur-remover
   ```
2. Open Chrome and go to:  
   ```
   chrome://extensions/
   ```
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the extension folder you cloned

## 🧑‍💻 Usage

- Click the extension icon in the Chrome toolbar  
- Click the **"Remove Blur & Paywalls"** button to clean the current page  
- Toggle **"Block Ads"** on/off (requires page reload to take effect)  

## ⚙️ How It Works

- Removes CSS blur and backdrop filters  
- Identifies and removes common overlay/modal elements  
- Restores scrolling on pages that block it  
- Blocks ads using pattern matching  
- Prevents tracking scripts from loading  

## 🎨 Optional: Add Your Own Icons(we have not used current)

1. Create PNG icon files:
   - `icon16.png` (16x16)
   - `icon48.png` (48x48)
   - `icon128.png` (128x128)
2. Save them in your extension directory
3. Update your `manifest.json` like this:
   ```json
   "action": {
     "default_popup": "popup.html",
     "default_icon": {
       "16": "icon16.png",
       "48": "icon48.png",
       "128": "icon128.png"
     }
   },
   "icons": {
     "16": "icon16.png",
     "48": "icon48.png",
     "128": "icon128.png"
   }
   ```

## ✅ Compatibility

- Chrome 88 and newer  
- Works on most websites including news, blogs, and content platforms  
- Tested on Windows, macOS, and Linux  

## ⚠️ Limitations

- Some websites with strong anti-ad-block may still detect it  
- Dynamic content might require another click to remove blur/paywall  
- Server-side paywalls cannot be bypassed  

## 🤝 Contributing

Contributions are welcome!  
Feel free to submit pull requests or issues for:

- Additional blur/paywall selectors  
- Improved ad detection patterns  
- Bug fixes and performance improvements  


## ⚠️ Disclaimer

This extension is for **educational purposes only**.  
Please respect content creators and consider subscribing or whitelisting websites you enjoy.
