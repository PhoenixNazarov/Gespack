from dataclasses import dataclass
import emoji
import requests
import text2emotion as te
from tot_hacaton.sound import text_to_speech

@dataclass
class Message:
    def __init__(self, text: str, sound:int=-1) -> None:
        self.emotion = message_to_code(text)  
        self.voice = text_to_speech(text, sound, "test.wav") if sound != -1 else None
        self.text = text
        self.id = 0
    

def message_to_code(text: str):
    emotions = te.get_emotion(text)
    emotion = max(emotions.keys(), key=lambda x: emotions[x])  
    match emotion:
        case "Happy" : return "#21ff34"
        case "Angry" : return "#fa020b"
        case "Surprise" : return "#f7ef4d"
        case "Sad" : return "#74cdfc"
        case "Fear" : return "#ffa621"
        case _: return "#74cdfc"


if __name__ == "__main__":
    print(message_to_code('Good'))
    print(message_to_code('Bad'))
    print(message_to_code('Sad'))
    print(message_to_code('Я грустный'))
    print(message_to_code('Я Веселый'))
    print(message_to_code('Жизнь'))
    print(message_to_code('Как дела?'))
    print(message_to_code('Я люблю тебя'))
    print(message_to_code('Сегодня такой грустный день'))
    print(message_to_code('Today is boring'))
    print(message_to_code('I love you'))
    print(message_to_code('I hate you'))
    print(message_to_code('You pretty'))
    print(message_to_code('You beautiful'))


