var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RoleSendCheckData = (function () {
    function RoleSendCheckData(callback, getFunc, getAuto, getRestart) {
        if (getRestart === void 0) { getRestart = null; }
        this.m_Callback = callback;
        this.m_GetFunc = getFunc;
        this.m_GetAuto = getAuto;
        this.m_GetRestart = getRestart;
    }
    RoleSendCheckData.prototype.SendBoost = function (autoBuy) {
        if (this.m_Callback) {
            this.m_Callback(autoBuy);
        }
    };
    RoleSendCheckData.prototype.GetCost = function () {
        return this.m_GetFunc();
    };
    RoleSendCheckData.prototype.SendUp = function () {
        var _this = this;
        var data = this.GetCost();
        if (!data) {
            return false;
        }
        var monId = data[0];
        var monCount = data[1];
        var costId = data[2];
        var costCount = data[3];
        if (monId && !Checker.Money(monId, monCount)) {
            return false;
        }
        var upitemId = costId;
        if (!upitemId) {
            return false;
        }
        var count = GameGlobal.UserBag.GetCount(upitemId);
        var needCount = costCount - count;
        if (count >= costCount) {
            this.SendBoost(0);
            return true;
        }
        else {
            if (this.m_GetAuto()) {
                var storeType = ItemStoreConfig.GetStoreType(upitemId);
                if (storeType == ShopController.EN_SHOP_BANGYUAN) {
                    var price = ItemStoreConfig.GetPrice(upitemId) * needCount;
                    var actor = GameLogic.ins().actorModel;
                    if (price > actor.byb) {
                        if (!this.m_IsTips) {
                            WarnWin.show("绑元不足，是否【消耗元宝】来自动购买？", function () {
                                _this.m_IsUse = true;
                                _this.m_IsTips = true;
                                if (_this.m_GetRestart) {
                                    _this.m_GetRestart();
                                }
                            }, this, function () {
                                _this.m_IsUse = false;
                            }, this);
                            return false;
                        }
                        if (!this.m_IsUse) {
                            return false;
                        }
                        price = ItemStoreConfig.GetPrice(upitemId, ShopController.EN_SHOP_YUANBAO) * needCount;
                        if (Checker.Money(MoneyConst.yuanbao, price)) {
                            this.SendBoost(2);
                            return true;
                        }
                    }
                    else {
                        this.SendBoost(1);
                        return true;
                    }
                }
                else if (storeType == ShopController.EN_SHOP_YUANBAO) {
                    var price = ItemStoreConfig.GetPrice(upitemId, ShopController.EN_SHOP_YUANBAO) * needCount;
                    if (Checker.Money(MoneyConst.yuanbao, price)) {
                        this.SendBoost(2);
                        return true;
                    }
                }
                else {
                    console.warn("not store type => ", storeType, upitemId);
                }
            }
            else {
                UserWarn.ins().setBuyGoodsWarn(upitemId, needCount);
            }
        }
        return false;
    };
    return RoleSendCheckData;
}());
__reflect(RoleSendCheckData.prototype, "RoleSendCheckData");
//# sourceMappingURL=RoleSendCheckData.js.map