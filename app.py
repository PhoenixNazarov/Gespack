from flask import Flask, render_template, request

from text_emoji import Message

app = Flask(__name__, template_folder = 'tamplate')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_color', methods = ['POST'])
def get_color():

    return 'good'


@app.route('/send_message', methods=['POST'])
def get_message():
    print(request.form['text'])
    # ❤️
    message = Message(request.form['text'])

    return message.emotion


app.run(host = 'localhost', port = 81, debug = True)
