//All settings
config = {
    "maxCount": 5,
    'minimalWidthPath': 150
}

let defaultConfig = {
    maxCount: 6,
    rangeForWidth: 800,
    rangeForHeight: 500,
    time: 100,
    timeForReset: 3000,
    minimalWidthPath: 300,
    minimalHeightPath: 150,
    coef1: 0.5,
    coef2: 2,
}
Object.setPrototypeOf(config, defaultConfig)
let oldTime = performance.now()
let newTime
let oldX = 0;
let oldY = 0;
let newX, newY;
let isItRight = false;
let isItUp = false;

let horizontalCount = 0;
let verticalCount = 0;
let maxX = 0;
let minX = window.outerWidth;
let maxY = 0;
let minY = window.outerHeight;

function getTanDeg(deg) {
    let rad = deg * Math.PI / 180;
    return Math.tan(rad);
}

function anulatorX() {
    maxX = 0;
    minX = window.outerWidth;
}

function anulatorY() {
    maxY = 0;
    minY = window.outerHeight;
}

function anulatorCounter() {
    horizontalCount = 0;
    verticalCount = 0;
}

function getMouseDirection(e) {
    //deal with the horizontal case
    newTime = performance.now()
    newX = e.pageX;
    newY = e.pageY;
    if (newTime - oldTime > config.timeForReset) {
        anulatorX();
        anulatorY();
        anulatorCounter();
        oldTime = newTime;
        return;
    }
    if (newTime - oldTime > config.time) {
        if (config.coef2 > Math.abs((oldY - newY) / (oldX - newX)) && Math.abs((oldY - newY) / (oldX - newX)) > config.coef1) {
            anulatorY();
            anulatorX();
            anulatorCounter();
            return;
        }
        if (horizontalCount === config.maxCount) {
            if (Math.abs(maxX - minX) > config.minimalWidthPath &&
                Math.abs(maxY - minY) < config.rangeForHeight &&
                newTime - oldTime < config.time * config.maxCount * 4) {

                // HERE PUT CODE FOR FIRST GESTURE RIGHT AND LEFT
                window.wss.send(JSON.stringify({
                    "type": "new_motion",
                    "user": my_name,
                    "emotion": "positive",
                    "device": "pc"
                }));
                console.log("BOOBA GOES RIGHT AND LEFT");
            }
            anulatorY();
            anulatorX();
            anulatorCounter();
        }
        if (verticalCount === config.maxCount) {
            if (Math.abs(maxY - minY) > config.minimalHeightPath &&
                Math.abs(maxX - minX) < config.rangeForWidth &&
                newTime - oldTime < config.time * config.maxCount * 4) {

                // HERE PUT CODE FOR SECOND GESTURE UP AND DOWN
                window.wss.send(JSON.stringify({
                    "type": "new_motion",
                    "user": my_name,
                    "emotion": "negative",
                    "device": "pc"
                }));
                console.log("BOOBA GOES UP AND DOWN");
            }
            anulatorX();
            anulatorY();
            anulatorCounter();
        }
        if (Math.abs(newX - oldX) > Math.abs(newY - oldY)) {
            if ((oldX < newX && !isItRight) || (oldX > newX && isItRight)) {
                isItRight = !isItRight;
                horizontalCount++;
            }
        } else {
            //deal with the vertical case
            if ((oldY < newY && isItUp) || (oldY > newY && !isItUp)) {
                isItUp = !isItUp;
                verticalCount++;
            }
        }
        maxX = oldX > newX ? oldX : newX;
        minX = oldX < newX ? oldX : newX;
        maxY = oldY > newY ? oldY : newY;
        minX = oldY < newY ? oldY : newY;
        oldX = newX;
        oldY = newY;
        oldTime = newTime
    }
    // console.log(
    //     "X max and min: " + maxX + " " + minX + "\n" +
    //     "Y max and min: " + maxY + " " + minY + "\n" +
    //     "New coord: " + e.pageX + " " +  e.pageY + "\n" +
    //     "Counters: " + horizontalCount + " " + verticalCount);
}

window.addEventListener("mousemove", getMouseDirection, false);