from flask_restful import Resource, Api, reqparse,  fields, marshal
from .models import User, db
from werkzeug.security import generate_password_hash

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument("username", type=str, help="Name must be a string.", required=True)
parser.add_argument("email", type=str, help="Email must be a string.", required=True)
parser.add_argument("password", type=str, help="Password must be a string.", required=True)

section_material_fields={
    'username': fields.String,
    'email':fields.String,
    'active': fields.Boolean
}

class user_info(Resource):
    def get(self):
        all_users= User.query.all()
        if len(all_users) > 0:
            return marshal(all_users, section_material_fields)
        else:
            return {"message": "No User Found"}, 404 
           
    def post(self):
        try:
            args = parser.parse_args()
            hashed_password = generate_password_hash(args["password"])
            user_add = User(username=args["username"], email=str(args["email"]), password=hashed_password, 
                            active=True, balance=0, roles=["reader"])
            db.session.add(user_add)
            db.session.commit()
            return {"message": "User Added"}
        except Exception as e:
            return {"error": str(e)}, 400        
api.add_resource(user_info, '/users')