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
var GBattleScoreRankPanel = (function (_super) {
    __extends(GBattleScoreRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleScoreRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleRankSkin";
        return _this;
    }
    GBattleScoreRankPanel.prototype.childrenCreated = function () {
        this.labDataTitle.text = "积分";
        this.labRankDataTitle.text = "积分：";
        this.list.itemRenderer = ScoreRankItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    GBattleScoreRankPanel.prototype.UpdateContent = function () {
    };
    GBattleScoreRankPanel.prototype.UpdatePlayerRank = function (rsp) {
        var playerRankList = rsp.scorerank;
        playerRankList.sort(function (lhs, rhs) {
            return lhs.rankData.scoreRank - rhs.rankData.scoreRank;
        });
        var myPlayerRankInfo = this.GetMyPlayerRankInfo(playerRankList);
        if (myPlayerRankInfo) {
            this.labMyRank.text = "" + myPlayerRankInfo.rankData.scoreRank;
            this.labMyData.text = "" + myPlayerRankInfo.rankData.score;
        }
        else {
            var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
            this.labMyRank.text = "未排名";
            this.labMyData.text = "" + (gbPlayerGlobalInfo.mScore || 0);
        }
        this.list.dataProvider = new eui.ArrayCollection(playerRankList);
    };
    GBattleScoreRankPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANGBATTLE_UPDATE_ALLPLAYERRANK, this.UpdatePlayerRank);
        GameGlobal.GangBattleModel.SendAllPlayerRank();
    };
    GBattleScoreRankPanel.prototype.OnClose = function () {
    };
    GBattleScoreRankPanel.prototype.GetMyPlayerRankInfo = function (playerRankList) {
        for (var _i = 0, playerRankList_1 = playerRankList; _i < playerRankList_1.length; _i++) {
            var info = playerRankList_1[_i];
            if (info.dbid == GameGlobal.actorModel.actorID) {
                return info;
            }
        }
    };
    GBattleScoreRankPanel.NAME = "积分排行";
    return GBattleScoreRankPanel;
}(BaseView));
__reflect(GBattleScoreRankPanel.prototype, "GBattleScoreRankPanel", ["ICommonWindowTitle"]);
var ScoreRankItem = (function (_super) {
    __extends(ScoreRankItem, _super);
    function ScoreRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ScoreRankItem.prototype.childrenCreated = function () {
    };
    ScoreRankItem.prototype.dataChanged = function () {
        this.imgBg.visible = this.itemIndex % 2 == 0;
        var gbPlayerRankInfo = this.data;
        this.labNo.text = "" + gbPlayerRankInfo.rankData.scoreRank;
        this.labGangName.text = gbPlayerRankInfo.guildName + ".S" + gbPlayerRankInfo.serverId;
        this.labName.text = "" + gbPlayerRankInfo.name;
        this.labData.text = "" + gbPlayerRankInfo.rankData.score;
    };
    return ScoreRankItem;
}(eui.ItemRenderer));
__reflect(ScoreRankItem.prototype, "ScoreRankItem");
//# sourceMappingURL=GBattleScoreRankPanel.js.map