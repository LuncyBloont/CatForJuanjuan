export class Size {
    constructor(w, h) {
        this.width = w
        this.height = h
    }
}

export class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y)
    }

    minus(v) {
        return new Vec2(this.x - v.x, this.y - v.y)
    }

    inverse() {
        return new Vec2(-this.x, -this.y)
    }

    multi(v) {
        return new Vec2(this.x * v.x, this.y * v.y)
    }

    scale(s) {
        return new Vec2(this.x * s, this.y * s)
    }

    divide(v) {
        return new Vec2(this.x / v.x, this.y / v.y)
    }

    normalize() {
        if (this.x == 0.0 && this.y == 0.0) { return new Vec2(0.0, 1.0) }
        return this.scale(1.0 / this.length())
    }

    length() {
        return Math.sqrt(Math.pow(this.x, 2.0), Math.pow(this.y, 2.0))
    }

    copy() {
        return new Vec2(this.x, this.y)
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    static cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y
    }

    static distance(v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2.0), Math.pow(v1.y - v2.y, 2.0))
    }

    static one() { return new Vec2(1.0, 1.0) }
    static up() { return new Vec2(0.0, -1.0) }
    static right() { return new Vec2(1.0, 0.0) }
    static zero() { return new Vec2(0.0, 0.0) }
}

export function size2Vec2(size) {
    return new Vec2(size.width, size.height)
}

export function vec22Size(v) {
    return new Size(v.x, v.y)
}

export class Matrix {
    constructor(i00, i01, i02, i10, i11, i12, i20, i21, i22) {
        this.i00 = i00
        this.i01 = i01
        this.i02 = i02
        this.i10 = i10
        this.i11 = i11
        this.i12 = i12
        this.i20 = i20
        this.i21 = i21
        this.i22 = i22
    }

    static indenty() {
        return new Matrix(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0)
    }
}

export function mulVM(v, m, z) {
    return new Vec2(
        v.x * m.i00 + v.y * m.i01 + z * m.i02,
        v.x * m.i10 + v.y * m.i11 + z * m.i12
        )
}

export function mulMV(m, v, z) {
    return new Vec2(
        v.x * m.i00 + v.y * m.i10 + z * m.i20,
        v.x * m.i01 + v.y * m.i11 + z * m.i21
        )
}

export function mulMM(m1, m2) {
    return new Matrix(
        m1.i00 * m2.i00 + m1.i01 * m2.i10 + m1.i02 * m2.i20,
        m1.i00 * m2.i01 + m1.i01 * m2.i11 + m1.i02 * m2.i21,
        m1.i00 * m2.i02 + m1.i01 * m2.i12 + m1.i02 * m2.i22,
        m1.i10 * m2.i00 + m1.i11 * m2.i10 + m1.i12 * m2.i20,
        m1.i10 * m2.i01 + m1.i11 * m2.i11 + m1.i12 * m2.i21,
        m1.i10 * m2.i02 + m1.i11 * m2.i12 + m1.i12 * m2.i22,
        m1.i20 * m2.i00 + m1.i21 * m2.i10 + m1.i22 * m2.i20,
        m1.i20 * m2.i01 + m1.i21 * m2.i11 + m1.i22 * m2.i21,
        m1.i20 * m2.i02 + m1.i21 * m2.i12 + m1.i22 * m2.i22
        )
}

export function arc(deg) {
    return deg / 180.0 * Math.PI
}

export function deg(arc) {
    return arc / Math.PI * 180.0
}

export function lerp(a, b, l) {
    return a * (1.0 - l) + b * l
}

export function lerpV(a, b, l) {
    return a.scale(1.0 - l).add(b.scale(l))
}

export function clamp(a, m0, m1) {
    return Math.max(m0, Math.min(a, m1))
}