from flask import Blueprint, request, jsonify
from models import db, Alert, Comment

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