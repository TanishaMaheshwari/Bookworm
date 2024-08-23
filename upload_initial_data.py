from main import app
from application.models import db, Role

with app.app_context():
    db.create_all()
    librarian = Role(id="1", name="librarian", description="User is an admin")
    reader = Role(id="2", name="reader", description="User is an custmoer")
    db.session.add(librarian)
    db.session.add(reader)
    db.session.commit()