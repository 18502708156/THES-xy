var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DirUtil = (function () {
    function DirUtil() {
    }
    /**
     * 通过2点，获取8方向值
     */
    DirUtil.Get8DirBy2Point = function (p1, p2) {
        //计算方向
        var angle = MathUtils.getAngle(MathUtils.getRadian2(p1.x, p1.y, p2.x, p2.y));
        return this.Gngle2dir(angle);
    };
    /** 方向转角度 */
    DirUtil.dir2angle = function (dir) {
        dir *= 45;
        dir -= 90;
        return dir;
    };
    /** 角度转方向 */
    DirUtil.Gngle2dir = function (angle) {
        if (angle < -90)
            angle += 360;
        angle += 90;
        if (angle <= 80) {
            return 1;
        }
        if (angle > 80 && angle <= 190) {
            return 3;
        }
        if (angle > 190 && angle <= 280) {
            return 5;
        }
        return 7;
        // return (Math.floor((angle + 90) / 90) % 4) * 2 + 1;
    };
    ;
    /** 反方向 */
    DirUtil.DirOpposit = function (dir) {
        return dir < 4 ? dir + 4 : dir - 4;
    };
    /** 8方向转5方向资源方向 */
    DirUtil.Get5DirBy8Dir = function (dir8) {
        var td = 2 * (dir8 - 4);
        if (td < 0)
            td = 0;
        return dir8 - td;
    };
    /** 获取方向格子坐标后几格的坐标 */
    DirUtil.GetGridByDir = function (dir, pos, p) {
        if (pos === void 0) { pos = 1; }
        if (p === void 0) { p = null; }
        var angle = this.dir2angle(this.DirOpposit(dir));
        var tp = p || new egret.Point();
        MathUtils.getDirMove(angle, pos * MapGrid.CELL_SIZE, tp);
        return tp;
    };
    ;
    DirUtil.GetDir = function (sx, sy, ex, ey) {
        return this.Gngle2dir(MathUtils.getAngle(MathUtils.getRadian2(sx, sy, ex, ey)));
    };
    return DirUtil;
}());
__reflect(DirUtil.prototype, "DirUtil");
//# sourceMappingURL=DirUtil.js.map