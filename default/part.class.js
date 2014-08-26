
// The part class
function class_part(name, position, parent) {
    this.name = name;
    this.position = { 'x': position.x, 'y': position.y };
    this.loaded = 0;
    this.locked = 0;
    this.health = data.parts[name].health;
    this.destroyed = 0;
    this.parent = parent;
}

class_part.prototype.draw = function(context, opts) {
    context.save();
    context.translate(this.position.x, this.position.y);
    data.drawpart(context, this.name, opts);
    context.restore();
}

class_part.prototype.getthrust = function() {
    return data.parts[this.name].thrust;
}

class_part.prototype.getweight = function() {
    return data.parts[this.name].weight;
}

// Load weapon and return true if loaded
class_part.prototype.load = function(speed) {
    if(this.loaded > 0) this.loaded -= speed;
    else if(data.parts[this.name].projectile_name) return true;
    return false;
}

// Fire a weapon (creates a projectile and resets load time)
class_part.prototype.fireweapon = function(ship, frags) {
    if(this.health <= 0) return false;
    this.loaded = data.parts[this.name].load_time;
    var tmp = {};
    tmp.right = { 'x': -ship.normal.y, 'y': ship.normal.x };
    tmp.size = data.getpartsize(this.name);
    tmp.position = {
        'x': ship.position.x + ship.normal.x * (this.position.x + tmp.size.x) + tmp.right.x * this.position.y,
        'y': ship.position.y + ship.normal.y * (this.position.x + tmp.size.x) + tmp.right.y * this.position.y
    };
    frags.push(new class_frag(data.parts[this.name].projectile_name, tmp.position, {
        'rotation': ship.rotation,
        'velocity': { 'x': ship.velocity.x, 'y': ship.velocity.y }
    }));
    return true;
}




