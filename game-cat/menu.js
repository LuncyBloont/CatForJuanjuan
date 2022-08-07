import { AABB, Actor, Game, gizAABB, GizmoContext, gizPoint, Sprite, Vec2 } from '../js/game.js'

export function menuDef() {
    let startButtonSprite = new Sprite('/images/UI/anyKeyStart', 1, 'png')
    let startButton = new Actor(new Vec2(Game.canvas.width * 0.5, Game.canvas.height * 0.5), 0, Vec2.one().scale(3.0), 
        'Start Button', startButtonSprite)
    startButton.start = (obj) => {
        
    }
    startButton.update = (obj, delta, time) => {
        let size = new Vec2(obj.sprite.getFrame().width * 0.3, obj.sprite.getFrame().height * 0.8)
        let box = new AABB(obj.position.minus(size.scale(3.0 / 2.0)), 
            obj.position.add(size.scale(3.0 / 2.0)))
        
            obj.scale = new Vec2(3.0, 3.0)
        if (box.distanceOf(Game.mouse) < 0) {
            if (Game.mouseDown) {
                Game.switch('default')
            }
            obj.scale = new Vec2(3.1, 3.1)
        }
        gizAABB(box)
        gizPoint(Game.mouse, GizmoContext.YS1)
    }
    Game.push(startButton)
}