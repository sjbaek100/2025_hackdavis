import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or \
        "postgresql://postgres:Sxk0904.@localhost/alertdb"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
