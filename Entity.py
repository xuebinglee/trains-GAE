from google.appengine.ext import db
import pickle


# credit: http://kovshenin.com/2010/app-engine-python-objects-in-the-google-datastore/
# Use this property to store objects.
class ObjectProperty(db.BlobProperty):
    def validate(self, value):
        try:
            pickle.dumps(value)
            return value
        except pickle.PicklingError:
            return super(ObjectProperty, self).validate(value)

    def get_value_for_datastore(self, model_instance):
        result = super(ObjectProperty, self).get_value_for_datastore(model_instance)
        result = pickle.dumps(result)
        return db.Blob(result)

    def make_value_from_datastore(self, value):
        try:
            value = pickle.loads(str(value))
        except:
            pass
        return super(ObjectProperty, self).make_value_from_datastore(value)


class EntityGraph(db.Model):
    """An entity which contains a Graph, using its associated sessionID as key_name"""
    G = ObjectProperty()
