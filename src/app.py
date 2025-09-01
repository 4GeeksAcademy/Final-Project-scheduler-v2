"""
Boot the API server, DB, and endpoints.
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "../dist/")

app = Flask(__name__)
app.url_map.strict_slashes = False

# ---------- JWT ----------
# Use either JWT_SECRET_KEY or FLASK_APP_KEY from .env
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") or os.getenv("FLASK_APP_KEY", "dev-secret")
jwt = JWTManager(app)

# ---------- CORS ----------
# Point this to your frontend (3000) and allow your backend URL too.
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").rstrip("/")
API_URL = os.getenv("VITE_BACKEND_URL", "http://localhost:3001").rstrip("/")
CORS(app, resources={r"/api/*": {"origins": [FRONTEND_ORIGIN, "http://127.0.0.1:3000", API_URL]}})

# ---------- Database ----------
db_url = os.getenv("DATABASE_URL")
if db_url:
    db_url = db_url.replace("postgres://", "postgresql://")
else:
    db_url = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
Migrate(app, db, compare_type=True)
db.init_app(app)

# ---------- Admin / Commands / Routes ----------
setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix="/api")

# ---------- Errors ----------
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ---------- Frontend ----------
@app.route("/")
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, "index.html")

@app.route("/<path:path>", methods=["GET"])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = "index.html"
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
