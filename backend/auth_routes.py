from flask import Blueprint, request, jsonify

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        # CORS preflight response
        return '', 204
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    print("Login received:", data)  # just to confirm it's working
    return jsonify({"message": "Login successful"}), 200

@auth_routes.route('/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        # CORS preflight response
        return '', 204

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    print("Register received:", data)
    return jsonify({"message": "Registration successful"}), 200
