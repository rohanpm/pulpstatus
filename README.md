Pulp Status
===========

This is a simple application to track status of tasks in Pulp servers.

Development Requirements
------------------------

- Must have npm in PATH
- Must have virtualenv in PATH

Development Hints
-----------------

- Use `make` to build frontend bundle
- Use `make run` to run in gunicorn
- Use `make dev` to run in flask development mode with JS and Python hot reload
- Add `dev=1` to query string to get some additional controls in UI
- If you have [yarn](https://yarnpkg.com/), you can use `make NPM=yarn`
  for faster/better installs

