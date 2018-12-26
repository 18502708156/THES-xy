var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIUnitMoveData = (function () {
    function AIUnitMoveData() {
        this.mOffset = 0;
        this.mAStar = null;
        this.mDir = 1;
    }
    AIUnitMoveData.prototype.GetNextStar = function (x, y, t) {
        if (!this.mAStar) {
            return false;
        }
        var data = this.mAStar.pop();
        if (!data) {
            return false;
        }
        if (!this.mAStar.length) {
            this.mAStar = null;
        }
        // let sx = this.sx = x
        // let sy = this.sy = y
        // let ex = this.ex = data.nX
        // let ey = this.ey = data.nY
        if (this.DoInit(x, y, Const.PosToPixel(data.nX), Const.PosToPixel(data.nY), MoveTeam.MOVE_SPEED, this.mOffset)) {
            this.time = t;
            return true;
        }
        return false;
    };
    AIUnitMoveData.prototype.InitByAStar = function (sx, sy, aStar, speed, offset) {
        if (offset === void 0) { offset = 0; }
        this.mAStar = aStar;
        this.mOffset = offset;
        return this.GetNextStar(sx, sy, 0);
    };
    AIUnitMoveData.prototype.Init = function (sx, sy, ex, ey, speed, offset) {
        if (offset === void 0) { offset = 0; }
        this.mAStar = null;
        return this.DoInit(sx, sy, ex, ey, speed, offset);
    };
    AIUnitMoveData.prototype.DoInit = function (sx, sy, ex, ey, speed, offset) {
        if (offset === void 0) { offset = 0; }
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.mDir = DirUtil.GetDir(sx, sy, ex, ey);
        var x1 = sx - ex;
        var y1 = sy - ey;
        var len = Math.sqrt(x1 * x1 + y1 * y1);
        if (offset) {
            if (len <= offset) {
                this.duration = 0;
                this.time = 0;
                return false;
            }
            len -= offset;
            var point = egret.$TempPoint;
            MathUtils.VectorMagnitude(ex - sx, ey - sy, len, point);
            this.ex = this.sx + point.x;
            this.ey = this.sy + point.y;
        }
        this.duration = Math.ceil(len / speed * 1000);
        this.time = 0;
        return this.duration > 1;
    };
    AIUnitMoveData.prototype.Update = function (delta, pos) {
        if (!this.duration) {
            return AIUnitMoveData.STATE_FINISH;
        }
        var finish = false;
        var tmp;
        this.time += delta;
        var x1 = this.sx;
        var y1 = this.sy;
        var x2 = this.ex;
        var y2 = this.ey;
        if (this.time >= this.duration) {
            var det = this.time - this.duration;
            finish = true;
            tmp = 1;
            this.duration = 0;
            if (this.mAStar) {
                if (this.GetNextStar(this.ex, this.ey, det)) {
                    finish = false;
                }
            }
        }
        else {
            tmp = this.time / this.duration;
        }
        var tempPos = MathUtils.TEMP_POS;
        MathUtils.Lerp(x1, y1, x2, y2, tmp, pos);
        return finish ? AIUnitMoveData.STATE_FINISH : AIUnitMoveData.STATE_CONTINUE;
    };
    AIUnitMoveData.prototype.GetGap = function () {
        return MathUtils.GetDisSqrt(this.sx, this.sy, this.ex, this.ey);
    };
    AIUnitMoveData.prototype.Stop = function () {
        this.duration = 0;
        this.mAStar = null;
    };
    AIUnitMoveData.STATE_FINISH = 2;
    AIUnitMoveData.STATE_CONTINUE = 1;
    AIUnitMoveData.STATE_NONE = 0;
    return AIUnitMoveData;
}());
__reflect(AIUnitMoveData.prototype, "AIUnitMoveData");
//# sourceMappingURL=AIUnitData.js.map