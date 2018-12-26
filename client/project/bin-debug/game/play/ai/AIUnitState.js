var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIUnitStateType = (function () {
    function AIUnitStateType() {
    }
    AIUnitStateType.STAND = "STAND";
    AIUnitStateType.Die = "Die";
    AIUnitStateType.RUN = "RUN";
    AIUnitStateType.BORN = "BORN";
    AIUnitStateType.Atk = "Atk";
    AIUnitStateType.HIT = "HIT";
    AIUnitStateType.PROTECT = "BLOCK";
    AIUnitStateType.FIND_NEXT_POS = "FIND_NEXT_POS";
    return AIUnitStateType;
}());
__reflect(AIUnitStateType.prototype, "AIUnitStateType");
var AIUnitState = (function () {
    function AIUnitState() {
        this.mIndex = 0;
        this.mAction = [];
        this.mIsEnter = false;
        this.mAIUnitArgs = new AIUnitArgs;
    }
    AIUnitState.prototype.ClearOtherAnim = function () {
    };
    AIUnitState.prototype.PlayHit = function () {
        return 0;
    };
    AIUnitState.prototype.PlayEvade = function () {
        return 0;
    };
    AIUnitState.prototype.Init = function (unit) {
        this.mIndex = 0;
        this.mUnit = unit;
        for (var _i = 0, _a = this.mAction; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Init(this);
        }
    };
    AIUnitState.prototype.OnUpdate = function (delta) {
        var action = this.mAction[this.mIndex];
        if (!action) {
            this.mUnit.StateEndEvent(this.mType);
            return;
        }
        var ret = action.OnUpdate(delta);
        if (ret == AIUnitReturn.BREAK) {
            this.mUnit.StateEndEvent(this.mType);
            return;
        }
        if (ret == AIUnitReturn.NEXT) {
            action.OnExit();
            var nextAction = this.mAction[++this.mIndex];
            if (nextAction) {
                nextAction.OnEnter();
            }
            else {
                this.mUnit.StateEndEvent(this.mType);
            }
        }
    };
    AIUnitState.prototype.OnEnter = function () {
        this.mIndex = 0;
        var action = this.mAction[this.mIndex];
        if (action) {
            action.OnEnter();
        }
    };
    AIUnitState.prototype.OnExit = function () {
        var action = this.mAction[this.mIndex];
        if (action) {
            action.OnExit();
        }
    };
    return AIUnitState;
}());
__reflect(AIUnitState.prototype, "AIUnitState", ["IAIUnitState"]);
//# sourceMappingURL=AIUnitState.js.map