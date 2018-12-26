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
var GangMineRankPanel = (function (_super) {
    __extends(GangMineRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangMineRankPanel() {
        return _super.call(this) || this;
    }
    GangMineRankPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMineRankSkin";
        this.commonWindowBg.SetTitle('排名');
    };
    ;
    GangMineRankPanel.prototype.initData = function () {
        this.list.itemRenderer = GangMineRankItem;
        this.list.dataProvider = null;
    };
    GangMineRankPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.GANGMINE_RANK_INFO, this.updateContent);
        GameGlobal.GangMineModel.sendGangMineScoreRank(1);
    };
    GangMineRankPanel.prototype.updateContent = function () {
        var rankInfos = GameGlobal.GangMineModel.mineRanks[1];
        this.list.dataProvider = new eui.ArrayCollection(rankInfos);
        var isMe = false;
        for (var key in rankInfos) {
            if (rankInfos[key].guildId == GameGlobal.actorModel.guildID) {
                this.trank.text = rankInfos[key].rank + '';
                isMe = true;
                break;
            }
        }
        if (!isMe)
            this.trank.text = '未上榜';
    };
    GangMineRankPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    GangMineRankPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return GangMineRankPanel;
}(BaseEuiView));
__reflect(GangMineRankPanel.prototype, "GangMineRankPanel");
//# sourceMappingURL=GangMineRankPanel.js.map