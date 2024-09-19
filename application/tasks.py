from celery import shared_task
from flask import render_template
from .models import Book, User, Role, BookRequest, BookBought
import flask_excel as excel
from .mail_service import send_message
from jinja2 import Template


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

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'reader')).all()
    for user in users:
        with open('remainder.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject, template.render(username=user.username))
    return "OK"

@shared_task(ignore_result=True)
def monthly_activity_report_task():
    users = User.query.all()
    for user in users:
        try:
            monthly_activity_report(user.id)
        except Exception as e:
            return f"Error sending monthly activity report to user {user.id}: {str(e)}"
    return "Monthly activity reports sent successfully"

def send_email(report_content,report_contents,report_contentss, user_id):
    user = User.query.get(user_id)
    subject = "Monthly Activity Report"
    with open('monthly.html', 'r') as f:
        template = Template(f.read())
        html_content = template.render(report_content=report_content,
                                       report_contents=report_contents,
                                       report_contentss=report_contentss,
                                       username=user.username)
    send_message(user.username, subject, html_content)

def monthly_activity_report(user_id):
    book_requests = BookRequest.query.filter_by(user_id=user_id, approval=False).all()
    book_boughts = BookBought.query.filter_by(user_id=user_id).all()
    user = User.query.get(user_id)

    num_book_requests = len(book_requests)
    num_book_boughts = len(book_boughts)

    report_content = f"Monthly Activity Report for {user.username}\n"
    report_contents = f"Number of Book Requests: {num_book_requests}\n"
    report_contentss = f"Number of Book Buys: {num_book_boughts}\n"

    send_email(report_content,report_contents,report_contentss, user_id)