'use strict'

class GameState {
    constructor(data) {
        this.center_on_move = data ? data.center_on_move : false
        this.sprites = data ? data.sprites :  {}
        this.frames = data ? data.frames :  {
            "current_second": 0,
            "frame_count": 0,
            "frames_last_second": 0
        }
        this.max_fps = data ? data.max_fps :  5
        this.tile_width = data ? data.tile_width :   64
        this.tile_height = data ? data.tile_height :  64
        this.viewport_offset_x = data ? data.viewport_offset_x :  0
        this.viewport_offset_y = data ? data.viewport_offset_y :  0
        this.viewport_width = data ? data.viewport_width :  13 // in tiles
        this.viewport_height = data ? data.viewport_height :  13// in tiles
        this.full_map_width = data ? data.full_map_width :  600// in tiles
        this.full_map_height = data ? data.full_map_height :  600// in tiles
        this.world_map_canvas_id = data ? data.world_map_canvas_id : "world_map_canvas"
        this.world_map_width = data ? data.world_map_width :  1600 // in tiles
        this.world_map_height = data ? data.world_map_height :  1600  // in tiles
        this.world_map_container_width = data ? data.world_map_container_width :  600  // in pixels
        this.world_map_container_height = data ? data.world_map_container_height :  600  // in pixels
        this.world_map_zoom = data ? data.world_map_zoom :  2  // how many pixels per tile in the world map container
        this.units = data ? data.units :  []
        this.towns = data ? data.towns :  []
        // use when clicking on the world map to pan around
        //   if not null then the user clicked on the world map and the viewport
        //   should center on that point
        this.pointer = data ? data.pointer :  null
        this.selected_entity = data ? data.selected_entity : {
            id: 0,
            // valid types so far = data ? data. :
            //    units = data ? data. :  when a unit is selected
            //    towns = data ? data. :  when selecting a town
            type: "units" // by default the first unit is selected
        }
        this.visibility_distance = data ? data.visibility_distance : 3
        // TODO rename this to "paused" or something more meaningful
        this.game_state = data ? data.game_state : { 'paused' : false }
        this.turn_no = 0
        console.log(this)
    }

    selected() {
        return this[this.selected_entity.type][this.selected_entity.id]
    }

    on_move() {
        throw( new Error("no on_move action was set in globals") )
    }
}

export { GameState }
