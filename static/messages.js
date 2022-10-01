const smoothScroll = (element) => {
    element.stop().animate({
        scrollTop: element.prop("scrollHeight")
    }, 500);
}

let socket = new WebSocket("ws://192.168.198.68:5000");
let my_name = '';
let chat_content = $('#chat-content');
let chat_input = $('#text_input');


socket.onopen = function (e) {
    socket.send('{"type": "new_user"}');
};

socket.onmessage = function (event) {
    let data = JSON.parse(event.data);

    console.log(data);

    if (data['type'] === 'set_name') {
        my_name = data['name'];
    } else if (data['type'] === 'new_message') {
        if (data['user'] !== my_name) {
            add_message(data['text'], data['date']);
        } else {
            add_my_message(data['text'], data['date'])
        }
    } else if (data['type'] === 'change_color') {
        change_color(data['color']);
    }

};


function add_my_message(text, date) {
    chat_content.append(
        `
          <div class="media media-chat media-chat-reverse">
              <div class="media-body">
                <p>${text}</p>
                <p class="meta">
                  <time datetime="2018">${date}</time>
                </p>
              </div>
          </div>
          `
    );
    smoothScroll(chat_content);
}

function add_message(text, date) {
    chat_content.append(
        `
          <div class="media media-chat">
              <img class="avatar avatar-xs" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="...">
              <div class="media-body">
                <p>${text}</p>
                <p class="meta">
                  <time datetime="2018">${date}</time>
                </p>
              </div>
            </div>
          `
    );
    smoothScroll(chat_content);
}


function send_message() {
    let text = chat_input.val();
    chat_input.val('');
    socket.send(JSON.stringify({"type": "new_message", "user": my_name, "text": text}));
}

function send_message_answer(data) {
    change_color(data);
}


function current_color() {
    return chat_content.css('background-color');
}

function set_color(color) {
    chat_content.css('background-color', color);
}

let c_color = current_color();

function show_color(color, time) {
    chat_content.css('transition', time + 's');
    set_color(color);
    setTimeout(() => set_color(c_color), time * 1000);
}

function change_color(color) {
    c_color = color;
    chat_content.css('transition', '2s');
    set_color(color);
}


function emotion_angry() {
    show_color('red', 0.5);
}

$("#send_message").bind('click', send_message);
$(document).keypress(function (e) {
    if (e.which === 13) {
        $("#send_message").click();
    }
});