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
var LadderWinnerPanel = (function (_super) {
    __extends(LadderWinnerPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LadderWinnerPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LadderWinnerSkin";
        _this.list.itemRenderer = ItemBaseNotName;
        return _this;
    }
    LadderWinnerPanel.prototype.OnOpen = function () {
        var date = new Date(GameServer.serverTime * 1000);
        date.setDate(date.getDate() - DateUtils.GetDay(date));
        this.infoLabel.textFlow = TextFlowMaker.generateTextFlow(DateUtils.GetFormatSecond(date.getTime() * 0.001, DateUtils.TIME_FORMAT_14) + "|C:0xcd3d0b&T:登上王者宝座|");
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.KingSportsBaseConfig.worshipreward);
        GameGlobal.Ladder.SendGetWinnerInfo();
        this.AddClick(this.goBtn, this._OnClick);
        this.observe(MessageDef.LADDER_WINNER, this.UpdateContent);
        this.UpdateContent();
    };
    LadderWinnerPanel.prototype._OnClick = function () {
        GameGlobal.Ladder.SendWorship();
    };
    LadderWinnerPanel.prototype.UpdateContent = function () {
        this.UpdateBtnState();
        this.noneLabel.visible = true;
        this.infoLabel.visible = false;
        this.nameLabel.visible = false;
        var data = GameGlobal.Ladder.mWinnerRecords;
        if (!data) {
            return;
        }
        if (!data.shows) {
            return;
        }
        this.noneLabel.visible = false;
        this.infoLabel.visible = true;
        this.nameLabel.visible = true;
        this.nameLabel.text = GameString.GetSerAndName(data.shows.serverid, data.shows.name);
        var show = data.shows;
        if (show) {
            this.roleShowPanel.SetShowImage({ shows: show.shows, job: show.job, sex: show.sex });
        }
    };
    LadderWinnerPanel.prototype.UpdateBtnState = function () {
        var worship = GameGlobal.Ladder.mWinnerRecords ? GameGlobal.Ladder.mWinnerRecords.worship : true;
        if (worship) {
            this.goBtn.enabled = false;
            this.goBtn.label = "已膜拜";
        }
        else {
            this.goBtn.enabled = true;
            this.goBtn.label = "膜拜";
        }
    };
    LadderWinnerPanel.NAME = "跨服王者";
    return LadderWinnerPanel;
}(BaseView));
__reflect(LadderWinnerPanel.prototype, "LadderWinnerPanel");
//# sourceMappingURL=LadderWinnerPanel.js.map