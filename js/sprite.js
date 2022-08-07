import { Size, Vec2 } from './basic.js'

export class Sprite {
    /**
     * 
     * @param {string} filename file path without extension
     * @param {number} frame frame count
     * @param {string} type file extension without '.'
     * @example new Sprite('/images/player', 6, 'png')
     */
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

    /**
     * reload manually image assets after setting the members about image loading.
     */
    refresh() {
        frames = []
        for (let i = 0; i < this.frame; i++) {
            let img = new Image()
            if (this.frame > 1) {
                img.src = this.filename + (i + 1) + '.' + this.type
            } else {
                img.src = this.filename + '.' + this.type
            }
            this.frames.push(img)
        }
    }

    /**
     * drive frame animation
     * @param {number} delta frame delta time
     */
    update(delta) {
        this.time += delta * this.life
    }

    /**
     * return frame image of current time
     * @returns {Image}
     */
    getFrame() {
        let dur = this.time
        let pos = Math.floor((dur - Math.floor(dur)) * this.frame)
        return this.frames[pos]
    }

    /**
     * return a copy of this Sprite
     * @returns {Sprite}
     */
    copy() {
        let n = new Sprite(this.filename, this.frame, this.type)
        n.center = this.center
        n.life = this.life
        n.show = this.show
        n.time = this.time
        return n
    }
}