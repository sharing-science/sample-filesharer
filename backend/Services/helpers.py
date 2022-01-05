from flask import abort, session
from functools import wraps


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'user' in session:
            return f(*args, **kwargs)
        else:
            abort(401)
    return wrap

