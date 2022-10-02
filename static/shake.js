const EPS_A = 20;
const EPS_B = 20;
const EPS_Y = 20;

let last_norm = 0;
let prev_less_0 = false


function check_coordinate(x, y, add, range) {
    mn = Math.min(x, y) + add;
    mx = Math.max(x, y) + add;
    return Math.min(mx - mn, mn + (range - mx));
}

function check_pos(event, a, b, y) {
    new_a = check_coordinate(event.alpha, a, 0, 359)
    new_b = check_coordinate(event.beta, b, 180, 359)
    new_y = check_coordinate(event.gamma, y, 90, 179)
    return (new_a <= EPS_A || a === -1) && (new_b <= EPS_B || b === -1) && (new_y <= EPS_Y || y === -1);
}

// var outputRed = document.querySelector('.outputRed');
// var outputGreen = document.querySelector('.outputGreen');
// var outputBlue = document.querySelector('.outputBlue');
// var outputPos = document.querySelector('.outputPos');

let last_active = 0;

window.addEventListener('deviceorientation', (event) => {
    // outputRed.innerHTML = Math.floor(event.alpha);
    // outputGreen.innerHTML = Math.floor(event.gamma);
    // outputBlue.innerHTML = Math.floor(event.beta);

    if (Date.now() - last_active <= 3000) {
        return;
    }

    if (check_pos(event, -1, 90, -1)) {
        last_norm = Date.now();
        console.log("yes");
    } else if (Date.now() - last_norm <= 1000) {
        if (check_pos(event, -1, 179, 0)) {
            // outputPos.innerHTML = "Anger";
            last_active = Date.now();
            window.wss.send(JSON.stringify({
                "type": "new_motion",
                "user": my_name,
                "emotion": "anger",
                "device": "mobile"
            }));
            // setTimeout(() => outputPos.innerHTML = '', 3000);
        } else if (check_pos(event, -1, 0, 0)) {
            last_active = Date.now();
            window.wss.send(JSON.stringify({
                "type": "new_motion",
                "user": my_name,
                "emotion": "ok",
                "device": "mobile"
            }));
            // setTimeout(() => outputPos.innerHTML = '', 3000);
        }
    }


    if (event.gamma > 15 && prev_less_0 && (Date.now() - last_norm <= 2000)) {
        prev_less_0 = false
        cnt += 1
    } else if (event.gamma < -15 && (!prev_less_0) && (Date.now() - last_norm <= 2000)) {
        prev_less_0 = true
        cnt += 1
    } else {
        if (Date.now() - last_norm > 2000) {
            cnt = 0;
        }
    }
    if (cnt == 5) {
        cnt = 0;
        last_active = Date.now();
        window.wss.send(JSON.stringify({
            "type": "new_motion",
            "user": my_name,
            "emotion": "smile",
            "device": "mobile"
        }));
        // setTimeout(() => outputPos.innerHTML = '', 3000);
    }
});