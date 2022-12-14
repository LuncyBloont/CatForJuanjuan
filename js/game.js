import { Actor } from './actor.js'
import { Matrix, Vec2 } from './basic.js'
import { AABB } from './geometry.js'
import { gizAABB, gizWireAABB } from './gizmo.js'
import { Sprite } from './sprite.js'

export * from './actor.js'
export * from './sprite.js'
export * from './basic.js'
export * from './geometry.js'
export * from './gizmo.js'

export class Game {
    /**
     * @type {Array<string>}
     */
    static games = {}
    /**
     * @type {CanvasRenderingContext2D} drawer
     */
    static render = null
    static canvas = null
    static rendering = false
    static logicThread = null
    static actors = []
    static gameTimeLogic = 0.0
    static gameTimeRender = 0.0
    static deltaLogic = 0.01
    static deltaRender = 0.01
    static mousex = 0.0
    static mousey = 0.0
    static mouse = new Vec2(0.0, 0.0)
    static mouseDown = false
    static mouseUp = false
    static frame = 0

    static time() {
        return (Game.gameTimeLogic + Game.gameTimeRender) * 0.5 / 1000.0
    }

    static initialize(canvasid) {
        Game.canvas = document.getElementById(canvasid)
        Game.canvas.width = innerWidth
        Game.canvas.height = innerHeight

        if (Game.canvas == null) {
            console.error('没有该画布' + canvasid)
        }
        Game.render = Game.canvas.getContext('2d')
        Game.render.imageSmoothingEnabled = false
        Game.render.imageSmoothingQuality = 'low'
        Game.canvas.addEventListener('mousedown', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
            Game.mouse.x = Game.mousex
            Game.mouse.y = Game.mousey
            Game.mouseDown = true
        })
        Game.canvas.addEventListener('mousemove', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
            Game.mouse.x = Game.mousex
            Game.mouse.y = Game.mousey
        })
        Game.canvas.addEventListener('mouseup', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
            Game.mouse.x = Game.mousex
            Game.mouse.y = Game.mousey
            Game.mouseUp = true
        })

        Game.games['default'] = Game.actors
    }

    static logicLoop() {
        for (let i = 0; i < Game.actors.length; i++) {
            Game.actors[i].logicFrame(Game.deltaLogic, Game.gameTimeLogic)
        }

        Game.actors = checkList(Game.actors)

        Game.deltaLogic = (Date.now() - Game.gameTimeLogic) + 0.1
        Game.gameTimeLogic = Date.now()
    }

    static updateMatrix() {
        for (let i = 0; i < Game.actors.length; i++) {
            Game.actors[i].matrix = Game.actors[i].toLocalMatrix()
            Game.actors[i].updateMatrix()
        }
    }

    static renderLoop() {
        Game.updateMatrix()
        let heap = new Heap(1e9)
        let push = (actor) => {
            heap.push(actor, actor.z)
            for (let i = 0; i < actor.children.length; i++) {
                push(actor.children[i], actor.children[i].z)
            }
        }
        for (let i = 0; i < Game.actors.length; i++) {
            push(Game.actors[i])
        }

        Game.render.clearRect(0, 0, Game.canvas.width, Game.canvas.height)
        while (heap.size > 0) {
            let pair = heap.pop()
            pair.obj.renderFrame(Game.deltaRender, Game.gameTimeRender)
        }

        Game.deltaRender = (Date.now() - Game.gameTimeRender) + 0.1
        Game.gameTimeRender = Date.now()
        if (Game.rendering) {
            requestAnimationFrame(Game.renderLoop)
        }
        Game.frame += 1

        Game.mouseDown = false
        Game.mouseUp = false
    }

    static start(loopTime) {
        Game.rendering = true
        Game.logicThread = setInterval(Game.logicLoop, loopTime)
        requestAnimationFrame(Game.renderLoop)
        Game.gameTimeLogic = Date.now()
        Game.gameTimeRender = Date.now()
    }

    static createGame(name) {
        Game.games[name] = []
    }

    static switch(name) {
        let warn = new Actor(Vec2.zero(), 0, Vec2.one, 'Warn')
        warn.start = (obj, delta, time) => { console.error('Invalid game name: ' + name) }
        Game.actors = (Game.games[name] != undefined ? Game.games[name] : [warn])

        let restart = (obj) => {
            obj.initialize()
            for (let k in obj.children) {
                obj.children[k].initialize()
                restart(obj.children[k])
            }
        }
        for (let k in Game.actors) {
            restart(Game.actors[k])
        }
    }

    static deleteGame(name) {
        Game.games[name] = undefined
    }

    static find(name) {
        for (let i in Game.actors) {
            if (Game.actors[i].name == name) {
                return Game.actors[i]
            }
        }
    }

    static findAll(name) {
        let res = []
        for (let i in Game.actors) {
            if (Game.actors[i].name == name) {
                res.push(Game.actors[i])
            }
        }
        return res
    }

    static stop() {
        Game.rendering = false
        clearInterval(Game.logicThread)
    }

    static push(child) {
        Game.actors.push(child)
        child.initialize()
    }

    static drawSprite(sprite, matrix) {
        if (sprite == null || !sprite.show) return
        Game.render.save()
        try {
            Game.render.transform(matrix.i00, matrix.i01, matrix.i10, matrix.i11, matrix.i02, matrix.i12)
            let img = sprite.getFrame()
            Game.render.drawImage(img, -sprite.center.x * img.width, -sprite.center.y * img.height)
        } catch (err) {
            console.warn(err)
        }
        Game.render.restore()

    }

    /**
     * 
     * @param {Vec2} pos 
     * @param {Sprite} sprite 
     * @param {string} char 
     * @param {Vec2} scale 
     */
    static drawChar(pos, sprite, char, scale) {
        let img = sprite.frames[char.charCodeAt(0) - 32]
        if (img != undefined) {
            Game.render.drawImage(img, pos.x - img.width * scale.x * sprite.center.x,
                pos.y - img.height * scale.y * sprite.center.y,
                img.width * scale.x, img.height * scale.y)
        }
    }

    /**
     * 
     * @param {Matrix} pos
     * @param {number} col
     * @param {number} raw
     * @param {Sprite} sprite 
     * @param {string} str 
     * @param {number} space 
     * @param {number} linespace 
     * @param {Vec2} scale 
     * @param {Vec2} center
     */
    static drawText(matrix, col, raw, sprite, str, space, linespace, scale, center) {
        Game.render.save()
        try {
            Game.render.transform(matrix.i00, matrix.i01, matrix.i10, matrix.i11, matrix.i02, matrix.i12)
            let width = col * space
            let height = raw * linespace
            let pos = center.inverse().multi(new Vec2(width, height))
            let rawIndex = 0
            let colIndex = 0
            for (let i = 0; i < str.length; i++) {
                if (colIndex >= col) {
                    colIndex = 0
                    rawIndex += 1
                }
                if (str[i] == '\n' || str[i] == '\r') {
                    colIndex = 0
                    rawIndex += 1
                }
                if (rawIndex >= raw) {
                    break
                }
                let char = str[i] == '\t' ? ' ' : str[i]
                Game.drawChar(pos.add(new Vec2(colIndex * space, rawIndex * linespace)), sprite, char, scale)
                colIndex += 1
            }
            // gizWireAABB(new AABB(pos, pos.add(new Vec2(width, height))))
        } catch (err) {
            console.log(err)
        }
        Game.render.restore()
    }
}

