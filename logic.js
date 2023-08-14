const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

var background = new Image();
background.src = "go-board.jpg";

const stoneOffSet = 37.4772;
const padding = 63;

let color = 'rgba(0, 0, 0, 0.5)';
let stoneTurn = 0;

let prevState = { };
let stoneGroup = [];
let airFound = false;

let stonesFound = [];
let sideCheck = 0;

const stones = [];
for(let c = 0; c < 19; c++) {
    stones[c] = [];
    for(let r = 0; r < 19; r++) {
        stones[c][r] = { x: c, y: r, status: 0, color: 0 };
    }
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function mouseClickHandler(e) {
    var pos = getMousePos(canvas, e);
    const relativeX = pos.x;
    const relativeY = pos.y;
    for(let c = 0; c < 19; c++) {
        for(let r = 0; r < 19; r++) {
            if (relativeX > ((stones[c][r].x * stoneOffSet) - (stoneOffSet/2)) + padding && 
                relativeX < ((stones[c][r].x * stoneOffSet) + (stoneOffSet/2)) + padding &&
                relativeY > ((stones[c][r].y * stoneOffSet) - (stoneOffSet/2)) + padding && 
                relativeY < ((stones[c][r].y * stoneOffSet) + (stoneOffSet/2)) + padding &&
                stones[c][r].status === 0) {
                    stones[c][r].status = 2;
                    stones[c][r].color = stoneTurn;
                    checkConnectedStone(stones[c][r]);
                    
                    console.log(sideCheck, stonesFound.length);
                    
                    if (sideCheck === stonesFound.length) {
                        stones[c][r].status = 0;
                        stones[c][r].color = 0;
                        console.log("Error, illegal move");
                    } else {
                        stoneTurn = 1 - stoneTurn;
                    }
            }
        }
    }
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
                    if (stones[c][r] != prevState && stones[c][r].status < 2) {
                        prevState = stones[c][r]
                        stones[c][r].status = 1;
                        drawHoverStone();
                    } else if (stones[c][r].status === 2 && prevState.status != 2) {
                        prevState.status = 0;
                        clearStones();
                        prevState = { };
                    }
            }
        }
    }
    if (relativeX < stoneOffSet || relativeX > canvas.width - stoneOffSet || relativeY < stoneOffSet || relativeY > canvas.height - stoneOffSet) { 
        for(let x = 0; x < 19; x++) {
            for(let y = 0; y < 19; y++) {
                if (stones[x][y].status === 1) stones[x][y].status = 0;
            }
        }
        prevState = { };
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}    

function drawPlacedStones() {
    for (let c = 0; c < 19; c++) {
        for (let r = 0; r < 19; r++) {
            if (stones[c][r].status === 2) {
                const stoneX = (stones[c][r].x * stoneOffSet) + padding;
                const stoneY = (stones[c][r].y * stoneOffSet) + padding;
                ctx.beginPath();
                ctx.arc(stoneX, stoneY, stoneOffSet/2, 0, Math.PI * 2);
                if (stones[c][r].color === 0) {
                    ctx.fillStyle = "#000000";
                } else if (stones[c][r].color === 5) {
                    ctx.fillStyle = "#FF0000";
                } else {
                    ctx.fillStyle = "#FFFFFF";
                }
                ctx.fill();
                ctx.closePath();
            } 
        }
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
            } else if (stones[c][r].status === 0) {
                const stoneX = (stones[c][r].x * stoneOffSet) + padding;
                const stoneY = (stones[c][r].y * stoneOffSet) + padding;
                ctx.clearRect(stoneX - stoneOffSet/2, stoneY - stoneOffSet/2, stoneOffSet, stoneOffSet);
            }
        }
    }
}


function clearStones() {
    for (let c = 0; c < 19; c++) {
        for (let r = 0; r < 19; r++) {
            if (stones[c][r].status === 0) {
                const stoneX = (stones[c][r].x * stoneOffSet) + padding;
                const stoneY = (stones[c][r].y * stoneOffSet) + padding;
                ctx.clearRect(stoneX - stoneOffSet/2, stoneY - stoneOffSet/2, stoneOffSet, stoneOffSet);
            }
        }
    }
}

