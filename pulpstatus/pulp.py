import os


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

        out.append(dict(
            name=name,
            url=url,
            auth=(user, password)))
    return out


def by_name(name):
    match = [pulp for pulp in info if pulp['name'] == name]
    if not match:
        raise KeyError(name)
    return match[0]


info = build_info()
