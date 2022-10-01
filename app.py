from flask import Flask, render_template, request
import config

app = Flask(__name__, template_folder = 'tamplate')


@app.route('/')
def index():
    return render_template('index.html', ip = config.IP)


app.run(host = config.IP, port = 4500)
