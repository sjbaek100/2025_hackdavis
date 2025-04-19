# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install packages
pip install -r requirements.txt

# 4. Initialize migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# 5. Run the app
flask run
