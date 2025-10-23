@echo off
echo Starting Campus Voice Application...
echo.

echo Setting environment variables...
set DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19XTFB2bUlxZTRfOXRKUGs4ZFdWOFQiLCJhcGlfa2V5IjoiMDFLODkwREpUNTEwTjlFSFRLTlgxMjE3Q1MiLCJ0ZW5hbnRfaWQiOiI3OGVmMGYxYTcwNmFjZDc5ODMzOGI5MDlkYjM3ODMwZWMzZTY4OGJhNmIzMzg0ODY2Yjc2ZGQ2YzU1M2E1NmY5IiwiaW50ZXJuYWxfc2VjcmV0IjoiYTQ3YjkwNzctZmE5YS00YzRhLTg1ZjgtNGM4MTBjYzI3ZjljIn0.AYx9AKI73dj9uZlclsheijQQXhfxPifKZpS3s_zo66o
set JWT_SECRET=campus_voice_jwt_secret_key_2025
set PORT=3001

echo Starting backend server...
start "Backend Server" cmd /k "node server.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Frontend" cmd /k "npm start"

echo.
echo Application is starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Default login credentials:
echo Admin: admin@campusvoice.edu / admin123
echo Student: student@campusvoice.edu / student123
echo.
pause
