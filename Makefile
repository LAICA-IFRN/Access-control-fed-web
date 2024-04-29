build:
	git stash && git pull
	npm install
	npm run build

copy:
	cd && cp -r deploy/Access-control-fed-web/dist/* /var/www/virtualhost/iot

deploy: build copy

cd:
	ssh hilquias@laica.ifrn.edu.br 'cd /home/hilquias/deploy/Access-control-fed-web && make deploy'