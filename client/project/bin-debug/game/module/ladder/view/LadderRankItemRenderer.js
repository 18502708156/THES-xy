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
var LadderRankItemRenderer = (function (_super) {
    __extends(LadderRankItemRenderer, _super);
    function LadderRankItemRenderer() {
        var _this = _super.call(this) || this;
        _this.skinName = "TiantiRankItem";
        return _this;
    }
    LadderRankItemRenderer.prototype.dataChanged = function () {
        var data = this.data;
        if (this.itemIndex >= 3) {
            this.rankLabel.text = '第' + (this.itemIndex + 1) + '名';
            this.rankImg.source = "";
        }
        else {
            this.rankLabel.text = "";
            this.rankImg.source = LadderRankItemRenderer.RANK_ICON[this.itemIndex];
        }
        this.winNum.text = data.winNum + "场";
        this.levelIcon.SetRank2(data.grade);
        this.nameLabel.text = GameString.GetSerAndName(data.serverid, data.player);
        // UIHelper.SetHead(this.head, data.job, data.sex)
    };
    LadderRankItemRenderer.prototype.getRankIcon = function (pos) {
        switch (pos) {
            case 1: return "ui_wzzb_ks"; //榜首
            case 2: return "ui_wzzb_by"; //榜眼
            case 3: return "ui_wzzb_th"; //探花
            default: return "";
        }
    };
    /////////////////////////////////////////////////////////////////////////////
    LadderRankItemRenderer.RANK_ICON = [
        "ui_kfwz_bm_pmk01",
        "ui_kfwz_bm_pmk02",
        "ui_kfwz_bm_pmk03",
    ];
    return LadderRankItemRenderer;
}(eui.ItemRenderer));
__reflect(LadderRankItemRenderer.prototype, "LadderRankItemRenderer");
//# sourceMappingURL=LadderRankItemRenderer.js.map