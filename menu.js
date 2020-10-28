let inverse = false;
let numSpirals = 0;
let maxSpirals = 80; // Do not rip cpu
let numRepeatingBreathingFrames = 300;
let spiralSpeed = 3;
let desiredNumSpirals = null;

const menu = document.getElementById("menu");
const toggle = document.getElementById("menuToggle");
const numSpiralsRange = document.getElementById("numSpirals");

function toggleMenu() {
    if (!menu.classList.contains("open")) {
        menu.classList.remove("close");
        menu.classList.add("open");
        toggle.classList.add("close-button");
    } else {
        menu.classList.remove("open");
        menu.classList.add("close");
        toggle.classList.remove("close-button");
    }
}

function toggleDirection() {
    inverse = !inverse;
}

function changeMaxSpirals(value) {
    maxSpirals = value;
}

function changeNumSpirals(value) {
    desiredNumSpirals = value;
}

function updateNumSpirals(newNumSpirals) {
    numSpiralsRange.value = newNumSpirals;
    numSpirals = newNumSpirals;
}

function changeBreathingFrames(value) {
    numRepeatingBreathingFrames = value;
}

function changeSpiralSpeed(value) {
    spiralSpeed = value;
}

function invertSpiralDirection() {
    ctx.translate(centerX,centerY);
    ctx.scale(-1,1);
    ctx.translate(-centerX,-centerY);
}