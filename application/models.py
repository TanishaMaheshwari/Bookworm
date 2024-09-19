from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    balance = db.Column(db.Integer)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',backref=db.backref('users', lazy='dynamic'))
    sections = db.relationship('Section', secondary='users_sections',backref=db.backref('users', lazy='dynamic'))
    books = db.relationship('Book', secondary='users_books',backref=db.backref('users', lazy='dynamic'))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    books = db.relationship('Book', backref='section', lazy=True)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    sample = db.Column(db.String, nullable=False)
    text = db.Column(db.String, nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)

class BookRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    approval = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('book_requests', lazy=True))
    book = db.relationship('Book', backref=db.backref('book_requests', lazy=True, cascade='all, delete-orphan'))
    section = db.relationship('Section', backref=db.backref('book_requests', lazy=True))

class BookBought(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    pay = db.Column(db.Boolean, default=True)

    user = db.relationship('User', backref=db.backref('book_bought', lazy=True))
    book = db.relationship('Book', backref=db.backref('book_bought', lazy=True, cascade='save-update, merge'))
    section = db.relationship('Section', backref=db.backref('book_bought', lazy=True))
