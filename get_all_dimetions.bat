cd /d "%~dp0"

echo delecting the old out\locations dir from the remotion dir...

rd "C:\Users\Public\Documents\Programacion\remotion-video\out\locations" /S

echo copying the \locations dir from the back dir...
robocopy "C:\Users\Public\Documents\Programacion\telegram back\downloads\locations" "C:\Users\Public\Documents\Programacion\remotion-video\public\locations" /E /V /Z
node get-dimensions.js


echo delecting the old public\locations dir from the remotion dir...
rd "C:\Users\Public\Documents\Programacion\remotion-video\public\locations" /S