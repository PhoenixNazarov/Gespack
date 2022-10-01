const smoothScroll = (element) => {
    element.stop().animate({
        scrollTop: element.prop("scrollHeight")
    }, 500);
}

let socket = new WebSocket("wss://192.168.43.135:5000");
let my_name = '';
let last_name = '';
let chat_content = $('#chat-content');
let chat_input = $('#text_input');
let current_color_index = 0;
let max_scroll_height = 0;

let color_history = [];


socket.onopen = function (e) {
    socket.send('{"type": "new_user"}');
};

let getScrollPosition = () => document.getElementById('chat-content').scrollTop;

socket.onmessage = function (event) {
    let data = JSON.parse(event.data);

    console.log(data);

    if (data['type'] === 'set_name') {
        my_name = data['name'];
    } else if (data['type'] === 'new_message') {
        check_last_name(data['user']);
        if (data['user'] !== my_name) {
            add_message(data['text'], data['date']);
        } else {
            add_my_message(data['text'], data['date'])
        }
        max_scroll_height = getScrollPosition();
    } else if (data['type'] === 'new_voice') {
        if (data['user'] === my_name) {
            add_my_voice(data['date']);
        } else {
            add_voice(data['date']);
        }
        $('.start_audio').last().bind('click', () => playSound(data['uuid']));
        playSound(data['uuid']);
    } else if (data['type'] === 'change_color') {
        change_color(data['color']);
        color_history.push([getScrollPosition(), data['color']]);
    } else if (data['type'] === 'drop_emoji') {
        drop_emoji(data['emoji']);
    }
};

function drop_emoji(emoji) {
    function circ(timeFraction) {
      return 1 - Math.sin(Math.acos(timeFraction));
    }

    let offset = chat_content.prop("scrollHeight") - 400;

    chat_content.append(
        `<div style="
            font-size: 80px;
            position: absolute;
            top: ${-100 + offset}px;
        ">${emoji}</div>`
    )
    let emoji_div = chat_content.find('div').last();

    emoji_div.css('left', 200);

    let start = Date.now();

    function drop() {
        if (Date.now() >= start + 1000) {emoji_div.remove(); return;};
        emoji_div.css('top', Math.floor((500 * circ((Date.now() - start)/ 1000)) - 100 + offset) + 'px');
        setTimeout(drop, 10);
    }

    setTimeout(drop, 10);

}


function check_last_name(current_name) {
    if (last_name === current_name) {
        $('.meta').last().remove();
    }
    last_name = current_name;
}

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


function add_my_voice(date) {
    chat_content.append(
        `
          <div class="media media-chat media-chat-reverse">
              <div class="media-body">
                <p><a class="start_audio"><i class="fa fa-solid fa-voicemail" aria-hidden="true"></i></a></p>
                <p class="meta">
                  <time datetime="2018">${date}</time>
                </p>
              </div>
          </div>
          `
    );
    smoothScroll(chat_content);
}

function add_voice(date) {
    chat_content.append(
        `
          <div class="media media-chat">
              <div class="media-body">
                <p><a class="start_audio"><i class="fa fa-solid fa-voicemail" aria-hidden="true"></i></a></p>
                <p class="meta">
                  <time datetime="2018">${date}</time>
                </p>
              </div>
          </div>
          `
    );
    smoothScroll(chat_content);
}


function playSound(uuid) {
    let a = new Audio('/voice?uuid=' + uuid);
    a.play();
}


function send_message() {
    let text = chat_input.val();
    if (text === ' ' || text === '') {
        return;
    }
    chat_input.val('');
    socket.send(JSON.stringify({"type": "new_message", "user": my_name, "text": text}));
}

function send_voice() {
    let text = chat_input.val();
    if (text === ' ' || text === '') {
        return;
    }
    chat_input.val('');
    socket.send(JSON.stringify({"type": "new_voice", "user": my_name, "text": text}));
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

function change_color(color, trans = 2) {
    c_color = color;
    chat_content.css('transition', trans + 's');
    set_color(color);
}

$("#send_voice").bind('click', send_voice);
$("#send_message").bind('click', send_message);
$(document).keypress(function (e) {
    if (e.which === 13) {
        $("#send_message").click();
    }
});


chat_content.on('scroll', function () {
    if (color_history.length !== 0) {
        if (getScrollPosition() > 0 && getScrollPosition() <= color_history[0][0] && current_color_index !== 0) {
            change_color(color_history[0][1], 1);
            current_color_index = 0;
            return
        }

        if (getScrollPosition() >= max_scroll_height) {
            change_color(color_history[color_history.length - 1][1], 1);
            current_color_index = color_history.length - 1;
            return;
        }

        for (let i = 1; i < color_history.length; i++) {
            if (getScrollPosition() >= color_history[i - 1][0] && getScrollPosition() < color_history[i][0] && current_color_index !== i - 1) {
                change_color(color_history[i - 1][1], 1);
                current_color_index = i - 1;
                return;
            }
        }
    }
});

