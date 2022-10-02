import os
import torch
from random import randint


def text_to_speech(text: str, path: str = "audio.wav", code: int = 0):
    device = torch.device('cpu')
    torch.set_num_threads(4)
    text += "."
    local_file = '../models/model1.pt'

    if not os.path.isfile(local_file):
        torch.hub.download_url_to_file('https://models.silero.ai/models/tts/en/v3_en.pt',
                                       local_file)

    model = torch.package.PackageImporter(
        local_file).load_pickle("tts_models", "model")
    model.to(device)
    sample_rate = 48000

    if code >= 118:
        raise ValueError("Invalid code parameter")
    code = randint(0, 117)
    model.save_wav(audio_path=path,
                   text=text,
                   speaker=f'en_{code}',
                   sample_rate=sample_rate)


if __name__ == "__main__":
    text_to_speech(
        "That is so fucking bad that I can't kick 😀😀  your ass..", code=112)
