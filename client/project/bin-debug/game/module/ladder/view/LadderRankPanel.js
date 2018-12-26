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
var LadderRankPanel = (function (_super) {
    __extends(LadderRankPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LadderRankPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LadderRankPanelSkin";
        return _this;
    }
    LadderRankPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = LadderRankItemRenderer;
    };
    LadderRankPanel.prototype.UpdateContent = function () {
        var datas = GameGlobal.Ladder.mRankList;
        // let selfRank = 0
        // let i = 0
        // for (let data of datas) {
        // 	if (data.id == GameGlobal.actorModel.actorID) {
        // 		selfRank = i
        // 		break
        // 	}
        // 	++i
        // }
        var selfRank = GameGlobal.Ladder.rank;
        var config = this.GetLadderModel().GetSelfLevelConfig();
        this.list.dataProvider = new eui.ArrayCollection(datas);
        this.myRank.text = selfRank ? "排名：" + selfRank : "排名：未上榜";
        this.WinNum.text = "净胜场：" + this.GetLadderModel().winNum + "场";
        this.levelIcon.SetRank2(this.GetLadderModel().grade);
    };
    LadderRankPanel.prototype.GetLadderModel = function () {
        return GameGlobal.Ladder;
    };
    LadderRankPanel.NAME = "排名";
    return LadderRankPanel;
}(BaseView));
__reflect(LadderRankPanel.prototype, "LadderRankPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LadderRankPanel.js.map