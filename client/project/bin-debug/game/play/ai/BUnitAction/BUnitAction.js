var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BUnitAction = (function () {
    function BUnitAction() {
        // 子类事件
        this.actions = null;
    }
    BUnitAction.prototype.HasDead = function () {
        if (this.actions) {
            for (var _i = 0, _a = this.actions; _i < _a.length; _i++) {
                var ac = _a[_i];
                if (ac.mType == BattleTurnDataParse.TYPE_DEAD) {
                    return true;
                }
            }
        }
        return false;
    };
    /** 帧循环事件 */
    BUnitAction.prototype.Init = function (context) {
        this.mContext = context;
    };
    BUnitAction.prototype.OnUpdate = function (delta) {
        return AIUnitReturn.NEXT;
    };
    BUnitAction.prototype.OnEnter = function () {
    };
    BUnitAction.prototype.OnExit = function () {
    };
    /** 帧循环事件结束 */
    /** 数据执行事件，直接执行结果 */
    BUnitAction.prototype.Execute = function (raid) {
        this.mContext = raid;
        this.DoExecute();
    };
    BUnitAction.prototype.DoExecute = function () {
    };
    return BUnitAction;
}());
__reflect(BUnitAction.prototype, "BUnitAction");
//# sourceMappingURL=BUnitAction.js.map