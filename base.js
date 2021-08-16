const canvasUp = document.querySelector('#top');
const canvasDown = document.querySelector('#bottom');
const canvasBlock = document.querySelector('#block');

const ct = canvasUp.getContext('2d');
const cd = canvasDown.getContext('2d');
const cb = canvasBlock.getContext('2d');

const width = window.innerWidth;
const height = window.innerHeight/3;
const positions  = ['up','down'];

// Setting height and width for canvases
[canvasUp,canvasBlock,canvasDown].forEach((e) => {
    e.width = width;
    e.height = height;
});

console.log(`Height of area = ${window.innerHeight} and width of area = ${window.innerWidth}`);


var score = 0;
function scoreMaintainer(speed){
    score += 1;
    if(score%1000){
        speed += 2;
    }
    document.querySelector('span').textContent = score;
}


class blockDetails{
    constructor(){
        this.x = width/8;
        this.side = width/15;
        this.y = height-this.side;
        this.blockPosition = true;
        this.shifting = false;
        this.direction = false;
        this.shiftCounter = 0;
    }

    blockPositionSetter(){
        // console.log(`y-coordinate = ${this.y}`);
        cb.fillStyle = '#000000';
        cb.fillRect(this.x,this.y,this.side,this.side);
    }

    rotate(){
        cb.rotate(2*Math.PI);
        cb.fillRect(this.x,this.y,this.side,this.side);
        cb.rotate(-2*Math.PI);

    }

    blockSide(){
        this.blockPositionSetter();
        if(this.shifting && this.blockPosition){
            if(this.shiftCounter === 10){
                this.y = 0;
                this.shifting = false;
                this.blockPosition = false;
                this.shiftCounter = 0;
            }
            else{
                this.y -= (height-this.side)/10;
                this.shiftCounter++;
            }
        }

        else if(this.shifting && !this.blockPosition){
            // console.log(this.y);
            if(this.shiftCounter === 10){
                this.y = height-this.side;
                this.shifting = false;
                this.blockPosition = true;
                this.shiftCounter = 0;
            }
            else{
                this.y += (height-this.side)/10;
                this.shiftCounter++;
            }
        }
    }

}


var holesp = 5;
class pits{

    constructor (holeWidth,movingPixelSpeed,position){

        this.x  = width + holeWidth;
        this.y = 0;
        this.width = holeWidth;
        this.height = height;
        this.holeSpeed = movingPixelSpeed;
        this.position = position

        if (this.position == 'up'){
            this.canvas = ct;
        }
        else if(this.position == 'down'){
            this.canvas = cd;
        }
        else{
            console.error('No correct canvas selection');
        }
    }

    pitMovement(){ 
        if(this.x > 0-this.width){
            this.canvas.clearRect(this.x,this.y,this.width,this.height);
            this.x -= this.holeSpeed;
        }
        else{
            return;
        }
    }
}

class fallingDown{
    constructor(){
        this.x = player.x;
        this.side = player.side;
        this.speed = 6;
        this.y = -this.side;
        this.z = player.y;
    }

    updateY(){

        if(player.blockPosition){
            this.y = -this.side;
            this.z = player.y;
        }
        else if(!player.blockPosition){
            this.y = height;
            this.z = player.y;
        }
    }
}

class obstacles{

    constructor(){
        let shapes = ['square','circle','triangle'];
        this.shape = 'triangle';//shapes[randomNumber(0,2)];
        this.side = width/15;
        this.y = height - this.side;
        this.x = width;
        this.speed = randomNumber(1,4);
        this.direction = true;  //false is top and have to go down while true means have to go up
        console.log(this.shape);
    }

    createObstacle(){
        switch (this.shape) {
            case 'square':
                cb.fillStyle = '#FFE194';
                cb.fillRect(this.x,this.y,this.side,this.side);
                break;
            case 'circle':
                cb.fillStyle = '#B8DFD8';
                cb.beginPath();
                cb.arc(this.x+this.side/2,this.y+this.side/2,this.side/2,0,2*Math.PI);
                cb.fill();
                cb.closePath();
                break;
            case 'triangle':
                let c = new Path2D();
                c.moveTo(this.x,this.y);
                c.lineTo(this.x-this.side/2,this.y+this.side/2);
                c.lineTo(this.x+this.side/2,this.y+this.side/2);
                c.lineTo(this.x,this.y);
                cb.fillStyle = '#4C4C6D';
                cb.fill(c);
                break;

        }
        this.movingObstacle();
    }

    movingObstacle(){
        this.x -= this.speed;
        if(this.direction){
            this.y -= 1;
            if(Math.floor(this.y) == 0){
                this.direction = false
                this.y =0;
            }
        }
        else if(!this.direction){
            this.y += 1;
            if(this.y >= height-this.side){
                this.direction = true;
            }
        }
    }

