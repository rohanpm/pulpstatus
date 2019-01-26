import sys
import os
import argparse
import logging
import requests
import time
from datetime import datetime, timedelta

LOG = logging.getLogger(__name__)


class Poller(object):
    def __init__(self, url, interval):
        self.url = url
        self.interval = interval
        self.last_polled = {}

    def get(self, path):
        return requests.get(os.path.join(self.url, path)).json()

    def run(self):
        while True:
            envs = self.get('env')
            LOG.debug("envs: %s", envs)
            for env in envs:
                self.poll_env(env)

    def poll_env(self, env):
        last_polled = self.last_polled.get(env)
        if last_polled:
            now = datetime.now()
            diff = now - last_polled
            wait = self.interval - diff.total_seconds()

            LOG.debug("now %s last_polled %s diff %s", now, last_polled, diff)

            if wait > 0:
                time.sleep(wait)

        LOG.info("Polling %s", env)

        try:
            self.get('data/%s/latest' % env)
            LOG.info("Polled %s", env)
        except Exception:
            LOG.exception("Poll %s failed", env)

        self.last_polled[env] = datetime.now()

def main_func():
    p = argparse.ArgumentParser(
        description="Poll pulpstatus repeatedly to keep caches and history warm.")
    p.add_argument('--url',
                   default=os.environ.get('PULPSTATUS_PRIMER_URL',
                                          'http://127.0.0.1:5000'))
    p.add_argument('--debug',
                   action='store_true',
                   default=(os.environ.get('PULPSTATUS_PRIMER_DEBUG', '0') == '1'))
    p.add_argument('--interval',
                   type=int,
                   default=os.environ.get('PULPSTATUS_PRIMER_INTERVAL', '15'))
    parsed = p.parse_args()

    logging.basicConfig()
    if parsed.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    return Poller(url=parsed.url, interval=parsed.interval).run()
