class BotResponse:
    background_change = ''
    background_emotion = ''


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
