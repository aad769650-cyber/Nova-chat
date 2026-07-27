Real binary image assets (icon.png, splash.png, adaptive-icon.png, favicon.png)
aren't included here since they must be actual image files. `expo start` works
fine without them. Before an EAS build, add:

  assets/icon.png            (1024x1024)
  assets/splash.png          (1242x2436 recommended)
  assets/adaptive-icon.png   (1024x1024, transparent background)
  assets/favicon.png         (48x48, web only)

...then reference them from app.json's "icon", "splash.image", and
"android.adaptiveIcon.foregroundImage" fields.
