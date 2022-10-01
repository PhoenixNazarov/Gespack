let eps_a = 20;
let aps_b = 20;
let eps_y = 20;


let last_norm = 0;

function check_coordinate(x, y, add, range) {
    mn = Math.min(x, y) + add;
    mx = Math.max(x, y) + add;
    return Math.min(mx - mn, mn + (range - mx));    
}

function check_pos(event, a, b, y) {
    new_a = check_coordinate(event.alpha, a, 0, 359)
    new_b = check_coordinate(event.beta, b, 180, 359)
    new_y = check_coordinate(event.gamma, y, 90, 179)

    return (new_a <= eps_a || a === -1) && (new_b <= aps_b || b === -1) && (new_y <= eps_y || y === -1);
}

var outputRed = document.querySelector('.outputRed');
var outputGreen = document.querySelector('.outputGreen');
var outputBlue = document.querySelector('.outputBlue');
var outputPos = document.querySelector('.outputPos');

window.addEventListener('deviceorientation', (event) => {
    outputRed.innerHTML = Math.floor(event.alpha);
    outputGreen.innerHTML = Math.floor(event.gamma);
    outputBlue.innerHTML = Math.floor(event.beta);

    if (check_pos(event, -1, 90, -1)) {
        last_norm = Date.now();
        console.log("ys");
    }
 else if (check_pos(event, -1, 179, 0)) {
        if ( Date.now() - last_norm <= 1000) {
            outputPos.innerHTML = 'YEEEEEEES';
            setTimeout(() => outputPos.innerHTML = '', 3000);
        }
    }
});