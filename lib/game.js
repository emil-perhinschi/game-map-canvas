
var gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 1, 0, 0, 0, 1, 1, 0,
    0, 1, 0, 1, 0, 1, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

const tile_width = 40, tile_height = 40;
const map_width = 10, map_height = 10;
let current_second = 0
let frame_count = 0
let frames_last_second = 0;
const max_frame_rate = 30;

window.onload = function() {
    const ctx = document.getElementById('game').getContext("2d");

    const game_loop_config = {
        "max_fps": 10 // max fps
    }

    game_loop(ctx, game_loop_config);
};

function game_loop(ctx, game_loop_config) {

    update();
    draw_viewport(ctx);

    const time = Date.now();
    const sec = Math.floor( time / 1000 );
    if ( sec != current_second ) {
        current_second = sec;
        frames_last_second = frame_count;
        frame_count = 1;
    } else {
        frame_count++;
    }

    ctx.fillStyle = "#ff0000";
    ctx.fillText("FPS: " + frames_last_second, 10, 20);

    window.requestAnimationFrame( function() { game_loop(ctx, game_loop_config) } );
}

function update() {

}

function draw_viewport( ctx ) {

    if ( ctx == null) { return; }

    for (let y = 0; y < map_height; ++y) {
        for (let x = 0; x < map_width; ++x) {
            switch (gameMap[(( y * map_width ) + x)]) {
                case 0:
                    ctx.fillStyle = "grey";
                    break;
                default:
                    ctx.fillStyle = "blue";
            }
            ctx.fillRect( x * tile_width, y * tile_height, tile_width, tile_height);
        }
    }
}
