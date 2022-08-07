import { Sprite } from './sprite.js'
import { Matrix, mulMM, Size, Vec2 } from './basic.js'
import { checkList, Game } from './game.js'

export class Actor {
    /**
     * 
     * @param {Vec2} position actor local position
     * @param {number} rotation local rotation
     * @param {Vec2} scale local scale
     * @param {string} name actor nume
     * @param {Sprite} sprite actor sprite
     */
    constructor(position, rotation, scale, name, sprite = null) {
        this.position = position
        this.rotation = rotation
        this.scale = scale
        this.name = name
        this.sprite = sprite
        this.update = (obj, delta, time) => {}
        this.start = (obj) => {}
        this.loop = (obj, delta, time) => {}
        this.children = []
        this.alive = true
        this.z = 0
        this.matrix = Matrix.indenty()
        this.flip = false
        this.oldPos = new Vec2(0.0, 0.0)
        this.recordPos = true
        this.speedVector = new Vec2(0.0, 0.0)
        this.speed = 0.0
    }

    logicFrame(delta, time) {
        this.loop(this, delta, time)
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].logicFrame(delta, time)
        }
        if (this.recordPos) {
            this.speedVector = this.position.minus(this.oldPos).scale(1.0 / delta)
            this.speed = this.speedVector.length() / delta
        }
        this.oldPos = this.position.copy()

        this.children = checkList(this.children)
    }

    renderFrame(delta, time) {
        this.update(this, delta, time)
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].renderFrame(delta, time)
        }
        if (this.sprite != null) { this.sprite.update(delta) }
        Game.drawSprite(this.sprite, this.matrix)
    }

    updateMatrix() {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].matrix = mulMM(this.matrix, this.children[i].toLocalMatrix())
            this.children[i].updateMatrix()
        }
    }

    toLocalMatrix() {
        let cr = Math.cos(this.rotation)
        let sr = Math.sin(this.rotation)
        return new Matrix(
            cr * this.scale.x * (this.flip ? -1.0 : 1.0), -sr * this.scale.y, this.position.x,
            sr * this.scale.x * (this.flip ? -1.0 : 1.0), cr * this.scale.y, this.position.y,
            0.0, 0.0, 1.0
            )
    }

    initialize() {
        this.start(this)
        this.oldPos = this.position
    }

    push(child) {
        this.children.push(child)
        child.initialize()
    }
}