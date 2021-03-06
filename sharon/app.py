# import libraries
from flask import Flask,render_template,jsonify
import pandas as pd

# from sqlalchemy import func
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, MetaData
import os
from sqlalchemy.orm import Session

# Flask Setup
app = Flask(__name__)

# Database Setup

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db/data.sqlite"
db = SQLAlchemy(app)
Base = automap_base()
dbfile = os.path.join('db','data.sqlite')
engine = create_engine(f"sqlite:///{dbfile}")
Base.prepare(engine, reflect=True)
Hacker = Base.classes.hacker

session = Session(engine)

# @app.before_first_request
# def setup():
#     # Recreate database each time for demo
#     #db.drop_all()
#     db.create_all()


# Flask Routes
# Homepage
@app.route('/')
def index():
    return render_template('index.html')

# Pie Chart
@app.route("/pie/<country>")
def learning(country):
    results = session.query(Hacker.RespondentID, Hacker.CountryNumeric2, Hacker.q6LearnCodeUni1, Hacker.q6LearnCodeSelfTaught1, Hacker.q6LearnCodeAccelTrain1, 
    Hacker.q6LearnCodeDontKnowHowToYet1, Hacker.q6LearnCodeOther1).filter(Hacker.CountryNumeric2 == country).all()

    ids = [row[0] for row in results]
    countries = [row[1] for row in results]
    uni = [row[2] for row in results]
    total_uni = uni.count(1)
    self_taught = [row[3] for row in results]
    total_self = self_taught.count(1)
    accelerated = [row[4] for row in results]
    total_accelerated = accelerated.count(1)
    dont_know = [row[5] for row in results]
    total_dont = dont_know.count(1)
    other = [row[6] for row in results]
    total_other = other.count(1)

    return jsonify([total_accelerated, total_dont, total_other, total_self, total_uni])

# Bar Chart
@app.route("/countries")
def country():
    results = session.query(Hacker.CountryNumeric2).distinct()#.\
        # func.distinct(Hacker.CountryNumeric2).all()
    results = results.order_by(Hacker.CountryNumeric2)

    countries = [row[0] for row in results]

    return jsonify(countries)


@app.route("/bar")
def ages():
    results = session.query(Hacker.RespondentID, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2).all()#.\
        # func.distinct(Names.id).all()

    ids = [row[0] for row in results]
    ages = [row [1] for row in results]
    countries = [row[2] for row in results]

    return jsonify([{'respondent_ids': ids, 'ages_began': ages, 'countries': countries}])
# Bubble Chart

if __name__ == "__main__":
    app.run(debug=True)