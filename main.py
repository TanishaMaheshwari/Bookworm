from flask import Flask
from flask_security import Security
from application.models import db, User
from application.sec import datastore
from config import DevelopmentConfig
from application.resource import api
from application.worker import celery_init_app
from application.tasks import daily_reminder, monthly_activity_report_task
from celery.schedules import crontab
import flask_excel as excel 
from application.instance import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views

    return app

app= create_app()
celery_app= celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=21, minute=59, day_of_month=19),
        daily_reminder.s('bookworms@email.com', 'Daily Reminder'),
    )
    sender.add_periodic_task(
        crontab(hour=21, minute=59, day_of_month=19),  
        monthly_activity_report_task.s(),  
    )

if __name__ == '__main__':
    app.run(debug=True)