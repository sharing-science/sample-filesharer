from flask.json import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify

db = SQLAlchemy()


class Files(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    owner_address = db.Column(db.String())
    owner_name = db.Column(db.String())
    name = db.Column(db.String())
    description = db.Column(db.String())
    date = db.Column(db.DateTime())

    def __repr__(self):
        return f'<Files {self.name}>'
