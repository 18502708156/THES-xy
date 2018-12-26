var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ColorMatrixFilter = (function (_super) {
    __extends(ColorMatrixFilter, _super);
    function ColorMatrixFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColorMatrixFilter.prototype.$addTarget = function (target) {
    };
    ColorMatrixFilter.prototype.$removeTarget = function (target) {
    };
    ColorMatrixFilter.prototype.invalidate = function () {
    };
    return ColorMatrixFilter;
}(egret.ColorMatrixFilter));
__reflect(ColorMatrixFilter.prototype, "ColorMatrixFilter");
var Color = (function () {
    function Color() {
    }
    Color.GetStr = function (color) {
        return "0x" + Number(color || 0).toString(16);
    };
    Color.GetFilter = function () {
        return this.grayFilters;
    };
    Color.Red = 0xFF0000;
    Color.Green = 0x00FF00;
    Color.Blue = 0x0000FF;
    Color.White = 0xFFFFFF;
    Color.Black = 0x000000;
    Color.Yellow = 0xFFeb04;
    Color.Cyan = 0x00ffff;
    Color.Magenta = 0xff00ff;
    Color.Gray = 0x808080;
    Color.GrayAttr = 0x7c7c7c;
    Color.GrayLabel = 0x505050;
    Color.l_green_1 = 0x019704;
    Color.l_green_2 = 0x2dff42;
    Color.l_brown_2 = 0x682f00;
    Color.l_gray = 0x94999b;
    Color.GREEN_LIGHT = 0x32FF00;
    Color.l_normal = 0x6e330b;
    Color.NameBlue = 0x00A5FF;
    Color.TitleYellow = 0xF5D061;
    Color.grayFilters = [new ColorMatrixFilter([0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0, 0, 0, 1, 0])];
    //琅琊榜游戏颜色
    Color.WhiteColor = 0xE6F1F4; //白色
    Color.White1Color = 0XCDC7B1; //白色
    Color.YellowWishColor = 0xEAE0B8; //淡黄
    Color.YellowColor = 0xFFCC7C; //黄色
    Color.OrangeColor = 0xFF5A00; //橙色
    Color.RedColor = 0xCD1515; //红色
    Color.GreenColor = 0x04FF10; //绿色
    Color.BludColor = 0x00B1F1; //蓝色
    return Color;
}());
__reflect(Color.prototype, "Color");
// F5D061   黄色文本
// 0x019704 获取方式颜色
//# sourceMappingURL=Color.js.map