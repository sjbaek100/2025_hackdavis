from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    location = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    posted_by = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(500), nullable=True)

    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)


class Comment(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    alert_id   = db.Column(db.Integer, db.ForeignKey("alert.id"), nullable=False)
    author     = db.Column(db.String(120), nullable=False)
    body       = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    alert = db.relationship("Alert", backref=db.backref("comments", lazy=True))

