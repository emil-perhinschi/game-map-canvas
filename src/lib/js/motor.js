import { viewport_center } from 'Viewport.js'
import { fetch_data, update} from 'mock_server_data.js'
import { map_palette } from 'globals.js'

function game_tick(ctx, store) {

    const selected_unit = store.units[store.selected_unit.id]

    if (!selected_unit.unit_in_viewport(store, 0)) {
        viewport_center(store, selected_unit.x, selected_unit.y)
    }

    const viewport_map_data = update(
        store.viewport_offset_x,
        store.viewport_offset_y,
        store.viewport_width,
        store.viewport_height
    )

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

export { game_tick }
