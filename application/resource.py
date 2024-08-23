from flask_restful import Resource, Api, reqparse
from application.models import Section, db

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument("name", type=str, help="Name must be a string.")
parser.add_argument("description", type=str, help="Name must be a string.")

class Section(Resource):
    def get(self):
        return{"message": "hello from Section"}
    
    def post(self):
        args= parser.parse_args()
        section_add = Section(**args)
        db.session.add(section_add)
        db.session.commit()
        
api.add_resource(Section, '/section')