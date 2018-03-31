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

from itertools import chain
from operator import methodcaller

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

# Bar Chart
@app.route("/countries")
def country():
    results = session.query(Hacker.CountryNumeric2).distinct()#.\
        # func.distinct(Hacker.CountryNumeric2).all()
    results = results.order_by(Hacker.CountryNumeric2)

    countries = [row[0] for row in results]

    return jsonify(countries)

# @app.route("/countries/<country>")
# def selection(country):
#     results = session.query(Hacker.RespondentID, Hacker.CountryNumeric2).filter(Hacker.CountryNumeric2 == country).\
#         order_by(Hacker.RespondentID.desc()).all()

#     ids = [row[0] for row in results]
#     countries = [row[1] for row in results]

#     return jsonify([{'ids': ids, 'countries': countries}])

@app.route("/bar")
def ages():
    results = session.query(Hacker.RespondentID, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2).all()#.\
        # func.distinct(Names.id).all()

    ids = [row[0] for row in results]
    ages = [row [1] for row in results]
    countries = [row[2] for row in results]

    return jsonify([{'respondent_ids': ids, 'ages_began': ages, 'countries': countries}])

@app.route("/bar/<country>")
def ages_country(country):
    results = session.query(Hacker.RespondentID, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2, Hacker.q3Gender).\
    filter(Hacker.CountryNumeric2 == country, Hacker.q1AgeBeginCoding != '#NULL!').all()

    ages = [row[1] for row in results]
    count = [[x, ages.count(x)] for x in set(ages)]
    ages = [row[0] for row in count]
    age_counts = [row[1] for row in count]

    # ages_count = [{x: ages.count(x)} for x in set(ages)]
    # ages_count = dict(chain.from_iterable(map(methodcaller('items'), ages_count)))
    countries = [row[2] for row in results]

    female_results = session.query(Hacker.RespondentID, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2, Hacker.q3Gender).\
    filter(Hacker.CountryNumeric2 == country, Hacker.q1AgeBeginCoding != '#NULL!', Hacker.q3Gender == 'Female').all()

    female_ages = [row[1] for row in female_results]
    female_count = [[x, female_ages.count(x)] for x in set(female_ages)]
    female_ages = [row[0] for row in female_count]
    female_age_counts = [row[1] for row in female_count]

    male_results = session.query(Hacker.RespondentID, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2, Hacker.q3Gender).\
    filter(Hacker.CountryNumeric2 == country, Hacker.q1AgeBeginCoding != '#NULL!', Hacker.q3Gender == 'Male').all()

    male_ages = [row[1] for row in male_results]
    male_count = [[x, male_ages.count(x)] for x in set(male_ages)]
    male_ages = [row[0] for row in male_count]
    male_age_counts = [row[1] for row in male_count]

    return jsonify(ages, age_counts, female_ages, female_age_counts, male_ages, male_age_counts)

# Bubble Chart

if __name__ == "__main__":
    app.run(debug=True)