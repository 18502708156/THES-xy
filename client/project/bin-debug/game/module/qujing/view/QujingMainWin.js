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
var QujingMainWin = (function (_super) {
    __extends(QujingMainWin, _super);
    function QujingMainWin() {
        var _this = _super.call(this) || this;
        _this.mSettingList = [
            { xPos: -200, yPos: 20, time: 22 },
            { xPos: -400, yPos: 180, time: 26 },
            { xPos: -100, yPos: 320, time: 20 },
            { xPos: -300, yPos: 20, time: 24 },
            { xPos: 0, yPos: 240, time: 18 },
            { xPos: -150, yPos: 400, time: 21 },
            { xPos: -350, yPos: 370, time: 25 },
            { xPos: -100, yPos: 80, time: 20 },
            { xPos: -200, yPos: 450, time: 22 },
            { xPos: -250, yPos: 220, time: 23 },
        ];
        _this.skinName = "QujingMainSkin";
        _this.commonWindowBg.SetTitle("取经东归");
        _this._AddClick(_this.btnEscort, _this._OnClick);
        _this._AddClick(_this.btnRecord, _this._OnClick);
        _this._AddClick(_this.labQuilkFinish, _this._OnClick);
        GameGlobal.QujingModel.SendEnterEscortView();
        GameGlobal.QujingModel.SendEscortList();
        return _this;
    }
    QujingMainWin.prototype.childrenCreated = function () {
        this.durationLab.SetColor(0x6e330b);
    };
    QujingMainWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.QUJING_UPDATE_BASEINFO, this.UpdateContent);
        this.observe(MessageDef.QUJING_SHOW_REWARD, this.RecordReward);
        this.observe(MessageDef.QUJING_UPDATE_ESCORTLIST, this.ShowEscortList);
        this.observe(MessageDef.QUJING_SHOW_ROBVIEW, this.ShowRobView);
        this.commonWindowBg.OnAdded(this);
        this.shuffleList();
    };
    QujingMainWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    QujingMainWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnRecord:
                ViewManager.ins().open(QujingRecordWin);
                break;
            case this.btnEscort:
                this.HandleEscort();
                break;
            case this.labQuilkFinish:
                this.HandleQuilkFinish();
                break;
        }
    };
    QujingMainWin.prototype.UpdateContent = function () {
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        var escortMaxCount = GameGlobal.Config.EscortBaseConfig.escortnum;
        this.labCount.text = escortMaxCount - baseInfo.mEscortCount + "/" + escortMaxCount;
        var robMaxCount = GameGlobal.Config.EscortBaseConfig.robtime;
        this.labRobCount.text = robMaxCount - baseInfo.mRobCount + "/" + robMaxCount;
        this.groupEscorting.visible = baseInfo.mState == QujingModel.ESCORT_STATE_DOING;
        this.btnEscort.label = this.GetBtnLabelText(baseInfo.mState);
        this.imgDouble.visible = GameGlobal.QujingModel.IsDoudleAwardTime();
        this.labQuilkFinish.textFlow = (new egret.HtmlTextParser).parser("<font color='#019704'><u>" + "快速完成" + "</u></font>");
        if (this.mItem && this.mItem.parent) {
            this.panel.removeChild(this.mItem);
            this.mItem = null;
        }
        if (baseInfo.mState == QujingModel.ESCORT_STATE_DOING) {
            this.durationLab.SetEndTime(baseInfo.mFinishTime, DurationLabel.TIMETEXT_TYPE_MMSS);
            this.SetMyEscortInfo();
        }
        else {
            this.durationLab.Stop();
        }
    };
    QujingMainWin.prototype.RecordReward = function (info) {
        this.mShowRewardInfo = info;
        ViewManager.ins().open(QujingAwardWin, this.mShowRewardInfo);
    };
    QujingMainWin.prototype.ShowRobView = function (playerId) {
        ViewManager.ins().open(QujingRevengeWin, playerId, QujingModel.ESCORT_FIGHT_TYPE_ROB);
    };
    QujingMainWin.prototype.ShowEscortList = function () {
        var escortList = GameGlobal.QujingModel.escortList;
        var idx = 0;
        for (var _i = 0, escortList_1 = escortList; _i < escortList_1.length; _i++) {
            var escortInfo = escortList_1[_i];
            var settingInfo = this.mSettingList[idx];
            if (!settingInfo)
                break;
            var escortItem = new QujingEscortItem;
            escortItem.$setX(settingInfo.xPos);
            escortItem.$setY(settingInfo.yPos);
            escortItem.SetItem(escortInfo, idx * 0.3, settingInfo);
            this.panel.addChild(escortItem);
            idx++;
        }
    };
    QujingMainWin.prototype.SetMyEscortInfo = function () {
        this.mItem = new QujingEscortItem;
        var escortInfo = new EscortInfo;
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        escortInfo.mFinishTime = baseInfo.mFinishTime;
        escortInfo.mPlayerId = GameGlobal.actorModel.actorID;
        escortInfo.mPlayerName = GameGlobal.actorModel.name;
        escortInfo.mQuality = baseInfo.mQuality;
        escortInfo.mPower = GameGlobal.actorModel.power;
        escortInfo.mRobbedCount = 0;
        this.mItem.SetItem(escortInfo, 0, { time: 18 });
        this.mItem.$setY(350);
        this.panel.addChild(this.mItem);
    };
    QujingMainWin.prototype.HandleQuilkFinish = function () {
        var cost = GameGlobal.Config.EscortBaseConfig.completecostb;
        WarnWin.show("\u662F\u5426\u82B1\u8D39" + cost.count + GameGlobal.actorModel.GetCurrencyName(cost.id) + "\u5FEB\u901F\u5B8C\u6210?", function () {
            Checker.Currency(cost, true, null, function () {
                GameGlobal.QujingModel.SendQuilkFinish();
            });
        }, this);
    };
    QujingMainWin.prototype.HandleEscort = function () {
        var baseInfo = GameGlobal.QujingModel.baseInfo;
        var state = baseInfo.mState;
        switch (state) {
            case QujingModel.ESCORT_STATE_FREE:
                if (baseInfo.mEscortCount == GameGlobal.Config.EscortBaseConfig.escortnum) {
                    UserTips.ins().showTips("今日次数用完了");
                    return;
                }
                if (!GameGlobal.QujingModel.IsDoudleAwardTime()) {
                    ViewManager.ins().open(QujingTipPanel);
                    return;
                }
                ViewManager.ins().open(QujingChooseWin);
                break;
            case QujingModel.ESCORT_STATE_DOING:
                UserTips.ins().showTips("护送中...");
                break;
            case QujingModel.ESCORT_STATE_DONE:
                if (!this.mShowRewardInfo)
                    return;
                ViewManager.ins().open(QujingAwardWin, this.mShowRewardInfo);
                break;
        }
    };
    QujingMainWin.prototype.GetBtnLabelText = function (state) {
        var text = "";
        switch (state) {
            case QujingModel.ESCORT_STATE_FREE:
                text = "前往护送";
                break;
            case QujingModel.ESCORT_STATE_DOING:
                text = "护送中";
                break;
            case QujingModel.ESCORT_STATE_DONE:
                text = "领取奖励";
                break;
        }
        return text;
    };
    QujingMainWin.prototype.GetTimeText = function (diffTime) {
        var min = Math.floor(diffTime / 60);
        var second = diffTime % 60;
        return min + ":" + second;
    };
    QujingMainWin.prototype.shuffleList = function () {
        for (var idx = 0; idx < this.mSettingList.length; ++idx) {
            var swapIdx = MathUtils.limitInteger(idx + 1, this.mSettingList.length - 1);
            var tempInfo = this.mSettingList[swapIdx];
            this.mSettingList[swapIdx] = this.mSettingList[idx];
            this.mSettingList[idx] = tempInfo;
        }
    };
    QujingMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return QujingMainWin;
}(BaseEuiView));
__reflect(QujingMainWin.prototype, "QujingMainWin", ["ICommonWindow"]);
//# sourceMappingURL=QujingMainWin.js.map