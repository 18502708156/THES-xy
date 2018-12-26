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
var ShootUpPanel = (function (_super) {
    __extends(ShootUpPanel, _super);
    function ShootUpPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._activityId = 10;
        _this._index = 0;
        _this.skinName = 'ShootUpPanelSkin';
        return _this;
    }
    ShootUpPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
        this.itemList.dataProvider = null;
    };
    ShootUpPanel.prototype.onClick = function (e) {
        this.CloseSelf();
        if (this.chargeBtn.label == '充点小钱') {
            RechargeWin.Open();
        }
        else {
            GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, this._index);
        }
    };
    ShootUpPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.dialogMask, this.CloseSelf);
        this.AddClick(this.dialogCloseBtn, this.CloseSelf);
        this.AddClick(this.chargeBtn, this.onClick);
        this.updateContent();
    };
    ShootUpPanel.prototype.updateContent = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            UIHelper.ShowRedPoint(this.chargeBtn, activityData.hasReward());
            var config = activityData.GetConfig()[activityData.runday - 1];
            if (config) {
                this.itemList.dataProvider = new eui.ArrayCollection(config.item);
                this.titleImg.source = config.title;
                this.imgIcon.source = config.showitem;
                this.nameTxt.text = config.itemname + '';
                this._index = config.index;
                var rechargenum = GameGlobal.RechargeModel.dailyRechare;
                this.chargeTxt.text = '今日已充值：' + rechargenum + '元';
                this.chargeBtn.enabled = true;
                if (rechargenum >= config.cost) {
                    if (activityData.record == 4) {
                        this.chargeBtn.label = '已领取';
                        this.chargeBtn.enabled = false;
                    }
                    else if (activityData.record == 3) {
                        this.chargeBtn.label = '点击领取';
                    }
                }
                else {
                    this.chargeBtn.label = '充点小钱';
                }
            }
            TimerManager.ins().remove(this.updateTime, this);
            this.AddTimer(1000, 0, this.updateTime);
            this.updateTime();
        }
    };
    ShootUpPanel.prototype.updateTime = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var date = new Date(GameServer.serverTimeMilli);
        var restTime = DateUtils.MS_PER_DAY - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
        this.timeTxt.text = DateUtils.format_1(restTime);
    };
    ShootUpPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ShootUpPanel;
}(BaseEuiView));
__reflect(ShootUpPanel.prototype, "ShootUpPanel");
//# sourceMappingURL=ShootUpPanel.js.map