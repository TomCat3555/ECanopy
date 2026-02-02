@echo off
echo Setting up ECanopy Database...

cd /d ECanopy

echo Running database migrations...
dotnet ef database update

if %ERRORLEVEL% NEQ 0 (
    echo Database migration failed!
    pause
    exit /b 1
)

echo Database setup complete!
echo Starting application...

cd ..
start-app.bat