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
var GrowUpPanel = (function (_super) {
    __extends(GrowUpPanel, _super);
    function GrowUpPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.lists = [];
        _this._activityId = 11;
        _this.skinName = 'GrowUpPanelSkin';
        return _this;
    }
    GrowUpPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = GrowUpItem;
        this.itemList.dataProvider = null;
        this.lists = GameGlobal.Config.ActivityType24Config[this._activityId];
        this.itemList.dataProvider = new eui.ArrayCollection(this.lists);
    };
    GrowUpPanel.prototype.onClick = function (e) {
        if (Checker.Money(MoneyConst.yuanbao, 20000, MoneyConst.yuanbao)) {
            GameGlobal.ActivityKaiFuModel.sendInvestment(this._activityId);
        }
    };
    GrowUpPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.touziBtn, this.onClick);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
    };
    GrowUpPanel.prototype.UpdateContent = function () {
        var _this = this;
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
            var weight_1 = function (config) {
                var isReward = _this._activityData.reward.indexOf(config.index) != -1;
                if (isReward) {
                    return config.index + 10000;
                }
                return config.index;
            };
            this.lists.sort(function (lhs, rhs) {
                return weight_1(lhs) - weight_1(rhs);
            });
            UIHelper.ListRefresh(this.itemList);
        }
    };
    GrowUpPanel.prototype.updateTime = function () {
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
    GrowUpPanel.RedPointCheck = function () {
        return GameGlobal.GrowUpModel.checkGrowUpRedPoint();
    };
    GrowUpPanel.NAME = '成长基金';
    return GrowUpPanel;
}(BaseView));
__reflect(GrowUpPanel.prototype, "GrowUpPanel", ["ICommonWindowTitle"]);
var GrowUpItem = (function (_super) {
    __extends(GrowUpItem, _super);
    function GrowUpItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GrowUpItem.prototype.childrenCreated = function () {
        this.rewardList.itemRenderer = ItemBaseNotName;
        this.rewardList.dataProvider = null;
        this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCkick, this);
    };
    GrowUpItem.prototype.onCkick = function (e) {
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (_activityData) {
            if (_activityData.status == 0) {
                UserTips.ins().showTips('您还没有投资，不能领取');
                return;
            }
            GameGlobal.ActivityKaiFuModel.sendReward(11, this.data.index);
        }
    };
    GrowUpItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data)
            return;
        var config = this.data;
        this.descTxt.text = '达到' + config.level + '级，返还';
        this.rewardList.dataProvider = new eui.ArrayCollection(config.reward);
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(11);
        if (_activityData) {
            var lv = GameGlobal.actorModel.level;
            if (lv < config.level) {
                this.levelTxt.text = lv + '级/' + config.level + '级';
                this.levelTxt.visible = true;
                this.rewardBtn.visible = this.rewardImg.visible = false;
            }
            else {
                //按钮状态处理
                var isReward = _activityData.reward.indexOf(config.index) != -1;
                UIHelper.ShowRedPoint(this.rewardBtn, _activityData.status == 1 && !isReward);
                this.rewardImg.visible = isReward;
                this.rewardBtn.visible = !isReward;
                this.levelTxt.visible = false;
            }
        }
    };
    return GrowUpItem;
}(eui.ItemRenderer));
__reflect(GrowUpItem.prototype, "GrowUpItem");
//# sourceMappingURL=GrowUpPanel.js.map