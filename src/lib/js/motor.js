'use strict'

import { viewport_center } from 'Viewport.js'
import { map_data, fetch_data, update } from 'mock_server_data.js'
import { map_palette, debug_info } from 'globals.js'

function game_tick(ctx, store, game_state) {

    const selected_entity_type = store.selected_entity.type
    const selected_entity = store[selected_entity_type][store.selected_entity.id]

    if (!selected_entity.visible_in_viewport(store, 0)) {
        viewport_center(store, selected_entity.x, selected_entity.y)
    }

    const viewport_map_data = update(
        store.viewport_offset_x,
        store.viewport_offset_y,
        store.viewport_width,
        store.viewport_height
    )

    draw_viewport(ctx, store, viewport_map_data)
    draw_units(ctx, store)
    draw_towns(ctx, store)

    if ( game_state.paused === true ) {
        ui_msg("game paused")
        // check every second if the game was unpaused
        game_paused_check(ctx, store, game_state)
    } else {
        draw_debug_info(ctx, store)
        setTimeout(
            function() {
                window.requestAnimationFrame(
                    function() {
                        game_tick(ctx, store, game_state)
                    }
                )
            },
            Math.ceil(1000/store.max_fps)
        )
    }
}

function game_paused_check(ctx, store, game_state) {
    ctx.fillStyle = "#ff0000"
    ctx.font = "80px Arial"
    ctx.fillText("GAME PAUSED", 10, 150)
    if ( game_state.paused === false ) {
        window.requestAnimationFrame(
            function() {
                game_tick(ctx, store, game_state)
            }
        )
    } else {
        setTimeout(
            window.requestAnimationFrame(
                function() { game_paused_check(ctx, store, game_state) }
            ),
            1000
        )
    }
}

function draw_debug_info( ctx, store) {
    if (debug_info.show === true) {
        draw_fps(ctx, store)
        draw_viewport_info(ctx, store)
        draw_selected_entity_info(ctx, store)
        draw_diagonals(ctx, store)
    }
}

function draw_units(ctx, store) {
    store.units.map(
        function (unit) {
            // if( store.selected_entity["unit"].id === unit.id ) {
            //     return false
            // }
            // unit = store.units[unit_id]
            if (unit.visible_in_viewport(store, 0)) {
                unit.draw(ctx, store)
            }
        }
    )
}

function draw_towns(ctx, store) {
    store.towns.map(
        function (town) {
            if (town.visible_in_viewport(store, 0)) {
                town.draw(ctx, store)
            }
        }
    )
}


function draw_selected_entity_info(ctx, store) {
    const selected_entity_type = store.selected_entity.type
    const selected_entity = store[selected_entity_type][store.selected_entity.id]
    ctx.fillStyle = "#000000"
    ctx.font = "20px Arial";
    ctx.fillText(
        "Selected " + selected_entity_type + " is at: "
            + selected_entity.x
            + " "
            + selected_entity.y,
        10,60
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
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(
        0,
        store.viewport_height * store.tile_height
    )
    ctx.lineTo(
        store.viewport_width * store.tile_width,
        0)
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

function world_map_draw(store) {
    const center = {
        x: store[store.selected_entity.type][store.selected_entity.id].x,
        y: store[store.selected_entity.type][store.selected_entity.id].y
    }

    const zoom = store.world_map_zoom // how wide is the tile

    const viewport = { // size in tiles
        width: Math.floor(store.world_map_container_width / zoom),
        height: Math.floor(store.world_map_container_height / zoom)
    }

    const offset = { // in tiles
        x: center.x - Math.floor(viewport.width/2),
        y: center.y - Math.floor(viewport.height/2)
    }

    if (offset.x < 0) {
        offset.x = 0
    }

    if (offset.y < 0) {
        offset.y = 0
    }

    const world_map_data = fetch_data(
        "world_map",
        {
            "start_x": offset.x,
            "start_y": offset.y,
            "viewport_width": viewport.width,
            "viewport_height": viewport.height
        }
    )

    const ctx = document.getElementById("world_map_canvas").getContext("2d")
    for (let y = 0; y < viewport.height; y++) {
        for (let x = 0; x < viewport.width; x++) {
            ctx.fillStyle = "#ffffff" // default is white
            if (y in world_map_data && x in world_map_data[y]) {
                ctx.fillStyle = map_palette[world_map_data[y][x]]
            }
            ctx.fillRect(
                x * zoom,
                y * zoom,
                1 * zoom,
                1 * zoom
            );
        }
    }

    // draw the contour of the viewport
    const viewport_on_worldmap = {
        x: (center.x - offset.x - Math.floor(store.viewport_width/2 )) * zoom,
        y: (center.y - offset.y - Math.floor(store.viewport_height/2)) * zoom
    }
    ctx.beginPath()
    ctx.strokeStyle = "#00ff00"
    ctx.rect(
        viewport_on_worldmap.x,
        viewport_on_worldmap.y,
        store.viewport_width  * zoom,
        store.viewport_height * zoom
    )
    ctx.stroke()

    // draw towns
    const town_marker_size = zoom >= 5 ? zoom : 5;
    store.towns.forEach(
        function(town) {
            if (town.in_viewport(offset, viewport)) {
                ctx.fillStyle = "#FF0000"
                ctx.fillRect(
                    ( town.x - offset.x ) * zoom,
                    ( town.y - offset.y ) * zoom,
                    town_marker_size, town_marker_size
                )
            }
        }
    )

}

export { game_tick, world_map_draw }
