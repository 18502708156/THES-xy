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
var BagItemBase = (function (_super) {
    __extends(BagItemBase, _super);
    function BagItemBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BagItemBase.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    BagItemBase.prototype._UpdateRedPoint = function () {
        if (this.data.getCanbeUsed) {
            this.redPoint.visible = this.data.getCanbeUsed();
        }
        else {
            _super.prototype._UpdateRedPoint.call(this);
        }
    };
    BagItemBase.prototype.showDetail = function () {
        if (this.itemConfig.useType == ItemUseType.TYPE00) {
            _super.prototype.showDetail.call(this);
        }
        else if (this.itemConfig.useType == ItemUseType.TYPE04) {
            ViewManager.ins().open(ItemAuctionTipsWin, 0, this.itemConfig.id);
        }
        else {
            if (!ItemData.IsNotTimeLimitUse(this.itemConfig)) {
                _super.prototype.showDetail.call(this);
                return;
            }
            ViewManager.ins().open(ItemUseTipsWin, 0, this.itemConfig.id);
        }
    };
    return BagItemBase;
}(ItemBase));
__reflect(BagItemBase.prototype, "BagItemBase");
//# sourceMappingURL=BagItemBase.js.map