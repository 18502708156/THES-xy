var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SimpleTimeout = (function () {
    function SimpleTimeout() {
        this.m_Timer = null;
    }
    SimpleTimeout.prototype.SetTimeout = function (listener, thisObject, delay) {
        this.ClearTimeOut();
        egret.setTimeout(listener, thisObject, delay);
    };
    SimpleTimeout.prototype.ClearTimeOut = function () {
        if (this.m_Timer) {
            egret.clearTimeout(this.m_Timer);
            this.m_Timer = null;
        }
    };
    return SimpleTimeout;
}());
__reflect(SimpleTimeout.prototype, "SimpleTimeout");
//# sourceMappingURL=SimpleTimeout.js.map