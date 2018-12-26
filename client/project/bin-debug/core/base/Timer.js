var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Timer = (function () {
    function Timer() {
        this.m_Timer = -1;
    }
    Timer.TimeOut = function (func, time) {
        var timer = new Timer;
        var f = function () {
            if (timer.m_Timer == -1) {
                return;
            }
            func();
            timer.m_Timer = -1;
        };
        timer.m_Timer = setTimeout(f, time);
        return timer;
    };
    Timer.prototype.Stop = function () {
        if (this.m_Timer != -1) {
            clearTimeout(this.m_Timer);
        }
        this.m_Timer = -1;
    };
    return Timer;
}());
__reflect(Timer.prototype, "Timer");
//# sourceMappingURL=Timer.js.map