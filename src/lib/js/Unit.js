"use strict"
import { Entity } from "Entity.js"

class Unit extends Entity {
    constructor(id, x, y) {
        super(id, x, y)
        this.color_code = "#000000"
        this.icon = '𓀦'
        this.unit_type = Unit.type()
    }

    draw(ctx, store) {
        ctx.imageSmoothingEnabled = true
        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.font = "50px Arial"
        ctx.fillStyle = "red"
        ctx.fillText(
            this.icon,
            draw_coords.x,
            draw_coords.y + store.tile_height - 3
        )
        ctx.beginPath()
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
    }

    static type() {
        return "units"
    }
}

export { Unit }
