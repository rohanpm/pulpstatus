import logging
import datetime
from functools import partial

from . import db

LOG = logging.getLogger(__name__)

# history is only recorded with up to this much accuracy
# (avoids saving too much duplicate data)
GRANULARITY_SECONDS = 5

# how long to retain history
TTL = datetime.timedelta(days=7)


def try_record_history(env, task_response):
    try:
        record_history(env, task_response)
    except StandardError:
        LOG.exception("error recording history for response")

def insert_value(conn, env, when, key, value):
    second = when.second - (when.second % GRANULARITY_SECONDS)
    chopped_when = when.replace(microsecond=0, second=second)
    conn.execute('''
        INSERT OR REPLACE
        INTO history(env, datetime, key, value)
        VALUES(?,?,?,?)
    ''', (env, chopped_when, key, value))


def reap_history(conn, env, now):
    then = now - TTL
    conn.execute('''
        DELETE
        FROM history
        WHERE env=? AND datetime < ?
    ''', (env['name'], then))


def record_history(env, task_response):
    connection = db.connect()
    now = datetime.datetime.utcnow()
    save = partial(insert_value, connection, env['name'], now)

    tasks = task_response.json()
    tasks_count = lambda state: len([t for t in tasks if t['state'] == state])

    save('running-count', tasks_count('running'))
    save('waiting-count', tasks_count('waiting'))

    reap_history(connection, env, now)

    connection.commit()
