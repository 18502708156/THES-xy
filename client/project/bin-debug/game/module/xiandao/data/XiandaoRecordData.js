var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XiandaoRecordData = (function () {
    function XiandaoRecordData() {
    }
    XiandaoRecordData.prototype.Parse = function (data) {
        this.isWin = data.win;
        this.name1 = data.name1;
        this.server1 = data.server1;
        this.name2 = data.name2;
        this.server2 = data.server2;
    };
    return XiandaoRecordData;
}());
__reflect(XiandaoRecordData.prototype, "XiandaoRecordData");
//# sourceMappingURL=XiandaoRecordData.js.map