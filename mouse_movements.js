//All settings
const maxCount = 6;
const rangeForWidth = 800;
const rangeForHeight = 500;
const time = 100;
const timeForReset = 3000;
const minimalWidthPath = 300;
const minimalHeightPath = 0;

let oldTime = performance.now()
let newTime
let oldX = 0;
let oldY = 0;
let newX, newY;
let isItRight = false;
let isItUp = false;

let horizontalCount= 0;
let verticalCount = 0;
let maxX = 0;
let minX = window.outerWidth;
let maxY = 0;
let minY = window.outerHeight;

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
    if (newTime - oldTime > timeForReset) {
        anulatorX();
        anulatorY();
        anulatorCounter();
        oldTime = newTime;
        return;
    }
    if (newTime - oldTime > time) {
        if (2 > Math.abs((oldY - newY)/(oldX - newX)) && Math.abs((oldY - newY)/(oldX - newX)) > 0.5) {
            anulatorY();
            anulatorX();
            return;
        }
        if (horizontalCount === maxCount) {
            if (maxX - minX > minimalWidthPath && maxY - minY < rangeForHeight && newTime - oldTime < time * maxCount * 2) {
                console.log("BOOBA GOES RIGHT AND LEFT");
            }
            anulatorY();
            anulatorX();
            anulatorCounter();
        }
        if (verticalCount === maxCount) {
            // console.log("THE FUCK " + (maxX - minX) + " " + rangeForWidth + " " + (newTime - oldTime))
            if (maxX - minX < rangeForWidth && newTime - oldTime < time * maxCount * 4) {
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