from flask import current_app as app, jsonify, request
from flask_security import auth_required, roles_required
from application.models import db, User
from application.sec import datastore
from werkzeug.security import check_password_hash

@app.get('/')
def home():
    return "Hello World"

@app.get('/admin')
@auth_required("token")
@roles_required("librarian")
def admin():
    return "Hello Admin/Librarian."

@app.get('/disable/user/<user_id>')
@auth_required("token")
@roles_required("librarian")
def disable(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.active=False
    db.session.commit()
    return jsonify({"message": "User Disabled"})

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"message":"Email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message":"User not found"}), 404
    
    if not check_password_hash(user.password, data.get('password')):
        return {jsonify({"message":"Incorrect password"}), 400}
    
    return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "balance": user.balance})