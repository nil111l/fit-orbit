# Fit Orbit

Fit Orbit is a DIY fitness planning app for diet, workout selection, calorie tracking, daily records, and weekly/monthly reporting.

The app uses one React/Vite frontend with two native shells:

- Windows desktop: Electron
- Android: Capacitor Android

## Development

```powershell
npm install
npm run dev
```

## Windows App

```powershell
npm run windows:portable
```

The generated app folder is created under:

```text
release/windows/FitOrbit-win-unpacked-*
```

Copy the whole folder to another Windows machine and run `Fit Orbit.exe`.

## Android App

```powershell
npm run android:sync
npm run android:open
```

To build an APK, install JDK and Android Studio / Android SDK first, then run:

```powershell
cd android
.\gradlew.bat assembleDebug
```

## Notes

User records and custom food/workout data are currently stored locally in the browser/app storage.
