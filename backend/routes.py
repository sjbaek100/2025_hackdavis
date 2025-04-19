from flask import Blueprint, request, jsonify
from models import db, Alert

alert_bp = Blueprint('alerts', __name__)

@alert_bp.route("/", methods=["POST"])
def create_alert():
    data = request.get_json()
    alert = Alert(title=data["title"], message=data["message"])
    db.session.add(alert)
    db.session.commit()
    return jsonify({"message": "Alert created"}), 201

@alert_bp.route("/", methods=["GET"])
def get_alerts():
    alerts = Alert.query.all()
    return jsonify([{"id": a.id, "title": a.title, "message": a.message} for a in alerts])
