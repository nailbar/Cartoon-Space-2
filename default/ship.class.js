
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
    this.parts = [];
    
    // Set ship position
    if(opts.position) this.position = { 'x': opts.position.x, 'y': opts.position.y };
    if(opts.velocity) this.velocity = { 'x': opts.velocity.x, 'y': opts.velocity.y };
    if(opts.rotation) this.rotation = opts.rotation;
    if(opts.rotspeed) this.rotspeed = opts.rotspeed;
    
    // Add parts to ship
    for(var i = 0; i < data.ships[name].parts.length; i++) {
        this.parts.push(new class_part(
            data.ships[name].parts[i].name,
            { 'x': data.ships[name].parts[i].position.x, 'y': data.ships[name].parts[i].position.y }
        ));
    }
}

// Human controlled ship
class_ship.prototype.control = function(controls) {
    if(controls.thrust > 0.01) this.thrust = controls.thrust;
    else this.thrust = 0.0;
    
    this.rotspeed = controls.turn * 0.07;
    
    this.fireprimary = controls.fire;
}

// Draw the ship (and calculate ship stats)
class_ship.prototype.draw = function(context, speed, frags) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    this.totalthrust = 0;
    this.totalweight = 0;
    for(var i = 0; i < this.parts.length; i++) {
        this.totalthrust += this.parts[i].getthrust();
        this.totalweight += this.parts[i].getweight();
        if(this.parts[i].load(speed) && this.fireprimary) this.parts[i].fireweapon(this, frags);
        this.parts[i].draw(context, { 'thrust': this.thrust });
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
