import asyncio
import json
import ssl
import uuid
import datetime
import config
import websockets
from websockets import serve
from utils.text_emoji import text_to_speech

wss = {}


ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('selfsigned.crt', keyfile='selfsigned.key')


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
                                             'date': datetime.datetime.now().strftime('%H:%M')}))
                except websockets.exceptions.ConnectionClosedError:
                    ks.append(k)
                except websockets.exceptions.ConnectionClosedOK:
                    ks.append(k)

            for i in ks:
                wss.pop(i)

        elif data['type'] == 'new_voice':
            user = data['user']
            text = data['text']

            uid = uuid.uuid4()
            text_to_speech(text, f'data/{str(uid)}.wav')

            ks = []
            for k, i in wss.items():
                try:
                    await i.send(json.dumps({'type': 'new_voice', 'user': user, 'uuid': str(uid),
                                             'date': datetime.datetime.now().strftime('%H:%M')}))
                except websockets.exceptions.ConnectionClosedError:
                    ks.append(k)
                except websockets.exceptions.ConnectionClosedOK:
                    ks.append(k)

            for i in ks:
                wss.pop(i)

        elif data['type'] == 'new_motion':
            user = data['user']
            emotion = data['emotion']
            sticker = '🌫️'

            # pc
            if emotion == 'positive':
                sticker = '😀'
            elif emotion == 'negative':
                sticker = '🤐'

            # mobile
            elif emotion == 'anger':
                sticker = '😬'
            elif emotion == 'smile':
                sticker = '😍'
            elif emotion == 'ok':
                sticker = '😚'


            ks = []
            for k, i in wss.items():
                try:
                    await i.send(json.dumps({'type': 'new_sticker', 'user': user, 'sticker': sticker,
                                             'date': datetime.datetime.now().strftime('%H:%M')}))
                except websockets.exceptions.ConnectionClosedError:
                    ks.append(k)
                except websockets.exceptions.ConnectionClosedOK:
                    ks.append(k)

            for i in ks:
                wss.pop(i)

        elif data['type'] in ['change_color', 'drop_emoji']:
            for i in wss.values():
                try:
                    await i.send(message)
                except websockets.exceptions.ConnectionClosedOK:
                    pass


async def main():
    async with serve(echo, config.IP, 5000, ssl = ssl_context):
        await asyncio.Future()


asyncio.run(main())
