
// Default frag class
//  * Parts, particles, projectiles and missiles and stuff
function class_frag(name, position, opts) {
    this.position = position;
    this.velocity = { 'x': 0, 'y': 0 };
    this.rotation = 0;
    this.rotspeed = 0;
    this.normal = { 'x': Math.cos(this.rotation), 'y': Math.sin(this.rotation) };
    this.name = name;
    this.time = 100;
    
    // More details
    
}
