var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AIUnitDeadState = (function (_super) {
    __extends(AIUnitDeadState, _super);
    function AIUnitDeadState() {
        var _this = _super.call(this) || this;
        _this.mType = AIUnitStateType.Die;
        return _this;
    }
    AIUnitDeadState.prototype.OnEnter = function () {
        GameGlobal.EntityEffMgr.UnbindByHandle(this.mUnit.mEntity.GetHandle());
        var entity = this.mUnit.mEntity;
        var info = entity.GetInfo();
        var isFlash = false;
        if (info && info.type == EntityType.Monster) {
            isFlash = Math.random() > 0.3;
        }
        if (isFlash) {
            this.mAction = [new AIUnitDeadFlash()];
        }
        else {
            this.mAction = [new AIUnitDeadKickOut()];
        }
        for (var _i = 0, _a = this.mAction; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Init(this);
        }
        _super.prototype.OnEnter.call(this);
    };
    AIUnitDeadState.prototype.OnExit = function () {
    };
    AIUnitDeadState.speed = 1.5;
    return AIUnitDeadState;
}(AIUnitState));
__reflect(AIUnitDeadState.prototype, "AIUnitDeadState");
//# sourceMappingURL=AIUnitDeadState.js.map