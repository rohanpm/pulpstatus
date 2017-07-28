from flask import Flask
from flask_compress import Compress
import logging


def make_app():
    out = Flask(__name__)
    Compress(out)
    out.config.from_envvar('PULPSTATUS_CFG', silent=True)

    if 'bundle_src' not in out.config:
        out.config['bundle_src'] = 'static/js/app-bundle.js'

    return out

app = make_app()

logging.basicConfig(level=logging.DEBUG if app.debug else logging.INFO)
