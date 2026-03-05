@echo off
echo Starting ngrok on port 5173...
ngrok http 5173
pause

//Start-Process cmd -ArgumentList "/c d:\Hoctiengnhat\start-ngrok.bat"
