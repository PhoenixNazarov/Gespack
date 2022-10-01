import asyncio
from websockets import connect
import threading
import json


class BotResponse:
    background_change = ''
    background_emotion = ''


async def hello(uri):
    async with connect(uri) as websocket:
        await websocket.send("Hello world!")
        while 1:
            print(await websocket.recv())


asyncio.run(hello("ws://192.168.110.206:5000"))


class BackgroundBot:
    def __init__(self, new_messages):
        self.new_messages = new_messages  # stack with new messages
        self.message_history = []

    def process(self):
        while 1:
            send_response()
            last_new_message = 0
            if 10 > last_new_message:
                send_response()


    def create_response(self):
        pass

    def send_response(self):
        # socket send BotResponse
        pass

    def check_new_message(self):
        # new_messages
        pass
