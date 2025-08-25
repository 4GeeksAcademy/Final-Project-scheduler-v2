from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


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
    date: Mapped[str] = mapped_column(unique=False, nullable=False)
    #fix the equals to colon
    time = Mapped[str] = mapped_column(unique=False, nullable=False)
    timezone = Mapped[str] = mapped_column(unique=False, nullable=False)
    attendees = Mapped[str] = mapped_column(unique=False, nullable=False)
    visibility = Mapped[str] = mapped_column(unique=False, nullable=False)
    host = Mapped[str] = mapped_column(unique=False, nullable=False)
    repeat = Mapped[str] = mapped_column(unique=False, nullable=False)
    description = Mapped[str] = mapped_column(unique=False, nullable=False)
    goalAmount = Mapped[str] = mapped_column(unique=False, nullable=False)
    timer = Mapped[str] = mapped_column(unique=False, nullable=False)

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
            "goalAmount": self.goalAmount,
            "timer": self.timer
        }


class Userdata(db.Model):
    __tablename__ = "userdata"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    gender = db.Column(db.String(10), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "gender": self.gender,
        }
