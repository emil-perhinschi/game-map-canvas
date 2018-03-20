import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { fetch_data, map_data } from 'fetch_data.js'
import { keyboard_shortcuts } from 'keyboard_shortcuts.js'
import { global_config, map_palette } from 'global_config.js'



let current_second = 0
let frame_count = 0
let frames_last_second = 0


window.onload = function() {
    const ctx_viewport = document.getElementById('game').getContext("2d")

    document.onkeydown = function (e) {
        const move_keys = keyboard_shortcuts;

        if (e.key in move_keys) {
            console.log(e.key)
            move_keys[e.key]()
            e.stopPropagation()
        }
    }
    const unit_x = global_config.viewport_offset_x + global_config.viewport_width/2;
    const unit_y = global_config.viewport_offset_y + global_config.viewport_height/2;
    const unit = new Unit(unit_x, unit_y)
    game_tick(ctx_viewport, unit);
    document.getElementById('map_container').focus()
}

function game_tick(ctx, unit) {

    const viewport_map_data = update()
    draw_viewport(ctx, viewport_map_data);
    unit.move(global_config)
    
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
    ctx.fillText(
        "Offset: "
            + global_config.viewport_offset_x
            + " "
            + global_config.viewport_offset_y,
        10,30
        )

    ctx.fillText(
        "Selected unit is at: "
            + unit.x
            + " "
            + unit.y,
        10,40
        )

    unit.draw(ctx, global_config)

    ctx.beginPath()
    ctx.moveTo(0,0)
    ctx.lineTo(
        global_config.viewport_width * global_config.tile_width,
        global_config.viewport_height * global_config.tile_height
    )
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(
        0,
        global_config.viewport_height * global_config.tile_height
    )
    ctx.lineTo(
        global_config.viewport_width * global_config.tile_width,
        0)
    ctx.closePath()
    ctx.stroke()

    setTimeout(
        function() {
            window.requestAnimationFrame(
                function() { game_tick(ctx, unit) }
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

function draw_viewport( ctx, map_data) {

    if ( ctx == null) { return; }

    for (let y = 0; y < global_config.viewport_height; ++y) {
        for (let x = 0; x < global_config.viewport_width; ++x) {
            // switch (map_data[y][x]) {
            //     case 0:
            //         ctx.fillStyle = "grey";
            //         break;
            //     default:
            //         ctx.fillStyle = "blue";
            // }
            ctx.fillStyle = map_palette[map_data[y][x]]
            ctx.fillRect(
                x * global_config.tile_width,
                y * global_config.tile_height,
                global_config.tile_width,
                global_config.tile_height
            );
        }
    }
}
