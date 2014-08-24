
// Default game control class
function class_game(context) {
    
    // Game variables
    this.ships = [];
    this.camera = new class_camera();
    
    // Populate ships array with random ships
    var tmp = {};
    for(var i = 0; i < 10; i++) {
        tmp.type = Math.floor(data.shiplist.length * Math.random());
        tmp.type = data.shiplist[tmp.type];
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
    this.camera.set(context, this.ships);
    for(var i = 0; i < this.ships.length; i++) {
        
        // Draw ship
        this.ships[i].draw(context);
        
        // Move ship
        this.ships[i].move(speed);
    }
    context.restore();
}


















