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
var InvestmentPlanPanel = (function (_super) {
    __extends(InvestmentPlanPanel, _super);
    function InvestmentPlanPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._activityId = 12;
        _this.skinName = 'InvestmentPlanPanelSkin';
        return _this;
    }
    InvestmentPlanPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = InvestmentItem;
        this.itemList.dataProvider = null;
        var lists = GameGlobal.Config.ActivityType8Config[this._activityId];
        this.itemList.dataProvider = new eui.ArrayCollection(lists);
    };
    InvestmentPlanPanel.prototype.onClick = function (e) {
        if (Checker.Money(MoneyConst.yuanbao, 8888, MoneyConst.yuanbao)) {
            GameGlobal.ActivityKaiFuModel.sendInvestment(this._activityId);
        }
    };
    InvestmentPlanPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.touziBtn, this.onClick);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
    };
    InvestmentPlanPanel.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.itemList);
        TimerManager.ins().remove(this.updateTime, this);
        this._activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (this._activityData) {
            if (this._activityData.status == 0) {
                this.touziBtn.visible = this.timeTxt.visible = true;
                this.flagImg.visible = false;
                this.AddTimer(1000, 0, this.updateTime);
                this.updateTime();
            }
            else {
                this.touziBtn.visible = this.timeTxt.visible = false;
                this.flagImg.visible = true;
            }
        }
    };
    InvestmentPlanPanel.prototype.updateTime = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (this._activityData) {
            this.timeTxt.textFlow = TextFlowMaker.generateTextFlow(this._activityData.getRemindTimeString());
        }
        else {
            this.timeTxt.text = "活动未开启";
        }
    };
    InvestmentPlanPanel.RedPointCheck = function () {
        return GameGlobal.GrowUpModel.checkInvestmentRedPoint();
    };
    InvestmentPlanPanel.NAME = '投资计划';
    return InvestmentPlanPanel;
}(BaseView));
__reflect(InvestmentPlanPanel.prototype, "InvestmentPlanPanel", ["ICommonWindowTitle"]);
var InvestmentItem = (function (_super) {
    __extends(InvestmentItem, _super);
    function InvestmentItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    InvestmentItem.prototype.childrenCreated = function () {
        this.rewardList.itemRenderer = ItemBaseNotName;
        this.rewardList.dataProvider = null;
        this.rewardBtn.visible = false;
        // this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCkick, this);
    };
    InvestmentItem.prototype.onCkick = function (e) {
    };
    InvestmentItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data)
            return;
        var config = this.data;
        this.descTxt.text = '第' + StringUtils.numTenToChinese(config.index) + '天返利';
        this.rewardList.dataProvider = new eui.ArrayCollection(config.item);
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(12);
        if (_activityData) {
            if (_activityData.day < config.index) {
                this.levelTxt.text = _activityData.day + '天/' + config.index + '天';
                this.levelTxt.visible = true;
                this.rewardImg.visible = false;
            }
            else {
                //按钮状态处理
                this.rewardImg.visible = true;
                this.levelTxt.visible = false;
            }
        }
    };
    return InvestmentItem;
}(eui.ItemRenderer));
__reflect(InvestmentItem.prototype, "InvestmentItem");
//# sourceMappingURL=InvestmentPlanPanel.js.map