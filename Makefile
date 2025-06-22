# -*- coding: utf-8; tab-width: 2; mode: makefile-gmake; -*-

MAKEFLAGS += --no-print-directory --warn-undefined-variables

SHELL := bash
.SHELLFLAGS := -euo pipefail -c

HERE := $(shell cd -P -- $(shell dirname -- $$0) && pwd -P)

.PHONY: all
all: build

include .titletk.mk

.PHONY: download-alpine
download-alpine: has-command-curl
	@curl -fsSL https://unpkg.com/alpinejs@3.14.9/dist/cdn.min.js -o js/alpine.min.js

.PHONY: npm-install
npm-install: has-command-npm
	@npm install

.PHONY: update-css
update-css: has-command-npx npm-install
	@npx @tailwindcss/cli -i tailwind.css -o css/site.css

.PHONY: watch-css
watch-css: has-command-npx npm-install
	@npx @tailwindcss/cli -i tailwind.css -o css/site.css -w

.PHONY: build
build: update-css
	@npx @11ty/eleventy

.PHONY: serve
serve: update-css
	@npx @11ty/eleventy --serve

.PHONY: rm-dist
rm-dist:
	@rm -rf dist

.PHONY: git-clean
git-clean: has-command-git
	@git clean -dxf . -e node_modules

.PHONY: distclean
distclean: git-clean

.PHONY: prettier
prettier: has-command-npm npm-install
	@npx prettier --write .

.PHONY: release
release: rm-dist distclean build prettier

.PHONY: open-site
open-site: has-command-open
	@open http://localhost:8080/
