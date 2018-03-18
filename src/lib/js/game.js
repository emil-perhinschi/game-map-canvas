import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { fetch_data, map_data } from 'fetch_data.js'

import { global_config } from 'global_config.js'

let current_second = 0
let frame_count = 0
let frames_last_second = 0

window.onload = function() {
    const ctx_viewport = document.getElementById('game').getContext("2d")
    const ctx_full_map = document.getElementById('full_map').getContext("2d")

    const redraw = function() {
        window.requestAnimationFrame(
            function() {
                draw_full_map(ctx_full_map, map_data)
            }
        )

        const game_map_data = update();
        game_loop(ctx_viewport, game_map_data);
    }

    document.onkeydown = function (e) {
        const move_keys = {
            "ArrowUp": function() {
                if (global_congig.viewport_offset_y > 0) {
                    global_config.viewport_offset_y--
                    redraw()
                }
            },
            "ArrowDown": function() {
                if (global_config.viewport_offset_y < global_config.full_map_height) {
                    global_config.viewport_offset_y++
                    redraw()
                }
            },
            "ArrowLeft": function() {
                if (global_config.viewport_offset_x > 0) {
                    global_config.viewport_offset_x--
                    redraw()
                }
            },
            "ArrowRight": function() {
                if (global_config.viewport_offset_x < global_config.full_map_width) {
                    global_config.viewport_offset_x++
                    redraw()
                }
            },
        }

        if (e.key in move_keys) {
            console.log(e.key)
            move_keys[e.key]()
            e.stopPropagation()
        }
    }

    redraw()
}

function draw_full_map(ctx_full_map, map) {

    draw_viewport(
        ctx_full_map,
        map,
        {
            "viewport_height": global_config.full_map_height,
            "viewport_width": global_config.full_map_width,
            "tile_height": global_config.tile_height,
            "tile_width": global_config.tile_width
        }
    )
    ctx_full_map.rect(
        global_config.viewport_offset_x * global_config.tile_width,
        global_config.viewport_offset_y * global_config.tile_height,
        global_config.viewport_width * global_config.tile_width,
        global_config.viewport_height * global_config.tile_height
    )
    ctx_full_map.strokeStyle = "red";
    ctx_full_map.stroke()
}

function game_loop(ctx, game_map_data) {

    // if viewport changes reupdate game_map_data

    draw_viewport(ctx, game_map_data);

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
    setTimeout(
        function() {
            window.requestAnimationFrame(
                function() { game_loop(ctx, game_map_data) }
            )
        },
        Math.ceil(1000/global_config.max_fps)
    )
}

function update() {
    return fetch_data(
        "map_data",
        {
            "start_x": global_config.viewport_offset_x,
            "start_y": global_config.viewport_offset_y,
            "viewport_width": global_config.viewport_width,
            "viewport_height": global_config.viewport_height
        }
    )
}

function draw_viewport( ctx, game_map_data) {

    if ( ctx == null) { return; }

    for (let y = 0; y < global_config.viewport_height; ++y) {
        for (let x = 0; x < global_config.viewport_width; ++x) {
            switch (game_map_data[y][x]) {
                case 0:
                    ctx.fillStyle = "grey";
                    break;
                default:
                    ctx.fillStyle = "blue";
            }
            ctx.fillRect(
                x * global_config.tile_width,
                y * global_config.tile_height,
                global_config.tile_width,
                global_config.tile_height
            );
        }
    }
}
