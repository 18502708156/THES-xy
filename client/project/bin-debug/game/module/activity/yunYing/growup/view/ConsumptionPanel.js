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
var ConsumptionPanel = (function (_super) {
    __extends(ConsumptionPanel, _super);
    function ConsumptionPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._activityId = 13;
        _this.lists = [];
        _this.skinName = 'ConsumptionPanelSkin';
        return _this;
    }
    ConsumptionPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ConsumptionItem;
        this.itemList.dataProvider = null;
        this.lists = GameGlobal.Config.ActivityType25Config[this._activityId];
        this.itemList.dataProvider = new eui.ArrayCollection(this.lists);
    };
    ConsumptionPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
    };
    ConsumptionPanel.prototype.UpdateContent = function () {
        var _this = this;
        this._activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (this._activityData) {
            this.ingotTxt.text = this._activityData.money + '元宝';
            var weight_1 = function (config) {
                var isReward = BitUtil.Has(_this._activityData.reward, config.index);
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
        TimerManager.ins().remove(this.updateTime, this);
        this.AddTimer(1000, 0, this.updateTime);
        this.updateTime();
    };
    ConsumptionPanel.prototype.updateTime = function () {
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
    ConsumptionPanel.RedPointCheck = function () {
        return GameGlobal.GrowUpModel.checkConsumptionRedPoint();
    };
    ConsumptionPanel.NAME = '消费有礼';
    return ConsumptionPanel;
}(BaseView));
__reflect(ConsumptionPanel.prototype, "ConsumptionPanel", ["ICommonWindowTitle"]);
var ConsumptionItem = (function (_super) {
    __extends(ConsumptionItem, _super);
    function ConsumptionItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ConsumptionItem.prototype.childrenCreated = function () {
        this.rewardList.itemRenderer = ItemBaseNotName;
        this.rewardList.dataProvider = null;
        this.rewardBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCkick, this);
    };
    ConsumptionItem.prototype.onCkick = function (e) {
        GameGlobal.ActivityKaiFuModel.sendReward(13, this.data.index);
    };
    ConsumptionItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data)
            return;
        var config = this.data;
        this.descTxt.text = '消费' + config.cost + '元宝';
        this.rewardList.dataProvider = new eui.ArrayCollection(config.item);
        var _activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(13);
        if (_activityData) {
            if (_activityData.money < config.cost) {
                this.levelTxt.text = '未达成';
                this.levelTxt.visible = true;
                this.rewardBtn.visible = this.rewardImg.visible = false;
            }
            else {
                //按钮状态处理
                var isReward = BitUtil.Has(_activityData.reward, config.index);
                UIHelper.ShowRedPoint(this.rewardBtn, !isReward);
                this.rewardImg.visible = isReward;
                this.rewardBtn.visible = !isReward;
                this.levelTxt.visible = false;
            }
        }
    };
    return ConsumptionItem;
}(eui.ItemRenderer));
__reflect(ConsumptionItem.prototype, "ConsumptionItem");
//# sourceMappingURL=ConsumptionPanel.js.map