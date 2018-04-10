'use strict';

const frames = {
    "current_second": 0,
    "frame_count": 0,
    "frames_last_second": 0
}

// ... need to replace this, can't make it const
module.exports.store = {
    "center_on_move": false,
    "sprites": {},
    "frames": frames,
    "max_fps": 5,
    "tile_width": 64,
    "tile_height": 64,
    "viewport_offset_x": 0,
    "viewport_offset_y": 0,
    "viewport_width": 13,// in tiles
    "viewport_height": 13,// in tiles
    "full_map_width": 600,// in tiles
    "full_map_height": 600,// in tiles
    "world_map_canvas_id": "world_map_canvas",
    "world_map_width": 1600,// in tiles
    "world_map_height": 1600, // in tiles
    "world_map_container_width": 600, // in pixels
    "world_map_container_height": 600, // in pixels
    "world_map_zoom": 2, // how many pixels per tile in the world map container
    "units": [],
    "towns": [],
    // use when clicking on the world map to pan around
    //   if not null then the user clicked on the world map and the viewport
    //   should center on that point
    "pointer": null,
    "selected_entity": {
        "id" : 0,
        // valid types so far:
        //    units: when a unit is selected
        //    towns: when selecting a town
        "type" : "units" // by default the first unit is selected
    },
    "selected": function() {
        return this[this.selected_entity.type][this.selected_entity.id]
    },
    "on_move" : function() {
        throw( new Error("no on_move action was set in globals") )
    },
    "visibility_distance": 3,
    "game_state": {
        "paused": false
    },
    "redraw_all": undefined, // will be initialized with a function
    "turn_no": 0
}

module.exports.debug_info = {
    "show": true
}

const map_palette_init = [
    [ 23,  87, 126], //"#17577e"
    [ 61, 108,  66], //"#3d6c42"
    [ 63, 110,  66], //"#3f6e42"
    [ 71, 115,  64], //"#477340"
    [ 82, 123,  62], //"#527b3e"
    [ 97, 133,  59], //"#61853b"
    [114, 144,  56], //"#729038"
    [143, 164,  51], //"#8fa433"
    [175, 186,  45], //"#afba2d"
    [184, 192,  43], //"#b8c02b"
    [169, 166,  42], //"#a9a62a"
    [141, 115,  41], //"#8d7329"
    [117,  71,  39], //"#754727"
    [107,  53,  39], //"#6b3527"
    [131,  86,  74], //"#83564a"
    [195, 173, 167]  //"#c3ada7"
]

function rgb_to_string(rgb, change) {
    if (
        Number.isInteger(change)
        && change >= -255
        && change <= 255
    ) {
        rgb = rgb.map( value => value + change >= 0 ? value + change : 0)
    }
    return "rgb(" + rgb.join(",") + ")"
}
const map_palette = map_palette_init.map(
    rgb_value => rgb_to_string(rgb_value)
)
const map_palette_dark = map_palette_init.map(
    rgb_value => rgb_to_string(rgb_value, -30)
)
module.exports.map_palette = map_palette
module.exports.map_palette_dark = map_palette_dark

console.log("palettes", map_palette, map_palette_dark)

// also see https://www.compart.com/en/unicode/block/U+1F700 for symbols for ores
const icons = {
    "ship":"𓊝",
    "cart":"𓌝",
    "trade post":"𓍝",
    "agricultural worker":"𓀝",
    "traveler":"𓀦",
    "food worker":"𓀧",
    "construction worker":"𓀨",
    "human":"𓁷",
    "scout":"𓂉",
    "cattle":"𓃒",
    "pigs":"𓃟",
    "hunting area":"𓃹",
    "hunting area water":"𓅮",
    "turtle":"𓆉",
    "fishing grounds":"𓆟",
    "fields":"𓇦",
    "pottery":"𓎶",
    "home":"𓉤",
    "settlement":"𓉮𓉮",
}

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
