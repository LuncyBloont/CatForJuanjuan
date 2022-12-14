import { Game, Sprite, Actor, arc, clamp, lerp, Vec2, lerpV } from '../js/game.js'

export function homeDef() {
    let catSprite = new Sprite('./images/BigOrange/BigOrange', 5, 'png')
    catSprite.life = 0.002
    let ground = Game.canvas.height * 0.7
    let cat = new Actor(new Vec2(Game.canvas.width * 0.5, ground),
        0.0, Vec2.one(), 'Cat', catSprite)
    cat.scale = new Vec2(6.0, 6.0)
    cat.start = (obj) => {
        obj.m_target = obj.position.x
        obj.run = 0.1
        obj.happy = 0.5
    }
    cat.loop = (obj, delta, time) => {
        obj.sprite.life = obj.speed * 0.3
        if (Game.frame % 200 <= 0) {
            obj.m_target = Math.random() * Game.canvas.width * 0.8 + 0.1 * Game.canvas.width
        }

        if (obj.m_target < obj.position.x - 6.0) {
            obj.position.x -= obj.run * delta
        } else if (obj.m_target > obj.position.x + 6.0) {
            obj.position.x += obj.run * delta
        }

        if (obj.speed > 0.003) { obj.happy -= 0.0001 * delta }

        obj.happy += Math.random() * 0.00001 * delta

        obj.flip = obj.speedVector.x > 0.0
        obj.happy = clamp(obj.happy, -1.0, 1.0)
    }
    Game.push(cat)

    let lionCap = new Sprite('./images/Caps/Cap-lion', 2, 'png')
    let bygCap = new Sprite('./images/Caps/Cap-niuyg', 2, 'png')
    let orgCap = new Sprite('./images/Caps/Cap-Orange', 2, 'png')
    let fishS = new Sprite('./images/Fish', 2, 'png')
    let catCap = new Actor(new Vec2(-3.5, 4.5), arc(0), Vec2.one().scale(0.65), 'Bob', orgCap)
    cat.push(catCap)
    catCap.loop = (obj, delta, time) => {
        obj.rotation = Math.cos(time * 0.007) * 0.04
    }
    catCap.z = 1

    let ball = new Sprite('./images/Msg', 6, 'png')
    let catTalk = new Actor(Vec2.zero(), 0, Vec2.one().scale(3.0), 'CatTalk', ball)
    ball.life = 0.0
    catTalk.loop = (obj, d, t) => {
        obj.position = cat.position.add(new Vec2(72, -72))
        ball.time = clamp(cat.happy, -1.0, 1.0) * 0.49 + 0.5
    }
    catTalk.z = 101
    Game.push(catTalk)

    let walls = new Sprite('./images/wall', 2, 'png')
    let wall = new Actor(new Vec2(Game.canvas.width * 0.5, Game.canvas.height * 0.5),
        0.0, new Vec2(2.0, 2.0).scale(canvas.height / 1024.0), 'wall', walls)
    wall.z = -101
    Game.push(wall)

    let handS = new Sprite('./images/hand', 2, 'png')
    let hand = new Actor(Vec2.zero(), 0, Vec2.one().scale(3.0), 'Hand', handS)
    hand.z = 1000
    handS.life = 0.0
    hand.start = (obj) => {
        obj.m_touch = false
    }
    hand.update = (obj, d, t) => {
        obj.position = lerpV(obj.position, Game.mouse, 0.3)
        if (Game.mouseDown) {
            handS.time = 0.7
            obj.m_touch = true
            if (Vec2.distance(obj.position, cat.position) < 64) {
                cat.scale = new Vec2(5.9, 5.5)
                cat.happy += (Math.random() - 0.4) * 0.2
            }
        }
        if (Game.mouseUp) {
            handS.time = 0.0
            obj.m_touch = false
            cat.scale = new Vec2(6.0, 6.0)
        }

    }
    Game.push(hand)

    let button = (obj, d, t) => {
        if (Vec2.distance(obj.position, Game.mouse) < 32) {
            if (Game.mouseDown) {
                obj.m_do()
            }
        }
    }

    let fishBut = new Actor(new Vec2(128 + 256, 64), 0, Vec2.one().scale(3), 'FishButton', fishS.copy())
    fishBut.sprite.life = 0.002
    let cap0But = new Actor(new Vec2(256 + 256, 64), 0, Vec2.one().scale(3), 'FishButton', lionCap.copy())
    let cap1But = new Actor(new Vec2(384 + 256, 64), 0, Vec2.one().scale(3), 'FishButton', bygCap.copy())
    let cap2But = new Actor(new Vec2(512 + 256, 64), 0, Vec2.one().scale(3), 'FishButton', orgCap.copy())

    fishBut.update = button
    cap0But.update = button
    cap1But.update = button
    cap2But.update = button
    fishBut.m_do = () => {
        let ff = new Actor(new Vec2(Math.random() * Game.canvas.width * 0.8 + 0.1 * Game.canvas.width, 128),
            Math.random() * Math.PI * 2.0, Vec2.one().scale(2.0), 'Fish0', fishBut.sprite.copy())
        ff.m_r = Math.random() - 0.5
        ff.z = 7
        ff.sprite.time = 0.0
        ff.loop = (obj, d, t) => {
            if (obj.position.y > ground + 48) {
                if (Vec2.distance(obj.position, cat.position) < 64) {
                    obj.alive = false
                    cat.happy += 0.1
                }
            } else {
                obj.position.y += 0.08 * d
                obj.rotation += 0.01 * d * obj.m_r
            }
        }
        Game.push(ff)
    }

    cap0But.m_do = () => {
        catCap.sprite = cap0But.sprite.copy()
        cat.happy += 0.05
    }
    cap1But.m_do = () => {
        catCap.sprite = cap1But.sprite.copy()
        cat.happy += 0.05
    }
    cap2But.m_do = () => {
        catCap.sprite = cap2But.sprite.copy()
        cat.happy += 0.05
    }

    fishBut.z = 102
    Game.push(fishBut)
    cap0But.z = 102
    Game.push(cap0But)
    cap1But.z = 102
    Game.push(cap1But)
    cap2But.z = 102
    Game.push(cap2But)

}