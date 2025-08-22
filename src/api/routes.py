"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Events
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/createEvent', methods=['POST'])
def post_event_route():

    # do updating in the database
    request_data = request.json
    user_id = request_data["host"]
    # user = User.query.get(user_id)
    new_event = Events(
        # fill all this in with the data needed to create an event
    )
    # db.session.add(new_event)
    # db.session.commit()

    return jsonify("ok"), 200
