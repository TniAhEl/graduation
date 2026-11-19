@echo off
title Invitation Frontend (React Vite)
echo ========================================================
echo   KHOI DONG REACTJS FRONTEND (Port 5173)
echo ========================================================
echo.

if exist "D:\nodejs\node.exe" (
    set "PATH=D:\nodejs;%PATH%"
    echo [OK] Su dung NodeJS tai: D:\nodejs
)

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [..] Dang tai va cai dat thu vien npm...
    call npm install
)

if exist "node_modules" (
    echo.
    echo [OK] Dang khoi chay Vite dev server...
    call npm run dev
) else (
    echo.
    echo [THONG BAO] Neu ban chua muon cai npm, hay mo truc tiep file:
    echo            d:\graduation\preview.html
    echo tren trinh duyet de trai nghiem toan bo giao dien ngay lap tuc!
)
pause
