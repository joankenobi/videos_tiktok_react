cd /d "%~dp0"
rd "C:\Users\Public\Documents\Programacion\remotion-video\out\locations" /S
robocopy "C:\Users\Public\Documents\Programacion\telegram back\downloads\locations" "C:\Users\Public\Documents\Programacion\remotion-video\public\locations" /E /V /Z
node get-dimensions.js


rd "C:\Users\Public\Documents\Programacion\remotion-video\public\locations" /S