@echo off
echo ============================
echo Starting Backend and Frontend
echo ============================

:: Open a new terminal for backend
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python backend.py"

:: Open a new terminal for frontend
start cmd /k "cd frontend && npm install && npm run dev"

echo All processes started in separate terminals.
