var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleUnit = (function () {
    function BattleUnit() {
        this.mSkill = [];
        this.mBuffs = {};
    }
    BattleUnit.Equal = function (lhs, rhs) {
        if (!lhs || !rhs) {
            return false;
        }
        return lhs.mInfo.handle == rhs.mInfo.handle;
    };
    BattleUnit.prototype.Init = function (raid, entityData, teamIndex) {
        this.mRaid = raid;
        this.mInfo = entityData;
        this.mTeamIndex = teamIndex;
        this.action = new BattleAtkAction;
        this.action.Init(this);
        var ids = entityData.GetSkillIDs();
        this.mSkill = [];
        var index = 0;
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            if (id) {
                this.mSkill.push(new SUnitSkill(this, id));
            }
        }
        for (var _a = 0, _b = this.mSkill; _a < _b.length; _a++) {
            var skill = _b[_a];
            skill.Init();
        }
        this.mBuffs = {};
    };
    BattleUnit.prototype.IsDead = function () {
        return this.mInfo.getAtt(AttributeType.atHp) <= 0;
    };
    BattleUnit.prototype.CanUseSkill = function () {
        return true;
    };
    BattleUnit.prototype.CanBlock = function () {
        if (this.IsDead()) {
            return false;
        }
        return true;
    };
    BattleUnit.prototype.GetMaxHp = function () {
        return Math.floor(this.mInfo.getAtt(AttributeType.atMaxHp));
    };
    BattleUnit.prototype.IsTarget = function () {
        return !this.IsDead();
    };
    BattleUnit.prototype.Turn = function (turnDatas) {
        if (this.IsDead()) {
            return;
        }
        var data = this.action.Turn();
        if (data) {
            turnDatas.push(data);
        }
    };
    BattleUnit.prototype.Hit = function (type, value, caster) {
        this.UpdateHp(value, caster);
    };
    BattleUnit.prototype.UpdateHp = function (value, caster) {
        var self = this;
        if (self.IsDead()) {
            return;
        }
        var nowHp = self.mInfo.getAtt(AttributeType.atHp) + value;
        var maxHp = self.GetMaxHp();
        nowHp = nowHp > maxHp ? maxHp : nowHp;
        nowHp = nowHp < 0 ? 0 : nowHp;
        self.mInfo.setAtt(AttributeType.atHp, nowHp);
        if (nowHp <= 0) {
            this.mRaid.OnUnitDead(self.mInfo.handle);
        }
    };
    BattleUnit.prototype.TurnBuff = function (list) {
        for (var key in this.mBuffs) {
            var buff = this.mBuffs[key];
            if (!buff.Turn()) {
                this.RemoveBuff(list, Number(key));
            }
        }
    };
    BattleUnit.prototype.RemoveBuff = function (list, buffId) {
        var buff = this.mBuffs[buffId];
        if (!buff) {
            return;
        }
        delete this.mBuffs[buffId];
        list.push(buff.OnRemove());
    };
    BattleUnit.prototype.CheckBuff = function (list, buffId) {
        var config = GameGlobal.Config.EffectsConfig[buffId];
        if (!config) {
            return;
        }
        var groupId = config[GameGlobal.Config.EffectsConfig_keys.group];
        var removeList = [];
        for (var key in this.mBuffs) {
            var buffConfig = GameGlobal.Config.EffectsConfig[Number(key)];
            if (!buffConfig) {
                continue;
            }
            if (buffConfig[GameGlobal.Config.EffectsConfig_keys.group] == groupId) {
                removeList.push(Number(key));
            }
        }
        for (var _i = 0, removeList_1 = removeList; _i < removeList_1.length; _i++) {
            var id = removeList_1[_i];
            this.RemoveBuff(list, id);
        }
    };
    BattleUnit.prototype.AddBuffs = function (list, src, buffId) {
        for (var _i = 0, buffId_1 = buffId; _i < buffId_1.length; _i++) {
            var id = buffId_1[_i];
            this.AddBuff(list, src, id);
        }
        var tmpData = new BAddBuffAction;
        tmpData.src = src;
        tmpData.target = this.mInfo.handle;
        tmpData.args = buffId;
        list.push(tmpData);
    };
    BattleUnit.prototype.AddBuff = function (list, src, buffId) {
        var config = GameGlobal.Config.EffectsConfig[buffId];
        if (!config) {
            return;
        }
        this.CheckBuff(list, buffId);
        var unitBuff = new BattleUnitBuff;
        unitBuff.mTarget = this;
        unitBuff.mBuffId = buffId;
        unitBuff.mConfig = config;
        unitBuff.mTurn = 0;
        unitBuff.OnAdd();
        this.mBuffs[buffId] = unitBuff;
    };
    return BattleUnit;
}());
__reflect(BattleUnit.prototype, "BattleUnit");
//# sourceMappingURL=BattleUnit.js.map