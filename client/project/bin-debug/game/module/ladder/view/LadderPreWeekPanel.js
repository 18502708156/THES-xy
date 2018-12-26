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
var LadderPreWeekPanel = (function (_super) {
    __extends(LadderPreWeekPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LadderPreWeekPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LadderPreWeekPanelSkin";
        return _this;
    }
    LadderPreWeekPanel.prototype.childrenCreated = function () {
        this.rankTab.dataProvider = new eui.ArrayCollection(["王者额外奖励", "王者排名奖励"]);
        this.list0.itemRenderer = LastWeekRankItemRenderer;
        this.list1.itemRenderer = LadderRankRewardRenderer;
    };
    LadderPreWeekPanel.prototype.OnOpen = function () {
        this.AddClick(this.getReward, this.onTap);
        this.rankTab.selectedIndex = 0;
        this.rankTab.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this);
        this._ItemClick();
        this.observe(MessageDef.LADDER_UPWEEK_RANK_UPDATE, this.UpdateContent);
        this.UpdateContent();
    };
    LadderPreWeekPanel.prototype.OnClose = function () {
        this.rankTab.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._ItemClick, this);
    };
    //分别获取排行数据
    LadderPreWeekPanel.prototype._ItemClick = function () {
        var index = this.rankTab.selectedIndex;
        this.scroller0.visible = index == 0;
        this.scroller1.visible = index == 1;
    };
    //领取上周奖励
    LadderPreWeekPanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.getReward:
                this.getReward.visible = false;
                this.GetLadderModel().isCanReward = false;
                this.GetLadderModel().sendGetWeekReward();
                break;
        }
    };
    //更新数据
    LadderPreWeekPanel.prototype.UpdateContent = function () {
        var ladder = this.GetLadderModel();
        var config = ladder.GetSelfUpLevelConfig();
        this.list0.dataProvider = new eui.ArrayCollection(CommonUtils.GetArray(GameGlobal.Config.KingSportsRankConfig, "id"));
        this.list1.dataProvider = new eui.ArrayCollection(CommonUtils.GetArray(GameGlobal.Config.DWKingSportsConfig, "type"));
        this.levtxt.text = ladder.upWeekRank ? ladder.upWeekRank + "" : "未上榜";
        this.winNum.text = "净胜场：" + ladder.upWin + "场";
        this.getReward.visible = ladder.isCanReward;
        if (ladder.playUpTime) {
            this.levelIcon.SetRank2(ladder.upgrade);
        }
        else {
            this.levelIcon.SetRank2(1);
        }
    };
    ;
    LadderPreWeekPanel.prototype.GetLadderModel = function () {
        return GameGlobal.Ladder;
    };
    LadderPreWeekPanel.NAME = "上周";
    return LadderPreWeekPanel;
}(BaseView));
__reflect(LadderPreWeekPanel.prototype, "LadderPreWeekPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LadderPreWeekPanel.js.map