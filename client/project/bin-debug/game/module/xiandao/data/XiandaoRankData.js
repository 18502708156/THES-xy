var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// 仙道排行数据
var XiandaoRankData = (function () {
    function XiandaoRankData() {
        this.rank = 0;
        this.roleName = "";
        this.serverId = 0;
        this.score = 0;
        this.power = 0;
    }
    XiandaoRankData.prototype.Parse = function (data) {
        this.roleName = data.name;
        this.serverId = data.server;
        this.score = data.point;
    };
    XiandaoRankData.prototype.GetRank = function () {
        if (this.rank) {
            return this.rank + "";
        }
        return "未上榜";
    };
    XiandaoRankData.prototype.GetPower = function () {
        return CommonUtils.overLength(this.power);
    };
    return XiandaoRankData;
}());
__reflect(XiandaoRankData.prototype, "XiandaoRankData");
//# sourceMappingURL=XiandaoRankData.js.map