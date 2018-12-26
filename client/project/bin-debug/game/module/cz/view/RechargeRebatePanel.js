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
var RechargeRebatePanel = (function (_super) {
    __extends(RechargeRebatePanel, _super);
    function RechargeRebatePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "RechargeRebateSkin";
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RechargeRebatePanel.CheckRedPoint = function (id) {
        if (!id)
            return false;
        return GameGlobal.ActivityKaiFuModel.GetActivityDataById(id).isRedPoint();
    };
    RechargeRebatePanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = RebateItem;
    };
    RechargeRebatePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.avtiviteId = param[0];
        var ActivityType27Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId);
        this.countDownTxt.text = "\u5269\u4F59\u65F6\u95F4:" + ActivityBaseData.GetTimeStr(ActivityType27Data.endTime - GameServer.serverTime);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.updateContent);
        GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId).redPoint = false;
        this.updateContent();
    };
    RechargeRebatePanel.prototype.updateContent = function () {
        var ActivityType27Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.avtiviteId);
        var itemDatas = CommonUtils.GetArray(GameGlobal.Config.ActivityType27Config[this.avtiviteId], "money");
        var sort = function (item) {
            for (var _i = 0, _a = ActivityType27Data.cloutArr; _i < _a.length; _i++) {
                var val = _a[_i];
                if (val.no == item.orderid)
                    if (val.num >= item.frequency) {
                        return item.money + 100000;
                    }
            }
            return item.money;
        };
        itemDatas.sort(function (a, b) { return sort(a) - sort(b); });
        this.list.dataProvider = new eui.ArrayCollection(itemDatas);
    };
    return RechargeRebatePanel;
}(BaseView));
__reflect(RechargeRebatePanel.prototype, "RechargeRebatePanel");
var RebateItem = (function (_super) {
    __extends(RebateItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RebateItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RechargeRebateItemSkin";
        return _this;
    }
    RebateItem.prototype.childrenCreated = function () {
        this.rechargeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
    };
    RebateItem.prototype.dataChanged = function () {
        this.item.data = this.data.money3[0];
        this.percentTxt.textFlow = TextFlowMaker.generateTextFlow(this.data.percentage);
        this.tipsTxt.text = "\u5355\u7B14\u5145\u503C\uFF1A" + this.data.money + "\u5143";
        this.updateCount();
    };
    RebateItem.prototype.updateCount = function () {
        var curCount = 0;
        var ActivityType27Data = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.Id);
        var ActivityType27Config = GameGlobal.Config.ActivityType27Config[this.data.Id];
        for (var _i = 0, _a = ActivityType27Data.cloutArr; _i < _a.length; _i++) {
            var val = _a[_i];
            if (val.no == this.data.orderid)
                curCount = val.num;
        }
        if (curCount >= this.data.frequency) {
            this.countTxt.textColor = Color.Red;
            this.countTxt.text = "今日限购次数已满";
            this.rechargeBtn.filters = Color.GetFilter();
            this.rechargeBtn.touchEnabled = false;
        }
        else {
            this.countTxt.text = "\u6BCF\u5929\u9650\u8D2D" + curCount + "/" + this.data.frequency + "\u6B21";
            this.countTxt.textColor = Color.l_green_1;
            this.rechargeBtn.touchEnabled = true;
            this.rechargeBtn.filters = null;
        }
    };
    RebateItem.prototype.tap = function () {
        GameGlobal.RechargeModel.sendRecharge(this.data.orderid);
    };
    return RebateItem;
}(eui.ItemRenderer));
__reflect(RebateItem.prototype, "RebateItem");
//# sourceMappingURL=RechargeRebatePanel.js.map