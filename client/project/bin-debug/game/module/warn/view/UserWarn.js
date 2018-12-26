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
var UserWarn = (function (_super) {
    __extends(UserWarn, _super);
    function UserWarn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserWarn.ins = function () {
        return _super.ins.call(this);
    };
    ;
    UserWarn.prototype.setWarnLabel = function (str, callBackFun, callBackFun2, statu, data) {
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        TimerManager.ins().doNext(function () {
            var win = ViewManager.ins().open(WarnWin);
            win.setWarnLabel(str, callBackFun, callBackFun2, statu, data);
        }, this);
    };
    ;
    UserWarn.prototype.setWarnContent = function (content, callBackFun, callBackFun2, statu, data) {
        if (statu === void 0) { statu = "normal"; }
        if (data === void 0) { data = null; }
        ViewManager.ins().open(WarnWin).setWarnContent(content, callBackFun, callBackFun2, statu, data);
    };
    ;
    UserWarn.prototype.setshowReward = function (str, callBackFun, callBackFun2, statu, data) {
        if (statu === void 0) { statu = "reward"; }
        if (data === void 0) { data = null; }
        ViewManager.ins().open(WarnWin).setshowReward(str, callBackFun, callBackFun2, statu, data);
    };
    ;
    UserWarn.prototype.setshowCheckBox = function (name, str, callBackFun, callBackFun2, statu, data) {
        if (statu === void 0) { statu = "checkBox"; }
        if (data === void 0) { data = null; }
        if (WarnWinData.ins().checkerHintByName(name, callBackFun)) {
            WarnWinData.ins().setRecord(name, true);
            ViewManager.ins().open(WarnWin).setshowCheckBox(name, str, callBackFun, callBackFun2, statu, data);
        }
    };
    ;
    UserWarn.prototype.setBuyGoodsWarn = function (id, num) {
        if (num === void 0) { num = 1; }
        if (id == MoneyConst.gold) {
            ViewManager.ins().open(ExchangeMoneyWin);
            return;
        }
        //策划要求写死
        if (Deblocking.Check(96, true)) {
            ViewManager.ins().open(ShopGoodsWarn).setData(id, num);
        }
        else {
            var config = GameGlobal.Config.ItemConfig[id];
            if (config) {
                if (config.name) {
                    UserTips.InfoTip(config.name + "不足");
                }
            }
            else {
                var name_1 = MoneyConstToName[id];
                if (name_1) {
                    UserTips.InfoTip(name_1 + "不足");
                }
                else {
                    UserTips.InfoTip("材料不足");
                }
            }
        }
    };
    UserWarn.prototype.BuyGoodsWarn = function (id, num) {
        if (num === void 0) { num = 1; }
        if (id == MoneyConst.gold) {
            ViewManager.ins().open(ExchangeMoneyWin);
            return;
        }
        ViewManager.ins().open(ShopGoodsWarn).setData(id, num);
    };
    UserWarn.prototype.setGainGoodsWarn = function (ids) {
        ViewManager.ins().open(GainGoodsWarn).setData(ids);
    };
    UserWarn.CheckBagCapacity = function () {
        if (GameGlobal.UserBag.getSurplusCount() < 20) {
            WarnWin.show("背包空间不足20，请先清理背包，以免不能获取怪物掉落物品", function () {
                ViewManager.ins().open(SmeltEquipTotalWin);
            }, this, null, null, "sure");
            return false;
        }
        return true;
    };
    return UserWarn;
}(BaseSystem));
__reflect(UserWarn.prototype, "UserWarn");
//# sourceMappingURL=UserWarn.js.map