from flask_restful import Resource, Api

api = Api(prefix='/api')

class StudyMaterial(Resource):
    def get(self):
        return{"message": "hello from api"}
        




api.add_resource(StudyMaterial, '/study_material')