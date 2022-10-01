import asyncio
import json
import uuid
import datetime
import config
import websockets
from websockets import serve

wss = {}


async def echo(websocket):
    async for message in websocket:
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

            ks = []

            for k, i in wss.items():
                try:
                    await i.send(json.dumps({'type': 'new_message', 'user': user, 'text': text,
                                             'date': datetime.datetime.now().strftime('%H:%m')}))
                except websockets.exceptions.ConnectionClosedError:
                    ks.append(k)
                except websockets.exceptions.ConnectionClosedOK:
                    ks.append(k)

            for i in ks:
                wss.pop(i)


        elif data['type'] == 'change_color':
            for i in wss.values():
                try:
                    await i.send(message)
                except websockets.exceptions.ConnectionClosedOK:
                    pass


async def main():
    async with serve(echo, config.IP, 5000):
        await asyncio.Future()


asyncio.run(main())
