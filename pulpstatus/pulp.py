import os
from collections import namedtuple
from flask import request
import logging

LOG = logging.getLogger(__name__)

class Env(namedtuple('Env', ['name', 'url', 'auth'])):
    pass


class FakeEnv(object):
    def __init__(self, name):
        self.name = name
        self.auth = ('fake-user', 'fake-password')

    @property
    def url(self):
        port = request.environ['SERVER_PORT']
        return 'http://127.0.0.1:%s/fake-pulp/%s' % (port, self.name)


def build_info():
    out = []
    for i in range(0, 100):
        prefix = 'PULPSTATUS_PULP_%s' % i
        get = lambda key: os.getenv('%s_%s' % (prefix, key))

        name = get('NAME')
        url = get('URL')
        user = get('USER')
        password = get('PASSWORD')

        if not (name and url and user and password):
            break

        out.append(Env(name, url, (user, password)))

    return out


def fake_info():
    names = ['sine-pulp', 'random-pulp', 'empty-pulp', 'flaky-pulp', 'broken-pulp']
    return [FakeEnv(name) for name in names]


def by_name(name):
    match = [pulp for pulp in info if pulp.name == name]
    if not match:
        raise KeyError(name)
    return match[0]


info = build_info() or fake_info()
