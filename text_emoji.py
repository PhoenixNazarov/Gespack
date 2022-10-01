from strenum import StrEnum
import emoji
import requests
import text2emotion as te
import nltk


class Message:
    def __init__(self, text: str, sound: int = 0) -> None:
        self.emotion = message_to_code(text)
        self.is_voice = False
        self.voice = message_to_sound(text, sound)
        self.text = text


def message_to_code(text: str):
    emotions = te.get_emotion(text)
    emotion = max(emotions.keys(), key = lambda x: emotions[x])
    match emotion:
        case "Happy":
            return "#21ff34"
        case "Angry":
            return "#fa020b"
        case "Surprise":
            return "#f7ef4d"
        case "Sad":
            return "#74cdfc"
        case "Fear":
            return "#ffa621"


def message_to_sound(text: str, flag: int):
    if flag == 0:
        return None
    return


sounds = {
    0: "NO_SOUND",
    1: "Arthas"
}

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


