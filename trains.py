import os
import bottle
from bottle import route, request, error, debug
from beaker.middleware import SessionMiddleware
import jinja2
from google.appengine.ext.webapp.util import run_wsgi_app

from Graph.Graph import Graph
from Entity import EntityGraph


session_opts = {
    'session.type': 'file',
    'session.cookie_expires': True,
    'session.type': 'ext:google',
    'session.auto': True
}
app = SessionMiddleware(bottle.app(), session_opts)
JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


@route('/')
def App():
    # delete previous session and its corresponding entity
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is not None:
        entity.delete()
    session.delete()

    template = JINJA_ENVIRONMENT.get_template('index.html')
    return template.render({})


@route('/Town/Add', method='POST')
def AddTown():
    # create or fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is None:  # first time
        entity = EntityGraph(key_name=session.id, G=Graph())
    G = entity.G

    townID = request.POST['townID']
    G.addTown(townID)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@route('/Town/Delete', method='POST')
def DeleteTown():
    # create or fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is None:  # first time
        entity = EntityGraph(key_name=session.id, G=Graph())
    G = entity.G

    townID = request.POST['townID']
    G.deleteTown(townID)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@route('/Edge/Add', method='POST')
@route('/Edge/Update', method='POST')
def AddOrUpdateEdge():
    # create or fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is None:  # first time
        entity = EntityGraph(key_name=session.id, G=Graph())
    G = entity.G

    originID = request.POST['originID']
    destinationID = request.POST['destinationID']
    distance = int(request.POST['distance'])
    G.addOrUpdateEdge(originID, destinationID, distance)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@route('/Edge/Update/Both', method='POST')
def UpdateBothEdges():
    # create or fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is None:  # first time
        entity = EntityGraph(key_name=session.id, G=Graph())
    G = entity.G

    originID = request.POST['originID']
    destinationID = request.POST['destinationID']
    distance = int(request.POST['distance'])
    G.addOrUpdateEdge(originID, destinationID, distance)
    G.addOrUpdateEdge(destinationID, originID, distance)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@route('/Edge/Delete', method='POST')
def DeleteEdge():
    # create or fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    if entity is None:  # first time
        entity = EntityGraph(key_name=session.id, G=Graph())
    G = entity.G

    originID = request.POST['originID']
    destinationID = request.POST['destinationID']
    G.deleteEdge(originID, destinationID)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@route('/Edge/Delete/Both', method='POST')
def DeleteBothEdges():
    # fetch G from datastore
    session = bottle.request.environ.get('beaker.session')
    entity = EntityGraph.get_by_key_name(session.id)
    G = entity.G

    originID = request.POST['originID']
    destinationID = request.POST['destinationID']
    G.deleteEdge(originID, destinationID)
    G.deleteEdge(destinationID, originID)

    # store G
    entity.G = G
    entity.put()

    return str(G)


@error(404)
def Error404(code):
    return 'Sorry, we cannot find what you\'re looking for..'


debug(True)
run_wsgi_app(app)
