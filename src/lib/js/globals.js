const frames = {
    "current_second": 0,
    "frame_count": 0,
    "frames_last_second": 0
}

const store = {
    "frames": frames,
    "max_fps": 5,
    "tile_width": 64,
    "tile_height": 64,
    "viewport_offset_x": 0,
    "viewport_offset_y": 0,
    "viewport_width": 13,
    "viewport_height": 13,
    "full_map_width": 400,
    "full_map_height": 400,
    "units": [],
    "selected_unit": {
        "id": 0
    },
    "on_move" : function() {
        throw( new Error("no on_move action was set in globals") )
    }
}
module.exports.store = store

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
