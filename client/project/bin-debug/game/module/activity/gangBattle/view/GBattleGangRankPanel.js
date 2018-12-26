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
var GBattleGangRankPanel = (function (_super) {
    __extends(GBattleGangRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleGangRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleGangRankSkin";
        return _this;
    }
    GBattleGangRankPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = GangRankIem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    GBattleGangRankPanel.prototype.UpdateContent = function () {
    };
    GBattleGangRankPanel.prototype.UpdateRankInfo = function (gangRankList) {
        var myGangRankInfo = this.GetMyGangRankInfo(gangRankList);
        this.labMyRank.text = "" + (myGangRankInfo ? myGangRankInfo.rankData.injureRank : "未排名");
        this.labMyData.text = "" + (myGangRankInfo ? myGangRankInfo.rankData.injure : 0);
        gangRankList.sort(function (lhs, rhs) {
            return lhs.rankData.injureRank - rhs.rankData.injureRank;
        });
        this.list.dataProvider = new eui.ArrayCollection(gangRankList);
    };
    GBattleGangRankPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANGBATTLE_UPDATE_ALLGANGRANK, this.UpdateRankInfo);
        GameGlobal.GangBattleModel.SendAllGangRank();
    };
    GBattleGangRankPanel.prototype.OnClose = function () {
    };
    GBattleGangRankPanel.prototype.GetMyGangRankInfo = function (gangRankList) {
        for (var _i = 0, gangRankList_1 = gangRankList; _i < gangRankList_1.length; _i++) {
            var info = gangRankList_1[_i];
            if (info.guildId == GameGlobal.actorModel.guildID) {
                return info;
            }
        }
    };
    GBattleGangRankPanel.NAME = "帮会排行";
    return GBattleGangRankPanel;
}(BaseView));
__reflect(GBattleGangRankPanel.prototype, "GBattleGangRankPanel", ["ICommonWindowTitle"]);
var GangRankIem = (function (_super) {
    __extends(GangRankIem, _super);
    function GangRankIem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangRankIem.prototype.childrenCreated = function () {
    };
    GangRankIem.prototype.dataChanged = function () {
        this.imgBg.visible = this.itemIndex % 2 == 0;
        var gangRankInfo = this.data;
        this.labNo.text = "" + gangRankInfo.rankData.injureRank;
        this.labGangName.text = gangRankInfo.guildName + ".S" + gangRankInfo.serverId;
        this.labData.text = "" + gangRankInfo.rankData.injure;
    };
    return GangRankIem;
}(eui.ItemRenderer));
__reflect(GangRankIem.prototype, "GangRankIem");
//# sourceMappingURL=GBattleGangRankPanel.js.map