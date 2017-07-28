import logging
from flask import json

from .app import app

LOG = logging.getLogger(__name__)


@app.route('/fake-pulp/<env>/pulp/api/v2/tasks/search/', methods=['POST'])
def fake_pulp_tasks(env):
    return json.jsonify([])
