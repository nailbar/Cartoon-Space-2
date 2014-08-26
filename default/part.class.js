
// The part class
function class_part(name, position) {
    this.name = name;
    this.position = { 'x': position.x, 'y': position.y };
    this.loaded = 0;
    this.locked = 0;
}

class_part.prototype.draw = function(context, opts) {
    context.save();
    context.translate(this.position.x, this.position.y);
    data.drawpart(context, this.name, opts);
    context.restore();
}

class_part.prototype.getthrust = function() {
    return data.parts[this.name].thrust;
}

class_part.prototype.getweight = function() {
    return data.parts[this.name].weight;
}

class_part.prototype.calculate = function(speed) {
    if(this.loaded > 0) this.loaded -= speed;
}