function checkConnectedStone(stone) {
    stonesFound = [];
    sideCheck = 0;

    if(stone.x-1 >= 0 && stones[stone.x-1][stone.y].status === 2 
        && stones[stone.x-1][stone.y].color != stoneTurn) {
        stonesFound.push(stones[stone.x-1][stone.y]);
    } else if (stone.x-1 >= 0 && stones[stone.x-1][stone.y].status === 0) {
        sideCheck--;
    }
    if (stone.y-1 >= 0 && stones[stone.x][stone.y-1].status === 2 
        && stones[stone.x][stone.y-1].color != stoneTurn) {
        stonesFound.push(stones[stone.x][stone.y-1]);
    } else if (stone.y-1 >= 0 && stones[stone.x][stone.y-1].status === 0) {
        sideCheck--;
    }
    if (stone.x+1 < 19 && stones[stone.x+1][stone.y].status === 2 
        && stones[stone.x+1][stone.y].color != stoneTurn) {
        stonesFound.push(stones[stone.x+1][stone.y]);
    } else if (stone.x+1 < 19 && stones[stone.x+1][stone.y].status === 0) {
        sideCheck--;
    }
    if (stone.y+1 < 19 && stones[stone.x][stone.y+1].status === 2 
        && stones[stone.x][stone.y+1].color != stoneTurn) {
        stonesFound.push(stones[stone.x][stone.y+1]);
    } else if (stone.y+1 < 19 && stones[stone.x][stone.y+1].status === 0) {
        sideCheck--;
    }
    
    for(let i = 0; i < stonesFound.length; i++) {
        airFound = false;
        stoneGroup = [];
        checkGroupTaken(stonesFound[i]);
        
        if (airFound === false) {
            for(let j = 0; j < stoneGroup.length; j++) {
                stoneGroup[j].status = 0;
            }
        } else {
            sideCheck++;
        }
    }

    clearStones();
}

function checkGroupTaken(stone) {
    let sides = [];

    stoneGroup.push(stone);
    
    if (stone.x-1 >= 0 && stones[stone.x-1][stone.y].color != stoneTurn && stones[stone.x-1][stone.y].status === 2 && 
        !stoneGroup.includes(stones[stone.x-1][stone.y])) {
        sides.push(stones[stone.x-1][stone.y]);
    } else if (stone.x-1 >= 0 && stones[stone.x-1][stone.y].status === 0) {
        airFound = true;
    }
    if (stone.y-1 >= 0 && stones[stone.x][stone.y-1].color != stoneTurn && stones[stone.x][stone.y-1].status === 2 && 
        !stoneGroup.includes(stones[stone.x][stone.y-1])) {
        sides.push(stones[stone.x][stone.y-1]);
    } else if (stone.y-1 >= 0 && stones[stone.x][stone.y-1].status === 0) {
        airFound = true;
    }
    if (stone.x+1 < 19 && stones[stone.x+1][stone.y].color != stoneTurn && stones[stone.x+1][stone.y].status === 2 && 
        !stoneGroup.includes(stones[stone.x+1][stone.y])) {
        sides.push(stones[stone.x+1][stone.y]);
    } else if (stone.x+1 < 19 && stones[stone.x+1][stone.y].status === 0) {
        airFound = true;
    }
    if (stone.y+1 < 19 && stones[stone.x][stone.y+1].color != stoneTurn && stones[stone.x][stone.y+1].status === 2 && 
        !stoneGroup.includes(stones[stone.x][stone.y+1])) {
        sides.push(stones[stone.x][stone.y+1]);
    } else if (stone.y+1 < 19 && stones[stone.x][stone.y+1].status === 0) {
        airFound = true;
    }

    for(let i = 0; i < sides.length && airFound === false; i++) {
        checkGroupTaken(sides[i]);
    }
}

function draw() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlacedStones();

    requestAnimationFrame(draw);
}

draw();