let eps_a = 20;
let aps_b = 20;
let eps_y = 20;


let last_norm = 0;


function check_pos(event, a, b, y) {
    mn = Math.min(event.alpha, a);
    mx = Math.max(event.alpha, a);
    r1 = mn + (359 - mx);
    r2 = mx - mn;
    r_a = Math.min(r1, r2);

    mn = Math.min(event.beta, b) + 180;
    mx = Math.max(event.beta, b) + 180;
    r1 = mn + (359 - mx);
    r2 = mx - mn;
    r_b = Math.min(r1, r2);

    mn = Math.min(event.gamma, y) + 90;
    mx = Math.max(event.gamma, y) + 90;
    r1 = mn + (179 - mx);
    r2 = mx - mn;
    r_y = Math.min(r1, r2);

    return (r_a <= eps_a || a === -1) && (r_b <= aps_b || b === -1) && (r_y <= eps_y || y === -1);
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