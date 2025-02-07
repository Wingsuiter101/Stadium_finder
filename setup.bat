@echo off
echo Setting up Basketball Arena Finder...

:: Check if Python is installed
python --version > nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please install Python 3.12
    exit /b 1
)

:: Check if Node.js is installed
node --version > nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed! Please install Node.js
    exit /b 1
)

:: Create and activate virtual environment
echo Creating Python virtual environment...
python -m venv venv
call venv\Scripts\activate

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

:: Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Setup complete! You can now run:
echo - Backend: cd backend ^& python -m uvicorn src.api.main:app --reload
echo - Frontend: cd frontend ^& npm start 