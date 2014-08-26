
// Default frag class
//  * Parts, particles, projectiles and missiles and stuff
function class_frag(name, position, opts) {
    this.position = position;
    this.velocity = { 'x': 0, 'y': 0 };
    this.rotation = 0;
    this.rotspeed = 0;
    this.normal = { 'x': 0, 'y': 0 };
    this.name = name;
    this.time = 100;
    
    // More details
    if(opts) {
        if(opts.velocity) this.velocity = { 'x': opts.velocity.x, 'y': opts.velocity.y };
        if(opts.rotation) this.rotation = opts.rotation;
    }
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    if(data.frags[name].speed) {
        this.velocity.x += this.normal.x * data.frags[name].speed;
        this.velocity.y += this.normal.y * data.frags[name].speed;
    }
    if(data.frags[name].time) this.time = data.frags[name].time;
}

// Draw the frag
class_frag.prototype.draw = function(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    data.drawfrag(context, this.name);
    context.restore();
}

// Move the frag
class_frag.prototype.move = function(speed) {
    
    // Movement
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
}

