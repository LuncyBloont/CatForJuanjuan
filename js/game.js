
export class Game {
    static name = 'Game'
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
    static mouseDown = false
    static mouseUp = false

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
        Game.render.imageSmoothingEnabled  = false
        Game.render.imageSmoothingQuality = 'low'
        Game.canvas.addEventListener('mousedown', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
            Game.mouseDown = true
        })
        Game.canvas.addEventListener('mousemove', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
        })
        Game.canvas.addEventListener('mouseup', (e) => {
            Game.mousex = e.clientX
            Game.mousey = e.clientY
            Game.mouseUp = true
        })
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

    static stop() {
        Game.rendering = false
        clearInterval(Game.logicThread)
    }

    static push(child) {
        Game.actors.push(child)
        child.initialize()
    }

    static drawSpirit(spirit, matrix) {
        if (spirit == undefined || !spirit.show) return
        Game.render.save()
        try {
            Game.render.transform(matrix.i00, matrix.i01, matrix.i10, matrix.i11, matrix.i02, matrix.i12)
            let img = spirit.getFrame()
            Game.render.drawImage(img, -spirit.center.x * img.width, -spirit.center.y * img.height)
        } catch (err) {
            console.warn(err)
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
            if (this.arr[pos].key > this.arr[left].key) {
                let ex = this.arr[pos]
                this.arr[pos] = this.arr[left]
                this.arr[left] = ex
                change = true
                pos = left
            }
            if (right < this.size && this.arr[pos].key > this.arr[right].key) {
                let ex = this.arr[pos]
                this.arr[pos] = this.arr[right]
                this.arr[right] = ex
                change = true
                pos = right
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