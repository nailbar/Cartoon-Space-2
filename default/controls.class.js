
// Default ship control class
function class_controls() {
    this.thrust = 0;
    this.thrustkey = 0;
    this.turn = 0;
    this.turnleft = 0;
    this.turnright = 0;
    this.fire = 0;
    this.timer = 1000;
    this.nextship = 0;
    this.nexttarget = 0;
}

class_controls.prototype.tick = function(speed) {
    if(this.timer < 10000) this.timer++;
    
    // Gradual thrust
    if(this.thrustkey) this.thrust += (1.0 - this.thrust) * 0.1 * speed;
    else this.thrust *= 1.0 - 0.15 * speed;
    
    // Gradual turn rate
    if(this.turnright) this.turn += (1.0 - this.turn) * 0.1 * speed;
    else if(this.turnleft) this.turn += (-1.0 - this.turn) * 0.1 * speed;
    else this.turn *= 1.0 - 0.15 * speed;
}

class_controls.prototype.keydown = function(e) {
    switch(e.keyCode) {
    case 73: // I
        this.timer = 0;
        this.thrustkey = 1;
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
        this.thrustkey = 0;
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
     case 78: // N
        this.nextship = 1;
        break;
    case 84: // T
        this.nexttarget = 1;
        break;
    }
}





















