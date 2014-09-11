
// Default ship hud class
function class_hud() {
}

class_hud.prototype.draw = function(context, you, ships) {
    if(you < 0 || you >= ships.length) return;
    var tmp = {};
    
    // Draw target indicator around targeted ship
    if(ships[you].target >= 0 && ships[you].target < ships.length && ships[you].target != you) {
        context.strokeStyle = "#902";
        
        // Target indicator around enemy ship
        context.lineWidth = 2;
        context.beginPath();
        context.arc(ships[ships[you].target].oldpos.x, ships[ships[you].target].oldpos.y, ships[ships[you].target].size, 0, 2.0 * Math.PI, false);
        context.stroke();
        
        // Target indicator arrow
        tmp.relative = {
            'x': ships[ships[you].target].oldpos.x - ships[you].oldpos.x,
            'y': ships[ships[you].target].oldpos.y - ships[you].oldpos.y
        };
        tmp.distance = Math.sqrt(tmp.relative.x * tmp.relative.x + tmp.relative.y * tmp.relative.y);
        tmp.normal = { 'x': tmp.relative.x / tmp.distance, 'y': tmp.relative.y / tmp.distance };
        tmp.right = { 'x': -tmp.normal.y, 'y': tmp.normal.x };
        context.save();
        context.translate(ships[you].oldpos.x, ships[you].oldpos.y);
        context.beginPath();
        context.moveTo(tmp.normal.x * (ships[you].size + 40), tmp.normal.y * (ships[you].size + 40));
        context.lineTo(tmp.normal.x * (ships[you].size + 15) + tmp.right.x * 5.0, tmp.normal.y * (ships[you].size + 15) + tmp.right.y * 5.0);
        context.lineTo(tmp.normal.x * (ships[you].size + 18), tmp.normal.y * (ships[you].size + 18));
        context.lineTo(tmp.normal.x * (ships[you].size + 15) - tmp.right.x * 5.0, tmp.normal.y * (ships[you].size + 15) - tmp.right.y * 5.0);
        context.closePath();
        context.stroke();
        context.restore();
    }
}





















