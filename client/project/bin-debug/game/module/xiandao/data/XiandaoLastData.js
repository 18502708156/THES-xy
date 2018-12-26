var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// 仙道上届冠军数据
var XiandaoLastData = (function () {
    function XiandaoLastData() {
        this.roleName = "";
        this.serverId = 0;
        this.role1Job = 1;
        this.role1Sex = 0;
        this.role2Job = 1;
        this.role2Sex = 0;
    }
    XiandaoLastData.prototype.GetName = function () {
        return GameString.GetSerAndName(this.serverId, this.roleName);
    };
    return XiandaoLastData;
}());
__reflect(XiandaoLastData.prototype, "XiandaoLastData");
//# sourceMappingURL=XiandaoLastData.js.map