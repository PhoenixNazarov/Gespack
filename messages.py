import asyncio
import json
import uuid
import datetime

import websockets
from websockets import serve

wss = {}


async def echo(websocket):
    async for message in websocket:
        print('new_message', message)
        try:
            data = json.loads(message.replace("'", '"'))
        except:
            return
        print('new_message', data)

        if data['type'] == 'new_user':
            _id = str(uuid.uuid4())
            wss.update({_id: websocket})
            await websocket.send(json.dumps({'type': 'set_name', 'name': _id}))

        elif data['type'] == 'new_message':
            user = data['user']
            text = data['text']

            for i in wss.values():
                try:
                    await i.send(json.dumps({'type': 'new_message', 'user': user, 'text': text,
                                             'date': datetime.datetime.now().strftime('%H:%m')}))
                except websockets.exceptions.ConnectionClosedOK:
                    pass


async def main():
    async with serve(echo, "192.168.110.206", 5000):
        await asyncio.Future()


asyncio.run(main())
