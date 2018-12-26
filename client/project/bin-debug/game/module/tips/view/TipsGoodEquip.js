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
var TipsGoodEquip = (function (_super) {
    __extends(TipsGoodEquip, _super);
    function TipsGoodEquip() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.isUsing = false;
        _this.skinName = "OrangeEquipNoticeSkin";
        return _this;
    }
    Object.defineProperty(TipsGoodEquip.prototype, "data", {
        set: function (item) {
            this.item.data = item;
            this.item.isShowName(false);
            this.itemName.text = item.itemConfig.name;
            this.itemName.textColor = ItemBaseEffe.QUALITY_TIP_COLOR[item.itemConfig.quality];
            if (!this.mc) {
                this.mc = new MovieObject;
                this.mc.x = 230;
                this.mc.y = 75;
                this.mc.scaleX = 1.14;
                this.mc.scaleY = 1.2;
            }
            this.addChild(this.mc);
            this.mc.LoadByUrl(ResDataPath.GetUIEffePath("ui_yhy004"), -1, true);
        },
        enumerable: true,
        configurable: true
    });
    return TipsGoodEquip;
}(eui.Component));
__reflect(TipsGoodEquip.prototype, "TipsGoodEquip");
//# sourceMappingURL=TipsGoodEquip.js.map