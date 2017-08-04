import logging
import datetime
from functools import partial

from . import db, conf

LOG = logging.getLogger(__name__)


def try_record_history(env, task_response):
    try:
        record_history(env, task_response)
    except StandardError:
        LOG.exception("error recording history for response")

def insert_value(conn, env, when, key, value):
    second = when.second - (when.second % conf.HISTORY_GRANULARITY)
    chopped_when = when.replace(microsecond=0, second=second)
    conn.execute('''
        INSERT OR REPLACE
        INTO history(env, datetime, key, value)
        VALUES(?,?,?,?)
    ''', (env, chopped_when, key, value))


def reap_history(conn, env, now):
    then = now - conf.HISTORY_TTL
    conn.execute('''
        DELETE
        FROM history
        WHERE env=? AND datetime < ?
    ''', (env.name, then))


def record_history(env, task_response):
    with db.connect() as connection:
        now = datetime.datetime.utcnow()
        save = partial(insert_value, connection, env.name, now)

        tasks = task_response.json()
        tasks_count = lambda state: len([t for t in tasks if t['state'] == state])

        save('running-count', tasks_count('running'))
        save('waiting-count', tasks_count('waiting'))

        reap_history(connection, env, now)

        connection.commit()

def get_list_index(l, value):
    try:
        return l.index(value)
    except ValueError:
        out = len(l)
        l.append(value)
        return out

def convert_history_value(key, value):
    if key.endswith('-count'):
        return int(value)
    return value

def format_timestamp(ts):
    when = datetime.datetime.strptime(ts, '%Y-%m-%d %H:%M:%S')
    return when.strftime('%Y-%m-%dT%H:%M:%SZ')

def get_history(env, since_str):
    out = {'keys': [], 'times': [], 'data': []}

    if not since_str:
        return out

    since = datetime.datetime.strptime(
        since_str,
        '%Y-%m-%dT%H:%M:%SZ')

    with db.connect() as connection:
        cur = connection.cursor()
        cur.execute('''
            SELECT datetime, key, value
            FROM history
            WHERE env = ? AND datetime >= ?
        ''', (env.name, since))

        keys = out['keys']
        times = out['times']
        data = out['data']

        get_key = partial(get_list_index, keys)
        get_time = partial(get_list_index, times)

        while True:
            row = cur.fetchone()
            if not row:
                break

            (when, key, value) = row
            when = format_timestamp(when)

            data.append({
                'time': get_time(when),
                'key': get_key(key),
                'value': convert_history_value(key, value),
            })

    return out
