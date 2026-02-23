echo on
IF NOT EXIST "local\.env" (copy docker-local-env local\.env)

docker compose pull
docker-compose -f docker-compose-local.yaml up --build
@echo off
pause