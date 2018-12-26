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
var LadderRankRewardRenderer = (function (_super) {
    __extends(LadderRankRewardRenderer, _super);
    function LadderRankRewardRenderer() {
        var _this = _super.call(this) || this;
        _this.skinName = "LadderRankRewardItemSkin";
        return _this;
    }
    LadderRankRewardRenderer.prototype.dataChanged = function () {
        var config = this.data;
        this.img1.source = LadderConst.GetMiddleIcon(6 - config.type);
        this.img2.source = LadderRankRewardRenderer.GRADE_NAME_BIG_IMG[config.type];
        this.item.data = config.rankreward[0];
    };
    /////////////////////////////////////////////////////////////////////////////
    LadderRankRewardRenderer.GRADE_NAME_BIG_IMG = (_a = {},
        _a[1] = "font_kfwz_zqwz",
        _a[2] = "font_kfwz_yhzs",
        _a[3] = "font_kfwz_yyhj",
        _a[4] = "font_kfwz_zxby",
        _a[5] = "font_kfwz_jjqt",
        _a);
    return LadderRankRewardRenderer;
}(eui.ItemRenderer));
__reflect(LadderRankRewardRenderer.prototype, "LadderRankRewardRenderer");
var _a;
//# sourceMappingURL=LadderRankRewardRenderer.js.map