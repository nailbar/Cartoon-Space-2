
// Default game control class
function class_game(context) {
    
    // Game variables
    this.ships = [];
    this.frags = [];
    this.camera = new class_camera();
    this.controls = new class_controls();
    
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
    context.save();
    this.camera.set(context, this.ships);
    this.controls.tick(speed);
    
    // Loop through ships
    for(var i = 0; i < this.ships.length; i++) {
        
        // Draw ship (and do part calculations)
        this.ships[i].draw(context, speed, this.frags);
        
        // Control ship
        if(this.camera.ship_id == i) this.ships[i].control(this.controls);
        
        // Move ship
        this.ships[i].move(speed);
    }
    
    // Loop through frags
    for(var i = 0; i < this.frags.length; i++) {
        
        // Draw frag (and do part calculations)
        this.frags[i].draw(context);
        
        // Move frag
        this.frags[i].move(speed);
    }
    
    // Done
    context.restore();
}


















