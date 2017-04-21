NPM=npm
BROWSERIFY=node_modules/.bin/browserify
WATCHIFY=node_modules/.bin/watchify
UGLIFY=node_modules/.bin/uglifyjs
BUNDLE=pulpstatus/static/js/app-bundle.js
APP_JS=pulpstatus/js-src/app.js
BROWSERIFY_ARGS=pulpstatus/js-src/app.js -t browserify-css -t babelify -t uglifyify

all: node_modules/timestamp $(BUNDLE)

node_modules/timestamp: package.json
	$(NPM) install
	touch $@

$(BUNDLE): node_modules/timestamp $(wildcard pulpstatus/js-src/*.js*)
	$(BROWSERIFY) $(BROWSERIFY_ARGS) | $(UGLIFY) > $@.tmp
	mv $@.tmp $@

watchify:
	$(WATCHIFY) $(BROWSERIFY_ARGS) --outfile $(BUNDLE)

run: $(BUNDLE)
	gunicorn pulpstatus

clean:
	rm -f pulpstatus/static/js/app-bundle.js
