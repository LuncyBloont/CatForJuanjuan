import { Size, Vec2 } from './basic.js'

export class Spirit {
    constructor(filename, frame, type) {
        this.frames = []
        this.frame = frame
        this.center = new Vec2(0.5, 0.5)
        this.life = 0.001
        this.filename = filename
        this.type = type
        this.time = 0.0
        this.refresh()
        this.show = true
    }

    refresh() {
        frames = []
        for (let i = 0; i < this.frame; i++) {
            let img = new Image()
            img.src = this.filename + (i + 1) + '.' + this.type
            this.frames.push(img)
        }
    }

    update(delta) {
        this.time += delta * this.life
    }

    getFrame() {
        let dur = this.time
        let pos = Math.floor((dur - Math.floor(dur)) * this.frame)
        return this.frames[pos]
    }

    copy() {
        let n = new Spirit(this.filename, this.frame, this.type)
        for (let i in this) {
            n[i] = this[i]
        }
        return n
    }
}