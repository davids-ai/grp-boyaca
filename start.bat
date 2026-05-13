@echo off
REM Script de inicio rápido para desarrollo en Windows

echo 🚀 Iniciando CRM Congresista Boyacá...
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    echo.
)

REM Iniciar servidor de desarrollo
echo ▶️  Iniciando servidor de desarrollo en http://localhost:3000
call npm run dev

pause
