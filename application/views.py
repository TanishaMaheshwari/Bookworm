from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required
from flask_restful import marshal, fields
from application.models import db, User, Section, Book, BookRequest, BookBought
from application.sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
import flask_excel as excel
from .tasks import create_resource_csv
from celery.result import AsyncResult

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
    return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name,
                    "message": "Registration successful! You can now log in with your credentials."}),201

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
    
    if not user.active:
        return jsonify({"message":"*You have been Flagged.*"}), 400
    
    return jsonify({"id":user.id,"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "balance": user.balance})

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "balance": fields.Integer,
    "active": fields.Boolean
}

@app.get('/users')
def all_users():
    users = User.query.join(User.roles).filter_by(name='reader').all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal( users, user_fields)

@app.get('/librarian')
@auth_required("token")
@roles_required("librarian")
def get_librarian():
    user = User.query.all()[0]
    return jsonify({"balance": user.balance})

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


@app.delete('/sections/<int:section_id>')
@auth_required("token")
@roles_required("librarian")
def delete_section(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({"message": "Section not found"}), 400

    books = Book.query.filter_by(section_id=section_id).all()
    b_books = BookBought.query.filter_by(section_id=section_id).all()
    r_books = BookRequest.query.filter_by(section_id=section_id).all()

    for book in books:
        db.session.delete(book)
    for book in b_books:
        db.session.delete(book)
    for book in r_books:
        db.session.delete(book)
    db.session.commit()

    db.session.delete(section)
    db.session.commit()
    return jsonify({"message": "Section deleted successfully"}), 200

@app.get('/all_books')
@auth_required("token")
def all_books():
    books = Book.query.all()
    if not books:
        return jsonify({"message": "No books found in the database"}), 400
    book_info = [{"id": book.id, "title": book.title, "author": book.author, "price": book.price,
                "section": db.session.query(Section).filter_by(id=book.section_id).first().name,
                "section_id": book.section_id} 
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


@app.post('/book_request')
@auth_required("token")
def book_request():
    data = request.get_json()
    user_id = data.get('user_id')
    book_id = data.get('book_id')
    section_id = data.get('section_id')

    existing_request = BookRequest.query.filter_by(user_id=user_id, book_id=book_id, section_id=section_id).first()
    if existing_request:
        return jsonify({"message": "Request already sent"}), 400 

    new_request = BookRequest(user_id=user_id, book_id=book_id, section_id=section_id, approval=False)
    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Request sent successfully"}), 200

@app.get('/all_requests')
@auth_required("token")
@roles_required("librarian")
def all_requests():
    reqs = BookRequest.query.all()
    
    info = [{"id": req.id, 
             "user": req.user.username,
             "book": req.book.title, 
             "author": req.book.author, 
             "section": req.section.name,
             "approval": req.approval}  
             for req in reqs]
    return jsonify(info)

@app.put('/approve/<int:id>')
@auth_required("token")
@roles_required("librarian")
def approve_request(id):
    book = BookRequest.query.get(id)

    book.approval=True
    db.session.commit()

    return jsonify({"message": "Request approved successfully"}), 200

@app.get('/all_book_requested/<int:user_id>')
@auth_required("token")
def all_book_requested(user_id):
    reqs = BookRequest.query.filter_by(user_id=user_id).all()
    
    info = [{"id": req.id, 
             "book": req.book.title, 
             "author": req.book.author, 
             "section": req.section.name,
             "approval": req.approval}  
             for req in reqs]
    return jsonify(info)

@app.delete('/users/<int:userId>/return_book/<int:bookReqId>')
@auth_required("token")
def return_book(userId, bookReqId):
    book_request = BookRequest.query.get(bookReqId)
    if book_request and book_request.user_id == userId:
        db.session.delete(book_request)
        db.session.commit()
        return jsonify({'message': 'Book returned successfully'}), 200
    else:
        return jsonify({'message': 'Failed to return book'}), 400
    
@app.get('/users/<int:userId>/read_book/<int:bookReqId>')
@auth_required("token")
def read_book(userId, bookReqId):
    book_request = BookRequest.query.filter_by(user_id=userId, book_id=bookReqId).first()
    if book_request:
        book = book_request.book  
        return jsonify({"url": book.text})
    else:
        return jsonify({"error": "Book not found"}), 404  

@app.get('/all_book_bought/<int:user_id>')
@auth_required("token")
def all_book_bought(user_id):
    reqs = BookBought.query.filter_by(user_id=user_id).all()
    
    info = [{"id": req.id, 
             "book": req.book.title, 
             "author": req.book.author, 
             "section": req.section.name}  
             for req in reqs]
    return jsonify(info)

@app.get('/all_payments')
@auth_required("token")
def all_payments():
    pays = BookBought.query.all()
    info = [{"id": pay.id, 
             "username":pay.user.username,
             "book": pay.book.title, 
             "author": pay.book.author, 
             "section": pay.section.name,
             "price":pay.price}  
             for pay in pays]
    return jsonify(info)

@app.get('/download-csv')
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task-id": task.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
    
@app.get('/book_chart')
def book_chart():
    book_requests = BookRequest.query.all()
    book_boughts = BookBought.query.all()

    all_books = [br.book for br in book_requests] + [bb.book for bb in book_boughts]

    book_counts = {}
    for book in all_books:
        if book.title in book_counts:
            book_counts[book.title] += 1
        else:
            book_counts[book.title] = 1

    top_5_books = sorted(book_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    return jsonify({'top_5_books': top_5_books})

@app.get('/section_chart')
def section_chart():
    # Get all sections and count the number of books in each section
    sections = Section.query.all()
    section_counts = {}
    for section in sections:
        section_counts[section.name] = len(section.books)

    # Return the result as JSON
    return jsonify({'sections': list(section_counts.items())})