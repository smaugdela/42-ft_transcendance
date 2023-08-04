up: #data certs
	# -cp -u localhost.pem frontend/security/localhost.pem
	# -cp -u localhost-key.pem frontend/security/localhost-key.pem
	# -cp -u localhost.pem backend/security/localhost.pem
	# -cp -u localhost-key.pem backend/security/localhost-key.pem
	# @if [ ! -f .env ]; then echo "No .env file, please add one" && exit; fi; cp -u .env frontend/.env; docker-compose -f docker-compose.yml up --build

# data:
# 	mkdir -p data

# certs:
# 	@if [ ! -f localhost.pem ] || [ ! -f localhost-key.pem ]; then mkcert localhost; fi

down:
	docker-compose down

fclean: down
	# -rm -rf frontend/.env
	docker system prune -af
	docker network prune -f
	-docker volume rm 42-ft_transcendance_postgres

re:	fclean up
