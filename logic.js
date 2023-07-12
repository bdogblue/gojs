const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

var background = new Image();
background.src = "go-board.jpg";

const stoneOffSet = 37.4771;
const padding = 63;

let color = 'rgba(0, 0, 0, 0.5)';
let stoneTurn = 1;

let prevState = { };

const stones = [];
for(let c = 0; c < 19; c++) {
    stones[c] = [];
    for(let r = 0; r < 19; r++) {
        stones[c][r] = { x: c, y: r, status: 0, color: 0 };
    }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function mouseMoveHandler(e) {
    var pos = getMousePos(canvas, e);
    const relativeX = pos.x;
    const relativeY = pos.y;
    for(let c = 0; c < 19; c++) {
        for(let r = 0; r < 19; r++) {
            if (relativeX > ((stones[c][r].x * stoneOffSet) - (stoneOffSet/2)) + padding && 
                relativeX < ((stones[c][r].x * stoneOffSet) + (stoneOffSet/2)) + padding &&
                relativeY > ((stones[c][r].y * stoneOffSet) - (stoneOffSet/2)) + padding && 
                relativeY < ((stones[c][r].y * stoneOffSet) + (stoneOffSet/2)) + padding) {
                    if (stones[c][r] != prevState) {
                        prevState = stones[c][r]
                        stones[c][r].status = 1;
                        drawHoverStone();
                    }
            }
        }
    }
    if (relativeX < stoneOffSet || relativeX > canvas.width - stoneOffSet || relativeY < stoneOffSet || relativeY > canvas.height - stoneOffSet) { 
        for(let x = 0; x < 19; x++) {
            for(let y = 0; y < 19; y++) {
                stones[x][y].status = 0;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}    

function drawHoverStone() {
    if (stoneTurn === 0) {
        color = 'rgba(0, 0, 0, 0.5)';
    } else {
        color = 'rgba(255, 255, 255, 0.5)'
    }
    
    for (let c = 0; c < 19; c++) {
        for (let r = 0; r < 19; r++) {
            if (stones[c][r].status === 1) {
                const stoneX = (stones[c][r].x * stoneOffSet) + padding;
                const stoneY = (stones[c][r].y * stoneOffSet) + padding;
                ctx.beginPath();
                ctx.arc(stoneX, stoneY, stoneOffSet/2, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
                stones[c][r].status = 0;
            } else {
                const stoneX = (stones[c][r].x * stoneOffSet) + padding;
                const stoneY = (stones[c][r].y * stoneOffSet) + padding;
                ctx.clearRect(stoneX - stoneOffSet/2, stoneY - stoneOffSet/2, stoneOffSet, stoneOffSet);
                //ctx.beginPath();
                //ctx.arc(stoneX, stoneY, stoneOffSet/2, 0, Math.PI * 2);
                //ctx.fillStyle = "#FFFFFF";
                //ctx.fill();
                //ctx.closePath();
            }
        }
    }
}

function drawWhite() {
    
    
    ctx.beginPath();
    ctx.arc(401 + (stoneOffSet*6), 399 + (stoneOffSet*6), stoneOffSet/2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    requestAnimationFrame(draw);
}

draw();