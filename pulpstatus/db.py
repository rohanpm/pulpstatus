import os
import sqlite3
import logging

DB_NAME = 'pulpstatus.sqlite3'
DB_INIT = False
LOG = logging.getLogger(__name__)


def db_dir():
    return os.environ.get('OPENSHIFT_DATA_DIR', os.getcwd())

def db_init(conn):
    try:
        conn.execute('''
            CREATE TABLE history
            (env text, datetime text, key text, value text)
        ''')
        conn.execute('''
            CREATE UNIQUE INDEX history_unique
            ON history(env, datetime, key)
        ''')
    except sqlite3.OperationalError as e:
        if 'already exists' in str(e):
            LOG.debug('history table already exists')
            pass
        else:
            raise e

def connect():
    global DB_INIT
    db_path = os.path.join(db_dir(), DB_NAME)
    out = sqlite3.connect(db_path)

    # this isn't threadsafe at all, but it's not expected to matter;
    # db_init tolerates if tables already exist
    if not DB_INIT:
        db_init(out)
        DB_INIT = True

    return out
