var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CrossGuildInfo = (function () {
    function CrossGuildInfo() {
        this.reset();
    }
    CrossGuildInfo.prototype.reset = function () {
        this.name = '';
        this.power = this.score = 0;
        this.state = 3;
        this.isWaring = false;
        this.isMySide = true;
    };
    CrossGuildInfo.prototype.updateInfo = function (data) {
    };
    return CrossGuildInfo;
}());
__reflect(CrossGuildInfo.prototype, "CrossGuildInfo");
//# sourceMappingURL=CrossGuildInfo.js.map