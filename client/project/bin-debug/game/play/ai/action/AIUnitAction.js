var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIUnitReturn;
(function (AIUnitReturn) {
    AIUnitReturn[AIUnitReturn["CONTINUE"] = 0] = "CONTINUE";
    AIUnitReturn[AIUnitReturn["NEXT"] = 1] = "NEXT";
    AIUnitReturn[AIUnitReturn["BREAK"] = 2] = "BREAK";
})(AIUnitReturn || (AIUnitReturn = {}));
var AIUnitAction = (function () {
    function AIUnitAction() {
    }
    AIUnitAction.prototype.GetUnit = function () {
        return this.m_UnitState.mUnit;
    };
    AIUnitAction.prototype.GetEntity = function () {
        return this.m_UnitState.mUnit.mEntity;
    };
    AIUnitAction.prototype.GetArgs = function () {
        return this.m_UnitState.mAIUnitArgs;
    };
    AIUnitAction.prototype.Init = function (unitState) {
        this.m_UnitState = unitState;
    };
    AIUnitAction.prototype.OnUpdate = function (delta) {
        return AIUnitReturn.NEXT;
    };
    AIUnitAction.prototype.OnEnter = function () {
    };
    AIUnitAction.prototype.OnExit = function () {
    };
    AIUnitAction.POOL = [];
    return AIUnitAction;
}());
__reflect(AIUnitAction.prototype, "AIUnitAction");
//# sourceMappingURL=AIUnitAction.js.map