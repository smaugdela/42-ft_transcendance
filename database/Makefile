
up:
	docker-compose -f docker-compose.yml up

fclean:
	docker system prune -a
	docker volume prune
	@echo " >>> Check if next commands return empty: <<< "
	@docker container ls -a
	@docker volume ls

re:	up fclean
