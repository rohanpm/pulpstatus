import os
import requests_cache
from flask import Flask, make_response, render_template
from flask_compress import Compress

import pulp


def make_app():
    out = Flask(__name__)
    Compress(out)
    out.config.from_envvar('PULPSTATUS_CFG', silent=True)

    if 'bundle_src' not in out.config:
        out.config['bundle_src'] = 'static/js/app-bundle.js'

    return out


def cachedir():
    return os.environ.get('OPENSHIFT_DATA_DIR', os.getcwd())


def make_session():
    return requests_cache.CachedSession(
        expire_after=30,
        allowable_methods=('GET', 'POST'),
        cache_name=os.path.join(cachedir(), 'requests_cache')
    )


app = make_app()
s = make_session()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/data/<env>/latest')
def pulp_data(env):
    env = pulp.info[env]
    pulp_response = s.post(
        '%s/pulp/api/v2/tasks/search/' % env['url'],
        json=dict(
            criteria={"filters": {"state": {"$in": ["running", "waiting"]}}}),
        verify=False,
        auth=env['auth'])

    response = make_response(pulp_response.content, pulp_response.status_code)
    response.headers['Content-Type'] = pulp_response.headers['content-type']
    response.headers['Date'] = pulp_response.headers['date']
    return response
