/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:51
 * @meaning: 熔炼额外item
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
var BagMakeExItem = (function (_super) {
    __extends(BagMakeExItem, _super);
    function BagMakeExItem() {
        var _this = _super.call(this) || this;
        // 皮肤名称
        _this.skinName = "BagMakeExItemSkin";
        //点击响应
        _this.group.touchChildren = false;
        _this.group.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.OnClick, _this);
        return _this;
    }
    BagMakeExItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        if (this.data.itemConfig && this.data.itemConfig.name) {
            this.nameLabel.text = this.data.itemConfig.name;
            this.nameLabel.textColor = ItemBase.QUALITY_COLOR[this.data.itemConfig.quality];
            this.itemIcon.setData(this.data.itemConfig);
            var equipConfig = GlobalConfig.ins().EquipConfig[this.data.itemConfig.id];
            this.lbPower.text = "战力: " + ItemConfig.CalcAttrScoreValue(equipConfig.attrs);
        }
    };
    BagMakeExItem.prototype.OnClick = function (e) {
        this.checkBox.selected = !this.checkBox.selected;
        this.data.select = this.checkBox.selected;
    };
    return BagMakeExItem;
}(eui.ItemRenderer));
__reflect(BagMakeExItem.prototype, "BagMakeExItem");
//# sourceMappingURL=BagMakeExItem.js.map