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
var GodPieListItem = (function (_super) {
    __extends(GodPieListItem, _super);
    function GodPieListItem() {
        return _super.call(this) || this;
    }
    GodPieListItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseEffe;
        this.scroller.horizontalScrollBar.autoVisibility = false;
        this.send.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    GodPieListItem.prototype._OnClick = function () {
        var data = this.data;
        GodPieWin.BuyData(data.info, data.index);
    };
    GodPieListItem.prototype.dataChanged = function () {
        var data = this.data;
        var info = data.info;
        GodPieWin.ShowTargetData(this.contion, this.consumeLabel, this.list, this.buyGroup, this.geted, this.send, info, data.index);
    };
    return GodPieListItem;
}(eui.ItemRenderer));
__reflect(GodPieListItem.prototype, "GodPieListItem");
//# sourceMappingURL=GodPieListItem.js.map