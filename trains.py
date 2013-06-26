import os
import bottle
from bottle import route, request, error, debug

import jinja2
from google.appengine.ext.webapp.util import run_wsgi_app


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


@route('/')
def App():
    template = JINJA_ENVIRONMENT.get_template('index.html')
    return template.render({})


@route('/AddTown', method='POST')
def AddTown():
    post_request = request.body.read()
    return post_request


@error(404)
def Error404(code):
    return 'Sorry, we cannot find what you\'re looking for..'


debug(True)
run_wsgi_app(bottle.default_app())
