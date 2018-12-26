var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BattleAtkAction = (function () {
    function BattleAtkAction() {
        this.tmpCheck = 0;
    }
    BattleAtkAction.prototype.Init = function (unit) {
        this.mUnit = unit;
    };
    BattleAtkAction.prototype.Turn = function () {
        var skill = this.GetUseSkill();
        if (!skill) {
            console.error("not can use skill => ");
            return;
        }
        var enemyList = skill.ScanEnemy();
        return skill.Use(enemyList);
    };
    BattleAtkAction.prototype.GetUseSkill = function () {
        if (!this.mUnit.CanUseSkill()) {
            return null;
        }
        var index = this.tmpCheck++;
        for (var i = 0, len = this.mUnit.mSkill.length; i < len; i++) {
            var j = (i + index) % len;
            var skill = this.mUnit.mSkill[j];
            if (!skill.IsAbilitySkill()) {
                continue;
            }
            if (skill.CheckCondition()) {
                return skill;
            }
        }
        return null;
    };
    return BattleAtkAction;
}());
__reflect(BattleAtkAction.prototype, "BattleAtkAction");
//# sourceMappingURL=BattleAtkAction.js.map