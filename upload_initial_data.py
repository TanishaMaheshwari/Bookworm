from main import app
from application.sec import datastore
from application.models import db
# from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    # db.drop_all()
    db.create_all()

    datastore.find_or_create_role(name="librarian", description="User is an admin")
    datastore.find_or_create_role(name="reader", description="User is an custmoer")
    db.session.commit()

    if not datastore.find_user(email="Librarian@email.com"):
        datastore.create_user(username="Librarian", email="Librarian@email.com", password=generate_password_hash("sobo"), 
                            active=True, balance=0, roles=["librarian"])
        # 
    if not datastore.find_user(email="User@email.com"):
        datastore.create_user(username="user01", email="user01@email.com", password=generate_password_hash("user01"), 
                            active=True, balance=0, roles=["reader"])
        # 
    db.session.commit()