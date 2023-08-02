up:
	@if [ ! -f .env ]; then echo "No .env file, please add one" && exit; fi; ln .env frontend-vite/.env; docker-compose -f docker-compose.yml up

down:
	docker-compose down

fclean: down
	docker system prune -af
	docker volume prune -f
	docker network prune -f

re:	fclean up
