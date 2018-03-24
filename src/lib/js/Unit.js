const sprites = require('./sprites.js').sprites
const map_data = require('mock_server_data.js').map_data
const tile_is_walkable = require('mock_server_data.js').tile_is_walkable

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
        const can_N = (store, x,y) => y > 0
        const can_S = (store, x,y) => y < ( store.full_map_height - 1 )
        const can_E = (store, x,y) => x < ( store.full_map_width  - 1 )
        const can_W = (store, x,y) => x > 0

        // store the new values before checking if movement is possible
        const move_directions = {
            "N": function(store,x,y) { if ( can_N(store,x,y) ) return [ x, y - 1 ] },
            "S": function(store,x,y) { if ( can_S(store,x,y) ) return [ x, y + 1 ] },
            "E": function(store,x,y) { if ( can_E(store,x,y) ) return [ x + 1, y ] },
            "W": function(store,x,y) { if ( can_W(store,x,y) ) return [ x - 1, y ] },
            "NE": function(store,x,y) {
                if ( can_N(store,x,y) && can_E(store,x,y) ) {
                    return [ x + 1, y - 1]
                }
            },
            "NW": function(store,x,y) {
                if ( can_N(store,x,y) && can_W(store,x,y) ) {
                    return [ x - 1, y - 1]
                }
            },
            "SE": function(store,x,y) {
                if ( can_S(store,x,y) && can_E(store,x,y) ) {
                    return [ x + 1, y + 1]
                }
            },
            "SW": function(store,x,y) {
                if ( can_S(store,x,y) && can_W(store,x,y) ) {
                    return [ x - 1, y + 1 ]
                }
            }
        }

        if(!direction in move_directions) {
            throw "Direction " + direction + " not valid"
        }

        const [ new_x, new_y ] = move_directions[direction](store,this.x,this.y)
        const can_move = tile_is_walkable(map_data, new_x, new_y)
        if (can_move.success == true) {
            this.x = new_x
            this.y = new_y
        } else {
            console.log( "cannot move there: " + can_move.reason )
        }
    }

    draw(ctx, store) {

        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        const unit_image = new Image(64,64)
        unit_image.src = sprites.cart
        ctx.drawImage(unit_image, draw_coords.x, draw_coords.y)
        const shield_image = new Image(64,64)
        shield_image.src = sprites.shield
        ctx.drawImage(shield_image, draw_coords.x, draw_coords.y)
        ctx.beginPath()
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
    }

    unit_in_viewport( store, min_distance_from_edges ) {
        const viewport_min_x = store.viewport_offset_x
        const viewport_min_y = store.viewport_offset_y
        const viewport_max_x = store.viewport_offset_x + store.viewport_width
        const viewport_max_y = store.viewport_offset_y + store.viewport_height

        if (
                (this.x < viewport_min_x + min_distance_from_edges)
                || (this.x > viewport_max_x - min_distance_from_edges - 1)
                || (this.y < viewport_min_y + min_distance_from_edges)
                || (this.y > viewport_max_y - min_distance_from_edges - 1)
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
