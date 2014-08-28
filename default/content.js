
// Add default content
function init_content() {
    
    // Register frags
    data.addfrag("default_part", "", "", { 'speed': 5.0, 'time': 200.0 }); // This is for displaying lost ship parts
    data.addfrag("default_blast", "default_blast", "default/blast.png", {
        'type': "projectile",
        'time': 100.0,
        'speed': 30.0,
        'idle': 5.0,
        'damage': 1.5
    });
    data.addfrag("default_frag", "default_frag", "default/frag.png", {
        'type': "projectile",
        'time': 40.0,
        'damage': 1.5
    });
    data.addfrag("default_missile", "default_missile", "default/missile.png", {
        'type': "missile",
        'time': 200.0,
        'speed': 3.0,
        'idle': 10.0,
        'damage': 8.0,
        'thrust_image_name': "default_thrustflame",
        'thrust_image_path': "default/thrustflame.png",
        'thrust_image_scale': 0.6,
        'frags': "default_frag"
    });
    
    // Register parts
    data.addpart("default_hull", "default_hull", "default/hull.png", { 'weight': 4.0 });
    data.addpart("default_cockpit", "default_cockpit", "default/cockpit.png", { 'weight': 1.5 });
    data.addpart("default_thruster", "default_thruster", "default/thruster.png", {
        'weight': 2.0,
        'thrust': 7.0,
        'thrust_image_name': "default_thrustflame",
        'thrust_image_path': "default/thrustflame.png"
    });
    data.addpart("default_blaster", "default_blaster", "default/blaster.png", {
        'weight': 0.6/*,
        'projectile_name': "default_blast",
        'load_time': 10.0*/
    });
    data.addpart("default_launcher", "default_launcher", "default/launcher.png", {
        'weight': 1.5,
        'projectile_name': "default_missile",
        'load_time': 80.0,
        'lock_time': 70.0
    });
    
    // Register ship models
//     data.addship("default_ship1", [
//         { 'name': "default_thruster", 'position': { 'x': -35, 'y': 0 }, 'parent': 1 },
//         { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 }, 'parent': 1 },
//         { 'name': "default_blaster", 'position': { 'x': 40, 'y': 0 }, 'parent': 1 },
//         { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 }, 'parent': 1 }
//     ]);
//     data.addship("default_ship2", [
//         { 'name': "default_thruster", 'position': { 'x': -35, 'y': 0 }, 'parent': 3 },
//         { 'name': "default_blaster", 'position': { 'x': -10, 'y': -30 }, 'parent': 3 },
//         { 'name': "default_blaster", 'position': { 'x': -10, 'y': 30 }, 'parent': 3 },
//         { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 }, 'parent': 3 },
//         { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 }, 'parent': 3 }
//     ]);
//     data.addship("default_ship3", [
//         { 'name': "default_thruster", 'position': { 'x': -25, 'y': -10 }, 'parent': 2 },
//         { 'name': "default_thruster", 'position': { 'x': -25, 'y': 10 }, 'parent': 2 },
//         { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 }, 'parent': 2 },
//         { 'name': "default_blaster", 'position': { 'x': 40, 'y': 0 }, 'parent': 2 },
//         { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 }, 'parent': 2 }
//     ]);
//     data.addship("default_ship4", [
//         { 'name': "default_thruster", 'position': { 'x': -25, 'y': -10 }, 'parent': 4 },
//         { 'name': "default_thruster", 'position': { 'x': -25, 'y': 10 }, 'parent': 4 },
//         { 'name': "default_blaster", 'position': { 'x': -10, 'y': -30 }, 'parent': 4 },
//         { 'name': "default_blaster", 'position': { 'x': -10, 'y': 30 }, 'parent': 4 },
//         { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 }, 'parent': 4 },
//         { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 }, 'parent': 4 }
//     ]);
    data.addship("default_ship5", [
        { 'name': "default_thruster", 'position': { 'x': -25, 'y': -10 }, 'parent': 4 },
        { 'name': "default_thruster", 'position': { 'x': -25, 'y': 10 }, 'parent': 4 },
        { 'name': "default_blaster", 'position': { 'x': -10, 'y': -30 }, 'parent': 4 },
        { 'name': "default_blaster", 'position': { 'x': -10, 'y': 30 }, 'parent': 4 },
        { 'name': "default_hull", 'position': { 'x': 0, 'y': 0 }, 'parent': 4 },
        { 'name': "default_launcher", 'position': { 'x': 40, 'y': 0 }, 'parent': 4 },
        { 'name': "default_cockpit", 'position': { 'x': -7, 'y': 0 }, 'parent': 4 }
    ]);
}


















