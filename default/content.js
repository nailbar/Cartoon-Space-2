
// Add default content
function init_content() {
    
    // Register frags
    data.addfrag("default_blast", "default_blast", "default/blast.png", {
        'type': "projectile",
        'time': 100.0,
        'speed': 20.0,
        'idle': 10.0
    });
    
    // Register parts
    data.addpart("default_hull", "default_hull", "default/hull.png", { 'weight': 4.0 });
    data.addpart("default_cockpit", "default_cockpit", "default/cockpit.png", { 'weight': 1.5 });
    data.addpart("default_thruster", "default_thruster", "default/thruster.png", {
        'weight': 2.0,
        'thrust': 5.0,
        'thrust_image_name': "default_thrustflame",
        'thrust_image_path': "default/thrustflame.png"
    });
    data.addpart("default_blaster", "default_blaster", "default/blaster.png", {
        'weight': 0.6,
        'projectile_name': "default_blast",
        'load_time': 10.0,
        'lock_time': 0 // This is for missiles
    });
    
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
}


















