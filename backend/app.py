from flask import Flask
from models import db
from routes import alert_bp
from config import Config
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(alert_bp, url_prefix="/alerts")

if __name__ == "__main__":
    app.run(debug=True)
