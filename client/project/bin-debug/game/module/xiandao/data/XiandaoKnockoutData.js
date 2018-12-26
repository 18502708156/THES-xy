var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var XiandaoKnockoutData = (function () {
    function XiandaoKnockoutData() {
        this.roleDatas = {};
        this.roleNoList = [];
        // 8强，4强，2强，冠军
        this.turnDatas = [[], [], [], []];
    }
    return XiandaoKnockoutData;
}());
__reflect(XiandaoKnockoutData.prototype, "XiandaoKnockoutData");
var XiandaoKnockoutTurn = (function () {
    function XiandaoKnockoutTurn() {
        this.fightRecord = [];
        this.winPart = 0;
    }
    XiandaoKnockoutTurn.prototype.Parse = function (rsp) {
        this.noA = rsp.noA;
        this.noB = rsp.noB;
        this.winNo = rsp.winNo;
        this.fightRecord = rsp.fightRecord || [];
        var list = {};
        for (var _i = 0, _a = this.fightRecord; _i < _a.length; _i++) {
            var data = _a[_i];
            if (list[data]) {
                if (++list[data] >= 2) {
                    this.winNo = data == 1 ? this.noA : this.noB;
                    this.winPart = data;
                    break;
                }
            }
            else {
                list[data] = 1;
            }
        }
    };
    return XiandaoKnockoutTurn;
}());
__reflect(XiandaoKnockoutTurn.prototype, "XiandaoKnockoutTurn");
var XiandaoKnockoutRoleData = (function () {
    function XiandaoKnockoutRoleData() {
        this.no = 0;
        this.roleName = "";
        this.serverId = 0;
        this.lv = 1;
        this.power = 0;
    }
    XiandaoKnockoutRoleData.prototype.Parse = function (rsp) {
        this.no = rsp.no;
        this.lv = rsp.lv;
        this.power = rsp.power;
        this.roleName = rsp.name;
        this.serverId = rsp.server;
        this.shows = rsp.shows;
        this.shows.job = rsp.job;
        this.shows.sex = rsp.sex;
        this.shows.name = rsp.name;
    };
    return XiandaoKnockoutRoleData;
}());
__reflect(XiandaoKnockoutRoleData.prototype, "XiandaoKnockoutRoleData");
//# sourceMappingURL=XiandaoKnockoutData.js.map