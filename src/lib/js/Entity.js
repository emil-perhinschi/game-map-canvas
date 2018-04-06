"use strict"

const map_data = require('mock_server_data.js').map_data
const tile_is_walkable = require('mock_server_data.js').tile_is_walkable

class Entity {
    constructor(id, x, y, own = false, friendly = false) {
        if (new.target === Entity) {
            throw new TypeError("Cannot construct Entity instances directly");
        }
        this.id = id
        this.x = x
        this.y = y
        this.color_code = "#000000"
        this.own = own // you own this entity
        this.friendly = false // means you're not at war
        this.landmark = false // fixed, does not move, such as a town
        this.known = false // you have seen it

    }

    is_own(own) {
        if (own != undefined ) {
            this.own = own
        }
        return this.own
    }

    is_known(known) {
        if (known != undefined ) {
            this.known = known
        }
        return this.known
    }

    is_friendly(friendly) {
        if (friendly != undefined) {
            this.friendly = friendly
        }
        return this.friendly
    }

    is_landmark(landmark) {
        if (landmark != undefined) {
            this.landmark = landmark
        }
        return this.landmark
    }

    position() {
        return [this.x, this.y]
    }

    move(store, direction) {
        const can_N = (store, x,y) => y > 0
        const can_S = (store, x,y) => y < ( store.world_map_height - 1 )
        const can_E = (store, x,y) => x < ( store.world_map_width  - 1 )
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
            ui_msg( "cannot move there: " + can_move.reason )
        }
    }

    draw(ctx, store) {
        ctx.imageSmoothingEnabled = true
        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.font = "50px Arial"
        ctx.fillStyle = "red"
        ctx.fillText(
            '𓉤',
            draw_coords.x,
            draw_coords.y + store.tile_height - 3
        )
        const shield_image = store.sprites.shield
        ctx.drawImage(
            shield_image,
            draw_coords.x, draw_coords.y,
            store.tile_width, store.tile_height
        )
        ctx.beginPath()
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
    }

    visible_in_viewport( store, min_distance_from_edges ) {
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

    in_viewport(offset, viewport_size) {
        if (
            this.x > offset.x
            && this.y > offset.y
            && this.x < offset.x + viewport_size.width
            && this.y < offset.y + viewport_size.height
        ) {
            return true
        }
        return false
    }

// this needs more thought, I'll just show them all
    visible_in_world_map( store, min_distance_from_edges ) {
        // const viewport_min_x = store.viewport_offset_x
        // const viewport_min_y = store.viewport_offset_y
        // const viewport_max_x = store.viewport_offset_x + store.viewport_width
        // const viewport_max_y = store.viewport_offset_y + store.viewport_height
        //
        // if (
        //         (this.x < viewport_min_x + min_distance_from_edges)
        //         || (this.x > viewport_max_x - min_distance_from_edges - 1)
        //         || (this.y < viewport_min_y + min_distance_from_edges)
        //         || (this.y > viewport_max_y - min_distance_from_edges - 1)
        //     ) {
        //         return false
        // }
        // return true
        return false
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

export { Entity }
