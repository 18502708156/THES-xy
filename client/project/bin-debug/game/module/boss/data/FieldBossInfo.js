var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var IBossInfo = (function () {
    function IBossInfo() {
    }
    IBossInfo.prototype.GetConfig = function () { };
    return IBossInfo;
}());
__reflect(IBossInfo.prototype, "IBossInfo");
var FieldBossInfo = (function () {
    function FieldBossInfo() {
        this.ownerId = 0;
        // 精英boss
        this.status = 3; // 1 已开放 2 逃跑 3 已击杀  4 已关闭
    }
    Object.defineProperty(FieldBossInfo.prototype, "isDie", {
        get: function () {
            return this.status == FieldBossState.DEAD;
        },
        enumerable: true,
        configurable: true
    });
    FieldBossInfo.prototype.IsClose = function () {
        return this.status == FieldBossState.CLOSE;
    };
    FieldBossInfo.prototype.GetConfig = function () {
        return GameGlobal.Config.FieldBossConfig[this.id];
    };
    FieldBossInfo.prototype.GetState = function () {
        if (GameGlobal.BossModel.IsChallengeTime()) {
            if (this.status == FieldBossState.DEAD) {
                return FieldBossState.DEAD;
            }
            return FieldBossState.OPEN;
        }
        return FieldBossState.CLOSE;
    };
    FieldBossInfo.prototype.parser = function (data) {
        if (this.id != data.id) {
            return;
        }
        this.hp = data.hp;
        this.status = data.status;
        this.ownerId = data.ownerId;
        this.ownerName = data.ownerName;
        this.ownerHeadId = parseInt(data.ownerJob + "" + data.ownerSex);
        // this.ownerSex = data.ownerSex
        // this.ownerJob = data.ownerJob
        this.leftTime = data.time;
    };
    Object.defineProperty(FieldBossInfo.prototype, "Weight", {
        get: function () {
            if (GameGlobal.actorModel.level < this.level) {
                return this.id * 10000;
            }
            if (this.status == FieldBossState.DEAD) {
                return this.id * 1000;
            }
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    return FieldBossInfo;
}());
__reflect(FieldBossInfo.prototype, "FieldBossInfo");
var FieldBossState;
(function (FieldBossState) {
    FieldBossState[FieldBossState["OPEN"] = 1] = "OPEN";
    FieldBossState[FieldBossState["RUN"] = 2] = "RUN";
    FieldBossState[FieldBossState["DEAD"] = 3] = "DEAD";
    FieldBossState[FieldBossState["CLOSE"] = 4] = "CLOSE";
})(FieldBossState || (FieldBossState = {}));
//# sourceMappingURL=FieldBossInfo.js.map