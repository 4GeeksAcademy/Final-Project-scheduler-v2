from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, JSON, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

db = SQLAlchemy()
# the following are relationship association tables:
followers = db.Table(
    'followers',
    db.Column('follower_id', db.Integer, db.ForeignKey(
        'userdata.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey(
        'userdata.id'), primary_key=True)
)

attendee_relation_table = db.Table(
    "attendee_relation_table",
    db.Column("user_id", db.Integer, db.ForeignKey(
        "userdata.id"), primary_key=True),
    db.Column("event_id", db.Integer, db.ForeignKey(
        "events.id"), primary_key=True)
)


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

# class EventType(db.Model):
#     __tablename__ = "event_types"
#     id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
#     name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)  
#     color: Mapped[str] = mapped_column(String(50), nullable=True)  

#     def serialize(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "color": self.color
#         }
    
class Events(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=False, nullable=False)
    date: Mapped[str] = mapped_column(nullable=False)
    time: Mapped[str] = mapped_column(nullable=False)
    timezone: Mapped[str] = mapped_column(unique=False, nullable=True)
    attendees: Mapped[List["Userdata"]] = relationship(
        secondary=attendee_relation_table,
        back_populates="attending_events_list")
    visibility: Mapped[str] = mapped_column(unique=False, nullable=False)
    host_id: Mapped[int] = mapped_column(ForeignKey("userdata.id"))
    host: Mapped["Userdata"] = relationship(
        back_populates="hosting_events_list")
    repeat: Mapped[dict] = mapped_column(JSON, nullable=True)
    description: Mapped[str] = mapped_column(unique=False, nullable=True)
    color: Mapped[str] = mapped_column(unique=False, nullable=True)
    timer: Mapped[dict] = mapped_column(JSON, nullable=True)
    # event_type_id: Mapped[int] = mapped_column(ForeignKey("event_types.id"))
    # event_type: Mapped["EventType"] = relationship() 

    def serialize_attendees(self):
        return {
            "attendees": [u.serialize() for u in self.attendees]
        }

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "time": self.time,
            "timezone": self.timezone,
            "visibility": self.visibility,
            "host_id": self.host_id,
            "repeat": self.repeat,
            "description": self.description,
            "color": self.color,
            "timer": self.timer
        }


class Userdata(db.Model):
    __tablename__ = "userdata"
    id: Mapped[int] = mapped_column(
        primary_key=True, autoincrement=True)  # added autoincrementing ids
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    gender = db.Column(db.String(10), nullable=True)
    # events
    hosting_events_list: Mapped[List["Events"]] = relationship(
        back_populates="host", cascade="all, delete-orphan")
    attending_events_list: Mapped[List["Events"]] = relationship(
        secondary=attendee_relation_table,
        back_populates="attendees")
    # goals
    goals: Mapped[List["Goal"]] = relationship(
        back_populates="user", cascade="all, delete-orphan")
    # followers
    followed = db.relationship(
        'Userdata',
        secondary=followers,   # reference the association table way up top
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref='followers'
    )

    def serialize_user_goals(self):
        return {"user_goals": [g.serialize() for g in self.goals]}

    def serialize_user_events(self):
        return {"hosting_events_list": [e.serialize() for e in self.hosting_events_list],
                "attending_events_list": [e.serialize() for e in self.attending_events_list]
                }

    def serialize_followed(self):
        return {"followed": [userdata.serialize() for userdata in self.followed]}

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "gender": self.gender,
        }


class Goal(db.Model):
    """
    Updated version for goal including completions, target.
    """
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    text: Mapped[str] = mapped_column(unique=False, nullable=False)
    target: Mapped[int] = mapped_column(Integer, unique=False, nullable=False)
    completions: Mapped[int] = mapped_column(
        Integer, unique=False, nullable=False, default=0)
    user_id: Mapped[int] = mapped_column(ForeignKey("userdata.id"))
    user: Mapped["Userdata"] = relationship(back_populates="goals")

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "target": self.target,
            "completions": self.completions,
            "user_id": self.user_id,
        }
