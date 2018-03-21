import { global_config } from "globals.js"
// import { read_image_to_map } from 'map_converter.js'

// const map_data = random_matrix(
//     global_config.full_map_width,
//     global_config.full_map_height
// )

const map_data = require("game_world_map.json")

function fetch_data(type, options) {
    const dispatch_map = {
        "map_data": function() { return mock_map_data(map_data, options) },
        "user_data": function() { return mock_user_data(options) }
    }

    return dispatch_map[type]()
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

export { fetch_data, map_data, tile_is_walkable }
