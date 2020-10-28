const MIN_GRADIENT_VALUE = 1e-10;
const canvas = document.getElementById("mieps");
let width = window.innerWidth;
let height = window.innerHeight;
let biggerDimension = Math.max(width, height);
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");
let centerX = width / 2;
let centerY = height / 2;
let tickNum = 0;
const maxSteps = 15;
let spiralColors;

function init() {
    window.addEventListener('resize', event => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        centerX = width / 2;
        centerY = height / 2;
        biggerDimension = Math.max(width, height);
    });

    tick();
}

function tick() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    if (tickNum % numRepeatingBreathingFrames === 0) {
        let nextSpiralNum = numSpirals + 1;
        if (desiredNumSpirals != null) {
            nextSpiralNum = desiredNumSpirals;
            desiredNumSpirals = null;
        }
        updateNumSpirals(Math.min(nextSpiralNum, maxSpirals));
        refreshColors();
    }
    ctx.lineWidth = getStrokeWidth(tickNum);
    const rotateBy = 0.01 * rotationSpeed() * tickNum;
    rotateAround(centerX, centerY, rotateBy);

    for (let i = 0; i < numSpirals; i++) {
        ctx.strokeStyle = colorToString(spiralColors[i]);
        drawSpiral(centerX, centerY, 1, Math.PI * 2 / numSpirals * i, maxSteps);
    }

    rotateAround(centerX, centerY, -rotateBy);

    gradientSphericalOverlay();

    tickNum++;
    requestAnimationFrame(tick);
}

function rotationSpeed() {
    return inverse ? -spiralSpeed : spiralSpeed;
}

function gradientSphericalOverlayInverse() {
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(getClipRadiusInverse(tickNum), MIN_GRADIENT_VALUE));
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,1)');
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function gradientSphericalOverlay() {
    if (inverse) {
        return gradientSphericalOverlayInverse();
    }

    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(getClipRadius(tickNum), MIN_GRADIENT_VALUE));
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function randomRadialGradient() {
    let gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.SQRT2 * biggerDimension / 2);
    gradient.addColorStop(0, colorToString(randomColor()));
    gradient.addColorStop(0.2, colorToString(randomColor()));
    gradient.addColorStop(0.4, colorToString(randomColor()));
    gradient.addColorStop(0.6, colorToString(randomColor()));
    gradient.addColorStop(1, colorToString(randomColor()));

    return gradient;
}

function rotateAround(x, y, angle) {
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.translate(-x, -y);
}

function refreshColors() {
    spiralColors = Array(numSpirals).fill(null).map(() => randomRadialGradient());
}

function getStrokeWidth(currentTick) {
    if (inverse) {
        return getStrokeWidthInverse(currentTick);
    }

    return (Math.cos(Math.PI + Math.PI * 2 / numRepeatingBreathingFrames * currentTick) + 1) / 2 * 3;
}

function getStrokeWidthInverse(currentTick) {
    return (Math.cos(-Math.PI + Math.PI * 2 / numRepeatingBreathingFrames * currentTick) + 1) / 2 * 3;
}

function getClipRadius(currentTick) {
    if (inverse) {
        return getClipRadiusInverse(currentTick);
    }
    return (Math.cos(Math.PI + Math.PI * 2 / numRepeatingBreathingFrames * currentTick) + 1) / 2 * Math.SQRT2 * biggerDimension / 2;
}

function getClipRadiusInverse(currentTick) {
    return (Math.cos(Math.PI * 2 / numRepeatingBreathingFrames * currentTick) + 1) / 2 * biggerDimension;
}

function clip() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, getClipRadius(tickNum), 0, Math.PI * 2);
    ctx.clip();
}

function unclip() {
    ctx.restore();
}

function drawSpiral(centerX, centerY, startRadius, angleOffset, steps, renderSquare = false) {
    rotateAround(centerX, centerY, angleOffset);
    let posX = centerX;
    let posY = centerY;
    let lastFib = 0;
    let fib = 1;
    for (let i = 0; i < steps; i++) {
        let curFib = lastFib + fib;
        let radius = startRadius * curFib;
        let lastRadius = startRadius * fib;
        let direction = i % 4;
        let startAngle;
        let cCenterX,
        cCenterY;

        switch (direction) {
        case 0: // down right
            posX += lastRadius;
            posY -= radius - lastRadius;
            cCenterX = posX;
            cCenterY = posY;
            startAngle = Math.PI / 2;

            break;
        case 1: // up right
            posX -= radius - lastRadius;
            posY -= radius;
            cCenterX = posX;
            cCenterY = posY + radius;
            startAngle = Math.PI * 2;

            break;
        case 2: // up left
            posX -= radius;
            cCenterX = posX + radius;
            cCenterY = posY + radius;
            startAngle = Math.PI * 3 / 2;

            break;
        case 3: // down left
            posY += lastRadius;
            cCenterX = posX + radius;
            cCenterY = posY;
            startAngle = Math.PI;

            break;
        }
        let color = randomColor();
        ctx.fillStyle = colorToString(color);
        if (renderSquare) {
            ctx.fillRect(posX, posY, radius, radius);
        }
        ctx.beginPath();
        ctx.arc(cCenterX, cCenterY, radius, startAngle, startAngle - Math.PI / 2, true);
        ctx.stroke();
        lastFib = fib;
        fib = curFib;
    }
    rotateAround(centerX, centerY, -angleOffset);

}

function colorToString(color) {
    if (color instanceof CanvasGradient) {
        return color;
    }
    return "rgb(" + color.join(', ') + ")";
}

function complementaryColor(color) {
    return [255 - color[0], 255 - color[1], 255 - color[2]];
}

function randomColor() {
    return Array(3).fill(null).map(() => Math.floor(Math.random() * 255));
}

function fibonacci(n) {
    return n <= 1 ? 1 : fib(n - 1) + fib(n - 2);
}