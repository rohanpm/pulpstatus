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

Additional environment variables available for configuration,
along with their default values, are listed below:

    # Time, in seconds, to cache Pulp server responses.
    # This will throttle the number of requests sent from
    # pulpstatus to the configured Pulp servers.
    PULPSTATUS_CACHE_TTL=30

    # Directory where data shall be stored (e.g. cache & history
    # sqlite databases).
    PULPSTATUS_DATA_DIR=<cwd>

    # Finest stored granularity in seconds of stored Pulp history.
    PULPSTATUS_HISTORY_GRANULARITY=5

    # How long to keep history, in days
    PULPSTATUS_HISTORY_TTL_DAYS=2

pulpstatus-primer
-----------------

The `pulpstatus-primer` command may be optionally used to keep the
history and cache in pulpstatus fresh.

It may be configured by additional environment variables:

    # URL of pulpstatus deployment
    PULPSTATUS_PRIMER_URL=http://127.0.0.1:5000

    # Set to 1 for verbose logging
    PULPSTATUS_PRIMER_DEBUG=0

    # Interval for refreshing data
    PULPSTATUS_PRIMER_INTERVAL=15

OpenShift deployment
--------------------

pulpstatus works well in OpenShift.

The `misc/openshift` directory contains a sample OpenShift configuration.
It will require tweaking for production.

For development/test purposes, this should result in a working deployment:

    oc cluster up
    oc create -f misc/openshift/pulpstatus.yml

Development Requirements
------------------------

- Must have npm in PATH
- Must have virtualenv in PATH

Development Hints
-----------------

- Use `make` to build frontend bundle
- Use `make run` to run in gunicorn
- Use `make dev` to run in flask development mode with JS and Python hot reload
