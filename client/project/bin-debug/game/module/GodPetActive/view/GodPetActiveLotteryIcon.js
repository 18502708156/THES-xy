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
var GodPetActiveLotteryIcon = (function (_super) {
    __extends(GodPetActiveLotteryIcon, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GodPetActiveLotteryIcon() {
        return _super.call(this) || this;
    }
    GodPetActiveLotteryIcon.prototype.setItemAward = function (itemData) {
        this.item.setItemAward(itemData.type, itemData.id, itemData.count);
        this.imgGain.visible = GameGlobal.GodPetActiveModel.HasGain(itemData.id);
    };
    GodPetActiveLotteryIcon.prototype.showChoose = function (b) {
        this.item.imgChoose.visible = b;
    };
    return GodPetActiveLotteryIcon;
}(eui.Component));
__reflect(GodPetActiveLotteryIcon.prototype, "GodPetActiveLotteryIcon", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GodPetActiveLotteryIcon.js.map