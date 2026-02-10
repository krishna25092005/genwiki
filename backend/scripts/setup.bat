@echo off
REM Backend Installation Script for Gen Z Wikipedia (Windows)

echo 🚀 Setting up Gen Z Wikipedia Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python found
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

echo.
echo ==================================================
echo ✅ Backend setup complete!
echo ==================================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env and configure your environment variables
echo    $ copy .env.example .env
echo.
echo 2. Start MongoDB (make sure it's running on localhost:27017)
echo.
echo 3. Seed the database with sample data:
echo    $ python scripts\seed_database.py
echo.
echo 4. Start the development server:
echo    $ python -m uvicorn main:app --reload
echo.
echo API Documentation will be available at:
echo   - http://localhost:8000/docs (Swagger UI)
echo   - http://localhost:8000/redoc (ReDoc)
echo.
echo ==================================================
pause
