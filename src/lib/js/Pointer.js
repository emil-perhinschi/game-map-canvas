"use strict"

import { Entity } from "Entity.js"

class Pointer extends Entity {
    constructor(id, x, y) {
        super(id, x, y)
        this.color_code = "#000000"
        this.icon = 'X'
        this.unit_type = Pointer.type()
    }

    move(store, direction) {
        return false; // towns do not move
    }

    draw(ctx, store) {
        ctx.imageSmoothingEnabled = true
        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.font = "30px Arial"
        ctx.fillStyle = "red"
        ctx.fillText(
            this.icon,
            draw_coords.x + (store.tile_width/2),
            draw_coords.y + (store.tile_height/2)
        )
        ctx.beginPath()
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
    }

    static type() {
        return "pointer"
    }
}

export { Pointer }
