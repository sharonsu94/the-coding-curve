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
    data = pd.read_csv('data.csv')
    return render_template('index.html')

# Pie Chart

# Bar Chart
@app.route("/bar")
def ages():
    results = session.query(Hacker.q3Gender1, Hacker.q1AgeBeginCoding, Hacker.CountryNumeric2).all()#.\
        # func.distinct(Names.id).all()

    ids = [row[0] for row in results]
    ages = [row [1] for row in results]
    countries = [row[2] for row in results]

    return jsonify([{'respondent_ids': ids, 'ages_began': ages, 'countries': countries}])
# Bubble Chart

if __name__ == "__main__":
    app.run(debug=True)