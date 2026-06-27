$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$jdk = Join-Path $root ".tools\jdk-21\jdk-21.0.11+10"
$sdk = Join-Path $root ".tools\android-sdk"

if (-not (Test-Path (Join-Path $jdk "bin\java.exe"))) {
  throw "JDK 21 is missing. Download Microsoft JDK 21 into .tools\jdk-21 first."
}

if (-not (Test-Path (Join-Path $sdk "platforms\android-36"))) {
  throw "Android SDK platform 36 is missing. Install command-line tools and SDK packages first."
}

$env:JAVA_HOME = $jdk
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:Path = "$jdk\bin;$sdk\cmdline-tools\latest\bin;$sdk\platform-tools;$env:Path"

Push-Location (Join-Path $root "android")
try {
  .\gradlew.bat assembleDebug
}
finally {
  Pop-Location
}

Write-Host "APK created at: $root\android\app\build\outputs\apk\debug\app-debug.apk"
