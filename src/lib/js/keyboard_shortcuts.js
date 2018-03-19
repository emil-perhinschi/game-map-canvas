import { global_config } from 'global_config.js'

const keyboard_shortcuts = {
    "k": function() {
        if (global_config.viewport_offset_y > 0) {
            global_config.viewport_offset_y--
        }
    },
    "j": function() {
        if ( global_config.viewport_offset_y + global_config.viewport_height
                < global_config.full_map_height
            ) {
            global_config.viewport_offset_y++
        }
    },
    "h": function() {
        if (global_config.viewport_offset_x > 0) {
            global_config.viewport_offset_x--
        }
    },
    "l": function() {
        if ( global_config.viewport_offset_x + global_config.viewport_width
                < global_config.full_map_width
            ) {
            global_config.viewport_offset_x++
        }
    },
    "K": function() {
        if (global_config.viewport_offset_y > 10) {
            global_config.viewport_offset_y -= 10
        }
    },
    "J": function() {
        if ( global_config.viewport_offset_y + global_config.viewport_height
                < global_config.full_map_height - 11
            ) {
            global_config.viewport_offset_y += 10
        }
    },
    "H": function() {
        if (global_config.viewport_offset_x > 10) {
            global_config.viewport_offset_x -= 10
        }
    },
    "L": function() {
        if ( global_config.viewport_offset_x + global_config.viewport_width
                < global_config.full_map_width - 10
            ) {
            global_config.viewport_offset_x += 10
        }
    },
}

export { keyboard_shortcuts }
