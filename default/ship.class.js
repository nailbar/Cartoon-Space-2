
// The ship class
function class_ship(name, opts) {
    this.position = { 'x': 0, 'y': 0 };
    this.oldpos = { 'x': 0, 'y': 0 };
    this.velocity = { 'x': 0, 'y': 0 };
    this.rotation = 0;
    this.rotspeed = 0;
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    this.thrust = 0;
    this.fireprimary = 0;
    this.firesecondary = 0;
    this.totalthrust = 0;
    this.totalweight = 0;
    this.health = 1;
    this.parts = [];
    this.ai = new class_ai();
    this.target = 0;
    this.size = 0;
    
    // Set ship position
    if(opts.position) this.position = { 'x': opts.position.x, 'y': opts.position.y };
    if(opts.velocity) this.velocity = { 'x': opts.velocity.x, 'y': opts.velocity.y };
    if(opts.rotation) this.rotation = opts.rotation;
    if(opts.rotspeed) this.rotspeed = opts.rotspeed;
    
    // Add parts to ship
    for(var i = 0; i < data.ships[name].parts.length; i++) {
        this.parts.push(new class_part(
            data.ships[name].parts[i].name,
            { 'x': data.ships[name].parts[i].position.x, 'y': data.ships[name].parts[i].position.y },
            data.ships[name].parts[i].parent
        ));
    }
    this.recenter();
}

// Human controlled ship
class_ship.prototype.control = function(controls, ship_id, ships, speed) {
    if(controls) {
        if(controls.thrust > 0.01) this.thrust = controls.thrust;
        else this.thrust = 0.0;
        this.rotspeed = controls.turn * 0.07;
        this.fireprimary = controls.fire;
    } else {
        this.ai.think(this, ship_id, ships, speed);
        this.target = this.ai.target;
    }
}

// Draw the ship (and calculate ship stats)
class_ship.prototype.draw = function(context, speed, frags) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    this.totalthrust = 0;
    this.totalweight = 0;
    this.health = 0;
    var tmp = {};
    
    // Loop through all parts except destroyed ones
    for(var i = 0; i < this.parts.length; i++) if(!this.parts[i].destroyed) {
        
        // Draw all parts that are not about to be destroyed or connected to a part that is destroyed
        if(this.parts[i].health > 0 && !this.parts[this.parts[i].parent].destroyed) {
            this.totalthrust += this.parts[i].getthrust();
            this.totalweight += this.parts[i].getweight();
            this.health += this.parts[i].health;
            if(this.parts[i].load(speed) && this.fireprimary) this.parts[i].fireweapon(this, frags, this.target);
            this.parts[i].draw(context, { 'thrust': this.thrust });
        
        // Properly destroy a part
        } else {
            this.parts[i].destroyed = 1;
            tmp.right = { 'x': -this.normal.y, 'y': this.normal.x };
            tmp.position = {
                'x': this.position.x + this.normal.x * this.parts[i].position.x + tmp.right.x * this.parts[i].position.y,
                'y': this.position.y + this.normal.y * this.parts[i].position.x + tmp.right.y * this.parts[i].position.y
            };
            frags.push(new class_frag("default_part", tmp.position, {
                'rotation': this.rotation,
                'velocity': this.velocity,
                'rotspeed': this.rotspeed,
                'graphic': data.parts[this.parts[i].name].graphic
            }));
            tmp.needs_recenter = true;
        }
    }
    context.restore();
    
    // Recenter ship if part is lost
    if(tmp.needs_recenter || !this.size) this.recenter();
}

// Move the ship
class_ship.prototype.move = function(speed) {
    this.oldpos = { 'x': this.position.x, 'y': this.position.y };
    
    // Movement
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
    this.rotation += this.rotspeed * speed;
    
    // Acceleration
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    this.velocity.x += this.normal.x * (this.totalthrust / this.totalweight) * this.thrust * speed;
    this.velocity.y += this.normal.y * (this.totalthrust / this.totalweight) * this.thrust * speed;
    
    // Artificial friction
    this.velocity.x *= 1.0 - 0.05 * speed;
    this.velocity.y *= 1.0 - 0.05 * speed;
    this.rotspeed *= 1.0 - 0.01 * speed;
}

// Recenter and calculate ship size
class_ship.prototype.recenter = function() {
    var tmp = {
        'min_x': 0,
        'min_y': 0,
        'max_x': 0,
        'max_y': 0
    };
    
    // Find the bounding box
    for(var i = 0; i < this.parts.length; i++) if(!this.parts[i].destroyed) {
        tmp.size = data.getpartsize(this.parts[i].name);
        if(tmp.size.x + tmp.size.y == 0) return; // Image data not loaded yet
        if(this.parts[i].position.x - tmp.size.x * 0.5 < tmp.min_x) tmp.min_x = this.parts[i].position.x - tmp.size.x * 0.5;
        if(this.parts[i].position.y - tmp.size.y * 0.5 < tmp.min_y) tmp.min_y = this.parts[i].position.y - tmp.size.x * 0.5;
        if(this.parts[i].position.x + tmp.size.x * 0.5 > tmp.max_x) tmp.max_x = this.parts[i].position.x + tmp.size.x * 0.5;
        if(this.parts[i].position.y + tmp.size.y * 0.5 > tmp.max_y) tmp.max_y = this.parts[i].position.y + tmp.size.x * 0.5;
    }
    
    // Recenter ship and all parts
    tmp.center_x = (tmp.min_x + tmp.max_x) * 0.5;
    tmp.center_y = (tmp.min_y + tmp.max_y) * 0.5;
    for(var i = 0; i < this.parts.length; i++) {
        this.parts[i].position.x -= tmp.center_x;
        this.parts[i].position.y -= tmp.center_y;
    }
    tmp.right = { 'x': -this.normal.y, 'y': this.normal.x };
    this.position.x += this.normal.x * tmp.center_x + tmp.right.x * tmp.center_y;
    this.position.y += this.normal.y * tmp.center_x + tmp.right.y * tmp.center_y;
    
    // Calculate ship size
    tmp.size_x = tmp.max_x - tmp.center_x;
    tmp.size_y = tmp.max_y - tmp.center_y;
    this.size = Math.sqrt(tmp.size_x * tmp.size_x + tmp.size_y * tmp.size_y);
}






















