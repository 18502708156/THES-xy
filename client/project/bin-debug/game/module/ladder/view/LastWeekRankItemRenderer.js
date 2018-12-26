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
var LastWeekRankItemRenderer = (function (_super) {
    __extends(LastWeekRankItemRenderer, _super);
    function LastWeekRankItemRenderer() {
        return _super.call(this) || this;
    }
    LastWeekRankItemRenderer.prototype.getRankImg = function (index) {
        switch (index) {
            case 1: return "ui_wzzb_ks"; //魁首
            case 2: return "ui_wzzb_by"; //榜眼
            case 3: return "ui_wzzb_th"; //探花
            default: return "";
        }
    };
    //排名数据更新
    LastWeekRankItemRenderer.prototype.dataChanged = function () {
        this.index = this.itemIndex + 1;
        var config = this.data;
        if (this.itemIndex >= 3) {
            this.rankLabel.text = '第' + (this.itemIndex + 1) + '名';
            this.rankImg.source = "";
        }
        else {
            this.rankLabel.text = "";
            this.rankImg.source = LadderRankItemRenderer.RANK_ICON[this.itemIndex];
        }
        this.item1.data = config.rankreward[0];
        var rankData = GameGlobal.Ladder.upRankList[this.itemIndex];
        if (rankData) {
            this.nameLabel.text = GameString.GetSerAndName(rankData.serverid, rankData.player);
            this.winNum.text = "净胜场：" + rankData.winNum + "场";
            this.levelIcon.SetRank2(rankData.grade);
            UIHelper.SetVisible(this.winNum, true);
            // this.head.visible = true
            // UIHelper.SetHead(this.head, rankData.job, rankData.sex)
        }
        else {
            var nameStr = LadderConst.GetRankIconTwo(5);
            this.nameLabel.text = nameStr + "级别第" + this.index + "名";
            this.levelIcon.SetRank2(18);
            UIHelper.SetVisible(this.winNum, false);
            // this.head.visible = false
        }
    };
    LastWeekRankItemRenderer.prototype.GetTianTiRankConfig = function () {
        return GlobalConfig.ins().DWKingSportsConfig;
    };
    return LastWeekRankItemRenderer;
}(eui.ItemRenderer));
__reflect(LastWeekRankItemRenderer.prototype, "LastWeekRankItemRenderer");
//# sourceMappingURL=LastWeekRankItemRenderer.js.map