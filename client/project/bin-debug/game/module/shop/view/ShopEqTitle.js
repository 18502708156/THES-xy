/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/10 14:51
 * @meaning: 标题
 *
 **/
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
var ShopEqTitle = (function (_super) {
    __extends(ShopEqTitle, _super);
    function ShopEqTitle() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "ShopEquipTitleSkin";
        return _this;
    }
    ShopEqTitle.prototype.dataChanged = function () {
        this.lbNe.text = this.data.strName;
    };
    return ShopEqTitle;
}(eui.ItemRenderer));
__reflect(ShopEqTitle.prototype, "ShopEqTitle");
//# sourceMappingURL=ShopEqTitle.js.map