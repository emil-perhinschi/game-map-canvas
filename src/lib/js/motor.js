'use strict'

import { viewport_center } from 'Viewport.js'
import { map_data, fetch_data, update, tile_is_visible } from 'mock_server_data.js'
import { map_palette, debug_info } from 'globals.js'

function game_tick(ctx, store, game_state, tiles) {

    if (store.pointer === null ) {
        const selected_entity_type = store.selected_entity.type
        const selected_entity = store[selected_entity_type][store.selected_entity.id]

        if (!selected_entity.visible_in_viewport(store, 0)) {
            viewport_center(store, selected_entity.x, selected_entity.y)
        }
    } else {
        viewport_center(store, store.pointer.x, store.pointer.y)
    }

    const viewport_map_data = update(
        store.viewport_offset_x,
        store.viewport_offset_y,
        store.viewport_width,
        store.viewport_height
    )

    draw_viewport(ctx, store, viewport_map_data, tiles)
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
                        game_tick(ctx, store, game_state, tiles)
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
    store.units.forEach(
        function (unit) {
            if (unit.visible_in_viewport(store, 0)) {
                if (unit.is_own()) {
                    unit.draw(ctx, store)
                } else if (
                    tile_is_visible(
                        store,
                        unit.x,
                        unit.y
                    )
                ) {
                    unit.draw(ctx, store)
                }
            }
        }
    )
}

function draw_towns(ctx, store) {
    store.towns.map(
        function (town) {
            if (town.visible_in_viewport(store, 0)) {
                if (tile_is_visible(store, town.x, town.y)) {
                    town.is_known(true)
                }

                if (town.is_known()) {
                    town.draw(ctx, store)
                }
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


function get_selected_entity(store, map_data) {
    const type = store.selected_entity.type
    const id = store.selected_entity.id
    return store[type][id]
}


function draw_viewport( ctx, store, map_data, tiles) {

    if ( ctx == null) { return; }

    const entity = get_selected_entity(store, map_data)

    for (let y = 0; y < store.viewport_height; y++) {
        for (let x = 0; x < store.viewport_width; x++) {

            if ( !(y in map_data) || !(x in map_data[y]) ) {
                ctx.fillStyle = "#ffffff" // default is white
                ctx.fillRect(
                    x * store.tile_width,
                    y * store.tile_height,
                    store.tile_width,
                    store.tile_height
                )
                continue
            }

            const terrain_type = map_data[y][x]
            ctx.fillStyle = map_palette[terrain_type]

            ctx.fillRect(
                x * store.tile_width,
                y * store.tile_height,
                store.tile_width,
                store.tile_height
            )

            if (tiles[terrain_type] === undefined ) {
                continue
            }

            if (map_data[y][x] = 0 || map_data[y][x] > 7) {
                // no tiles for these terrains
                continue
            }

            let img = null
            const is_visible = tile_is_visible(
                store,
                // make x and y absolute values, same as entity.x and entity.y
                x + store.viewport_offset_x,
                y + store.viewport_offset_y
            )
            if ( is_visible ) {
                img = tiles[terrain_type][0].cloneNode()
            } else {
                img = tiles[terrain_type][1].cloneNode()
            }

            ctx.drawImage(
                img,
                x * store.tile_width,
                y * store.tile_height
            )

        }
    }
}

function world_map_viewport_details(store) {

    let selected_entity = null

    if (store.pointer ) {
        selected_entity = store.pointer
    } else {
        selected_entity = store[store.selected_entity.type][store.selected_entity.id]
    }

    const center = {
        x: selected_entity.x,
        y: selected_entity.y
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

    return { center, offset, viewport, zoom }
}


function world_map_draw(store) {

    const {
        center,
        offset,
        viewport,
        zoom } = world_map_viewport_details( store )

    const world_map_data = fetch_data(
        "world_map",
        {
            "start_x": offset.x,
            "start_y": offset.y,
            "viewport_width": viewport.width,
            "viewport_height": viewport.height
        }
    )

    const ctx = document.getElementById(
        store.world_map_canvas_id
    ).getContext("2d")
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

export { game_tick, world_map_draw, world_map_viewport_details }
