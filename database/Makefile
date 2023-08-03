up:
	docker-compose -f docker-compose.yml up

down:
	docker-compose down

fclean:
	docker system prune -af
	docker volume prune -f
	docker network prune -f
	@echo " >>> Check if next commands return empty: <<< "
	@docker container ls -a
	@docker volume ls
	@docker network ls

re:	down fclean up