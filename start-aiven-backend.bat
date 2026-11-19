@echo off
setlocal
chcp 65001 >nul
title Invitation Backend - PostgreSQL

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backend\start-aiven-backend.ps1"
pause
