@echo off
title FinDash Pro - Gestao Financeira
echo ===================================================
echo     Iniciando FinDash Pro para Rennan Lucas...
echo ===================================================
echo.
cd /d "%~dp0"
echo Abrindo servidor de alta performance...
start http://localhost:5173
npm run dev -- --host 0.0.0.0 --port 5173
pause
