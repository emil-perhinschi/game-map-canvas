"use strict"

import { Entity } from "Entity.js"

class Town extends Entity {
    constructor(id, x, y) {
        super(id, x, y)
        this.color_code = "#000000"
        this.icon = '𓉤'
        // SEEME: what is the point of this ? need better solution
        this.entity_type = Town.type()
        this.friendly = true
        this.landmark = true
        this.known = false
        this.own = false
    }

    move(store, direction) {
        return false; // towns do not move
    }

    draw(ctx, store) {
        ctx.imageSmoothingEnabled = true
        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.font = "30px Arial"
        if (this.is_friendly()) {
            ctx.fillStyle = "blue"
        } else {
            ctx.fillStyle = "red"
        }
        ctx.fillText(
            this.icon,
            draw_coords.x,
            draw_coords.y + store.tile_height - 9
        )
        ctx.beginPath()
        if(this.is_own()) {
            ctx.strokeStyle = 'blue'
        } else {
            ctx.strokeStyle = 'red'
        }
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
    }

    static type() {
        return "towns"
    }
}

export { Town }
