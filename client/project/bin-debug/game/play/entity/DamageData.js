var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DamageData = (function () {
    function DamageData() {
    }
    DamageData.Set = function (team, x, y, type, value, skillId) {
        this.ins.team = team;
        this.ins.x = x;
        this.ins.y = y;
        this.ins.type = type;
        this.ins.value = value;
        this.ins.skillId = skillId;
        return this.ins;
    };
    DamageData.ins = new DamageData;
    return DamageData;
}());
__reflect(DamageData.prototype, "DamageData");
var DamageSourceData = (function () {
    function DamageSourceData() {
    }
    DamageSourceData.Get = function (team, x, y, entityType, job) {
        var ins = this.list.pop() || new DamageSourceData;
        ins.team = team;
        ins.x = x;
        ins.y = y;
        ins.job = job;
        ins.entityType = entityType;
        return ins;
    };
    DamageSourceData.Set = function (data) {
        this.list.push(data);
    };
    DamageSourceData.list = [];
    return DamageSourceData;
}());
__reflect(DamageSourceData.prototype, "DamageSourceData");
//# sourceMappingURL=DamageData.js.map