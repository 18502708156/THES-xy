var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MathUtils = (function () {
    function MathUtils() {
    }
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    MathUtils.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    ;
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    MathUtils.getRadian = function (angle) {
        return angle / 180 * Math.PI;
    };
    ;
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    ;
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    ;
    MathUtils.GetDisSqrt = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        return disX * disX + disY * disY;
    };
    ;
    MathUtils.GetDisSqrt2 = function (pos1, pos2) {
        var disX = pos1.x - pos2.x;
        var disY = pos1.y - pos2.y;
        return disX * disX + disY * disY;
    };
    /** 角度移动点 */
    MathUtils.getDirMove = function (angle, distance, p) {
        p = p || new egret.Point();
        p.x = Math.cos(angle * Math.PI / 180) * distance;
        p.y = Math.sin(angle * Math.PI / 180) * distance;
        return p;
    };
    ;
    /**
 * 获取一个区间的随机数
 * @param $from 最小值
 * @param $end 最大值
 * @returns {number}
 */
    MathUtils.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    ;
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    MathUtils.limitInteger = function ($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    ;
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    MathUtils.randomArray = function (arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    ;
    MathUtils.RandomArrayData = function (source, n) {
        var len = source.length;
        if (n >= len) {
            return source;
        }
        var result = [];
        for (var i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * len) % len;
            --len;
            result[i] = source[index];
            source[index] = source[len];
        }
        return result;
    };
    MathUtils.RandomArr = function (min, max, n) {
        var len = max - min + 1;
        if (max < min || n > len) {
            return [];
        }
        //初始化给定范围的待选数组
        var source = [];
        for (var i = min; i < min + len; i++) {
            source[i - min] = i;
        }
        return this.RandomArrayData(source, n);
    };
    MathUtils.Clamp = function (value, min, max) {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    };
    MathUtils.GetRandomSign = function () {
        return this.RAN_SIGN[MathUtils.limitInteger(0, 1)];
    };
    MathUtils.Normalize = function (x, y, temp) {
        var magnitude = Math.sqrt(x * x + y * y);
        if (magnitude > 9.9E-06) {
            temp.x = x / magnitude;
            temp.y = y / magnitude;
        }
        else {
            temp.x = 0;
            temp.y = 0;
        }
    };
    MathUtils.Lerp = function (sx, sy, ex, ey, t, temp) {
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }
        temp.x = sx + (ex - sx) * t;
        temp.y = sy + (ey - sy) * t;
    };
    // 长度向量
    MathUtils.VectorMagnitude = function (x, y, length, temp) {
        this.Normalize(x, y, this.TEMP_POS);
        temp.x = Math.round(this.TEMP_POS.x * length);
        temp.y = Math.round(this.TEMP_POS.y * length);
    };
    // 向量延长线
    MathUtils.VectorExtension = function (sx, sy, ex, ey, len, temp) {
        this.VectorMagnitude(ex - sx, ey - sy, len, temp);
        temp.x += ex;
        temp.y += ey;
    };
    MathUtils.RAN_SIGN = [-1, 1];
    MathUtils.TEMP_POS = new egret.Point();
    return MathUtils;
}());
__reflect(MathUtils.prototype, "MathUtils");
//# sourceMappingURL=MathUtils.js.map