rabbitmq-test:
	rm -rf tls-gen;
	git clone https://github.com/rabbitmq/tls-gen tls-gen; cd tls-gen/basic; CN=rabbitmq make
	chmod -R 755 tls-gen
	docker compose down
	docker compose up -d
	sleep 5
	docker exec rabbitmq-js-client rabbitmqctl await_startup
	docker exec rabbitmq-js-client rabbitmqctl add_user 'O=client,CN=rabbitmq' ''
	docker exec rabbitmq-js-client rabbitmqctl clear_password 'O=client,CN=rabbitmq'
	docker exec rabbitmq-js-client rabbitmqctl set_permissions 'O=client,CN=rabbitmq' '.*' '.*' '.*'