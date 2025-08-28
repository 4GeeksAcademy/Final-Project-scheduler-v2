from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Time, Date, ForeignKey, JSON
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


class Events(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=False, nullable=False)
    date: Mapped[Date] = mapped_column(Date, nullable=False)
    time: Mapped[Time] = mapped_column(Time, nullable=False)
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
    timer: Mapped[dict] = mapped_column(JSON, nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "time": self.time,
            "timezone": self.timezone,
            "attendees": self.attendees,
            "visibility": self.visibility,
            "host": self.host,
            "repeat": self.repeat,
            "description": self.description,
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
    goals: Mapped[List["Goals"]] = relationship(
        back_populates="host", cascade="all, delete-orphan")
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


class Goals(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(unique=False, nullable=False)
    visibility: Mapped[str] = mapped_column(unique=False, nullable=False)
    host_id: Mapped[int] = mapped_column(ForeignKey("userdata.id"))
    host: Mapped["Userdata"] = relationship(
        back_populates="goals")
    goalAmount: Mapped[int] = mapped_column(unique=False, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "visibility": self.visibility,
            "host": self.host,
            "goalAmount": self.goalAmount
        }
