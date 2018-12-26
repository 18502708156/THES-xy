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
var GBattleDamageRankPanel = (function (_super) {
    __extends(GBattleDamageRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GBattleDamageRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "GBattleRankSkin";
        return _this;
    }
    GBattleDamageRankPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = DamageRankItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    GBattleDamageRankPanel.prototype.UpdateContent = function () {
    };
    GBattleDamageRankPanel.prototype.UpdatePlayerRank = function (rsp) {
        var playerRankList = rsp.injurerank;
        playerRankList.sort(function (lhs, rhs) {
            return lhs.rankData.injureRank - rhs.rankData.injureRank;
        });
        var myPlayerRankInfo = this.GetMyPlayerRankInfo(playerRankList);
        if (myPlayerRankInfo) {
            this.labMyRank.text = "" + myPlayerRankInfo.rankData.injureRank;
            this.labMyData.text = "" + myPlayerRankInfo.rankData.injure;
        }
        else {
            var myPlayerInfo = GameGlobal.GangBattleModel.myGBattleInfo;
            this.labMyRank.text = "未排名";
            this.labMyData.text = "" + (myPlayerInfo.mGBRankInfo.mDamage || 0);
        }
        this.list.dataProvider = new eui.ArrayCollection(playerRankList);
    };
    GBattleDamageRankPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.GANGBATTLE_UPDATE_ALLPLAYERRANK, this.UpdatePlayerRank);
        GameGlobal.GangBattleModel.SendAllPlayerRank();
    };
    GBattleDamageRankPanel.prototype.OnClose = function () {
    };
    GBattleDamageRankPanel.prototype.GetMyPlayerRankInfo = function (playerRankList) {
        for (var _i = 0, playerRankList_1 = playerRankList; _i < playerRankList_1.length; _i++) {
            var info = playerRankList_1[_i];
            if (info.dbid == GameGlobal.actorModel.actorID) {
                return info;
            }
        }
    };
    GBattleDamageRankPanel.NAME = "个人排行";
    return GBattleDamageRankPanel;
}(BaseView));
__reflect(GBattleDamageRankPanel.prototype, "GBattleDamageRankPanel", ["ICommonWindowTitle"]);
var DamageRankItem = (function (_super) {
    __extends(DamageRankItem, _super);
    function DamageRankItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    DamageRankItem.prototype.childrenCreated = function () {
    };
    DamageRankItem.prototype.dataChanged = function () {
        this.imgBg.visible = this.itemIndex % 2 == 0;
        var gbPlayerRankInfo = this.data;
        this.labNo.text = "" + gbPlayerRankInfo.rankData.injureRank;
        this.labGangName.text = gbPlayerRankInfo.guildName + ".S" + gbPlayerRankInfo.sex;
        this.labName.text = "" + gbPlayerRankInfo.name;
        this.labData.text = "" + gbPlayerRankInfo.rankData.injure;
    };
    return DamageRankItem;
}(eui.ItemRenderer));
__reflect(DamageRankItem.prototype, "DamageRankItem");
//# sourceMappingURL=GBattleDamageRankPanel.js.map