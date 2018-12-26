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
/**
 * 银两兑换
 */
var ExchangeMoneyWin = (function (_super) {
    __extends(ExchangeMoneyWin, _super);
    function ExchangeMoneyWin() {
        var _this = _super.call(this) || this;
        _this.moneyCount = "0";
        //剩余次数
        _this.endCount = 1;
        _this.skinName = "exchangeMoneySkin";
        return _this;
    }
    ExchangeMoneyWin.prototype.childrenCreated = function () {
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "银两兑换";
        //挂机关卡表
        this.chaptersCommonConfigTab = GameGlobal.Config.ChaptersCommonConfig;
        //VIP表
        this.vipPrivilegeConfigTab = GameGlobal.Config.VipPrivilegeConfig;
        GameGlobal.ExchangeModel.exchangeInfo();
    };
    ExchangeMoneyWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.gotoVip, this.onClick);
        this.AddClick(this.exchangeBtn, this.onClick);
        this.observe(MessageDef.EXCHANGE_COUNT, this.surplus);
        this.observe(MessageDef.EXCHANGE_COUNT, this.updateItem);
        var itemId = this.chaptersCommonConfigTab.itemid;
        var vipData = UserVip.ins();
        //银两次数
        var count = this.vipPrivilegeConfigTab[vipData.lv].silvertime;
        this.endCount = count;
        this.surplusCount.text = "剩余" + count + "次";
        this.moneyLab.text = this.moneyCount;
        var itemCount = GameGlobal.UserBag.GetCount(itemId);
        this.itemCount.text = itemCount + "/1";
        var nextCfg = this.vipPrivilegeConfigTab[vipData.lv + 1];
        this.vipGroup.visible = nextCfg;
        if (nextCfg) {
            this.vipbuy_txt.text = "VIP" + nextCfg.vipid + "每天可再购买" + (nextCfg.silvertime - this.vipPrivilegeConfigTab[vipData.lv].silvertime) + "次";
        }
        UIHelper.PlayPanelTween(this.animGroup);
    };
    ExchangeMoneyWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    ExchangeMoneyWin.prototype.update = function () {
    };
    ExchangeMoneyWin.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.gotoVip:
                ViewManager.ins().close(this);
                ViewManager.ins().open(VipMainPanel);
                break;
            case this.exchangeBtn:
                //RPC
                var itemId = this.chaptersCommonConfigTab.itemid;
                if (this.checkItem(itemId, 1)) {
                    if (this.endCount > 0) {
                        GameGlobal.ExchangeModel.exchange();
                    }
                    else {
                        UserTips.ins().showTips("剩余兑换次数不足");
                    }
                }
                else {
                    if (this.endCount > 0) {
                        var needGold_1 = this.chaptersCommonConfigTab.gold;
                        WarnWin.show("是否花费" + needGold_1 + "元宝兑换银两？", function () {
                            if (Checker.Money(2, needGold_1)) {
                                GameGlobal.ExchangeModel.exchange();
                            }
                        }, this);
                    }
                    else {
                        UserTips.ins().showTips("剩余兑换次数不足");
                    }
                }
                break;
        }
    };
    ExchangeMoneyWin.prototype.checkItem = function (itemId, value) {
        var count = GameGlobal.UserBag.GetCount(itemId);
        if (count >= value) {
            return true;
        }
        return false;
    };
    ExchangeMoneyWin.prototype.surplus = function (msg) {
        if (msg.exchangeCount != null && msg.exchangeCount != undefined) {
            var vipData = UserVip.ins();
            var count = this.vipPrivilegeConfigTab[vipData.lv].silvertime;
            count -= msg.exchangeCount;
            this.endCount = count;
            this.surplusCount.text = "剩余" + count + "次";
        }
        if (msg.goldnum != null && msg.goldnum != undefined) {
            this.moneyCount = (msg.goldnum).toString();
            this.moneyLab.text = this.moneyCount;
        }
    };
    ExchangeMoneyWin.prototype.updateItem = function (msg) {
        var itemId = this.chaptersCommonConfigTab.itemid;
        var itemCount = GameGlobal.UserBag.GetCount(itemId);
        this.itemCount.text = itemCount + "/1";
    };
    //skinName
    //ExchangeMoneySkin.exml
    ExchangeMoneyWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return ExchangeMoneyWin;
}(BaseEuiView));
__reflect(ExchangeMoneyWin.prototype, "ExchangeMoneyWin", ["ICommonWindow"]);
//# sourceMappingURL=ExchangeMoneyWin.js.map