var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleMgr = (function () {
    function BattleMgr() {
        this.m_EntityTeams = [];
        this.m_Entity = {};
        this.m_UseSkill = {};
        this.m_StartTime = 1;
        this.m_Check = false;
    }
    BattleMgr.prototype.Init = function (raid) {
        this.mRaid = raid;
    };
    BattleMgr.prototype.OnEnter = function () {
        this.mOverData = null;
    };
    BattleMgr.prototype.Update = function (delta) {
        if (this.m_StartTime > 0) {
            if ((this.m_StartTime -= delta) <= 0) {
                this.StartTurn();
            }
        }
    };
    BattleMgr.prototype.OnExit = function () {
        this.m_EntityTeams = [];
        this.m_Entity = [];
    };
    BattleMgr.prototype.UseSkill = function (datas) {
        var dict = this.m_UseSkill = {};
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            dict[data.handle] = data;
        }
        this.ManualTurn();
    };
    // public GetUnit(handle: number): IBattleUnit {
    // 	return this.m_Entity[handle]
    // }
    BattleMgr.prototype.GetRaidUnit = function (handle) {
        return this.m_Entity[handle];
    };
    BattleMgr.prototype.SetBattleData = function (list) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var datas = list_1[_i];
            var list_2 = [];
            for (var _a = 0, datas_2 = datas; _a < datas_2.length; _a++) {
                var data = datas_2[_a];
                var cls = Util.GetClass(data);
                var role = new cls;
                CommonUtils.CopyTo(data, role);
                var unit = new BattleUnit;
                unit.Init(this, role, this.m_EntityTeams.length);
                this.m_Entity[unit.mInfo.handle] = unit;
                list_2.push(unit);
            }
            this.m_EntityTeams.push(list_2);
        }
        this.m_StartTime = 5;
    };
    BattleMgr.prototype.OnUnitDead = function (handle) {
        this.m_Check = true;
    };
    BattleMgr.prototype.OnAttack = function (unit) {
        var units = this.m_EntityTeams[unit.mTeamIndex];
        for (var _i = 0, units_1 = units; _i < units_1.length; _i++) {
            var data = units_1[_i];
            if (BattleUnit.Equal(data, unit)) {
                continue;
            }
            if (data.CanBlock()) {
                return data;
            }
        }
        return null;
    };
    BattleMgr.prototype.GetEntityTargetList = function (entitys) {
        var list = [];
        for (var _i = 0, entitys_1 = entitys; _i < entitys_1.length; _i++) {
            var entity = entitys_1[_i];
            if (!entity.IsTarget()) {
                continue;
            }
            list.push(entity.mInfo.handle);
        }
        return list;
    };
    BattleMgr.prototype.GetAllEmemyList = function (teamIndex) {
        var entitys = this.m_EntityTeams[(teamIndex + 1) % 2];
        return this.GetEntityTargetList(entitys);
    };
    BattleMgr.prototype.GetAllFriendlyList = function (teamIndex) {
        var entitys = this.m_EntityTeams[teamIndex];
        return this.GetEntityTargetList(entitys);
    };
    BattleMgr.prototype.StartTurn = function () {
        if (this.mRaid.mIsManual) {
            this.mRaid.StartManual(15, null);
        }
        else {
            this.AutoTurn();
        }
    };
    BattleMgr.prototype.AutoTurn = function () {
        var list = [];
        var overData = null;
        for (var i = 0; i < 99; ++i) {
            var turnData = [];
            overData = this.Turn(turnData);
            if (turnData && turnData.length) {
                list.push(turnData);
            }
            else {
                break;
            }
            if (overData) {
                break;
            }
        }
        if (overData) {
            this.mOverData = overData;
        }
        else {
            console.error("not over data");
        }
        this.mRaid.TurnAll(list);
        this.mRaid.SetFinishAction(overData);
    };
    // 客户端一回合执行结束
    BattleMgr.prototype.TurnExecuteFinish = function () {
        // 没有结束，通知副本选择技能
        if (!this.mOverData) {
            this.mRaid.StartManual(15, null);
        }
    };
    BattleMgr.prototype.ManualTurn = function () {
        var turnData = [];
        var overData = this.Turn(turnData);
        if (turnData && turnData.length) {
            this.mRaid.Turn(turnData);
        }
        if (overData) {
            this.mOverData = overData;
            this.mRaid.SetFinishAction(overData);
        }
    };
    BattleMgr.prototype.Turn = function (turnData) {
        turnData.push(new BTurnStartAction());
        var speed = [];
        for (var _i = 0, _a = this.m_EntityTeams; _i < _a.length; _i++) {
            var datas = _a[_i];
            speed.push(datas);
        }
        speed.sort(function (lhs, rhs) {
            var s1 = 0;
            for (var _i = 0, lhs_1 = lhs; _i < lhs_1.length; _i++) {
                var d = lhs_1[_i];
                s1 += d.mInfo.getAtt(AttributeType.atSpeed);
            }
            var s2 = 0;
            for (var _a = 0, rhs_1 = rhs; _a < rhs_1.length; _a++) {
                var d = rhs_1[_a];
                s2 += d.mInfo.getAtt(AttributeType.atSpeed);
            }
            return s2 - s1;
        });
        for (var _b = 0, speed_1 = speed; _b < speed_1.length; _b++) {
            var datas = speed_1[_b];
            datas.sort(function (lhs, rhs) {
                return rhs.mInfo.getAtt(AttributeType.atSpeed) - lhs.mInfo.getAtt(AttributeType.atSpeed);
            });
            for (var _c = 0, datas_3 = datas; _c < datas_3.length; _c++) {
                var data = datas_3[_c];
                data.TurnBuff(turnData);
            }
            for (var _d = 0, datas_4 = datas; _d < datas_4.length; _d++) {
                var data = datas_4[_d];
                data.Turn(turnData);
                var retData = this.UnitCheckDead(turnData);
                if (retData) {
                    return retData;
                }
            }
        }
        return null;
    };
    BattleMgr.prototype.UnitCheckDead = function (turnData) {
        if (!this.m_Check) {
            return null;
        }
        this.m_Check = false;
        for (var i = 0; i < this.m_EntityTeams.length; ++i) {
            var datas = this.m_EntityTeams[i];
            var has = false;
            for (var _i = 0, datas_5 = datas; _i < datas_5.length; _i++) {
                var data = datas_5[_i];
                if (!data.IsDead()) {
                    has = true;
                    break;
                }
            }
            if (!has) {
                var data = new BattleNormalFinishData;
                data.isWin = i == 0 ? true : false;
                return data;
            }
        }
        return null;
    };
    return BattleMgr;
}());
__reflect(BattleMgr.prototype, "BattleMgr");
//# sourceMappingURL=BattleMgr.js.map