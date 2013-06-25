import os

import webapp2
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class IndexPage(webapp2.RequestHandler):

    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render({}))

    def post(self):
        post_request = self.request.body
        self.response.write(post_request)


application = webapp2.WSGIApplication([
    ('/', IndexPage),
], debug=True)
