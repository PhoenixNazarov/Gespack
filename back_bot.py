import json
import threading
import time

import websocket

import config
from text_emoji import message_to_code

new_messages = []

ws = websocket.create_connection(f"wss://{config.IP}:5000")


class BackgroundBot:
    def __init__(self):
        self.local_history = ''

    def process(self):
        print('bot was started')
        while 1:
            _new_messages = self.check_new_message()
            if _new_messages:
                _message = _new_messages[-1]
                if _message['type'] == 'new_message':
                    if _message['text'] == 'hahaha':
                        self.send_response(
                            {'type': 'drop_emoji', 'emoji': '😀'})
                    else:
                        self.send_response(
                            {'type': 'change_color', 'color': message_to_code(_message['text']), 'save': 1})

            time.sleep(0.1)

    def send_response(self, data):
        ws.send(json.dumps(data))
        # ws
        # send_messages.append(data)

    def check_new_message(self):
        global new_messages
        if len(new_messages) != 0:
            my_message = new_messages.copy()
            new_messages = []
            return my_message


def start_loader():
    ws.send('{"type": "new_user"}')
    while 1:
        result = ws.recv()
        print('new message', result)
        try:
            new_messages.append(json.loads(result))
        except:
            pass


def start_process():
    BackgroundBot().process()


if __name__ == '__main__':
    try:
        threading.Thread(target = start_process).start()
        start_loader()
    except:
        pass
    finally:
        ws.close()
