import os

import webapp2
import jinja2

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'])


class MainPage(webapp2.RequestHandler):

    def get(self):
        name = 'Xuebing'
        template_values = {
            'name': name,
        }

        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render(template_values))
        #self.response.headers['Content-Type'] = 'text/plain'
        #self.response.write('Hello, webapp2 World!')


application = webapp2.WSGIApplication([
    ('/', MainPage),
], debug=True)
