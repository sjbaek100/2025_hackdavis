from flask import Flask
from models import db
from routes import alert_bp
from config import Config
from flask_migrate import Migrate
from flask_cors import CORS
from auth_routes import auth_routes

app = Flask(__name__)

# Add support for CORS
CORS(app, origins="*", supports_credentials=True)  # TEMP: allow all for testing

app.config.from_object(Config)

db.init_app(app) 
migrate = Migrate(app, db)

app.register_blueprint(alert_bp, url_prefix="/alerts")
app.register_blueprint(auth_routes)

if __name__ == "__main__":
    app.run(debug=True)
