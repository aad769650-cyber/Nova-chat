Icon files are intentionally not included (they must be real binary PNG/ICO/ICNS
images). Before running `npm run tauri build`, generate them from any square PNG:

    npx tauri icon path/to/your-logo.png

This fills in 32x32.png, 128x128.png, 128x128@2x.png, icon.icns, and icon.ico
automatically. `npm run tauri dev` works fine without them.
