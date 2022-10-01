from dataclasses import dataclass
import text2emotion as te
from sound import text_to_speech
import re


@dataclass
class Message:
    def __init__(self, text: str, sound: int = -1) -> None:
        self.emotion = message_to_code(text)
        if sound != -1:
            text_to_speech(text, "test.wav")
        self.text = text
        self.id = 0


def message_to_code(text: str):
    emotions = te.get_emotion(text)
    emotion = max(emotions.keys(), key=lambda x: emotions[x])
    match emotion:
        case "Happy": return "#21ff34"
        case "Angry": return "#fa020b"
        case "Surprise": return "#f7ef4d"
        case "Sad": return "#74cdfc"
        case "Fear": return "#ffa621"
        case _: return "#74cdfc"
