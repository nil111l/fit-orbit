# Fit Orbit App Builds

Fit Orbit uses one React/Vite frontend with two native shells:

- Windows desktop: Electron
- Android: Capacitor Android

## Windows

Run the desktop app during development:

```powershell
npm run electron:dev
```

Build a Windows package:

```powershell
npm run windows:portable
```

This creates a no-install Windows app folder with `Fit Orbit.exe`.

Build a Windows installer, when Electron Builder downloads are available:

```powershell
npm run windows:build
```

Output path:

```text
release/windows/FitOrbit-win-unpacked-*
```

## Android

Sync the latest web build into the Android project:

```powershell
npm run android:sync
```

Open the Android project:

```powershell
npm run android:open
```

Build a debug APK after installing JDK and Android Studio / Android SDK:

```powershell
npm run android:debug
```

APK output:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Required Local Tools

Windows packaging needs Electron Builder to complete successfully.

Android packaging needs:

- JDK installed and `JAVA_HOME` configured
- Android Studio or Android SDK installed
- Android SDK platform/build tools accepted and available
