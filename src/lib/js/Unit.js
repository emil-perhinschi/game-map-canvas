class Unit {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.draw_x = 0
        this.draw_y = 0
    }

    position() {
        return [this.x, this.y]
    }

    move(global_config) {
        this.x = global_config.viewport_offset_x + Math.floor(global_config.viewport_width/2)
        this.y = global_config.viewport_offset_y + Math.floor(global_config.viewport_height/2)
    }

    draw(ctx, global_config) {
        ctx.fillStyle = "#000000"

        this.draw_x = ( global_config.viewport_width  * global_config.tile_width  )/2
        this.draw_y = ( global_config.viewport_height * global_config.tile_height )/2

        ctx.beginPath()
        ctx.arc(
            this.draw_x,
            this.draw_y,
            global_config.tile_width/2, 0, 2 * Math.PI
        )
        ctx.closePath()
        ctx.stroke()

    }
}

export { Unit }
