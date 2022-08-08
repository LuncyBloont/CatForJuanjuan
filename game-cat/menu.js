import { AABB, Actor, Game, gizAABB, GizmoContext, gizPoint, Matrix, Sprite, Vec2 } from '../js/game.js'

let gameinfo = `Infomation:
This is a digital pet game. A smart pet has been built for you. Just spend time with it and find more interesting things.
`

export function menuDef() {
    let startButtonSprite = new Sprite('/images/UI/anyKeyStart', 1, 'png')
    let startButton = new Actor(new Vec2(Game.canvas.width * 0.5, Game.canvas.height * 0.5), 0, Vec2.one().scale(3.0),
        'Start Button')
    let font0 = new Sprite('/images/font/default/default', 95, 'png')
    startButton.start = (obj) => {

    }
    startButton.update = (obj, delta, time) => {
        let size = new Vec2(startButtonSprite.getFrame().width * 0.3, startButtonSprite.getFrame().height * 0.8)
        let box = new AABB(obj.position.minus(size.scale(3.0 / 2.0)),
            obj.position.add(size.scale(3.0 / 2.0)))

        obj.scale = new Vec2(3.0, 3.0)
        gizAABB(box)
        gizPoint(Game.mouse, GizmoContext.YS1)
        Game.drawText(startButton.matrix, 18, 1, font0, '[ Click to Start ]', 4.0, 8.0, new Vec2(0.5, 0.6), new Vec2(0.41, 0.4))

        if (box.distanceOf(Game.mouse) < 0) {
            if (Game.mouseDown) {
                Game.switch('default')
            }
            obj.scale = new Vec2(3.1, 3.1)
            Game.drawChar(Game.mouse, font0, '!', Vec2.one().scale(1.0))
        }
    }
    let info = new Actor(new Vec2(Game.canvas.width * 0.5, Game.canvas.height * 0.75), 0, Vec2.one().scale(2.0),
        'Info')
    info.update = (obj, delta, time) => {
        Game.drawText(info.matrix, 50, 6, font0, gameinfo, 8.0, 16.0, Vec2.one().scale(0.7), Vec2.one().scale(0.5))
    }

    Game.push(info)
    Game.push(startButton)
}