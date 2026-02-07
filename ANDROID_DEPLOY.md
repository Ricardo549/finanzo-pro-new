# Android Deployment Guide

This guide explains how to build and deploy the Finanzo Pro application to Android devices.

## 1. Prerequisites

- **Node.js** and **npm** installed.
- **Android Studio** installed (with Android SDK and standard tools).
- **Java Development Kit (JDK)** installed.

## 2. Setup

The project is already configured with Capacitor. If you need to re-initialize:

```bash
npx cap init
```

Ensure `vite.config.ts` has `base: './'`.

## 3. Building the App

1.  **Build the Web App:**
    ```bash
    npm run build
    ```
    This compiles your React app into the `dist/` folder.

2.  **Sync with Capacitor:**
    ```bash
    npx cap sync
    ```
    This copies the `dist/` folder to the `android/` native project and updates plugins.

## 4. Running on Android

### Option A: Open in Android Studio (Recommended)

Run:
```bash
npx cap open android
```
This opens the `android/` folder in Android Studio. From there, you can:
- Run the app on an Emulator.
- Connect a physical device and run the app.
- Build Signed APKs/Bundles for the Play Store (`Build > Generate Signed Bundle / APK`).

### Option B: Run from Command Line

To run on a connected device or emulator:
```bash
npx cap run android
```

## 5. Troubleshooting

- **White Screen:** Ensure `base: './'` is in `vite.config.ts`.
- **Plugin Issues:** Run `npx cap sync` after installing any new native plugins.
- **Gradle Errors:** Open the project in Android Studio to see detailed error messages and let it sync Gradle wrapper/dependencies.

## 6. Changing App Icon and Splash Screen

Use `@capacitor/assets` to generate icons and splash screens.
1. Install: `npm install @capacitor/assets --save-dev`
2. Place `logo.png` and `splash.png` in `assets/`.
3. Run: `npx capacitor-assets generate --android`

## 7. Firebase Setup (Optional)

If you are using Firebase:
1.  Download `google-services.json` from the Firebase Console.
2.  Place it in the **`android/app/`** directory.
3.  The project usually comes pre-configured to look for this file, but you may need to apply the google-services plugin in `android/build.gradle` and `android/app/build.gradle` if not already present (Capacitor usually handles most of this via plugins).
