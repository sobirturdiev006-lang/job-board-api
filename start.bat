@echo off
echo Starting Job Board Application...
echo.

echo [1/4] Installing backend dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo [3/4] Starting Django backend server...
start "Django Backend" cmd /k "python manage.py runserver"

echo.
echo [4/4] Starting React frontend...
cd frontend
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/api/docs/
echo ========================================
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq Django Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Frontend*" /T /F >nul 2>&1
echo Servers stopped.
