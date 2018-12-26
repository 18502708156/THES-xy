/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/9 15:51
 * @meaning: 法宝详情item
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
var TreasureShowItem = (function (_super) {
    __extends(TreasureShowItem, _super);
    function TreasureShowItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "TreasureRectIconSkin";
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        return _this;
    }
    TreasureShowItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        //圆形圆圈
        this.baseCricle.setData(this.data);
        if (this.data.name) {
            this.lbName.text = this.data.name;
        }
        //级别
        if (this.data.quality != null) {
            this.lbQuality.text = TreasureShowItem.TREASURETYPE[this.data.quality];
            this.lbQuality.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
            this.lbName.textColor = ItemBase.QUALITY_COLOR[this.data.quality];
        }
    };
    TreasureShowItem.prototype.onClick = function () {
        ViewManager.ins().open(TreasureArrInfo, this.data, null, true); //隐藏按钮
    };
    TreasureShowItem.TREASURETYPE = (_a = {},
        _a[0] = "普通",
        _a[1] = "精良",
        _a[2] = "稀有",
        _a[3] = "卓越",
        _a[4] = "完美",
        _a[5] = "传说",
        _a[6] = "传说",
        _a);
    return TreasureShowItem;
}(eui.ItemRenderer));
__reflect(TreasureShowItem.prototype, "TreasureShowItem");
var _a;
//# sourceMappingURL=TreasureShowItem.js.map