
// Default ship control class
function class_controls() {
    this.thrust = 0;
    this.turn = 0;
    this.turnleft = 0;
    this.turnright = 0;
    this.fire = 0;
    this.timer = 0;
}

class_controls.prototype.tick = function() {
    if(this.timer < 10000) this.timer++;
    if(this.turn < this.turnright - this.turnleft) this.turn += 0.1;
    else if(this.turn > this.turnright - this.turnleft) this.turn -= 0.1;
}

class_controls.prototype.keydown = function(e) {
    switch(e.keyCode) {
    case 73: // I
        this.timer = 0;
        this.thrust = 1;
        break;
    case 74: // J
        this.timer = 0;
        this.turnleft = 1;
        break;
    case 76: // L
        this.timer = 0;
        this.turnright = 1;
        break;
    case 81: // Q
        this.timer = 0;
        this.fire = 1;
        break;
//     case 87: // W
//     case 84: // T
//     case 78: // N
//     case 80: // P
    }
}

class_controls.prototype.keyup = function(e) {
    switch(e.keyCode) {
    case 73: // I
        this.timer = 0;
        this.thrust = 0;
        break;
    case 74: // J
        this.timer = 0;
        this.turnleft = 0;
        break;
    case 76: // L
        this.timer = 0;
        this.turnright = 0;
        break;
    case 81: // Q
        this.timer = 0;
        this.fire = 0;
        break;
    }
}





















