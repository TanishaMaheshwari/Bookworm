from flask import current_app as app, jsonify, request, render_template
from flask_security import auth_required, roles_required
from flask_restful import marshal, fields
from application.models import db, User, Section, Book
from application.sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash

@app.get('/')
def home():
    return render_template("index.html")

@app.post('/user-register')
def user_register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not email:
        return jsonify({"message": "email not provided"}), 400

    if not username:
        return jsonify({"message": "name not provided"}), 400

    if not password:
        return jsonify({"message": "password not provided"}), 400
    
    if not confirm_password:
        return jsonify({"message": "confirm password not provided"}), 400
    
    if confirm_password != password:
        return jsonify({"message": "confirm password does not match password"}), 400

    user_exists = User.query.filter_by(email=email).count()
    if(user_exists):
        return {"message":"Email already taken, use another email"},401
    user = datastore.create_user(email=email, username=username, password=generate_password_hash(password), 
                                 active=True, balance=0, roles=["reader"])

    db.session.add(user)

    db.session.commit()
    return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name}),201

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message":"Email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message":"*User not found*"}), 404
    
    if not check_password_hash(user.password, data.get('password')):
        return jsonify({"message":"*Incorrect password*"}), 400
    
    return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "balance": user.balance})

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "balance": fields.Integer,
    "active": fields.Boolean
}

@app.get('/admin')
@auth_required("token")
@roles_required("librarian")
def admin():
    return "Hello Admin/Librarian."

@app.get('/users')
@auth_required("token")
@roles_required("librarian")
def all_users():
    users = User.query.join(User.roles).filter_by(name='reader').all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal(users, user_fields)

@app.get('/disable/user/<int:user_id>')
@auth_required("token")
@roles_required("librarian")
def enable(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.active=False
    db.session.commit()
    return jsonify({"message": "User Disabled"})

@app.get('/enable/user/<int:user_id>')
@auth_required("token")
@roles_required("librarian")
def disable(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.active=True
    db.session.commit()
    return jsonify({"message": "User Enabled"})

@app.get('/sections')
@auth_required("token")
@roles_required("librarian")
def all_sections():
    sections = Section.query.all()
    if len(sections)==0:
        return jsonify({"message": "No Section Found"}), 404
    section_data = [{"id": section.id, "name": section.name, "description": section.description,
                    "num_books": db.session.query(Book).filter_by(section_id=section.id).count()}
                    for section in sections]
    return (section_data)

@app.post('/add_section')
@auth_required("token")
@roles_required("librarian")
def add_section():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name:
        return jsonify({"message": "name not provided"}), 400
    if not description:
        return jsonify({"message": "description not provided"}), 400
    
    name_exists = Section.query.filter_by(name=name).count()

    if(name_exists):
        return {"message":"Name is taken, use another name"},401
    
    new_section = Section(name=name, description=description)
    db.session.add(new_section)
    db.session.commit()
    return jsonify({"message": "Section created successfully"}), 201

# 
# @app.post('/edit_section/<int:section_id>')
# @auth_required("token")
# @roles_required("librarian")
# def edit_section(section_id):
    # data = request.get_json()
    # name = data.get('name')
    # description = data.get('description')
# 
    # if not name:
        # return jsonify({"message": "name not provided"}), 400
    # if not description:
        # return jsonify({"message": "description not provided"}), 400
    # 
    # section = Section.query.get(section_id)
# 
    # if not section:
        # return {"message":"Section doesnt exist"},401
    # 
    # section.name = name
    # section.description = description
    # db.session.commit()
    # return jsonify({"message": "Section created successfully"}), 201


@app.delete('/sections/<int:section_id>')
@auth_required("token")
@roles_required("librarian")
def delete_section(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({"message": "Section not found"}), 400

    books = Book.query.filter_by(section_id=section_id).all()
    for book in books:
        db.session.delete(book)
    db.session.commit()

    db.session.delete(section)
    db.session.commit()
    return jsonify({"message": "Section deleted successfully"}), 200

@app.get('/books')
@auth_required("token")
def all_books():
    books = Book.query.all()
    if len(books)==0:
        return jsonify({"message": "No Books Found"}), 404
    book_info = [{"id": book.id, "title": book.title, "author": book.author, "price": book.price,
                "section": db.session.query(Section).filter_by(id=book.section_id).first().name} 
                for book in books]
    return (book_info)

@app.post('/add_book')
@auth_required("token")
def add_book():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    price = data.get('price')
    sample =data.get('sample')
    text= data.get('text')
    section = data.get('section')

    if not title:
        return jsonify({"message": "Title not provided"}), 400
    if not author:
        return jsonify({"message": "Author not provided"}), 400
    if not price:
        return jsonify({"message": "Price not provided"}), 400
    if not sample:
        return jsonify({"message": "Section not provided"}), 400
    if not text:
        return jsonify({"message": "Section not provided"}), 400
    if not section:
        return jsonify({"message": "Section not provided"}), 400
    
    sections = Section.query.filter_by(name=section).all()
    book_exists = Book.query.filter_by(title=title).count()

    if book_exists:
        return {"message":"Title already exists."},401

    if not sections:
        return jsonify({"message": "Section not found"}), 404

    if len(sections) > 1:
        return jsonify({"message": "Multiple sections found with the same name"}), 400

    if sections:
        new_book = Book(title=title, author=author, price=price, sample=sample, text=text, section_id=sections[0].id)
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"message": "Book added successfully"}), 201
    else:
        return jsonify({"message": "Section not found"}), 404