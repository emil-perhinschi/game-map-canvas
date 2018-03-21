import { Map } from 'Map.js'
import { Unit } from 'Unit.js'
import { fetch_data, map_data } from 'fetch_data.js'
import { keyboard_shortcuts } from 'keyboard_shortcuts.js'
import { store, map_palette } from 'globals.js'
import utils from 'misc_not_mine.js'


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

    // mock some units
    for (let unit_id = 0; unit_id < 10; unit_id++ ) {
        const x = utils.get_random_int(store.full_map_width)
        const y = utils.get_random_int(store.full_map_height)
        store.units[unit_id.toString()] = new Unit(unit_id, x, y)
    }

    game_tick(ctx_viewport, store);
    document.getElementById('map_container').focus()
}

function viewport_center(store, x, y) {

    const offset_x_min = 0
    const offset_x_max = store.full_map_width - store.viewport_width
    const offset_y_min = 0
    const offset_y_max = store.full_map_height - store.viewport_height

    const x_new = x - Math.floor( store.viewport_width / 2 )
    const y_new = y - Math.floor( store.viewport_height / 2 )
    store.viewport_offset_x = x_new < offset_x_min
        ? offset_x_min
        : x_new > offset_x_max
            ? offset_x_max
            : x_new
    store.viewport_offset_y = y_new < offset_y_min
        ? offset_y_min
        : y_new > offset_y_max
            ? offset_y_max
            : y_new
}

function game_tick(ctx, store) {

    const selected_unit = store.units[store.selected_unit.id]

    if (!selected_unit.unit_in_viewport(store, 0)) {
        viewport_center(store, selected_unit.x, selected_unit.y)
    }

    const viewport_map_data = update()
    draw_viewport(ctx,store, viewport_map_data);
    draw_units(ctx, store)
    draw_fps(ctx, store)
    draw_viewport_info(ctx, store)
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial";
    ctx.fillText(
        "Selected unit is at: "
            + selected_unit.x
            + " "
            + selected_unit.y,
        10,60
        )

    draw_diagonals(ctx, store)

    setTimeout(
        function() {
            window.requestAnimationFrame(
                function() { game_tick(ctx, store) }
            )
        },
        Math.ceil(1000/store.max_fps)
    )
}

function draw_units(ctx, store) {
    store.units.map(
        function (unit) {
            // if( store.selected_unit.id === unit.id ) {
            //     return false
            // }
            // unit = store.units[unit_id]
            if (unit.unit_in_viewport(store, 0)) {
                unit.draw(ctx, store)
            }
        }
    )
}

function draw_fps(ctx, store) {
    const time = Date.now();
    const sec = Math.floor( time / 1000 );
    if ( sec != store.frames.current_second ) {
        store.frames.current_second = sec;
        store.frames.frames_last_second = store.frames.frame_count;
        store.frames.frame_count = 1;
    } else {
        store.frames.frame_count++;
    }

    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText("FPS: " + store.frames.frames_last_second, 10, 20);
}

function draw_viewport_info(ctx, store) {
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.fillText(
        "Offset: "
            + store.viewport_offset_x
            + " "
            + store.viewport_offset_y,
        10,40
    )
}




function draw_diagonals(ctx, store) {
    ctx.fillStyle = "#ff0000";
    ctx.beginPath()
    ctx.moveTo(0,0)
    ctx.lineTo(
        store.viewport_width * store.tile_width,
        store.viewport_height * store.tile_height
    )
    ctx.closePath()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(
        0,
        store.viewport_height * store.tile_height
    )
    ctx.lineTo(
        store.viewport_width * store.tile_width,
        0)
    ctx.closePath()
    ctx.stroke()

}

function update() {
    return fetch_data(
        "map_data",
        {
            "start_x": store.viewport_offset_x,
            "start_y": store.viewport_offset_y,
            "viewport_width": store.viewport_width,
            "viewport_height": store.viewport_height
        }
    )
}

function draw_viewport( ctx, store, map_data) {

    if ( ctx == null) { return; }

    for (let y = 0; y < store.viewport_height; y++) {
        for (let x = 0; x < store.viewport_width; x++) {

            ctx.fillStyle = "#ffffff" // default is white
            if (y in map_data && x in map_data[y]) {
                ctx.fillStyle = map_palette[map_data[y][x]]
            }
            ctx.fillRect(
                x * store.tile_width,
                y * store.tile_height,
                store.tile_width,
                store.tile_height
            );
        }
    }
}
