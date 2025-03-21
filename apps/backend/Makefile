ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

help:
	@printf "usage: make [target] ...\n\n"
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

# ---------------------------------
# Application related commands.
# ---------------------------------

install:
	@pip3 install -r requirements.txt

run: ## Run the application locally on the host machine
	@godotenv -f $(ROOT_DIR)/../../.env.local uvicorn main:app --host 0.0.0.0 --port 8000 --reload
