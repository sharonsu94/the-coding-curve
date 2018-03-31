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
@app.route("/bubble/<country>")
def bubble(country):
    competency = session.query(Hacker.q22LangProfC, Hacker.q22LangProfCPlusPlus,
         Hacker.q22LangProfJava, Hacker.q22LangProfPython, Hacker.q22LangProfRuby,
         Hacker.q22LangProfJavascript, Hacker.q22LangProfCSharp, Hacker.q22LangProfGo,
         Hacker.q22LangProfScala, Hacker.q22LangProfPerl, Hacker.q22LangProfSwift,
         Hacker.q22LangProfPascal, Hacker.q22LangProfClojure, Hacker.q22LangProfPHP,
         Hacker.q22LangProfHaskell, Hacker.q22LangProfLua, 
         Hacker.q22LangProfR).filter(Hacker.CountryNumeric2 == country).all()

    know = session.query(Hacker.q25LangC, Hacker.q25LangCPlusPlus, Hacker.q25LangJava,
        Hacker.q25LangPython, Hacker.q25LangRuby, Hacker.q25LangJavascript, Hacker.q25LangCSharp,
        Hacker.q25LangGo, Hacker.q25Scala, Hacker.q25LangPerl, Hacker.q25LangSwift, Hacker.q25LangPascal,
        Hacker.q25LangClojure, Hacker.q25LangPHP, Hacker.q25LangHaskell, Hacker.q25LangLua,
        Hacker.q25LangR).filter(Hacker.CountryNumeric2 == country).all()

    sentiment = session.query(Hacker.q28LoveC, Hacker.q28LoveCPlusPlus, Hacker.q28LoveJava,
       Hacker.q28LovePython, Hacker.q28LoveRuby, Hacker.q28LoveJavascript, Hacker.q28LoveCSharp,
       Hacker.q28LoveGo, Hacker.q28LoveScala, Hacker.q28LovePerl, Hacker.q28LoveSwift,
       Hacker.q28LovePascal, Hacker.q28LoveClojure, Hacker.q28LovePHP, Hacker.q28LoveHaskell,
       Hacker.q28LoveLua, Hacker.q28LoveR).filter(Hacker.CountryNumeric2 == country).all()

    c_list = [sum([row[i] for row in competency]) for i in range(len(competency[0]))]
    k_list = [sum([row[j] for row in know if row[j] == 1]) for j in range(len(know[0]))]
    l_list = [sum([row[k] for row in sentiment if row[k] == 1]) for k in range(len(sentiment[0]))]
    h_list = [sum([row[l] for row in sentiment if row[l] == 2]) for l in range(len(sentiment[0]))]
    s_list = list(zip(l_list, h_list))
    s_list = [round((m[0]/(m[0]+m[1])*100), 2) if (m[0]+m[1])>0 else (m[0]+m[1])==1 for m in s_list]
    p_list = ["C", "C++", "Java", "Python", "Ruby", "JavaScrpit", "Sharp", "Go", "Scala", "Perl", "Swift", 
            "Pascal", "Clojure", "PHP", "Haskell", "Lua", "R"]
    color_list = ["#555555", "#f34b7d", "#b07219", "#3572A5", "#701516", "#f1e05a", "#178600", "#375eab", "#c22d40", "#0298c3", "#ffac45",
            "E3F171", "#db5855", "#4F5D95", "#5e5086", "#000080", "#198CE7"]
    return jsonify({"languages": p_list, "competency": c_list, "know": k_list, "sentiment": s_list, "colors": color_list})

if __name__ == "__main__":
    app.run(debug=True)