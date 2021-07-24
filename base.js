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
function scoreMaintainer(){
    score += 1;
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
        console.log(`y-coordinate = ${this.y}`);
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
            console.log(this.y);
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

        // if (this.blockPosition){
        //     this.blockPosition = false;
        //     this.y = 0;
        //     this.blockPositionSetter();
        // } //true => down ; false => up;
        // else if(!this.blockPosition){
        //     this.blockPosition = true;
        //     this.y = height - this.side;
        //     this.blockPositionSetter();
        //}
    }

}

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
        let shapes = ['square','circle','rectangle','triangle'];
        this.shape = shapes[randomNumber(0,3)];
        this.y = height - 15;
        this.x = width + 15;
        this.side = 30;
        this.speed = 2;
        this.direction = true;  //false is top and have to go down while true means have to go up
        this.path = new Path2D();
    }

    createObstacle(){
        cb.clearRect(0,0,width,height);
        switch (this.shape) {
            case 'square':
                this.y = 15;
                this.path.rect(this.x,this.y-15,this.side,this.side);
                cb.fillStyle = '#FFE194';
                cb.fill(this.path);
                break;
            case 'circle':
                this.path.arc(this.x,this.y,this.side/2,0,2*Math.PI);
                cb.fillStyle = '#B8DFD8';
                cb.fill(this.path);
                break;
            case 'rectangle':
                this.path.rect(this.x,this.y-15,2*this.side,this.side);
                cb.fillStyle = '#4C4C6D';
                cb.fill(this.path);
                break;
            case 'triangle':
                this.path.moveTo(this.x,this.y);
                this.path.lineTo(this.x-15,this.y+15);
                this.path.lineTo(this.x+15,this.y+15);
                this.path.lineTo(this.x,this.y);
                cb.fillStyle = '#E8F6EF';
                cb.fill(this.path);
                break;

        }
        this.movingObstacle();
    }

    movingObstacle(){
        this.x -= 2;
        if(this.direction){
            this.y -= 1;
            if(this.y == 0){
                this.direction = false
            }
        }
        else if(!this.direction){
            this.y += 1;
            if(this.y == height-15){
                this.direction = true;
            }
        }
    }
}

function holeCreation(){
    setInterval(() => {
        let pos = positions[randomNumber(0,1)];
        holes.push(new pits(width/8,5,pos));
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

function removeHoles(){
    holes.forEach((e)=>{
        if(e.x+player.side <= -50){
            let index = holes.indexOf(e);
            let removedItems = holes.splice(index,1);
        }
    });
}

//falling animation with variable for cancelling it later...
var fallingAnimationVariable;
function fallingAnimation(){
    fallingAnimationVariable = requestAnimationFrame(fallingAnimation);
    cb.clearRect(0,0,width,height);
    cb.fillRect(fall.x,fall.z,fall.side,fall.side);
    if(player.blockPosition){
        console.log('if');
        cd.clearRect(fall.x-1,0,fall.side+5,height);
        cd.fillStyle = '#000000';
        cd.fillRect(fall.x,fall.y,fall.side,fall.side);
        fall.y += fall.speed;
        fall.z += fall.speed;
        if(fall.y > height){
            cancelAnimationFrame(fallingAnimationVariable);
            alert('Game Over!!');
        }
    }
    else if(!player.blockPosition){
        console.log('else if');
        console.log(fall.y);
        ct.clearRect(fall.x-1,0,fall.side+5,height);
        ct.fillStyle = '#000000';
        ct.fillRect(fall.x,fall.y,fall.side,fall.side);
        fall.y -= fall.speed;
        fall.z -= fall.speed;
        if(fall.y < - (fall.side+5)){
            cancelAnimationFrame(fallingAnimationVariable);
            alert('Game Over!!');
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
    player.blockSide();
    removeHoles();
    scoreMaintainer();
    fall.updateY();
    // obs.forEach((e)=>{
    //     e.createObstacle();
    // });
    holes.forEach((e,n)=>{
        e.pitMovement();
        let collision = Math.floor(player.x - player.side/4)
        if(Math.floor(e.x) <= collision+10 && Math.floor(e.x) >= collision-10 ){
            if(player.blockPosition && e.position === 'down'){
                cancelAnimationFrame(animateVariable)
                fallingAnimation();
            }
            else if (!player.blockPosition && e.position === 'up'){
                console.log('Hi Ho');
                cancelAnimationFrame(animateVariable);
                fallingAnimation();
            }
        }   
    });
}

// Variables needed globals
var holes = [];
// var obs = [];
let player = new blockDetails();
let fall = new fallingDown();

// setInterval(() => {
//     console.log('Obstacle created');
//     obs.push(new obstacles());
// }, randomNumber(800,2500));

// Iniatiation Functions
player.blockPositionSetter();
holeCreation();
animate();


//Event Listeners for shifting position
addEventListener('click',()=>{
    player.rotate();
    player.shifting = true; 
    player.blockSide();
    console.log("clicked");
});

addEventListener('touchend',()=>{
    player.rotate();
    player.shifting = true;
    player.blockSide();
    console.log('touch');
});

addEventListener('keypress',(e)=>{
    if(e.key == ' '){
        player.rotate();
        player.shifting = true;
        player.blockSide();
        console.log('space');
    }
});