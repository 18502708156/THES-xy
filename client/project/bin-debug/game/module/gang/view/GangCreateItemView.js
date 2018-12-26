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
var GangCreateItemView = (function (_super) {
    __extends(GangCreateItemView, _super);
    function GangCreateItemView() {
        return _super.call(this) || this;
    }
    GangCreateItemView.prototype.SetItemInfo = function (level) {
        this.mIdx = level;
        var config = GameGlobal.Config.GuildCreateConfig[level];
        this.labTitle.text = level + "\u7EA7\u5E2E\u4F1A";
        this.labMaxMemTip.text = "\u5E2E\u4F1A\u6210\u5458\u4E0A\u9650\uFF1A" + GangConst.GetMaxMemberCount(level) + "\u4EBA";
        this.labCopyTip.text = level > 1 ? "\u5F00\u542F" + level + "\u7EA7\u526F\u672C" : "";
        this.labLevelTip.text = "1.\u7B49\u7EA7\u8FBE\u5230" + config.level + "\u7EA7";
        this.labVipLevelTip.text = "2.VIP\u7B49\u7EA7\u8FBE\u5230" + config.vipLv + "\u7EA7";
        this.priceIcon.type = config.cost.id;
        this.priceIcon.price = config.cost.count;
    };
    GangCreateItemView.prototype.SetDoubleImg = function (b) {
        this.imgDouble.visible = b;
    };
    GangCreateItemView.prototype.SetChooseInfo = function (chooseIdx) {
        this.imgChoose.visible = this.mIdx == chooseIdx;
    };
    return GangCreateItemView;
}(eui.Component));
__reflect(GangCreateItemView.prototype, "GangCreateItemView");
//# sourceMappingURL=GangCreateItemView.js.map