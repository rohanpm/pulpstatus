import os
import logging
import requests_cache
from flask import make_response, render_template, json, request

from . import conf, app, pulp, history, fakepulp


LOG = logging.getLogger(__name__)

app = application = app.app

def make_session():
    return requests_cache.CachedSession(
        expire_after=conf.CACHE_TTL,
        allowable_methods=('GET', 'POST'),
        cache_name=os.path.join(conf.CACHE_DIR, 'requests_cache')
    )


s = make_session()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/env')
def env_index():
    """Produces list of available environments."""
    return json.jsonify([env.name for env in pulp.info])


@app.route('/data/<env>/latest')
def pulp_data(env):
    env = pulp.by_name(env)

    history_since = request.args.get('history-since')
    LOG.debug('requested history-since: %s', history_since)

    pulp_response = s.post(
        '%s/pulp/api/v2/tasks/search/' % env.url,
        json=dict(
            criteria={"filters": {"state": {"$in": ["running", "waiting"]}}}),
        verify=False,
        auth=env.auth)

    history.try_record_history(env, pulp_response)

    out = {
        'pulp': pulp_response.json(),
        'history': history.get_history(env, history_since),
    }


    response = make_response(json.jsonify(out), pulp_response.status_code)
    response.headers['Date'] = pulp_response.headers['date']
    return response
