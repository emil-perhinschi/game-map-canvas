import { world_map_draw } from 'motor.js'

class Viewport {
    constructor() {

    }
}



function viewport_center(store, x, y) {

    const offset_x_min = 0
    const offset_x_max = store.world_map_width - store.viewport_width
    const offset_y_min = 0
    const offset_y_max = store.world_map_height - store.viewport_height

    const x_new = x - Math.floor( store.viewport_width / 2 )
    const y_new = y - Math.floor( store.viewport_height / 2 )
    store.viewport_offset_x = x_new < offset_x_min
        ? offset_x_min
        : x_new > offset_x_max
            ? offset_x_max
            : x_new
    store.viewport_offset_y = y_new < offset_y_min
        ? offset_y_min
        : y_new > offset_y_max
            ? offset_y_max
            : y_new

    world_map_draw(store)
    store.execute_turn()
}

export { Viewport, viewport_center }
