
up:
	docker-compose -f docker-compose.yml up

fclean:
	docker volume prune
	docker system prune -a
	@echo " >>> Check if next commands return empty: <<< "
	@docker container ls -a
	@docker volume ls
