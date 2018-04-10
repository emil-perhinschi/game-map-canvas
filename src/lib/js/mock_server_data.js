/*
 * pretend we have a server
*/

// import { global_config } from "globals.js"
// import { read_image_to_map } from 'map_converter.js'
// const map_data = random_matrix(
//     global_config.full_map_width,
//     global_config.full_map_height
// )

const map_data = require("game_world_map.json")

function fetch_data(type, options) {
    const dispatch_map = {
        "map_data": function() { return mock_map_data(map_data, options) },
        "user_data": function() { return mock_user_data(options) },
        "world_map": function() { return mock_world_data(map_data, options)}
    }

    return dispatch_map[type]()
}

function mock_world_data(map_data, options) {
    // mocking for now, when using a server will do something else
    // probably get a lot less info since the world map data will contain
    // less information, only towns probably
    return mock_map_data(map_data, options)
}

function mock_map_data(original_map_data, options) {
    const start_x = options.start_x
    const start_y = options.start_y
    const end_x = start_x + options.viewport_width
    const end_y = start_y + options.viewport_height

    return get_array_window(original_map_data, start_x, end_x, start_y, end_y)
}

function get_array_window(original, start_x, end_x, start_y, end_y) {

    if (start_x >= end_x)
        throw "start_x should be smaller than end_x"
    if (start_y >= end_y)
        throw "start_y should be smaller than end_y"

    return Array.from(
        original.slice(start_y, end_y),
        (row) => row.slice(start_x, end_x)
    )
}

function mock_user_data(options) {

}

function random_matrix( x_count, y_count) {
    return Array.from(
        Array(y_count),
        () => Array.from(
            Array(x_count),
            () => Math.round(Math.random())
        )
    )
}

function tile_is_walkable(map_data, x, y) {
    // if not sea or high mountain
    if ( map_data[y][x] < 1 ) {
        return { success: false, reason: "cannot walk on water" }
    }

    if ( map_data[y][x] > 12 ) {
        return { success: false, reason: "these mountains are impassable" }
    }

    return { success: true, reason: "good ground for walking" }
}


// pretend we load visible map from the server
function update(offset_x, offset_y, width, height ) {

    return fetch_data(
        "map_data",
        {
            "start_x": offset_x,
            "start_y": offset_y,
            "viewport_width": width,
            "viewport_height": height
        }
    )
}

function tile_is_visible(store, tile_x, tile_y) {
    // foreach owned unit check if it can see the tile coordinates
    let is_visible = false
    for (let i = 0; i < store.units.length; i++) {
        const unit = store.units[i]
        if (!unit.own === true) {
            continue
        }

        if (unit_can_see_tile(
                unit, store.visibility_distance,
                tile_x, tile_y
            )
        ) {
            is_visible = true
            break
        }
    }
    return is_visible
}

function unit_can_see_tile(unit, max_distance, tile_x, tile_y) {
    const x_distance = Math.abs( tile_x - unit.x )
    const y_distance = Math.abs( tile_y - unit.y )

    if ( // first do the cheap computations
        x_distance > max_distance || y_distance > max_distance
    ) {
        return false
    } else {
        if (
            Math.floor(
                Math.sqrt(
                    Math.pow(x_distance, 2)
                    + Math.pow(y_distance, 2)
                )
            ) > 3
        ) {
            return false
        } else {
            return true
        }
    }
}

export { fetch_data, map_data, tile_is_walkable, update, tile_is_visible }
