from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def landing():
    return render_template("landing_page.html")

@app.route('/login')
def login():
    return render_template("log_in.html")

@app.route('/social')
def feed():
    return render_template("social_media.html")

@app.route('/profile')
def profile_page():
    return render_template("profile.html")

@app.route('/sign_up')
def sign_up():
    return render_template("sign_up_page.html")

