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
var QujingChooseItem = (function (_super) {
    __extends(QujingChooseItem, _super);
    function QujingChooseItem() {
        return _super.call(this) || this;
    }
    QujingChooseItem.prototype.SetItemData = function (config) {
        this.labName.text = config.name;
        this.labName.textColor = ItemBase.GetColorByQuality(config.quality - 1);
        this.imgIcon.source = config.icon;
        this.mQuality = config.quality;
        var idx = 1;
        for (var _i = 0, _a = config.reward; _i < _a.length; _i++) {
            var reward = _a[_i];
            var itemName = "item" + idx;
            if (this[itemName]) {
                this[itemName].visible = true;
                this[itemName].setItemData(reward);
            }
            idx++;
        }
        this.imgChoose.visible = GameGlobal.QujingModel.IsCurQuality(config.quality);
    };
    QujingChooseItem.prototype.SetChooseState = function (quality) {
        this.imgChoose.visible = quality == this.mQuality;
    };
    return QujingChooseItem;
}(eui.Component));
__reflect(QujingChooseItem.prototype, "QujingChooseItem", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=QujingChooseItem.js.map