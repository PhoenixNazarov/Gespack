from importlib.resources import path
import os
import torch


def text_to_speech(text: str, path: str = "audio.wav", code: int = 0):
    # TODO add different sound acting based on the code
    device = torch.device('cpu')
    torch.set_num_threads(4)
    local_file = './models/model1.pt'

    if not os.path.isfile(local_file):
        torch.hub.download_url_to_file('https://models.silero.ai/models/tts/en/v3_en.pt',
                                       local_file)

    model = torch.package.PackageImporter(
        local_file).load_pickle("tts_models", "model")
    model.to(device)
    sample_rate = 48000
    speakers = ['en_0']
    if code >= len(speakers):
        raise ValueError("Invalid code parameter")

    model.save_wav(audio_path=path,
                   text=text,
                   speaker=speakers[code],
                   sample_rate=sample_rate)


if __name__ == "__main__":
    text_to_speech("lol")
