up: data
	@if [ ! -f .env ]; then echo "No .env file, please add one" && exit; fi; ln .env frontend/.env; docker-compose -f docker-compose.yml up

data:
	mkdir -p data

down:
	docker-compose down

fclean: down
	docker system prune -af
	docker volume rm 42-ft_transcendance_postgres
	docker network prune -f

re:	fclean up
