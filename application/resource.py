from flask_restful import Resource, Api, reqparse,  fields, marshal
from application.models import Section, db

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument("name", type=str, help="Name must be a string.", required=True)
parser.add_argument("description", type=str, help="Name must be a string.", required=True)

section_material_fields={
    'id': fields.Integer,
    'name':fields.String,
    'description':fields.String
}

class SectionMaterial(Resource):
    def get(self):
        all_sections= Section.query.all()
        if len(all_sections) > 0:
            return marshal(all_sections, section_material_fields)
        else:
            return {"message": "No Resourse Found"}, 404 
           
    def post(self):
        args= parser.parse_args()
        section_add = Section(name=args["name"], description= args["description"])
        db.session.add(section_add)
        db.session.commit()
        return {"message": "Section Created"}
        
api.add_resource(SectionMaterial, '/section')