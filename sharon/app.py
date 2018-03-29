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

@app.before_first_request
def setup():
    db.drop_all()
    db.create_all()

# Flask Routes
# Homepage
@app.route('/')
def index():
    data = pd.read_csv('data.csv')
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


    return jsonify([{'uni': str(total_uni), 'self_taught': str(total_self),'accelerated': str(total_accelerated), 
    "dont know": str(total_dont), "other": str(total_other)}])

if __name__ == "__main__":
    app.run(debug=True)
    