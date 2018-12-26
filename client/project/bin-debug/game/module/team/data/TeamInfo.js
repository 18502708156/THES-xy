var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MyTeamInfo = (function () {
    function MyTeamInfo() {
        this.needpower = 0;
        this.members = [];
        this.leaderid = 0;
        this.level = 0;
    }
    MyTeamInfo.prototype.Clear = function () {
        this.members = [];
        this.leaderid = 0;
        this.level = 0;
        this.needpower = 0;
    };
    MyTeamInfo.prototype.parser = function (rsp) {
        var _this = this;
        var oldPower = this.needpower;
        this.leaderid = rsp.leaderid || 0;
        this.level = rsp.level || 0;
        this.needpower = rsp.needpower || 0;
        if (rsp.leaderid == GameGlobal.actorModel.actorID && oldPower != rsp.needpower) {
            UserTips.InfoTip("进队战力要求已改动");
        }
        this.members = rsp.members || [];
        this.members.sort(function (lhs, rhs) {
            if (lhs.dbid == _this.leaderid) {
                return -1;
            }
            if (rhs.dbid == _this.leaderid) {
                return 1;
            }
            return -1;
        });
    };
    MyTeamInfo.prototype.HasTeam = function () {
        return this.members.length > 0;
    };
    MyTeamInfo.prototype.IsMyTeam = function () {
        return GameGlobal.actorModel.actorID == this.leaderid;
    };
    MyTeamInfo.prototype.IsFull = function () {
        return this.members.length >= 3;
    };
    return MyTeamInfo;
}());
__reflect(MyTeamInfo.prototype, "MyTeamInfo");
//# sourceMappingURL=TeamInfo.js.map