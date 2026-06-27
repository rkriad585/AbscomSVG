.PHONY: build test typecheck clean install

build:
	npm run build

test:
	bun test

typecheck:
	npm run typecheck

clean:
	rm -rf dist/

install:
	npm install
