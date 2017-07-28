NPM=npm
BROWSERIFY=node_modules/.bin/browserify
WATCHIFY=node_modules/.bin/watchify
UGLIFY=node_modules/.bin/uglifyjs
BUNDLE=pulpstatus/static/js/app-bundle.js
APP_JS=pulpstatus/js-src/app.js
BROWSERIFY_ARGS=pulpstatus/js-src/app.js -t browserify-css -t babelify -t uglifyify
VIRTUALENV=virtualenv
GUNICORN=$(VIRTUALENV)/bin/gunicorn
FLASK=$(VIRTUALENV)/bin/flask

all: node_modules/timestamp $(BUNDLE)

node_modules/timestamp: package.json
	$(NPM) install
	touch $@

$(BUNDLE): node_modules/timestamp $(wildcard pulpstatus/js-src/*.js*)
	$(BROWSERIFY) $(BROWSERIFY_ARGS) | $(UGLIFY) > $@.tmp
	mv $@.tmp $@

watchify: node_modules/timestamp
	$(WATCHIFY) $(BROWSERIFY_ARGS) --outfile $(BUNDLE)

$(VIRTUALENV)/bin/pip:
	virtualenv $(VIRTUALENV)
	$(VIRTUALENV)/bin/pip install --upgrade pip

$(GUNICORN): $(VIRTUALENV)/bin/pip
	$(VIRTUALENV)/bin/pip install -r requirements.txt

$(FLASK): $(VIRTUALENV)/bin/pip
	$(VIRTUALENV)/bin/pip install -r requirements.txt

run: $(BUNDLE) $(GUNICORN)
	$(GUNICORN) pulpstatus

run-dev-flask: $(FLASK)
	$(VIRTUALENV)/bin/pip install --editable .
	env FLASK_APP=pulpstatus FLASK_DEBUG=1 $(FLASK) run --with-threads

dev:
	$(MAKE) -j2 watchify run-dev-flask

clean:
	rm -f pulpstatus/static/js/app-bundle.js
	rm -rf $(VIRTUALENV)
