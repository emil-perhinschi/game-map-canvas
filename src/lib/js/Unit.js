class Unit {
    constructor(id, x, y) {
        this.id = id
        this.x = x
        this.y = y
        this.color_code = "#000000"
    }

    position() {
        return [this.x, this.y]
    }

    move(store, direction) {
        const move_directions = {
            "N": () => (this.y > 0) && this.y--,
            "S": () => ( this.y < store.full_map_height - 1) && this.y++,
            "E": () => ( this.x < store.full_map_width - 1) && this.x++,
            "W": () => ( this.x > 0) && this.x--
        }

        if(!direction in move_directions) {
            throw "Direction " + direction + " not valid"
        }

        move_directions[direction]()
    }

    draw(ctx, store) {

        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.beginPath()
        ctx.arc(
            draw_coords.x + 0.5*store.tile_width,
            draw_coords.y + 0.5*store.tile_height,
            store.tile_width/2.5, 0, 2 * Math.PI
        )
        ctx.closePath()
        ctx.fill()
    }

    unit_in_viewport( store, min_distance_from_edges ) {
        const viewport_min_x = store.viewport_offset_x
        const viewport_min_y = store.viewport_offset_y
        const viewport_max_x = store.viewport_offset_x + store.viewport_width
        const viewport_max_y = store.viewport_offset_y + store.viewport_height

        if (
                (this.x < viewport_min_x + min_distance_from_edges)
                || (this.x > viewport_max_x - min_distance_from_edges)
                || (this.y < viewport_min_y + min_distance_from_edges)
                || (this.y > viewport_max_y - min_distance_from_edges)
            ) {
                return false
        }
        return true
    }

    // returns the coordinates of the tile where the unit should be drawn
    //   if the unit figure is a circle add 0.5 of the tile_width
    compute_draw_coordinates(store) {
        return {
            x: (this.x - store.viewport_offset_x) * store.tile_width,
            y: (this.y - store.viewport_offset_y) * store.tile_height
        }
    }


}

export { Unit }
