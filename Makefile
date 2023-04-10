#bin/sh

build-image:
	docker build -t nakama .
	docker tag nakama:latest 385424877344.dkr.ecr.us-east-1.amazonaws.com/nakama:latest
	docker push 385424877344.dkr.ecr.us-east-1.amazonaws.com/nakama:latest

build-test:
	docker build -t nakama .
	docker run nakama