    checkCollision(coordinateX,coordinateY,side){
        var collisionX1 = coordinateX+side;
        var collisionX2 = coordinateX-this.side;

        if((this.x <= collisionX1)&& (this.x >= collisionX2)){
            console.log('inside x collision');

            switch(this.shape){
                case 'triangle':
                    var collisionY1 = coordinateY+side/2;
                    var collisionY2 = coordinateY-this.side/2;
                    break;
                default:
                    var collisionY1 = coordinateY+side;
                    var collisionY2 = coordinateY-this.side;
                    break;
            }

            if((this.y <= collisionY1)&& (this.y >= collisionY2)){
                console.log('inside y collision');
                console.log(`X-player,Y-player = (${coordinateX},${coordinateY})`);
                console.log(`collisionY1,collisionY2 = (${collisionY1},${collisionY2})`);
                console.log(`side of player = ${side} and side of obstacle = ${this.side}`);
                return true;
            }
            return false;
        }

    }
}

function holeCreation(){
    setInterval(() => {
        let pos = positions[randomNumber(0,1)];
        holes.push(new pits(width/8,holesp,pos));
    }, randomNumber(800,2500));
}

function randomNumber (min,max){
    let random = Math.floor((Math.random()*(max-min+1))+min);
    return random;
}

function background(){
    ct.fillStyle = '#F38BA0';
    cd.fillStyle = '#F38BA0';
    ct.fillRect(0,0,width,height);
    cd.fillRect(0,0,width,height);
}

function removeHoles(e){
    if(e.x+player.side <= -50){
        let index = holes.indexOf(e);
        holes.splice(index,1);
    }
    else{
        return;
    }
}

function removeObstacles(e){
    if(e.x <= -100){
        let index = obs.indexOf(e);
        let removedItems = obs.splice(index,1);
    }
    else{
        return;
    }
}

var hscore = localStorage.getItem('high');
function highScore(){
    if(!hscore){
        localStorage.setItem('high',score);
    }
    else if(hscore){
        if(score > hscore){
            localStorage.setItem('high',score);
        }
    }
    hscore = localStorage.getItem('high');
}
//falling animation with variable for cancelling it later...
var fallingAnimationVariable;
function fallingAnimation(){
    fallingAnimationVariable = requestAnimationFrame(fallingAnimation);
    cb.clearRect(0,0,width,height);
    cb.fillRect(fall.x,fall.z,fall.side,fall.side);
    if(player.blockPosition){
        cd.clearRect(fall.x-1,0,fall.side+5,height);
        cd.fillStyle = '#000000';
        cd.fillRect(fall.x,fall.y,fall.side,fall.side);
        fall.y += fall.speed;
        fall.z += fall.speed;
        if(fall.y > height){
            cancelAnimationFrame(fallingAnimationVariable);
            highScore();
            alert(`Game Over!!\nYour Score = ${score}\nHigh Score = ${hscore}`);
        }
    }
    else if(!player.blockPosition){
        ct.clearRect(fall.x-1,0,fall.side+5,height);
        ct.fillStyle = '#000000';
        ct.fillRect(fall.x,fall.y,fall.side,fall.side);
        fall.y -= fall.speed;
        fall.z -= fall.speed;
        if(fall.y < - (fall.side+5)){
            cancelAnimationFrame(fallingAnimationVariable);
            highScore();
            alert(`Game Over!!\nYour Score = ${score}\nHigh Score = ${hscore}`);
        }
    }
}

var animateVariable;
function animate (){
    animateVariable = requestAnimationFrame(animate);

    ct.clearRect(0,0,width,height);
    cd.clearRect(0,0,width,height);
    cb.clearRect(0,0,width,height);
    background();
    // player.blockPositionSetter();
    scoreMaintainer(holesp); // maintes scores
    fall.updateY(); //updates y coordinate of player such that it touches the base
    for(let i=0;i < (holes.length>obs.length? holes.length:obs.length);i++){
        if(obs[i]){
            let obstacle = obs[i];
            obstacle.createObstacle();
            removeObstacles(obstacle);
            if(obstacle.checkCollision(player.x,player.y,player.side)){
                player.blockSide();
                cancelAnimationFrame(animateVariable);
                highScore();
                holes[i].pitMovement();
                alert(`Game Over!!\nYour Score = ${score}\nHigh Score = ${hscore}`);
            }
        }
        if(holes[i]){
            let hole = holes[i];
            hole.pitMovement();
            removeHoles(hole);
            let collision = Math.floor(player.x - player.side/4)
            if(Math.floor(hole.x) <= collision+10 && Math.floor(hole.x) >= collision-10 ){
                if(player.blockPosition && hole.position === 'down'){
                    cancelAnimationFrame(animateVariable);
                    fallingAnimation();
                }
                else if (!player.blockPosition && hole.position === 'up'){
                    cancelAnimationFrame(animateVariable);
                    fallingAnimation();
                }
            }
        }
    }
    player.blockSide(); //draws player square
}

// Variables needed globals
var holes = [];
var obs = [];
let player = new blockDetails();
let fall = new fallingDown();

setInterval(() => {
    console.log('Obstacle created');
    obs.push(new obstacles());
    highScore();
}, randomNumber(5000,6000));

// Iniatiation Functions
player.blockPositionSetter();
holeCreation();
animate();


//Event Listeners for shifting position
addEventListener('click',()=>{
    player.rotate();
    player.shifting = true; 
    player.blockSide();
});

addEventListener('touchend',()=>{
    player.rotate();
    player.shifting = true;
    player.blockSide();
});

addEventListener('keypress',(e)=>{
    if(e.key == ' '){
        player.rotate();
        player.shifting = true;
        player.blockSide();
    }
});