export function checkList(list) {
    let newList = []
    for (let i = 0; i < list.length; i++) {
        if (list[i].alive) {
            checkList(list[i])
            newList.push(list[i])
        }
    }
    return newList
}

export function heapParent(index) {
    return index >= 0 ? Math.floor((index - 1) / 2) : -1
}

export function heapLeft(index) {
    return Math.floor(index * 2 + 1)
}

export function heapRight(index) {
    return Math.floor(index * 2 + 2)
}

export class Sortable {
    constructor(obj, key) {
        this.obj = obj
        this.key = key
    }
}

export class Heap {
    constructor(max) {
        this.arr = []
        this.max = max
        this.size = 0
    }

    moreSize() {
        if (this.size >= this.arr.length) {
            let oldSize = this.arr.length
            for (let i = 0; i < oldSize + 1; i++) {
                this.arr.push(new Sortable(null, this.max))
            }
        }
    }

    push(obj, key) {
        this.moreSize()

        let pos = this.size
        this.size += 1
        this.arr[pos] = new Sortable(obj, key)

        let parent = heapParent(pos)
        while (parent >= 0) {
            if (this.arr[parent].key > key) {
                let ex = this.arr[pos]
                this.arr[pos] = this.arr[parent]
                this.arr[parent] = ex
                pos = parent
                parent = heapParent(pos)
            } else {
                break
            }
        }
    }

    peek() {
        if (this.size <= 0) return null
        return this.arr[0]
    }

    pop() {
        if (this.size <= 0) return null
        let top = this.arr[0]

        this.size -= 1
        this.arr[0] = this.arr[this.size]
        this.arr[this.size] = new Sortable(null, this.max)

        let pos = 0
        let left = heapLeft(pos)
        let right = heapRight(pos)
        while (left < this.size) {
            let change = false
            let chose = left
            if (right < this.size) {
                chose = this.arr[left].key <= this.arr[right].key ? left : right
            }
            if (this.arr[pos].key > this.arr[chose].key) {
                let ex = this.arr[pos]
                this.arr[pos] = this.arr[chose]
                this.arr[chose] = ex
                change = true
                pos = chose
            }

            left = heapLeft(pos)
            right = heapRight(pos)

            if (!change) {
                break
            }
        }

        return top
    }

    debug() {
        let w = 1
        let now = 0
        console.log('Debug:')
        while (true) {
            let str = ''
            for (let i = 0; i < w && now + i < this.size; i++) {
                str += this.arr[now + i].obj + '(' + this.arr[now + i].key + ')'
            }
            now += w
            w *= 2
            console.log(str)
            if (now > this.size) { break }
        }
    }
} 