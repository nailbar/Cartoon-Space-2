
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
    if(this.controls.nextship) {
        this.controls.nextship = 0;
        this.camera.ship_id++;
        if(this.camera.ship_id > this.ships.length) this.camera.ship_id = 0;
    }
    
    // Loop through ships
    for(var i = 0; i < this.ships.length; i++) {
        
        // Draw ship (and do part calculations)
        this.ships[i].draw(context, speed, this.frags);
        
        // Control ship you're looking at
        if(this.camera.ship_id == i && this.controls.timer < 500.0) this.ships[i].control(this.controls);
        else this.ships[i].control(false, i, this.ships, speed);
        
        // Move ship
        this.ships[i].move(speed);
        
        // Remove dead ships
        if(this.ships[i].health <= 0) {
            if(this.camera.ship_id > i) this.camera.ship_id--;
            this.ships.splice(i, 1);
            i--;
        }
    }
    
    // Loop through frags
    for(var i = 0; i < this.frags.length; i++) {
        
        // Draw frag (and do part calculations)
        this.frags[i].draw(context);
        
        // Move frag
        this.frags[i].move(speed, this.ships);
        
        // Check if it hit something
        this.frags[i].hit(this.ships, this.frags);
        
        // Mark frags for removal
        if(this.frags[i].time <= 0) {
            this.frags.splice(i, 1);
            i--;
        }
    }
    
    // Done
    context.restore();
}


















