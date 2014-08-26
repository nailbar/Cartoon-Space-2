
// The data class
// Handles all game data from graphics to missions to menu elements
function class_data() {
    this.graphics = {};
    this.parts = {};
    this.ships = {};
    this.shiplist = [];
    this.frags = {};
}

// Draw a frag
class_data.prototype.drawfrag = function(context, name, opts) {
    if(!opts) opts = {};
    if(!this.frags[name]) {
        console.log("class_data.drawfrag: " + name + " not registered");
        return false;
    }
    this.drawgraphic(context, this.frags[name].graphic);
    return true;
}

// Add a frag to list
class_data.prototype.addfrag = function(name, gname, gpath, opts) {
    if(!opts) opts = {};
    if(this.frags[name]) {
        console.log("class_data.addfrag: " + name + " already registered");
        return false;
    }
    this.addgraphic(gname, gpath);
    this.frags[name] = {
        'graphic': gname,
        'type': "particle", // particle, projectile, missile
        'time': 100.0,
        'speed': 0.0,
        'idle': 0.0,
        'damage': 0.0
    };
    if(opts.type) this.frags[name].type = opts.type;
    if(opts.time) this.frags[name].time = opts.time;
    if(opts.speed) this.frags[name].speed = opts.speed;
    if(opts.idle) this.frags[name].idle = opts.idle;
    if(opts.damage) this.frags[name].damage = opts.damage;
    return true;
}

// Add a ship to list
class_data.prototype.addship = function(name, parts) {
    if(this.ships[name]) {
        console.log("class_data.addship: " + name + " already registered");
        return false;
    }
    this.shiplist.push(name);
    this.ships[name] = {
        'parts': []
    };
    for(var i = 0; i < parts.length; i++) {
        this.ships[name].parts.push({
            'name': parts[i].name,
            'position': { 'x': parts[i].position.x, 'y': parts[i].position.y }
        });
    }
    return true;
}

// Add a part to list
class_data.prototype.addpart = function(name, gname, gpath, opts) {
    if(!opts) opts = {};
    if(this.parts[name]) {
        console.log("class_data.addpart: " + name + " already registered");
        return false;
    }
    this.addgraphic(gname, gpath);
    this.parts[name] = {
        'graphic': gname, // The picture of said part
        'weight': 1.0, // Part weight
        'health': 1.0, // Part health
        'thrust': 0, // If part is thruster, how much thrust it provides
        'thrust_image_name': "", // Image for thrust exhaust if part is thruster
        'thrust_image_scale': 1.0, // Image size for thrust exhaust if part is thruster and has an image
        'projectile_name': "", // Name of projectile if part is a weapon
        'load_time': 1.0, // Time for weapon to load
        'lock_time': 0.0, // Time for weapon to lock on target,
        'muzzle_image_name': "", // Image for muzzle flash if weapon
        'muzzle_image_scale': 1.0, // Muzzle flash image scale
        'muzzle_image_time': 1.0 // Muzzle flash duration
    };
    
   if(opts.weight) this.parts[name].weight = opts.weight;
   if(opts.health) this.parts[name].health = opts.health;
   else this.parts[name].health = opts.weight;
    
    // Thruster settings
    if(opts.thrust) {
        this.parts[name].thrust = opts.thrust; // Maximum thrust
        if(opts.thrust_image_name && opts.thrust_image_path) { // Thrust exhaust graphics
            this.addgraphic(opts.thrust_image_name, opts.thrust_image_path);
            this.parts[name].thrust_image_name = opts.thrust_image_name;
            if(opts.thrust_image_scale) this.parts[name].thrust_image_scale = opts.thrust_image_scale;
        }
    }
    
    // Weapon settings
    if(opts.projectile_name) {
        this.parts[name].projectile_name = opts.projectile_name;
        if(opts.load_time) this.parts[name].load_time = opts.load_time;
        if(opts.lock_time) this.parts[name].lock_time = opts.lock_time;
    }
    return true;
}

// Draw a part
class_data.prototype.drawpart = function(context, name, opts) {
    if(!opts) opts = {};
    if(!this.parts[name]) {
        console.log("class_data.drawpart: " + name + " not registered");
        return false;
    }
    this.drawgraphic(context, this.parts[name].graphic);
    
    // Thruster graphics
    if(opts.thrust && this.parts[name].thrust_image_name) {
        context.save();
        context.translate(this.graphics[this.parts[name].graphic].width * -0.5, 0);
        context.scale(opts.thrust * (0.9 + Math.random() * 0.1) * this.parts[name].thrust_image_scale, this.parts[name].thrust_image_scale * (0.5 + opts.thrust * 0.5));
        context.translate(this.graphics[this.parts[name].thrust_image_name].width * -0.5, 0);
        this.drawgraphic(context, this.parts[name].thrust_image_name);
        context.restore();
    }
    return true;
}

// Get part size
class_data.prototype.getpartsize = function(name) {
    if(!this.parts[name]) {
        console.log("class_data.getpartsize: " + name + " not registered");
        return false;
    }
    var graphic = this.graphics[this.parts[name].graphic];
    return { 'x': graphic.width, 'y': graphic.height };
}

// Add an image to list
class_data.prototype.addgraphic = function(name, path) {
    if(this.graphics[name]) {
        console.log("class_data.addgraphic: " + name + " already registered");
        return false;
    }
    this.graphics[name] = new Image();
    this.graphics[name].src = path;
    return true;
}

// Draw am image
class_data.prototype.drawgraphic = function(context, name) {
    if(!this.graphics[name]) {
        console.log("class_data.drawgraphic: " + name + " not registered");
        return false;
    }
    context.save();
    context.translate(this.graphics[name].width * -0.5, this.graphics[name].height * -0.5);
    context.drawImage(this.graphics[name], 0, 0);
    context.restore();
    return true;
}
