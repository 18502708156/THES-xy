var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var PointF = (function () {
    function PointF() {
    }
    return PointF;
}());
__reflect(PointF.prototype, "PointF");
var Bezier = (function () {
    function Bezier(cp) {
        this.pos = cp[0];
        var cx = this.cx = 3.0 * (cp[1].x - cp[0].x);
        var bx = this.bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        var ax = this.ax = cp[3].x - cp[0].x - cx - bx;
        var cy = this.cy = 3.0 * (cp[1].y - cp[0].y);
        var by = this.by = 3.0 * (cp[2].y - cp[1].y) - cy;
        var ay = this.ay = cp[3].y - cp[0].y - cy - by;
    }
    // public static  draw_bezier_curves( points,  count,  step)  
    //     {  
    //         let bezier_curves_points = []
    //         let t = 0;  
    //         do  
    //         {  
    //             let temp_point = bezier_interpolation_func(t, points, count);    // 计算插值点  
    //             t += step;  
    //             bezier_curves_points.Add(temp_point);  
    //         }  
    //         while (t <= 1 && count > 1);    // 一个点的情况直接跳出.  
    //         return bezier_curves_points.ToArray();  // 曲线轨迹上的所有坐标点  
    //     } 
    // private static calc_combination_number( n,  k)  
    //     {  
    //         let result = []
    //         for (let i = 1; i <= n; i++)  
    //         {  
    //             result[i] = 1;  
    //             for (let j = i - 1; j >= 1; j--)  
    //                 result[j] += result[j - 1];  
    //             result[0] = 1;  
    //         }  
    //         return result[k];  
    //     } 
    // 	private static bezier_interpolation_func( t,  points,  count)  
    //     {  
    //         let PointF = new PointF();  
    //         let part = []
    //         var sum_x = 0, sum_y = 0;  
    //         for (let i = 0; i < count; i++)  
    //         {  
    //             let tmp;  
    //             let n_order = count - 1;    // 阶数  
    //             tmp = Bezier.calc_combination_number(n_order, i);  
    //             sum_x += (float)(tmp * points[i].X * Math.Pow((1 - t), n_order - i) * Math.Pow(t, i));  
    //             sum_y += (float)(tmp * points[i].Y * Math.Pow((1 - t), n_order - i) * Math.Pow(t, i));  
    //         }  
    //         PointF.X = sum_x;  
    //         PointF.Y = sum_y;  
    //         return PointF;  
    //     } 
    Bezier.PointOnCubicBezier = function (cp, t, pos) {
        var ax, bx, cx;
        var ay, by, cy;
        var tSquared, tCubed;
        cx = 3.0 * (cp[1].x - cp[0].x);
        bx = 3.0 * (cp[2].x - cp[1].x) - cx;
        ax = cp[3].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[1].y - cp[0].y);
        by = 3.0 * (cp[2].y - cp[1].y) - cy;
        ay = cp[3].y - cp[0].y - cy - by;
        tSquared = t * t;
        tCubed = tSquared * t;
        pos.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        pos.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    };
    Bezier.prototype.Get = function (t, pos) {
        var tSquared = t * t;
        var tCubed = tSquared * t;
        pos.x = (this.ax * tCubed) + (this.bx * tSquared) + (this.cx * t) + this.pos.x;
        pos.y = (this.ay * tCubed) + (this.by * tSquared) + (this.cy * t) + this.pos.y;
    };
    return Bezier;
}());
__reflect(Bezier.prototype, "Bezier");
//# sourceMappingURL=Bezier.js.map