
// The ship class
function class_ship(name, opts) {
    this.position = { 'x': 0, 'y': 0 };
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
}

// Human controlled ship
class_ship.prototype.control = function(controls, ship_id, ships, speed) {
    if(controls) {
        if(controls.thrust > 0.01) this.thrust = controls.thrust;
        else this.thrust = 0.0;
        this.rotspeed = controls.turn * 0.07;
        this.fireprimary = controls.fire;
    } else this.ai.think(this, ship_id, ships, speed);
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
            if(this.parts[i].load(speed) && this.fireprimary) this.parts[i].fireweapon(this, frags);
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
        }
    }
    context.restore();
}

// Move the ship
class_ship.prototype.move = function(speed) {
    
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
