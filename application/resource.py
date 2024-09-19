from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import jsonify, request
from sqlalchemy import or_
from .models import User, db, Section, Book, BookBought
from werkzeug.security import generate_password_hash
# from .instances import cache


api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument("username", type=str, help="Name must be a string.", required=True)
parser.add_argument("email", type=str, help="Email must be a string.", required=True)
parser.add_argument("password", type=str, help="Password must be a string.", required=True)

section_fields={
    'id': fields.Integer,
    'name':fields.String,
    'description': fields.String
}

book_fields={
    'id': fields.Integer,
    'title': fields.String,
    'author': fields.String,
    'price': fields.Integer,
    'sample': fields.String,
    'text': fields.String,
    'section': fields.String
}

user_fields={
    'username': fields.String,
    'email':fields.String,
    'active': fields.Boolean,
    'balance': fields.Integer
}

class Section_Resource(Resource):
    # @auth_required("token")
    # @cache.cached(timeout=50)
    def get(self, section_id):
        return marshal(Section.query.get(section_id), section_fields)

    @auth_required("token")
    @roles_required("librarian")
    def put(self, section_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', help="Section name", required=True)
        parser.add_argument('description', help="Section Description", required=True)
        args = parser.parse_args()
        if args.get('name') == "":
            return {"message": "Section Name is required"}, 401
        edit_section = Section.query.get(section_id)
        edit_section.name = args.get('name')
        edit_section.description = args.get('description')
        db.session.commit()
        return {"message": "Updated successfully"}, 200

    @roles_required("librarian")
    def delete(self, section_id):
        edit_section = Section.query.get(section_id)
        db.session.delete(edit_section)
        db.session.commit()
        return {"message": "Deleted successfully"}, 200

api.add_resource(Section_Resource, '/sections/<int:section_id>')

class Book_Resource(Resource):

    def get(self, BookID):
        return marshal(Book.query.get(BookID), book_fields)
    
    @auth_required("token")
    @roles_required("librarian")
    def put(self, BookID):
        parser = reqparse.RequestParser()
        parser.add_argument('title', help="Book Titel", required=True)
        parser.add_argument('author', help="Book Author", required=True)
        parser.add_argument('price', help="Book Price", required=True)
        parser.add_argument('sample', help="Book Sample", required=True)
        parser.add_argument('text', help="Book URL", required=True)
        parser.add_argument('section_id', help="Book Section ID", required=True)
        args = parser.parse_args()

        if args.get('title') == "":
            return {"message": "Title is required"}, 401

        edit_book = Book.query.get(BookID)
        edit_book.title = args.get('title')
        edit_book.author = args.get('author')
        edit_book.price = args.get('price')
        edit_book.sample = args.get('sample')
        edit_book.text = args.get('text')

        section = Section.query.get(args.get('section_id'))
        if section is None:
            return {"message": "Invalid section ID"}, 400

        edit_book.section_id = section.id

        db.session.commit()
        return {"message": "Updated successfully"}, 200
    
    @roles_required("librarian")
    def delete(self, BookID):
        dlt_book = Book.query.get(BookID)
        db.session.delete(dlt_book)
        db.session.commit()
        return {"message": "Deleted successfully"}, 200

api.add_resource(Book_Resource, '/books/<int:BookID>')

class User_Resource(Resource):

    def get(self, UserID):
        return marshal(User.query.get(UserID), user_fields)
    
    @auth_required("token")
    def put(self, UserID):
        parser = reqparse.RequestParser()
        parser.add_argument('balance', required=True)
        args = parser.parse_args()

        edit_user = User.query.get(UserID)
        edit_user.balance = args.get('balance')

        db.session.commit()
        return {"message": "Updated successfully"}, 200

api.add_resource(User_Resource, '/users/<int:UserID>')


class book_bought_resource(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        book_id = data.get('book_id')
        price = data.get('price')

        if not all([user_id, book_id, price]):
            return {'error': 'Invalid request'}, 400

        try:
            user = User.query.get(user_id)
            lib = User.query.get(1)
            user.balance -= price
            lib.balance += price
            db.session.commit()

            book=Book.query.get(book_id)
            sid=book.section_id

            book_bought = BookBought(user_id=user_id, book_id=book_id, section_id=sid, price=price, pay=True)
            db.session.add(book_bought)
            db.session.commit()

            return {'message': 'Book bought successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to buy book'}, 500
        
api.add_resource(book_bought_resource,'/book_bought')