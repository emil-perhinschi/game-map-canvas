"use strict"
import { Entity } from "Entity.js"
import { UnitKnowledge } from "UnitKnowledge.js"

class Unit extends Entity {
    // friendly = owned by the player
    constructor(id, x, y, own = false, friendly = false) {
        super(id, x, y, own, friendly)
        this.color_code = "#000000"
        this.entity_type = Unit.type()
        this.landmark = false
        this.moves = 5
        this.knowledge = new UnitKnowledge()
    }

    draw(ctx, store) {
        const old_fill_style = ctx.fillStyle
        const old_stroke_style = ctx.strokeStyle

        ctx.imageSmoothingEnabled = true
        ctx.fillStyle = this.color_code
        const draw_coords = this.compute_draw_coordinates(store)
        ctx.font = "50px Arial"
        if (this.is_friendly()) {
            ctx.fillStyle = "blue"
        } else {
            ctx.fillStyle = "red"
        }
        const img = new Image()
        img.src = 'sprites/unit_topdown.png'
        ctx.drawImage(
            img,
            draw_coords.x,
            draw_coords.y
        )
        ctx.fillStyle = old_fill_style

        ctx.beginPath()
        if(this.is_own()) {
            ctx.strokeStyle = 'blue'
        } else {
            ctx.strokeStyle = 'red'
        }
        ctx.rect(draw_coords.x, draw_coords.y, 64, 64)
        ctx.stroke()
        ctx.closePath()
        ctx.strokeStyle = old_stroke_style
    }

    static type() {
        return "units"
    }
}

export { Unit }
