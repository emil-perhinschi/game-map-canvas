const frames = {
    "current_second": 0,
    "frame_count": 0,
    "frames_last_second": 0
}

// ... need to replace this, can't make it const
module.exports.store = {
    "sprites": {},
    "frames": frames,
    "max_fps": 5,
    "tile_width": 64,
    "tile_height": 64,
    "viewport_offset_x": 0,
    "viewport_offset_y": 0,
    "viewport_width": 13,// in tiles
    "viewport_height": 13,// in tiles
    "full_map_width": 400,// in tiles
    "full_map_height": 400,// in tiles
    "world_map_width": 400,// in tiles
    "world_map_height": 400, // in tiles
    "world_map_container_width": 400, // in pixels
    "world_map_container_height": 400, // in pixels
    "world_map_zoom": 10, // how many pixels per tile in the world map container
    "units": [],
    "selected_unit": {
        "id": 0
    },
    "on_move" : function() {
        throw( new Error("no on_move action was set in globals") )
    }
}

module.exports.debug_info = {
    "show": true
}

module.exports.game_state = {
    "paused": false
}
const map_palette = [
    "#17577e",
    "#3d6c42",
    "#3f6e42",
    "#477340",
    "#527b3e",
    "#61853b",
    "#729038",
    "#8fa433",
    "#afba2d",
    "#b8c02b",
    "#a9a62a",
    "#8d7329",
    "#754727",
    "#6b3527",
    "#83564a",
    "#c3ada7"
]
module.exports.map_palette = map_palette

//
//
// class GlobalConfig {
//     constructor() {
//         this.max_fps = 5
//         this.tile_width = 20
//         this.tile_height = 20
//         this.viewport_offset_x = 6
//         this.viewport_offset_y = 6
//         this.viewport_width = 10
//         this.viewport_height = 10
//         this.full_map_width = 100
//         this.full_map_height = 100
//     }
// }
//
// module.global_config =  new GlobalConfig()
