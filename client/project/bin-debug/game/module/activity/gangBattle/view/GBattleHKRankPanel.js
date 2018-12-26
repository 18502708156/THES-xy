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
var GBattleHKRankPanel = (function (_super) {
    __extends(GBattleHKRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleHKRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleRankSkin";
        return _this;
    }
    GBattleHKRankPanel.prototype.childrenCreated = function () {
        this.labDataTitle.text = "击杀次数";
        this.labRankDataTitle.text = "击杀：";
        this.list.itemRenderer = HKRankItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    GBattleHKRankPanel.prototype.UpdateContent = function () {
    };
    GBattleHKRankPanel.prototype.UpdatePlayerRank = function (rsp) {
        var playerRankList = rsp.killrank;
        playerRankList.sort(function (lhs, rhs) {
            return lhs.rankData.killRank - rhs.rankData.killRank;
        });
        var myPlayerRankInfo = this.GetMyPlayerRankInfo(playerRankList);
        if (myPlayerRankInfo) {
            this.labMyRank.text = "" + myPlayerRankInfo.rankData.killRank;
            this.labMyData.text = "" + myPlayerRankInfo.rankData.kill;
        }
        else {
            var gbPlayerGlobalInfo = GameGlobal.GangBattleModel.gbPlayerGlobalInfo;
            this.labMyRank.text = "未排名";
            this.labMyData.text = "" + (gbPlayerGlobalInfo.mKill || 0);
        }
        this.list.dataProvider = new eui.ArrayCollection(playerRankList);
    };
    GBattleHKRankPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANGBATTLE_UPDATE_ALLPLAYERRANK, this.UpdatePlayerRank);
        GameGlobal.GangBattleModel.SendAllPlayerRank();
    };
    GBattleHKRankPanel.prototype.OnClose = function () {
    };
    GBattleHKRankPanel.prototype.GetMyPlayerRankInfo = function (playerRankList) {
        for (var _i = 0, playerRankList_1 = playerRankList; _i < playerRankList_1.length; _i++) {
            var info = playerRankList_1[_i];
            if (info.dbid == GameGlobal.actorModel.actorID) {
                return info;
            }
        }
    };
    GBattleHKRankPanel.NAME = "击杀排行";
    return GBattleHKRankPanel;
}(BaseView));
__reflect(GBattleHKRankPanel.prototype, "GBattleHKRankPanel", ["ICommonWindowTitle"]);
var HKRankItem = (function (_super) {
    __extends(HKRankItem, _super);
    function HKRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    HKRankItem.prototype.childrenCreated = function () {
    };
    HKRankItem.prototype.dataChanged = function () {
        this.imgBg.visible = this.itemIndex % 2 == 0;
        var gbPlayerRankInfo = this.data;
        this.labNo.text = "" + gbPlayerRankInfo.rankData.killRank;
        this.labGangName.text = gbPlayerRankInfo.guildName + ".S" + gbPlayerRankInfo.serverId;
        this.labName.text = "" + gbPlayerRankInfo.name;
        this.labData.text = "" + gbPlayerRankInfo.rankData.kill;
    };
    return HKRankItem;
}(eui.ItemRenderer));
__reflect(HKRankItem.prototype, "HKRankItem");
//# sourceMappingURL=GBattleHKRankPanel.js.map