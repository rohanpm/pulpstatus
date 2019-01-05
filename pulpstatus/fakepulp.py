import logging
from flask import json

import random
import uuid
import time
import math

from .app import app

LOG = logging.getLogger(__name__)

task_generators = {}

def task_generator(name):
    def task_generator_with_name(fn):
        task_generators[name] = fn
        return fn
    return task_generator_with_name


@app.route('/fake-pulp/<env>/pulp/api/v2/tasks/search/', methods=['POST'])
def fake_pulp_tasks(env):
    gen = task_generators.get(env)
    if not gen:
        raise StandardError('no fake pulp %s available', env)
    return json.jsonify(gen())

@task_generator('empty-pulp')
def empty_tasks():
    return []

@task_generator('random-pulp')
def random_tasks():
    task_count = max(0, int(random.gauss(1000, 800)))
    return [random_task() for _ in range(0, task_count)]

@task_generator('sine-pulp')
def sine_tasks():
    now = time.time()
    count_x = now/400.
    running_scale = abs(math.sin(now/1200.) * 30.)
    waiting_scale = abs(math.sin(now/800.) * 500.)
    running_count = abs(int(running_scale*math.sin(count_x)))
    waiting_count = abs(int(waiting_scale*math.cos(count_x)))

    running_tasks = [random_task(state='running') for _ in range(0, running_count)]
    waiting_tasks = [random_task(state='waiting') for _ in range(0, waiting_count)]

    return running_tasks + waiting_tasks


@task_generator('flaky-pulp')
def flaky_tasks():
    r = random.random()
    if r < 0.2:
        raise RuntimeError('simulated exception')
    return sine_tasks()


def random_workers():
    return [
        'worker1',
        'worker2',
        'worker3',
        'worker4',
    ]

def random_task(**kwargs):
    state = 'waiting'
    if random.random() < 0.10:
        state = 'running'
    elif random.random() < 0.10:
        state = 'canceled'

    out = {
        'state': state,
        'task_id': uuid.uuid4(),
        'worker_name': random.sample(random_workers(), 1)[0],
        'progress_report': random_progress(),
    }
    out.update(kwargs)
    return out


def random_progress():
    if random.random() > 0.5:
        return None

    if random.random() > 0.5:
        return {'some': {'bogus': 'progress'}}

    steps_count = int(random.random() * 7) + 1
    steps_range = range(0, steps_count)
    step_types = ['step%d' % i for i in steps_range]
    active = random.sample(steps_range, 1)[0]

    steps = []
    for i in steps_range:
        state = 'unknown'
        if i == active:
            state = 'IN_PROGRESS'
        elif i < active:
            state = 'FINISHED'
        steps.append({'step_type': step_types[i],
                      'state': state})

    return {'some_task': steps}
