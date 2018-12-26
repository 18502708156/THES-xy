class AIUnitMoveData {

    public static readonly STATE_FINISH = 2
    public static readonly STATE_CONTINUE = 1
    public static readonly STATE_NONE = 0

    public sx: number
    public sy: number
    public ex: number
    public ey: number

    public mOffset: number = 0

    private mAStar: AStarNode[] = null

    private duration: number
    private time: number

    public mDir: number = 1

    private GetNextStar(x: number, y: number, t: number): boolean {
        if (!this.mAStar) {
            return false
        }
        let data = this.mAStar.pop()
        if (!data) {
            return false
        }
        if (!this.mAStar.length) {
            this.mAStar = null
        }
        // let sx = this.sx = x
        // let sy = this.sy = y
        // let ex = this.ex = data.nX
        // let ey = this.ey = data.nY

        if (this.DoInit(x, y, Const.PosToPixel(data.nX), Const.PosToPixel(data.nY), MoveTeam.MOVE_SPEED, this.mOffset)) {
            this.time = t
            return true
        }
        return false
    }

    public InitByAStar(sx: number, sy: number, aStar: AStarNode[], speed: number, offset: number = 0): boolean {
        this.mAStar = aStar
        this.mOffset = offset
        return this.GetNextStar(sx, sy, 0)
    }

    public Init(sx: number, sy: number, ex: number, ey: number, speed: number, offset: number = 0): boolean {
        this.mAStar = null
        return this.DoInit(sx, sy, ex, ey, speed, offset)
    }

    private DoInit(sx: number, sy: number, ex: number, ey: number, speed: number, offset: number = 0): boolean {
        this.sx = sx
        this.sy = sy
        this.ex = ex
        this.ey = ey

        this.mDir = DirUtil.GetDir(sx, sy, ex, ey)

        let x1 = sx - ex
        let y1 = sy - ey
        let len = Math.sqrt(x1 * x1 + y1 * y1)
        if (offset) {
            if (len <= offset) {
                this.duration = 0
                this.time = 0
                return false
            }
            len -= offset
            let point = egret.$TempPoint
            MathUtils.VectorMagnitude(ex - sx, ey - sy, len, point)
            this.ex = this.sx + point.x
            this.ey = this.sy + point.y
        }
        this.duration = Math.ceil(len / speed * 1000)
        this.time = 0
        return this.duration > 1
    }

    public Update(delta: number, pos: IBattlePoint): number {
        if (!this.duration) {
            return AIUnitMoveData.STATE_FINISH
        }
        let finish = false
        let tmp
        this.time += delta

        let x1 = this.sx
        let y1 = this.sy
        let x2 = this.ex
        let y2 = this.ey
		if (this.time >= this.duration) {
            let det = this.time - this.duration
            finish = true
            tmp = 1
            this.duration = 0
            if (this.mAStar) {
                if (this.GetNextStar(this.ex, this.ey, det)) {
                    finish = false
                }
            }
		} else {
			tmp = this.time / this.duration
		}
		let tempPos = MathUtils.TEMP_POS
        MathUtils.Lerp(x1, y1, x2, y2, tmp, pos)
        return finish ? AIUnitMoveData.STATE_FINISH : AIUnitMoveData.STATE_CONTINUE
    }

    public GetGap(): number {
        return MathUtils.GetDisSqrt(this.sx, this.sy, this.ex, this.ey)
    }

    public Stop() {
        this.duration = 0
        this.mAStar = null
    }
}
