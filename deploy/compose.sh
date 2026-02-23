cd cloud 
sudo docker compose pull

# Останавливаем контейнеры, если они есть
running_containers=$(docker ps -q)
if [ -n "$running_containers" ]; then
    echo "Найдены запущенные контейнеры. Останавливаем..."
    docker stop $running_containers
    echo "Успешно остановлено контейнеров: $(echo "$running_containers" | wc -l)"
else
    echo "Нет запущенных контейнеров для остановки."
fi

docker stop $(docker ps -q)
sudo docker compose -f docker-compose.yaml up --build -d