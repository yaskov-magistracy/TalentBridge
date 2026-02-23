echo on
IF NOT EXIST "local\.env" (
    copy docker-env-shared local\.env >nul
    echo. >> local\.env
    type local\docker-env-local >> local\.env
)
cd local

docker compose pull
docker-compose -f docker-compose.yaml up --build
@echo off
pause