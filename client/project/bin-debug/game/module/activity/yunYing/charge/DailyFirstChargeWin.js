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
var DailyFirstChargeWin = (function (_super) {
    __extends(DailyFirstChargeWin, _super);
    function DailyFirstChargeWin() {
        var _this = _super.call(this) || this;
        _this.skinName = 'DailyFirstChargeSkin';
        return _this;
    }
    DailyFirstChargeWin.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
        this.itemList.dataProvider = null;
        // let openDay = GameServer.serverOpenDay;
        // let len = CommonUtils.getObjectLength(GameGlobal.Config.DailyrechargeConfig);
        // let index = 0 == openDay % len ? len : openDay % len;
        var index = GameGlobal.RechargeModel.dailyId;
        var config = GameGlobal.Config.DailyrechargeConfig[index];
        var labels = [];
        DailyFirstChargeWin.list = [];
        if (config) {
            for (var id in config) {
                labels.push(1 == config[id].recharge ? '充任意金额' : '充' + config[id].recharge + '元');
                DailyFirstChargeWin.list.push(config[id]);
            }
            this.tabBar.dataProvider = new eui.ArrayCollection(labels);
            this.tabBar.itemRenderer = BtnTab4Item;
            this.tabBar.selectedIndex = 0;
        }
    };
    DailyFirstChargeWin.prototype.onClick = function (e) {
        if (this.chargeBtn.label == '充点小钱') {
            this.CloseSelf();
            RechargeWin.Open();
        }
        else {
            GameGlobal.RechargeModel.sendRechargeDailyReward(this.tabBar.selectedIndex + 1);
        }
    };
    DailyFirstChargeWin.prototype.onItemClick = function (e) {
        this.updateContent();
    };
    DailyFirstChargeWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.dialogMask, this.CloseSelf);
        this.AddClick(this.dialogCloseBtn, this.CloseSelf);
        this.AddClick(this.chargeBtn, this.onClick);
        this.AddItemClick(this.tabBar, this.onItemClick);
        this.observe(MessageDef.RECHARGE_DAILY_UPDATE, this.updateContent);
        this.updateContent();
    };
    DailyFirstChargeWin.prototype.updateContent = function () {
        UIHelper.ListRefresh(this.tabBar);
        this.itemList.dataProvider = new eui.ArrayCollection(DailyFirstChargeWin.list[this.tabBar.selectedIndex].reward);
        var rechargenum = GameGlobal.RechargeModel.dailyRechare;
        this.chargeTxt.text = '今日已充值' + rechargenum + '元';
        var isReward = GameGlobal.RechargeModel.dailyReward;
        UIHelper.ShowRedPoint(this.chargeBtn, false);
        if (BitUtil.Has(isReward, this.tabBar.selectedIndex)) {
            this.chargeBtn.label = '已领取';
            this.chargeBtn.enabled = false;
        }
        else {
            this.chargeBtn.enabled = true;
            if (rechargenum >= DailyFirstChargeWin.list[this.tabBar.selectedIndex].recharge) {
                this.chargeBtn.label = '领 取';
                UIHelper.ShowRedPoint(this.chargeBtn, true);
            }
            else {
                this.chargeBtn.label = '充点小钱';
            }
        }
    };
    DailyFirstChargeWin.LAYER_LEVEL = LayerManager.UI_Popup;
    /////////////////////////////////////////////////////////////////////////////
    DailyFirstChargeWin.list = [];
    return DailyFirstChargeWin;
}(BaseEuiView));
__reflect(DailyFirstChargeWin.prototype, "DailyFirstChargeWin");
var BtnTab4Item = (function (_super) {
    __extends(BtnTab4Item, _super);
    function BtnTab4Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    BtnTab4Item.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var isReward = GameGlobal.RechargeModel.dailyReward;
        var rechargenum = GameGlobal.RechargeModel.dailyRechare;
        if (rechargenum >= DailyFirstChargeWin.list[this.itemIndex].recharge) {
            this.redPoint.visible = !BitUtil.Has(isReward, this.itemIndex);
        }
    };
    return BtnTab4Item;
}(eui.ItemRenderer));
__reflect(BtnTab4Item.prototype, "BtnTab4Item");
//# sourceMappingURL=DailyFirstChargeWin.js.map