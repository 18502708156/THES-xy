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
var GainGoodsItem = (function (_super) {
    __extends(GainGoodsItem, _super);
    function GainGoodsItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "GainGoodsItemSkin";
        return _this;
    }
    GainGoodsItem.prototype.dataChanged = function () {
        if (this.data) {
            var t = this.data[0];
            this.data[1],
                this.data[2];
            this.desc.text = t;
        }
    };
    ;
    Object.defineProperty(GainGoodsItem.prototype, "userData", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    return GainGoodsItem;
}(eui.ItemRenderer));
__reflect(GainGoodsItem.prototype, "GainGoodsItem");
//# sourceMappingURL=GainGoodsItem.js.map