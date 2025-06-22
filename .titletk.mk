# -*- coding: utf-8; mode: makefile-gmake; -*-

MAKEFLAGS += --no-print-directory --warn-undefined-variables

SHELL := bash
.SHELLFLAGS := -euo pipefail -c

.PHONY: has-command-%
has-command-%:
	@$(if $(shell command -v $* 2> /dev/null),,$(error The command $* does not exist in PATH))

.PHONY: is-defined-%
is-defined-%:
	@$(if $(value $*),,$(error The environment variable $* is undefined))

.PHONY: is-repo-clean
is-repo-clean: has-command-git
	@git diff-index --quiet HEAD --
