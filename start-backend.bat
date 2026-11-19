@echo off
title Invitation Backend (Spring Boot)
echo ========================================================
echo   KHOI DONG SPRING BOOT BACKEND (Port 8088)
echo ========================================================
echo.

REM Kiem tra JDK 24 neu co, hoac dung Java 17 mac dinh
if exist "D:\jdk-24.0.1\bin\java.exe" (
    set "JAVA_HOME=D:\jdk-24.0.1"
    set "PATH=D:\jdk-24.0.1\bin;%PATH%"
)

cd /d "%~dp0backend"

echo [OK] Kiem tra phien ban Java:
java -version
echo.

if exist "target\invitation-backend-1.0.0.jar" (
    echo [OK] Tim thay file JAR (Java 17). Dang khoi dong...
    java -jar target\invitation-backend-1.0.0.jar
) else (
    echo [..] Dang bien dich qua Maven...
    call mvn spring-boot:run
)
pause
