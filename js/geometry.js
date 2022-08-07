import { Vec2 } from "./basic.js"
import { gizPoint } from "./gizmo.js"

export class Collider {
    /**
     * 
     * @param {Array<Vec2>} mesh 
     */
    constructor(mesh) {
        this.mesh = mesh
    }
}

export class AABB {
    /**
     * 
     * @param {Vec2} min 
     * @param {Vec2} max 
     */
    constructor(min, max) {
        this.min = min
        this.max = max
    }

    /**
     * 
     * @param {Vec2} point 
     * @return {Number} distance from point to AABB box side
     */
    distanceOf(point) {
        let center = this.min.add(this.max).scale(0.5)
        let halfSize = this.max.minus(this.min).scale(0.5)
        let dis = point.minus(center).abs().minus(halfSize)
        if (dis.x > 0 && dis.y > 0) {
            return dis.length()
        } else {
            return Math.max(dis.x, dis.y)
        }
    }
}