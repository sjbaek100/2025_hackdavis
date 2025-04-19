from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for alerts
alerts = []

@app.route('/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts), 200

@app.route('/alerts', methods=['POST'])
def create_alert():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'error': 'Invalid input'}), 400
    alert = {
        'id': len(alerts) + 1,
        'message': data['message']
    }
    alerts.append(alert)
    return jsonify(alert), 201

@app.route('/alerts/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    global alerts
    alerts = [alert for alert in alerts if alert['id'] != alert_id]
    return jsonify({'message': 'Alert deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)