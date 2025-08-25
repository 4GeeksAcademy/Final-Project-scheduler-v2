from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

followers = db.Table(
    'followers',
    db.Column('follower_id', db.Integer, db.ForeignKey(
        'userdata.id'), primary_key=True),
    db.Column('followed_id', db.Integer, db.ForeignKey(
        'userdata.id'), primary_key=True)
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
    # this following and line 7 handles followers
    followed = db.relationship(
        'Userdata',
        secondary=followers,   # reference the table defined outside on line 7
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref='followers'
    )

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
