var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DabiaoRankData = (function () {
    function DabiaoRankData() {
    }
    DabiaoRankData.prototype.prase = function (e, type) {
        this.name = e.name;
        this.numType = e.value;
    };
    return DabiaoRankData;
}());
__reflect(DabiaoRankData.prototype, "DabiaoRankData");
//# sourceMappingURL=DabiaoRankData.js.map