
// Default game control class
function class_game(context) {
    
    // Game variables
    this.ships = [];
    
    // Register parts
    data.addpart("default_hull", "default_hull", "default/hull.png", { 'weight': 4.0 });
    data.addpart("default_cockpit", "default_cockpit", "default/cockpit.png", { 'weight': 1.5 });
    data.addpart("default_thruster", "default_thruster", "default/thruster.png", {
        'weight': 2.0,
        'thrust': 10.0,
        'thrust_image_name': "default_thrustflame",
        'thrust_image_path': "default/thrustflame.png"
    });
    data.addpart("default_blaster", "default_blaster", "default/blaster.png", { 'weight': 0.6 });
    
    // Register ship models
    data.addship("default_ship1", [
        { 'name': "default_thruster", 'position': { 'x': -35, 'y': 0 } },
        { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 } },
        { 'name': "default_blaster", 'position': { 'x': 40, 'y': 0 } },
        { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 } }
    ]);
    data.addship("default_ship2", [
        { 'name': "default_thruster", 'position': { 'x': -25, 'y': -10 } },
        { 'name': "default_thruster", 'position': { 'x': -25, 'y': 10 } },
        { 'name': "default_blaster", 'position': { 'x': -10, 'y': -30 } },
        { 'name': "default_blaster", 'position': { 'x': -10, 'y': 30 } },
        { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 } },
        { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 } }
    ]);
    
    // Populate ships array
    var tmp = {};
    for(var i = 0; i < 10; i++) {
        tmp.type = Math.random();
        if(tmp.type < 0.8) tmp.type = "default_ship1";
        else tmp.type =  "default_ship2";
        this.ships.push(new class_ship(tmp.type, {
            'position': { 'x': Math.random() * canvas.width, 'y': Math.random() * canvas.height },
            'rotation': Math.random() * Math.PI * 2.0
        }));
    }
}

// Main game loop
class_game.prototype.loop = function(context, speed) {
    
    // Clear level
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Loop through ships
    context.save();
    context.scale(0.5, 0.5);
    context.translate(canvas.width * 0.5, canvas.height * 0.5);
    for(var i = 0; i < this.ships.length; i++) {
        
        // Draw ship
        this.ships[i].draw(context);
        
        // Move ship
        this.ships[i].move(speed);
    }
    context.restore();
}


















