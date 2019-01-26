NPM=npm
WEBPACK=node_modules/.bin/webpack
BUNDLE=pulpstatus/static/js/app-bundle.js
APP_JS=pulpstatus/js-src/app.js
VIRTUALENV_DIR=virtualenv
VIRTUALENV=virtualenv-3
GUNICORN=$(VIRTUALENV_DIR)/bin/gunicorn
FLASK=$(VIRTUALENV_DIR)/bin/flask

# Development mode uses some settings more amenable to quick testing
DEV_ENV=\
  FLASK_APP=pulpstatus \
  FLASK_DEBUG=1 \
  PULPSTATUS_CACHE_TTL=1 \
  PULPSTATUS_HISTORY_GRANULARITY=2

all: $(BUNDLE)

node_modules/timestamp: package.json
	$(NPM) install
	touch $@

$(BUNDLE): $(WEBPACK) $(wildcard pulpstatus/js-src/*.js*)
	$(WEBPACK)

$(WEBPACK): node_modules/timestamp

$(VIRTUALENV_DIR)/bin/pip:
	$(VIRTUALENV) $(VIRTUALENV_DIR)
	$(VIRTUALENV_DIR)/bin/pip install --upgrade pip

$(GUNICORN): $(VIRTUALENV_DIR)/bin/pip
	$(VIRTUALENV_DIR)/bin/pip install -r requirements.txt

$(FLASK): $(VIRTUALENV_DIR)/bin/pip
	$(VIRTUALENV_DIR)/bin/pip install -r requirements.txt

run-webpack-watch: $(WEBPACK)
	$(WEBPACK) --watch

run: $(BUNDLE) $(GUNICORN)
	$(GUNICORN) -w4 pulpstatus

run-dev-flask: $(FLASK)
	$(VIRTUALENV_DIR)/bin/pip install --editable .
	env $(DEV_ENV) $(FLASK) run --with-threads

dev:
	$(MAKE) -j2 run-dev-flask run-webpack-watch

clean:
	rm -f $(BUNDLE) app-bundle.js
	rm -rf $(VIRTUALENV_DIR)
