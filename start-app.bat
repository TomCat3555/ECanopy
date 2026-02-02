@echo off
echo Starting ECanopy Application...

echo Starting .NET Backend...
start "Backend" cmd /k "cd /d ECanopy && dotnet run"

timeout /t 5 /nobreak > nul

echo Starting React Frontend...
start "Frontend" cmd /k "cd /d ecanopy-frontend && npm start"

echo Both services are starting...
echo Backend: https://localhost:7001
echo Frontend: http://localhost:3000
pause