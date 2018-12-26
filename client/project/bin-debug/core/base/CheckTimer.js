var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CheckTimer = (function () {
    function CheckTimer(func, obj, gapTime) {
        if (gapTime === void 0) { gapTime = 800; }
        this.m_CheckHaveCanTimer = false;
        this.m_CheckTimer = 0;
        this.m_CheckFun = func;
        this.m_CheckObj = obj;
        this.m_GapTime = gapTime;
    }
    CheckTimer.prototype._ContinueCheck = function () {
        if (this.m_CheckFun && this.m_CheckObj) {
            this.m_CheckFun.call(this.m_CheckObj);
        }
    };
    CheckTimer.prototype.CanCheck = function () {
        if (this.m_CheckTimer > egret.getTimer()) {
            // 如果在检查时间内
            if (this.m_CheckHaveCanTimer == false) {
                this.m_CheckHaveCanTimer = true;
                TimerManager.ins().doTimer(this.m_GapTime + 200, 1, this._ContinueCheck, this);
            }
            return false;
        }
        this.m_CheckTimer = egret.getTimer() + this.m_GapTime;
        if (this.m_CheckHaveCanTimer) {
            TimerManager.ins().remove(this._ContinueCheck, this);
            this.m_CheckHaveCanTimer = false;
        }
        return true;
    };
    return CheckTimer;
}());
__reflect(CheckTimer.prototype, "CheckTimer");
//# sourceMappingURL=CheckTimer.js.map