
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
    this.idle = 0;
    
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
    if(data.frags[name].idle) this.idle = data.frags[name].idle;
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
    if(this.time > 0) this.time -= speed;
    if(this.idle > 0) this.idle -= speed;
    
    // Movement
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
}

// Hit a ship
class_frag.prototype.hit = function(ships, frags) {
    var tmp = {};
    if(this.time > 0 && this.idle <= 0 && data.frags[this.name].type == "projectile") for(var i = 0; i < ships.length; i++) {
        
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
                ships[i].velocity.x += this.velocity.x * tmp.damage * 0.1 * tmp.kick;
                ships[i].velocity.y += this.velocity.y * tmp.damage * 0.1 * tmp.kick;
                ships[i].rotspeed += tmp.damage * 0.01 * (tmp.dot_right > 0 ? tmp.spin : -tmp.spin);
                return;
            }
        }
    }

                    
//                             
//                             // Check what part of ship is hit
//                             pdis = 1000;
//                             prt = -1;
//                             for(var u = 0; u < a[i].p.length; u++) if(a[i].p[u].hlt > 0.0 && this.lif > 0) {
//                                 ppos = {
//                                     x: a[i].pos.x + a[i].nrm.x * a[i].p[u].x - a[i].nrm.y * a[i].p[u].y,
//                                     y: a[i].pos.y + a[i].nrm.y * a[i].p[u].x + a[i].nrm.x * a[i].p[u].y
//                                 };
//                                 if(a[i].p[u].hlt < 0.2) partid = part.id(a[i].p[u].part + "broken");
//                                 else partid = part.id(a[i].p[u].part);
//                                 psiz = (p[partid].width + p[partid].height) / 4.0;
//                                 pos = {x: this.pos.x - ppos.x, y: this.pos.y - ppos.y};
//                                 dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y) - psiz;
//                                 if(dis < psiz && dis < pdis) {
//                                     prt = u;
//                                     pdis = dis;
//                                     pcpos = {x: ppos.x, y: ppos.y};
//                                 }
//                             }
//                             
//                             // If part is hit, add damage
//                             if(prt != -1) {
//                                 switch(this.typ) {
//                                 case 0: damage = Math.random() + 0.25; break;
//                                 case 4: damage = Math.random() + 0.4; break;
//                                 case 5: damage = Math.random() + 0.15; break;
//                                 }
//                                 a[i].p[prt].hit += damage;
//                                 a[i].p[prt].hlt -= damage;
//                                 if(a[i].p[prt].hlt > 0) this.lif = 0; // Unless part is destroyed the bullet ends here
//                                 
//                                 // Create explosion unless part is shield
//                                 if(a[i].p[prt].part != "shield2" && a[i].p[prt].part != "shield3" && a[i].p[prt].part != "shield4") for(var u = 0; u < 3; u++) b.push(new frag(
//                                     {x: this.pos.x, y: this.pos.y},
//                                     Math.random() * 6.3,
//                                     this.own,
//                                     1
//                                 ));
//                                 
//                                 // Detatch broken part
//                                 if(a[i].p[prt].hlt <= 0.0) {
//                                     b.push(new frag(
//                                         {x: pcpos.x, y: pcpos.y},
//                                         a[i].rot,
//                                         this.own,
//                                         3, a[i].p[prt].part,
//                                         a[i].del + Math.random() * 0.2 - 0.1,
//                                         {x: a[i].spd.x + Math.random() * 8.0 - 4.0, y: a[i].spd.y + Math.random() * 8.0 - 4.0}
//                                     ));
//                                     a[i].p[prt].hlt = 0;
//                                 }
//                                 
//                                 // If owner is player and ship it is enemy of player, count damage as score
//                                 if(this.own == camid && hascontrol) if(a[i].col != a[camid].col) {
//                                     hud.score += Math.floor(damage * 10.0);
//                                     if(hud.score > hud.best_score) hud.best_score = hud.score;
//                                 }
//                             }
//                         }
//                     }
//                 }
}































