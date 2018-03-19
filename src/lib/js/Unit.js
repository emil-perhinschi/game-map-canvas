class Unit {
    constructor() {
        this.x = 25
        this.y = 25
    }

    position() {
        return [this.x, this.y]
    }

    move(x, y) {
        this.x = x
        this.y = y
    }
}

export { Unit }
