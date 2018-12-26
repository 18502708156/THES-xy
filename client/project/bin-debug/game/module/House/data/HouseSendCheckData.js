var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HouseSendCheckData = (function () {
    function HouseSendCheckData(callback, getFunc) {
        this.m_Callback = callback;
        this.m_GetFunc = getFunc;
    }
    HouseSendCheckData.prototype.SendBoost = function () {
        if (this.m_Callback) {
            this.m_Callback();
        }
    };
    HouseSendCheckData.prototype.GetCost = function () {
        return this.m_GetFunc();
    };
    HouseSendCheckData.prototype.SendUp = function () {
        var cost = this.GetCost();
        var curNum = GameGlobal.YingYuanModel.GetIntimacy();
        if (cost > curNum) {
            WarnWin.show("亲密度不足，是否前往送花提升？", function () {
                ViewManager.ins().open(YingYuanXianHuaPanel);
            }, this);
            return false;
        }
        this.SendBoost();
        return true;
    };
    return HouseSendCheckData;
}());
__reflect(HouseSendCheckData.prototype, "HouseSendCheckData");
//# sourceMappingURL=HouseSendCheckData.js.map