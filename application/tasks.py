from celery import shared_task
from .models import Book
import flask_excel as excel
# from .mail_service import send_message
# from .models import User, Role
# from jinja2 import Template


@shared_task(ignore_result=False)
def create_resource_csv():
    
    book = Book.query.with_entities(Book.title, Book.author, Book.price).all()
    data = [["Title", "Author", "Price"]] 
    data.extend([[row[0], row[1], row[2]] for row in book])  
    csv_output = excel.make_response_from_array(data, "csv" )
    filename="Books.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename