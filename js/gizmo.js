import { AABB, Game, Matrix } from './game.js'

export class GizmoContext {
    /**
     * 
     * @param {string} color 颜色
     * @param {number} alpha 透明度
     * @param {number} lineWidth 线条粗细
     * @param {Matrix} matrix 变换矩阵
     */
    constructor(color, alpha, lineWidth, matrix) {
        this.color = color
        this.alpha = alpha
        this.lineWidth = lineWidth
        this.matrix = matrix
    }

    static BT1 = new GizmoContext('#0000FF', 0.5, 1.0, Matrix.indenty());
    static RT1 = new GizmoContext('#FF0000', 0.5, 1.0, Matrix.indenty());
    static GT1 = new GizmoContext('#00FF00', 0.5, 1.0, Matrix.indenty());
    static YT1 = new GizmoContext('#FFFF00', 0.5, 1.0, Matrix.indenty());
    static MT1 = new GizmoContext('#FF00FF', 0.5, 1.0, Matrix.indenty());
    static CT1 = new GizmoContext('#00FFFF', 0.5, 1.0, Matrix.indenty());
    static BS1 = new GizmoContext('#0000FF', 1.0, 1.0, Matrix.indenty());
    static RS1 = new GizmoContext('#FF0000', 1.0, 1.0, Matrix.indenty());
    static GS1 = new GizmoContext('#00FF00', 1.0, 1.0, Matrix.indenty());
    static YS1 = new GizmoContext('#FFFF00', 1.0, 1.0, Matrix.indenty());
    static MS1 = new GizmoContext('#FF00FF', 1.0, 1.0, Matrix.indenty());
    static CS1 = new GizmoContext('#00FFFF', 1.0, 1.0, Matrix.indenty());
}

/**
 *  
 * @param {GizmoContext} context 
 */
function useContext(context) {
    Game.render.fillStyle = context.color
    Game.render.globalAlpha = context.alpha
    Game.render.lineWidth = context.lineWidth
    Game.render.transform(context.matrix.i00, context.matrix.i01,
        context.matrix.i10, context.matrix.i11,
        context.matrix.i02, context.matrix.i12)
}

/**
 * 
 * @param {AABB} aabb 
 * @param {GizmoContext} context
 */
export function gizAABB(aabb, context = GizmoContext.BT1) {
    Game.render.save()
    try {
        useContext(context)
        Game.render.fillRect(aabb.min.x, aabb.min.y, aabb.max.minus(aabb.min).x, aabb.max.minus(aabb.min).y)
    } catch (err) {
        console.log(err)
    }
    Game.render.restore()
}

/**
 * 
 * @param {Vec2} point 
 * @param {GizmoContext} context 
 */
export function gizPoint(point, context = GizmoContext.BT1) {
    Game.render.save()
    try {
        useContext(context)
        Game.render.fillRect(point.x - context.lineWidth * 2.0, point.y - context.lineWidth * 2.0, 
            context.lineWidth * 4.0, context.lineWidth * 4.0)
    } catch (err) {
        console.log(err)
    }
    Game.render.restore()
}