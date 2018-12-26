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
var RechargeFeedbackWin = (function (_super) {
    __extends(RechargeFeedbackWin, _super);
    function RechargeFeedbackWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mActivityId = 29;
        _this.mCurIdx = 0;
        _this.skinName = "RechargeFeedbackSkin";
        _this.commonWindowBg.SetTitle("累充回馈");
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 140);
        return _this;
    }
    RechargeFeedbackWin.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
        this.list.itemRenderer = RechargeFeedbackItem;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.list.dataProvider = new eui.ArrayCollection([]);
        this._AddClick(this.btnBuy, this._OnClicked);
        this._AddItemClick(this.list, this._OnItemTap);
    };
    RechargeFeedbackWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.commonWindowBg.OnAdded(this);
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        var config = activityData.GetConfig();
        this.list.dataProvider = new eui.ArrayCollection(config);
        this.list.selectedIndex = 0;
        this.UpdateContent();
    };
    RechargeFeedbackWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    RechargeFeedbackWin.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.list);
        this.UpdateBtnRedPoint();
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        this.labCharge.text = activityData.recharge + "\u5143";
        this.duration.SetColor(0x019704);
        this.duration.SetEndTime(activityData.endTime, DurationLabel.TIMETEXT_TYPE_DDHH_HHMMSS);
        var config = activityData.GetConfig()[this.mCurIdx];
        this.itemList.dataProvider = new eui.ArrayCollection(config.rewards);
        this.btnBuy.enabled = activityData.record[this.mCurIdx] != 4;
        if (activityData.record[this.mCurIdx] == 4) {
            this.btnBuy.label = "已领取";
            return;
        }
        this.btnBuy.label = activityData.recharge >= config.value ? "领取奖励" : "前往充值";
    };
    RechargeFeedbackWin.prototype._OnItemTap = function (e) {
        this.mCurIdx = e.itemIndex;
        this.UpdateContent();
    };
    RechargeFeedbackWin.prototype._OnClicked = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        var config = activityData.GetConfig()[this.mCurIdx];
        if (activityData.recharge >= config.value) {
            GameGlobal.ActivityKaiFuModel.sendReward(this.mActivityId, config.index);
            return;
        }
        RechargeWin.Open();
    };
    RechargeFeedbackWin.prototype.UpdateBtnRedPoint = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        var configList = activityData.GetConfig();
        var list = [];
        for (var _i = 0, configList_1 = configList; _i < configList_1.length; _i++) {
            var config = configList_1[_i];
            list.push(activityData.canGetRecordByIndex(config.index));
        }
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
    };
    RechargeFeedbackWin.LAYER_LEVEL = LayerManager.UI_Main;
    return RechargeFeedbackWin;
}(BaseEuiView));
__reflect(RechargeFeedbackWin.prototype, "RechargeFeedbackWin", ["ICommonWindow"]);
var RechargeFeedbackItem = (function (_super) {
    __extends(RechargeFeedbackItem, _super);
    function RechargeFeedbackItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RechargeFeedbackItem.prototype.dataChanged = function () {
        var config = this.data;
        this.labDesc.text = config.des.replace("%s", "" + config.value);
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(29);
        this.redPoint.visible = activityData.canGetRecordByIndex(config.index);
    };
    return RechargeFeedbackItem;
}(eui.ItemRenderer));
__reflect(RechargeFeedbackItem.prototype, "RechargeFeedbackItem");
//# sourceMappingURL=RechargeFeedbackWin.js.map