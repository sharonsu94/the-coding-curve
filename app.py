# import libraries
from flask import Flask,render_template,jsonify
import pandas as pd


# Flask Setup
app = Flask(__name__)

# Flask Routes
# Homepage
@app.route('/')
def index():
    data = pd.read_csv('data.csv')
    return render_template('index.html')

# Pie Chart

# Bar Chart

# Bubble Chart