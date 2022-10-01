from flask import Flask, render_template, send_file, request

import config

app = Flask(__name__, template_folder = 'tamplate')


@app.route('/')
def index():
    return render_template('index.html', ip = config.IP)


@app.route('/voice')
def get_voice():
    return send_file(f"data/{request.args['uuid']}.wav")


@app.route('/get_shake')
def get_shake():
    return render_template('shake.html')


app.run(host = '192.168.198.68', port=443, ssl_context='adhoc', debug = True)
# app.run(host = config.IP, port=443, ssl_context='adhoc', debug = True)
