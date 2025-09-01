"""
API routes: users & auth
"""
from flask import Blueprint, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select
from .models import db, Userdata, Events  # User is unused
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask import Blueprint, request, jsonify
from api.utils import generate_sitemap, APIException
from api.models import db, User, Events
from flask import Flask, request, jsonify, url_for, Blueprint


api = Blueprint("api", __name__)
CORS(api)

ALLOWED_GENDERS = {"male", "female", "other"}


@api.route("/hello", methods=["GET", "POST"])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message from the backend. Check your Network tab."}), 200

    return jsonify(response_body), 200


# @api.route('/createEvent', methods=['POST'])
# def post_event_route():

#     # do updating in the database
#     request_data = request.json
#     user_id = request_data["host"]
#     # user = User.query.get(user_id)
#     new_event = Events(
#         # fill all this in with the data needed to create an event
#     )
#     # db.session.add(new_event)
#     # db.session.commit()
#     return jsonify("ok"), 200
@api.route('/create/event', methods=['POST'])
@jwt_required()
def post_event_create_route():
    request_body = request.json
    current_user_id = get_jwt_identity()
    user = db.session.execute(select(Userdata).where(
        Userdata.id == current_user_id)).scalar_one_or_none()

    new_event = Events(
        name=request_body["name"],
        date=request_body["date"],
        time=request_body["time"],
        # originally intended to set this to user[timezone] but user doesnt have that field
        timezone=request_body["timezone"],
        attendees=[],
        visibility=request_body["visibility"],
        host_id=current_user_id,
        host=user,
        repeat=request_body["repeat"],
        description=request_body["description"],
        timer=request_body["timer"]
    )
    db.session.add(new_event)
    new_event.attendees.append(user)
    db.session.commit()
    return jsonify({"createdEvent": new_event.serialize()}), 200


@api.route('/editEvent', methods=['PUT'])
def post_event_route():

    # do updating in the database
    request_data = request.json
    event_id = request_data["id"]
    event = Events.query.get(event_id)
    event.date = request_data["date"]
    # do all the other event fields

    # db.session.commit()

    return jsonify("ok"), 200
# --- List all users (consider adding pagination later) ---


@api.route("/users", methods=["GET"])
def list_users():
    users = Userdata.query.order_by(Userdata.id.desc()).all()
    return jsonify([u.serialize() for u in users]), 200


# --- Get one user by id ---
@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id: int):
    user = db.session.get(Userdata, user_id)  # SQLAlchemy 2.x style
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize()), 200

  # reuse the same function you wrote for /signup


@api.route("/users", methods=["POST"])
def create_user():
    return signup()

# --- Sign up (create user) ---


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}

    required = ["username", "first_name", "last_name", "email", "password"]
    for f in required:
        if not data.get(f) or not str(data[f]).strip():
            return jsonify({"error": f"{f} is required"}), 400

    username = data["username"].strip()
    first_name = data["first_name"].strip()
    last_name = data["last_name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    gender = (data.get("gender") or "").strip().lower() or None

    if gender and gender not in ALLOWED_GENDERS:
        return jsonify({"error": "gender must be one of: male, female, other"}), 400

    user = Userdata(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=generate_password_hash(password),
        gender=gender,
    )

    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        # Assuming you have UNIQUE constraints on username and email in your model
        return jsonify({"error": "username or email already exists"}), 409

    return jsonify({"message": "User created successfully", "user": user.serialize()}), 201

# Create a route to authenticate your users and return JWT Token
@api.route("/token", methods=["POST"])
def create_token():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return jsonify({"msg": "username and password are required"}), 400

    user = Userdata.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad username or password"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "user_id": user.id, "username": user.username}), 200


# --- Login ---
@api.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = Userdata.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "invalid credentials"}), 401

    # TODO: issue JWT (flask_jwt_extended) and return token instead of full user
    return jsonify({"message": "login ok", "user": user.serialize()}), 200


# --- Update a user ---
@api.route("/users/<int:user_id>", methods=["PUT", "PATCH"])
def update_user(user_id: int):
    user = db.session.get(Userdata, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json(silent=True) or {}

    if "username" in data:
        new_username = (data["username"] or "").strip()
        if new_username and new_username != user.username:
            user.username = new_username  # uniqueness enforced by DB

    if "first_name" in data:
        v = (data["first_name"] or "").strip()
        if v:
            user.first_name = v

    if "last_name" in data:
        v = (data["last_name"] or "").strip()
        if v:
            user.last_name = v

    if "email" in data:
        new_email = (data["email"] or "").strip().lower()
        if new_email and new_email != user.email:
            user.email = new_email  # uniqueness enforced by DB

    if "gender" in data:
        g = (data["gender"] or "").strip().lower() or None
        if g and g not in ALLOWED_GENDERS:
            return jsonify({"error": "gender must be one of: male, female, other"}), 400
        user.gender = g

    if "password" in data and data["password"]:
        user.password = generate_password_hash(data["password"])

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "username or email already registered"}), 409

    return jsonify(user.serialize()), 200


# --- Delete a user ---
@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id: int):
    user = db.session.get(Userdata, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200  # or return '', 204


@api.route('/protected/followed', methods=['GET'])
@jwt_required()
def get_user_protected_follows_route():
    current_user_id = get_jwt_identity()
    user = db.session.execute(select(Userdata).where(
        Userdata.id == current_user_id)).scalar_one_or_none()
    return jsonify({"id": user.id, "followed": user.serialize_followed()}), 200


@api.route('/protected/followed/<string:action>/<int:target_id>', methods=['PUT'])
@jwt_required()
def put_user_protected_follows_route(action: str, target_id: int):
    current_user_id = get_jwt_identity()
    user = db.session.execute(select(Userdata).where(
        Userdata.id == current_user_id)).scalar_one_or_none()
    target = db.session.execute(select(Userdata).where(
        Userdata.id == target_id)).scalar_one_or_none()
    if action == "add":
        user.followed.append(target)
    elif action == "remove":
        user.followed.remove(target)
    db.session.commit()
    return jsonify({"id": user.id, "followed": user.serialize_followed()}), 200


@api.route("/events", methods=["GET"])
def list_events():
    events = Events.query.order_by(Events.id.desc()).all()
    return jsonify([e.serialize() for e in events]), 200
