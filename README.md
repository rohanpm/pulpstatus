Pulp Status
===========

This is a simple application to track status of tasks in Pulp servers.

Configuration
-------------

The Pulp server(s) to be monitored should be configured in environment
variables according to the following scheme:

    PULPSTATUS_PULP_0_NAME=mypulp-prod
    PULPSTATUS_PULP_0_URL=https://pulp.prod.example.com
    PULPSTATUS_PULP_0_USER=readonly
    PULPSTATUS_PULP_0_PASSWORD=readonly

    PULPSTATUS_PULP_1_NAME=mypulp-stage
    PULPSTATUS_PULP_1_URL=https://pulp.stage.example.com
    PULPSTATUS_PULP_1_USER=readonly
    PULPSTATUS_PULP_1_PASSWORD=readonly

    # ... and so on

If no Pulp servers are configured, some simple fake servers are
automatically provided for demo/development purposes.

Development Requirements
------------------------

- Must have npm or yarn in PATH (yarn is preferred)
- Must have virtualenv in PATH

Development Hints
-----------------

- Use `make` to build frontend bundle
- Use `make run` to run in gunicorn
- Use `make dev` to run in flask development mode with JS and Python hot reload
- Add `dev=1` to query string to get some additional controls in UI
