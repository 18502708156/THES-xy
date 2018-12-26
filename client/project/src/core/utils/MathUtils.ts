class MathUtils {
	/**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    public static getAngle(radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    public static getRadian(angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getRadian2(p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getDistance(p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };

    public static GetDisSqrt(p1X: number, p1Y: number, p2X: number, p2Y: number) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        return disX * disX + disY * disY;
    };

    public static GetDisSqrt2(pos1: {x: number, y: number}, pos2: {x: number, y: number}) {
        var disX = pos1.x - pos2.x;
        var disY = pos1.y - pos2.y;
        return disX * disX + disY * disY;
    }

    /** 角度移动点 */
    public static getDirMove(angle, distance, p?: egret.Point) {
        p = p || new egret.Point();
        p.x = Math.cos(angle * Math.PI / 180) * distance;
        p.y = Math.sin(angle * Math.PI / 180) * distance;
        return p;
    };
    /**
 * 获取一个区间的随机数
 * @param $from 最小值
 * @param $end 最大值
 * @returns {number}
 */
    public static limit($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(帧数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limitInteger($from, $end) {
        return Math.round(this.limit($from, $end));
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public static randomArray(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };

    public static RandomArrayData<T>(source: T[], n: number): T[] {
        let len = source.length
        if (n >= len) {
            return source
        }
        let result = []
        for (let i = 0; i < n; i++) {
            var index = Math.floor(Math.random() * len) % len;
            --len
            result[i] = source[index];
            source[index] = source[len];
        }
        return result;
    }

    public static RandomArr(min: number, max: number, n: number): number[] {
        let len = max - min + 1;
        if (max < min || n > len) {
            return [];
        }
        //初始化给定范围的待选数组
        let source = []
        for (let i = min; i < min + len; i++) {
            source[i - min] = i;
        }
        return this.RandomArrayData(source, n)
    }

    public static Clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min
        }
        if (value > max) {
            return max
        }
        return value
    }

    private static RAN_SIGN = [-1, 1]

    public static GetRandomSign(): number {
        return this.RAN_SIGN[MathUtils.limitInteger(0, 1)]
    }

    public static TEMP_POS = new egret.Point()

    public static Normalize(x: number, y: number, temp: egret.Point) {
        let magnitude = Math.sqrt(x * x + y * y);
        if (magnitude > 9.9E-06) {
            temp.x = x / magnitude
            temp.y = y / magnitude
        } else {
            temp.x = 0
            temp.y = 0
        }
    }

    public static Lerp(sx: number, sy: number, ex: number, ey: number, t: number, temp: { x: number, y: number }) {
        if (t > 1) {
            t = 1
        } else if (t < 0) {
            t = 0
        }
        temp.x = sx + (ex - sx) * t
        temp.y = sy + (ey - sy) * t
    }

    // 长度向量
    public static VectorMagnitude(x: number, y: number, length: number, temp: egret.Point): void {
        this.Normalize(x, y, this.TEMP_POS)
        temp.x = Math.round(this.TEMP_POS.x * length)
        temp.y = Math.round(this.TEMP_POS.y * length)
    }

    // 向量延长线
    public static VectorExtension(sx: number, sy: number, ex: number, ey: number, len: number, temp: egret.Point) {
        this.VectorMagnitude(ex - sx, ey - sy, len, temp)
        temp.x += ex
        temp.y += ey
    }
}