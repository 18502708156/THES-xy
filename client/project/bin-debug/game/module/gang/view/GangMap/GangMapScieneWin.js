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
var GangMapScieneWin = (function (_super) {
    __extends(GangMapScieneWin, _super);
    function GangMapScieneWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangMapSceneSkin";
        _this._AddClick(_this.btnArr, _this._OnClicked);
        _this._AddClick(_this.btnExchange, _this._OnClicked);
        _this.cbAuto.addEventListener(egret.Event.CHANGE, _this._OnCbAutoChange, _this);
        GameGlobal.GangMapModel.SendGetMapTaskInfo();
        GameGlobal.GangMapModel.SendGetExchange();
        return _this;
    }
    GangMapScieneWin.prototype.OnOpen = function () {
        this.observe(MessageDef.UPDATE_CHAT_ZOOM, this.AdaptationGroup);
        this.observe(MessageDef.GANGMAP_UPDATE_TASKINFO, this.UpdateItem);
        this.observe(MessageDef.GANGMAP_START_PICKPLANT_NOTICY, this._StartPickPlant);
        this.observe(MessageDef.GANGMAP_ONEKEYFINISH, this._UpdateCheckBox);
        this.observe(MessageDef.GANGMAP_HIDEPICKPROGRESS, this._HidePickProgress);
        this.observe(MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, this.UpdateRedPoint);
        GameGlobal.MessageCenter.dispatch(MessageDef.MINICHATSCAL);
        this.bar.maximum = GameGlobal.Config.GuildConfig.collectiontime * 10;
        var multiTime = GameGlobal.Config.GuildConfig.doubletime;
        this.labTip.text = "\u53EC\u96C6\u65F6\u95F4\uFF1A " + multiTime.star + "-" + multiTime.ends + "\u5728\u5E2E\u4F1A\u8FDB\u884C\u4EFB\u52A1\u53EF\u83B7\u5F97\u591A\u500D\u7ECF\u9A8C";
        this.groupPick.visible = false;
        this.AdaptationGroup(false);
        this.UpdateRedPoint();
    };
    GangMapScieneWin.prototype.UpdateItem = function () {
        var taskList = CommonUtils.GetArray(GameGlobal.Config.GuildMapTaskConfig, "id");
        this.item1.SetTaskInfo(1, taskList[0]);
        this.item2.SetTaskInfo(2, taskList[1]);
        this.UpdateRedPoint();
    };
    GangMapScieneWin.prototype.OnClose = function () {
        TimerManager.ins().removeAll(this);
    };
    GangMapScieneWin.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.btnExchange, GameGlobal.GangMapModel.CanItemExchange());
    };
    GangMapScieneWin.prototype._OnClicked = function (e) {
        switch (e.currentTarget) {
            case this.btnArr:
                this.ShowTaskView(this.btnArr.$getScaleX() != -1);
                break;
            case this.btnExchange:
                ViewManager.ins().open(GangMapExchangeWin);
                break;
        }
    };
    GangMapScieneWin.prototype._StartPickPlant = function () {
        this.groupPick.visible = true;
        this.mPickTime = 0;
        var totalTime = GameGlobal.Config.GuildConfig.collectiontime;
        this.AddTimer(100, totalTime * 10, this._UpdateBar);
    };
    GangMapScieneWin.prototype._UpdateCheckBox = function () {
        this.cbAuto.selected = false;
        GameGlobal.GangMapModel.SetAutoTask(false);
    };
    GangMapScieneWin.prototype._HidePickProgress = function () {
        this.groupPick.visible = false;
        this.bar.value = 0;
        TimerManager.ins().removeAll(this);
        this._UpdateCheckBox();
    };
    GangMapScieneWin.prototype._UpdateBar = function () {
        this.mPickTime++;
        this.bar.value = this.mPickTime;
        if (this.mPickTime == GameGlobal.Config.GuildConfig.collectiontime * 10) {
            this.groupPick.visible = false;
            this.bar.value = 0;
        }
    };
    GangMapScieneWin.prototype._OnCbAutoChange = function () {
        GameGlobal.GangMapModel.SetAutoTask(this.cbAuto.selected);
    };
    GangMapScieneWin.prototype.AdaptationGroup = function (zoomFlag) {
        MiniChatPanel.UpdateViewPos(this.groupAdaptation);
        this.groupAdaptation.y -= 160;
        this.ShowTaskView(!zoomFlag);
    };
    GangMapScieneWin.prototype.ShowTaskView = function (isShow) {
        this.btnArr.$setScaleX(isShow ? -1 : 1);
        this.groupTask.visible = isShow;
    };
    GangMapScieneWin.LAYER_LEVEL = LayerManager.UI_GAME_MAP;
    GangMapScieneWin.VIEW_LAYER_LEVEL = ViewLayerLevel.BOTTOM;
    return GangMapScieneWin;
}(BaseEuiView));
__reflect(GangMapScieneWin.prototype, "GangMapScieneWin");
//# sourceMappingURL=GangMapScieneWin.js.map