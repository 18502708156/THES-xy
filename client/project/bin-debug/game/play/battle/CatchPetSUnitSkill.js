var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CatchPetSUnitSkill = (function () {
    function CatchPetSUnitSkill(skillId, handle) {
        this.mTargets = [];
        this.handle = 0;
        this.mSkillId = skillId;
        this.handle = handle;
    }
    CatchPetSUnitSkill.prototype.Init = function () {
        this.m_SkillConfig = GameGlobal.Config.SkillsConfig[this.mSkillId];
    };
    CatchPetSUnitSkill.prototype.Use = function (targets) {
        this.mTargets = targets || [];
        var action = new CatchSkillAction;
        action.src = this.handle;
        action.skillId = this.mSkillId;
        action.targets = targets;
        var event = [];
        if (targets) {
            var actions = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.actions];
            var list = [];
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var dt = actions_1[_i];
                var dta = this.ExecuteAction(dt, this.handle, targets);
                dta.skill = action;
                list.push(dta);
            }
            action.actions = list;
        }
        else {
            console.warn("not enm");
        }
        return action;
    };
    CatchPetSUnitSkill.prototype.ExecuteAction = function (actionId, handle, tar) {
        var atkData = new BUseSkillAtkAction;
        atkData.src = handle;
        atkData.actionId = actionId;
        var configData = GameGlobal.Config.SkillsExeConfig[actionId];
        if (!configData) {
            console.error("not config id => " + actionId);
            return atkData;
        }
        var targets = tar;
        if (!targets || targets.length == 0) {
            atkData.targets = [];
            console.log("not target => " + actionId);
            return atkData;
        }
        atkData.targets = tar;
        var list = [];
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var targetId = targets_1[_i];
            var tmpData = new BattleDamageBaseData;
            tmpData.target = tar;
            tmpData.type = 0;
            tmpData.value = null;
            atkData.event.push(tmpData);
        }
        return atkData;
    };
    return CatchPetSUnitSkill;
}());
__reflect(CatchPetSUnitSkill.prototype, "CatchPetSUnitSkill");
//# sourceMappingURL=CatchPetSUnitSkill.js.map