
// Default frag class
//  * Parts, particles, projectiles and missiles and stuff
function class_frag(name, position, opts) {
    this.position = position;
    this.velocity = { 'x': 0, 'y': 0 };
    this.rotation = 0;
    this.rotspeed = 0;
    this.normal = { 'x': 0, 'y': 0 };
    this.name = name;
    this.graphic = "";
    this.time = 100;
    this.idle = 0;
    this.target = -1;
    
    // More details
    if(opts) {
        if(opts.velocity) this.velocity = { 'x': opts.velocity.x, 'y': opts.velocity.y };
        if(opts.rotation) this.rotation = opts.rotation;
        if(opts.rotspeed) this.rotspeed = opts.rotspeed;
        if(opts.graphic) this.graphic = opts.graphic;
        if(opts.target) this.target = opts.target;
    }
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    if(data.frags[name].speed) {
        switch(data.frags[name].type) {
        case "particle":
            this.velocity.x += (Math.random() * 2.0 - 1.0) * data.frags[name].speed;
            this.velocity.y += (Math.random() * 2.0 - 1.0) * data.frags[name].speed;
            this.rotspeed += (Math.random() * 0.02 - 0.01) * data.frags[name].speed;
            break;
        case "projectile":
            this.velocity.x += this.normal.x * data.frags[name].speed;
            this.velocity.y += this.normal.y * data.frags[name].speed;
            break;
//         case "missile": // Missiles does not have initial speeds
//             break;
        }
    }
    if(data.frags[name].time) this.time = data.frags[name].time;
    if(data.frags[name].idle) this.idle = data.frags[name].idle;
}

// Draw the frag
class_frag.prototype.draw = function(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    if(this.graphic) data.drawgraphic(context, this.graphic);
    else data.drawfrag(context, this.name);
    context.restore();
}

// Move the frag
class_frag.prototype.move = function(speed, ships) {
    var tmp = {};
    if(this.time > 0) this.time -= speed;
    if(this.idle > 0) this.idle -= speed;
    
    // Movement
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
    this.rotation += this.rotspeed * speed;
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    
    // Missile has acceleration
    if(data.frags[this.name].type == "missile") {
        this.velocity.x += this.normal.x * data.frags[this.name].speed * speed;
        this.velocity.y += this.normal.y * data.frags[this.name].speed * speed;
        
        // Follow target
        if(this.target >= 0 && this.target < ships.length) {
            tmp.relative_position = { 'x': ships[this.target].position.x - this.position.x, 'y': ships[this.target].position.y - this.position.y };
            tmp.distance = Math.sqrt(tmp.relative_position.x * tmp.relative_position.x + tmp.relative_position.y * tmp.relative_position.y);
            if(tmp.distance) tmp.normal = { 'x': tmp.relative_position.x / tmp.distance, 'y': tmp.relative_position.y / tmp.distance };
            else tmp.normal = { 'x': 1, 'y': 0 };
            tmp.dot = this.normal.x * tmp.normal.x + this.normal.y * tmp.normal.y;
            tmp.dot_right = this.normal.x * -tmp.normal.y + this.normal.y * tmp.normal.x;
            if(tmp.dot > 0.0) {
                if(tmp.dot_right > 0.5) this.rotspeed = -0.2;
                else if(tmp.dot_right < -0.5) this.rotspeed = 0.2;
                else this.rotspeed = tmp.dot_right * -0.4;
            } else {
                if(tmp.dot_right > 0.0) this.rotspeed = -0.2;
                else this.rotspeed = 0.2;
            }
        }
        
        // Artificial friction to prevent drifting
        this.velocity.x *= 1.0 - 0.05 * speed;
        this.velocity.y *= 1.0 - 0.05 * speed;
        this.rotspeed *= 1.0 - 0.01 * speed;
    }
}

// Hit a ship
class_frag.prototype.hit = function(ships, frags) {
    var tmp = {};
    if(this.time > 0 && this.idle <= 0 && (data.frags[this.name].type == "projectile" || data.frags[this.name].type == "missile")) for(var i = 0; i < ships.length; i++) {
        
        // Check if projectile is even near this ship
        // TODO: Check if projectile passed through a part during the frame
        tmp.relative = { 'x': ships[i].position.x - this.position.x, 'y': ships[i].position.y - this.position.y };
        if(Math.abs(tmp.relative.x) < 50.0 && Math.abs(tmp.relative.y) < 50.0) { // TODO: Use calculated ship size
            
            // Find the ships closest part
            tmp.closest_distance = 1000.0;
            tmp.closest_id = 0;
            tmp.right = { 'x': -ships[i].normal.y, 'y': ships[i].normal.x };
            tmp.closest_relative = { 'x': 1.0, 'y': 0.0 };
            for(var u = 0; u < ships[i].parts.length; u++) if(ships[i].parts[u].health > 0) {
                tmp.part_position = {
                    'x': ships[i].position.x + ships[i].normal.x * ships[i].parts[u].position.x + tmp.right.x * ships[i].parts[u].position.y,
                    'y': ships[i].position.y + ships[i].normal.y * ships[i].parts[u].position.x + tmp.right.y * ships[i].parts[u].position.y
                };
                tmp.part_size = data.getpartsize(ships[i].parts[u].name);
                tmp.part_relative = { 'x': tmp.part_position.x - this.position.x, 'y': tmp.part_position.y - this.position.y };
                tmp.part_distance = Math.sqrt(tmp.part_relative.x * tmp.part_relative.x + tmp.part_relative.y * tmp.part_relative.y) - (tmp.part_size.x + tmp.part_size.y) * 0.25;
                if(tmp.part_distance < tmp.closest_distance) {
                    tmp.closest_distance = tmp.part_distance;
                    tmp.closest_id = u;
                    tmp.closest_relative = { 'x': tmp.part_relative.x, 'y': tmp.part_relative.y };
                }
            }
            
            // Check if closest part is closer than part size
            if(tmp.closest_distance < 0) {
                tmp.damage = Math.random() * data.frags[this.name].damage;
                ships[i].parts[tmp.closest_id].health -= tmp.damage;
                if(ships[i].parts[tmp.closest_id].health > 0) this.time = 0;
                
                // Give the ship a good kick and spin from being hit
                tmp.dot_right = -this.normal.y * tmp.relative.x + this.normal.x * tmp.relative.y;
                tmp.spin = (Math.abs(tmp.dot_right) > 1.0 ? 1.0 - 1.0 / Math.abs(tmp.dot_right) : 0.0) * 0.5;
                tmp.kick = 1.0 - tmp.spin;
                ships[i].velocity.x += this.velocity.x * tmp.damage * (1.0 / ships[i].totalweight) * tmp.kick;
                ships[i].velocity.y += this.velocity.y * tmp.damage * (1.0 / ships[i].totalweight) * tmp.kick;
                ships[i].rotspeed += tmp.damage * (0.1 / ships[i].totalweight) * (tmp.dot_right > 0 ? tmp.spin : -tmp.spin);
                return;
            }
        }
    }
}































