
// Default ai class
function class_ai() {
    this.target = 0;
    this.state = 0;
    this.ticker = 0;
    this.nearest = [];
}

class_ai.prototype.think = function(ship, ship_id, ships, speed) {
    var tmp = {
        'turn': 0.0,
        'thrust': 0.0,
        'fire': 0,
        'friendlyfire': 0,
        'collision': 0
    };
    
    // Add random ship to collision detection
    tmp.id = Math.floor(Math.random() * ships.length);
    tmp.addthis = true;
    if(tmp.id == ship_id) tmp.addthis = false;
    for(var i = 0; i < this.nearest.length; i++) if(this.nearest[i] == tmp.id) tmp.addthis = false;
    if(tmp.addthis) this.nearest.push(tmp.id);
    
    // Perform collision detection on nearby ships
    tmp.removeme = 0;
    tmp.removedistance = 0;
    for(var i = 0; i < this.nearest.length; i++) if(this.nearest[i] < 0 || this.nearest[i] >= ships.length || this.nearest[i] == ship_id) {
        
        // Remove unusable id
        this.nearest.splice(i, 1);
        i--;
    } else {
        tmp.data = this.calculate(ship, ships[this.nearest[i]].position);
        
        // Remove those behind you
        if(tmp.data.dot < 0 && tmp.data.distance > (ship.size + ships[this.nearest[i]].size) * 1.5) {
            this.nearest.splice(i, 1);
            i--;
        } else {
            
            // Flag furthest away for removal
            if(tmp.data.distance > tmp.removedistance || tmp.data.dot < 0) {
                tmp.removeme = i;
                tmp.removedistance = tmp.data.distance;
            }
            
            // Avoid friendly fire
            //  * TODO: Irrelevant until we have actual teams
            if(false) if(tmp.data.distance < (ship.size + ships[this.nearest[i]].size) * 1.5 || (tmp.data.dot > 0.8 && tmp.data.distance < 3000.0)) tmp.friendlyfire = true;
            
            // Avoid collision
            if(tmp.data.distance < (ship.size + ships[this.nearest[i]].size) * 2) {
                tmp.collision = true;
                if(tmp.data.dot < 0.4) {
                    tmp.thrust = 1.0;
                    if(tmp.data.dot_right < -0.4) tmp.turn = -1.0;
                    else if(tmp.data.dot_right > 0.4) tmp.turn = 1.0;
                } else {
                    if(tmp.data.dot_right < 0.0) tmp.turn = -1.0;
                    else tmp.turn = 1.0;
                }
            }
        }
    }
    
// // DEBUG collision avoidance
// tmp.collision = true;
// tmp.friendlyfire = true;
    
    // Remove furthest away if list is full
    if(this.nearest.length > 5) this.nearest.splice(tmp.removeme, 1);
    
    // Add some random into it
    this.ticker -= speed;
    if(this.ticker <= 0) {
        this.ticker = Math.random() * 700.0;
        switch(Math.floor(Math.random() * 4.0)) {
        case 0: this.state = 0; break;
        case 1: this.state = 1; break;
        case 2: this.state = 2; break;
        case 3: this.state = 3; break;
        }
    }
    
    // Return to init state if current target is bad
    if(this.target >= ships.length || this.target == ship_id) this.state = 0;
    
    // Init state
    switch(this.state) {
    case 0:
        this.target = Math.floor(Math.random() * ships.length);
        this.state = 1;
        break;
    
    // Attack state
    case 1:
        tmp.data = this.calculate(ship, ships[this.target].position);
        if(tmp.data.distance < 500.0) this.state = 2;
        else {
            if(!tmp.collision) {
                if(tmp.data.dot > -0.8) {
                    if(tmp.data.distance > 600.0) tmp.thrust = 1.0;
                    if(tmp.data.dot_right < -0.4) tmp.turn = 1.0;
                    else if(tmp.data.dot_right > 0.4) tmp.turn = -1.0;
                    else tmp.turn = tmp.data.dot_right * -2.0;
                } else {
                    if(tmp.data.dot_right < 0.0) tmp.turn = 1.0;
                    else tmp.turn = -1.0;
                }
            }
            if(tmp.data.dot > 0.95 && tmp.data.distance < 2000.0) tmp.fire = 1;
        }
        break;
    
    // Evade state
    case 2:
        tmp.data = this.calculate(ship, ships[this.target].position);
        if(tmp.data.distance > 2500.0) this.state = 1;
        else {
            if(!tmp.collision) {
                if(tmp.data.dot < 0.4) {
                    tmp.thrust = 1.0;
                    if(tmp.data.dot_right < -0.4) tmp.turn = -1.0;
                    else if(tmp.data.dot_right > 0.4) tmp.turn = 1.0;
                } else {
                    if(tmp.data.dot_right < 0.0) tmp.turn = -1.0;
                    else tmp.turn = 1.0;
                }
            }
        }
        break;
    
    // Berserk state (an attack state which doesn't change by distance)
    case 3:
        tmp.data = this.calculate(ship, ships[this.target].position);
        if(!tmp.collision) {
            if(tmp.data.dot > -0.8) {
                if(tmp.data.distance > 600.0) tmp.thrust = 1.0;
                if(tmp.data.dot_right < -0.4) tmp.turn = 1.0;
                else if(tmp.data.dot_right > 0.4) tmp.turn = -1.0;
                else tmp.turn = tmp.data.dot_right * -2.0;
            } else {
                if(tmp.data.dot_right < 0.0) tmp.turn = 1.0;
                else tmp.turn = -1.0;
            }
        }
        if(tmp.data.dot > 0.95 && tmp.data.distance < 2000.0) tmp.fire = 1;
        break;
    }
    
    // Ship control modifiers
    ship.thrust += (tmp.thrust - ship.thrust) * 0.5 * speed;
    ship.rotspeed += (tmp.turn * 0.1 - ship.rotspeed) * 0.1 * speed;
    ship.fireprimary = tmp.fire;
    if(tmp.friendlyfire) ship.fireprimary = 0;
}

// Calculate relative target data
class_ai.prototype.calculate = function(ship, target) {
    var tmp = { // Result data
        'position': { 'x': target.x, 'y': target.y },
        'relative_position': false,
        'distance': false,
        'normal': false,
        'dot': false,
        'dot_right': false
    };
    
    // Get targets position relative to self
    tmp.relative_position = { 'x': target.x - ship.position.x, 'y': target.y - ship.position.y };
    
    // Get distance and normal to target
    tmp.distance = Math.sqrt(tmp.relative_position.x * tmp.relative_position.x + tmp.relative_position.y * tmp.relative_position.y);
    
    // Calculate normal towards target
    if(tmp.distance) tmp.normal = { 'x': tmp.relative_position.x / tmp.distance, 'y': tmp.relative_position.y / tmp.distance };
    else tmp.normal = { 'x': 1, 'y': 0 };
    
    // Get normal dot value to target
    tmp.dot = ship.normal.x * tmp.normal.x + ship.normal.y * tmp.normal.y;
    
    // Get extruded dot value to target
    tmp.dot_right = ship.normal.x * -tmp.normal.y + ship.normal.y * tmp.normal.x;
    
    // Done collecting data
    return tmp;
}


















