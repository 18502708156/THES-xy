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
var AIUnitProtectState = (function (_super) {
    __extends(AIUnitProtectState, _super);
    function AIUnitProtectState() {
        var _this = _super.call(this) || this;
        _this.mType = AIUnitStateType.PROTECT;
        return _this;
    }
    AIUnitProtectState.prototype.PlayHit = function () {
        this.mAction[1].mWait = false;
        var action = this.mAction[2];
        if (action) {
            return action.mHit || 0;
        }
    };
    AIUnitProtectState.prototype.OnEnter = function () {
        var raid = this.mUnit.mEntity.mRaid;
        var unit = raid.GetEntity(this.mAIUnitArgs.mBlockSrc);
        var target = raid.GetEntity(this.mAIUnitArgs.mBeBlockSrc);
        this.mAction = [
            AIUnitJumpAction.CreateByBlock(target, unit.mAI),
            new AIUnitWaitAction,
            new AIUnitHitAction,
            AIUnitJumpAction.Create(unit.x, unit.y)
        ];
        for (var _i = 0, _a = this.mAction; _i < _a.length; _i++) {
            var action = _a[_i];
            action.Init(this);
        }
        _super.prototype.OnEnter.call(this);
    };
    AIUnitProtectState.prototype.OnExit = function () {
    };
    return AIUnitProtectState;
}(AIUnitState));
__reflect(AIUnitProtectState.prototype, "AIUnitProtectState");
//# sourceMappingURL=AIUnitProtectState.js.map