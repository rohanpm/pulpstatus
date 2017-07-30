import os
import datetime

CACHE_TTL = int(os.environ.get('PULPSTATUS_CACHE_TTL', '30'))
DATA_DIR = os.environ.get('PULPSTATUS_DATA_DIR', os.getcwd())

HISTORY_GRANULARITY = int(os.environ.get('PULPSTATUS_HISTORY_GRANULARITY', '5'))
HISTORY_TTL = datetime.timedelta(
    days=int(os.environ.get('PULPSTATUS_HISTORY_TTL_DAYS', '2')),
)
