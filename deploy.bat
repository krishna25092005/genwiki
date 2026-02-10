@echo off
REM Quick Deployment Script for Windows
REM WikiGen Platform Deployment Helper

echo ========================================
echo   WikiGen Deployment Helper
echo ========================================
echo.

:menu
echo Please select deployment option:
echo.
echo 1. Deploy to Vercel (Frontend)
echo 2. Deploy to Railway (Backend)
echo 3. Deploy with Docker (Full Stack)
echo 4. Run deployment checks
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto railway
if "%choice%"=="3" goto docker
if "%choice%"=="4" goto checks
if "%choice%"=="5" goto end

echo Invalid choice. Please try again.
goto menu

:vercel
echo.
echo ========================================
echo   Deploying to Vercel
echo ========================================
echo.
echo Installing Vercel CLI...
call npm install -g vercel

echo.
echo Running build...
call pnpm build

echo.
echo Deploying to Vercel...
call vercel --prod

echo.
echo ✅ Frontend deployed to Vercel!
echo Check your Vercel dashboard for the URL.
pause
goto menu

:railway
echo.
echo ========================================
echo   Deploying to Railway
echo ========================================
echo.
echo Installing Railway CLI...
call npm install -g @railway/cli

echo.
echo Logging in to Railway...
call railway login

echo.
echo Deploying backend...
cd backend
call railway up
cd ..

echo.
echo ✅ Backend deployed to Railway!
echo Check your Railway dashboard for the URL.
pause
goto menu

:docker
echo.
echo ========================================
echo   Docker Deployment
echo ========================================
echo.
echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    goto menu
)

echo.
echo Building and starting containers...
docker-compose up --build -d

echo.
echo ✅ Docker containers started!
echo.
echo Services available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   MongoDB:  localhost:27017
echo.
echo View logs with: docker-compose logs -f
echo Stop with: docker-compose down
pause
goto menu

:checks
echo.
echo ========================================
echo   Running Deployment Checks
echo ========================================
echo.
call node scripts/check-deployment.js
pause
goto menu

:end
echo.
echo Thanks for using WikiGen Deployment Helper!
echo.
exit /b 0
