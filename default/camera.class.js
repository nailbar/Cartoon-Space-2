
// The camera class
function class_camera() {
    this.mode = 0;
    this.ship_id = 0;
    this.x = 0;
    this.y = 0;
    this.zoom = 1.0;
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
            this.x = ships[this.ship_id].position.x + ships[this.ship_id].velocity.x * 10.0;
            this.y = ships[this.ship_id].position.y + ships[this.ship_id].velocity.y * 10.0;
            this.zoom = 1.0 / (1.0 + (ships[this.ship_id].velocity.x * ships[this.ship_id].velocity.x + ships[this.ship_id].velocity.y * ships[this.ship_id].velocity.y) * 0.004);
        } else this.mode = 0;
        break;
    }
    
    // Set the camera
    context.translate(canvas.width * 0.5, canvas.height * 0.5);
    context.scale(this.zoom, this.zoom);
    context.translate(-this.x, -this.y);
}
