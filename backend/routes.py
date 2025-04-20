from flask import Blueprint, request, jsonify
from models import db, Alert, Comment
import requests
import smtplib
from email.mime.text import MIMEText

alert_bp = Blueprint('alerts', __name__)
@alert_bp.route("/", methods=["POST"])
def create_alert():
    data = request.get_json()

    try:
        alert = Alert(
            title=data["title"],
            description=data["description"],
            location=data["location"],
            category=data.get("category"),
            posted_by=data.get("posted_by"),
            image_url=data.get("image_url")
        )
        db.session.add(alert)
        db.session.commit()
        return jsonify({"message": "Alert created", "id": alert.id}), 201

    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@alert_bp.route("/", methods=["GET"])
def get_alerts():
    alerts = Alert.query.order_by(Alert.created_at.desc()).all()
    return jsonify([
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "created_at": a.created_at.isoformat(),
            "location": a.location,
            "category": a.category,
            "posted_by": a.posted_by,
            "image_url": a.image_url,
            "upvotes": a.upvotes,
            "downvotes": a.downvotes
        } for a in alerts
    ])


@alert_bp.route("/<int:alert_id>/upvote", methods=["POST"])
def upvote_alert(alert_id):
    alert = Alert.query.get_or_404(alert_id)
    alert.upvotes += 1
    db.session.commit()

    if alert.upvotes == 30: 
        send_alert_email(alert)

    return jsonify({
        "message": "Upvoted",
        "upvotes": alert.upvotes,
        "downvotes": alert.downvotes
    })




@alert_bp.route("/<int:alert_id>/downvote", methods=["POST"])
def downvote_alert(alert_id):
    alert = Alert.query.get_or_404(alert_id)
    alert.downvotes += 1
    db.session.commit()
    return jsonify({
        "message": "Downvoted",
        "upvotes": alert.upvotes,
        "downvotes": alert.downvotes
    })


@alert_bp.route("/<int:alert_id>/remove_vote", methods=["POST"])
def remove_vote(alert_id):
    data = request.get_json()
    vote_type = data.get("type")
    alert = Alert.query.get_or_404(alert_id)

    if vote_type == "up":
        alert.upvotes = max(0, alert.upvotes - 1)
    elif vote_type == "down":
        alert.downvotes = max(0, alert.downvotes - 1)

    db.session.commit()
    return jsonify({"upvotes": alert.upvotes, "downvotes": alert.downvotes})


@alert_bp.route("/<int:alert_id>/comments", methods=["GET"])
def get_comments(alert_id):
    Alert.query.get_or_404(alert_id)
    comments = Comment.query.filter_by(alert_id=alert_id)\
                            .order_by(Comment.created_at).all()
    return jsonify([
        {
            "id": c.id,
            "author": c.author,
            "body": c.body,
            "created_at": c.created_at.isoformat()
        } for c in comments
    ])

@alert_bp.route("/<int:alert_id>/comments", methods=["POST"])
def add_comment(alert_id):
    Alert.query.get_or_404(alert_id)
    data = request.get_json() or {}
    body   = data.get("body", "").strip()
    author = data.get("author", "Anonymous").strip()

    if not body:
        return jsonify({"error": "Comment body required"}), 400

    comment = Comment(alert_id=alert_id, author=author, body=body)
    db.session.add(comment)
    db.session.commit()

    return jsonify({
        "id": comment.id,
        "author": comment.author,
        "body": comment.body,
        "created_at": comment.created_at.isoformat()
    }), 201
    
    # 여기부턴 내가
@alert_bp.route("/api/disasters")
def get_disasters():
    try:
        all_disasters = []

        ### 1. Earthquake (USGS)
        eq_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
        eq_params = {
            "format": "geojson",
            "latitude": 38.5449,
            "longitude": -121.7405,
            "maxradiuskm": 80,
            "orderby": "time",
            "limit": 3
        }
        eq_data = requests.get(eq_url, params=eq_params).json()

        for feature in eq_data.get("features", []):
            props = feature.get("properties", {})
            all_disasters.append({
                "type": "Earthquake",
                "location": props.get("place", "Unknown"),
                "time": props.get("time", "Unknown"),
                "magnitude": props.get("mag", "N/A"),
                "message": f"Magnitude {props.get('mag', '?')} earthquake in {props.get('place', '?')}"
            })

        ### 2. FEMA Disasters (filtered by state = CA)
        fema_url = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
        fema_params = {
            "$filter": "state eq 'CA'",
            "$orderby": "declarationDate desc",
            "$top": 5
        }
        fema_data = requests.get(fema_url, params=fema_params).json()
        for item in fema_data.get("DisasterDeclarationsSummaries", []):
            all_disasters.append({
                "type": item.get("incidentType", "Disaster"),
                "location": item.get("designatedArea", "California"),
                "time": item.get("declarationDate", "Unknown"),
                "message": f"{item.get('incidentType')} in {item.get('designatedArea', 'California')}"
            })

        ### 3. National Weather Alerts (NWS)
        nws_url = "https://api.weather.gov/alerts/active"
        nws_params = {"point": "38.5449,-121.7405"}
        nws_data = requests.get(nws_url, params=nws_params).json()
        for feature in nws_data.get("features", []):
            props = feature.get("properties", {})
            all_disasters.append({
                "type": props.get("event", "Weather Alert"),
                "location": props.get("areaDesc", "Unknown area"),
                "time": props.get("onset", "Unknown"),
                "message": props.get("headline", "Weather alert in your area")
            })

        return jsonify(all_disasters)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def send_alert_email(alert):
    subject = f"🚨 High Upvote Alert: {alert.title}"
    body = f"""An alert has received 30+ upvotes:

📌 Title: {alert.title}
📍 Location: {alert.location}
🗓️ Time: {alert.created_at}
📝 Description: {alert.description}

Take appropriate action if needed.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "no-reply@aggiealert.com"
    msg["To"] = "admin@yourdomain.com"  # 변경 가능

    try:
        # 기본 로컬 SMTP 서버 (예: 로컬에서 테스트할 경우)
        with smtplib.SMTP("localhost") as server:
            server.send_message(msg)
        print("✅ Email sent successfully.")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
