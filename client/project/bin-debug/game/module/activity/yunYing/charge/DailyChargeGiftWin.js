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
var DailyChargeGiftWin = (function (_super) {
    __extends(DailyChargeGiftWin, _super);
    function DailyChargeGiftWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mActivityId = 28;
        _this.skinName = "DailyChargeGiftSkin";
        _this._AddClick(_this.btnBuy, _this._OnClick);
        return _this;
    }
    DailyChargeGiftWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
    };
    DailyChargeGiftWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "每日豪礼";
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.UpdateContent();
    };
    DailyChargeGiftWin.prototype.UpdateContent = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        var index = activityData.runday;
        var config = activityData.GetConfig()[index - 1];
        this.list.dataProvider = new eui.ArrayCollection(config.gift);
        this.labChargeTip.text = "\u4ECA\u65E5\u5DF2\u5145\u503C\uFF1A" + activityData.recharge + "\u5143";
        if (activityData.record[index - 1] == 4) {
            this.btnBuy.label = '已领取';
            this.btnBuy.enabled = false;
            return;
        }
        this.btnBuy.label = config.recharge > activityData.recharge ? "前往充值" : "领取奖励";
    };
    DailyChargeGiftWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    DailyChargeGiftWin.prototype._OnClick = function (e) {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.mActivityId);
        var index = activityData.runday;
        var config = activityData.GetConfig()[index - 1];
        if (config.recharge > activityData.recharge) {
            RechargeWin.Open();
            this.CloseSelf();
            return;
        }
        GameGlobal.ActivityKaiFuModel.sendReward(this.mActivityId, index);
    };
    DailyChargeGiftWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return DailyChargeGiftWin;
}(BaseEuiView));
__reflect(DailyChargeGiftWin.prototype, "DailyChargeGiftWin");
//# sourceMappingURL=DailyChargeGiftWin.js.map