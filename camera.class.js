
// The camera class
function class_camera() {
    this.mode = 0;
    this.ship_id = 0;
    this.x = 0;
    this.y = 0;
    this.zoom = 0.8;
}

class_camera.prototype.set = function(context, ships) {
    switch(this.mode) {
    
    // Find ship to follow
    case 0:
        this.ship_id = Math.floor(Math.random() * ships.length);
        this.mode = 1;
        break;
    
    // Follow ship
    case 1:
        if(this.ship_id < ships.length) {
            this.x = ships[this.ship_id].position.x;
            this.y = ships[this.ship_id].position.y;
        } else this.mode = 0;
        break;
    }
    
    // Set the camera
    context.translate(canvas.width * 0.5, canvas.height * 0.5);
    context.scale(this.zoom, this.zoom);
    context.translate(-this.x, -this.y);
}
