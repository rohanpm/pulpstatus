Pulp Status
===========

This is a simple application to track status of tasks in Pulp servers.

Development Requirements
------------------------

- Must have npm in PATH
- Must have python with requirements.txt installed (e.g. a virtualenv)

Development Hints
-----------------

- Use `make` to build frontend bundle
- Use `make run` to run in flask development mode
- Add `dev=1` to query string to get some additional controls in UI
- For live JS updates, run `make watchify` while application is running
- If you have [yarn](https://yarnpkg.com/), you can use `make NPM=yarn`
  for faster/better installs

