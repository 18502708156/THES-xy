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
var RaidAIUnit = (function (_super) {
    __extends(RaidAIUnit, _super);
    function RaidAIUnit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RaidAIUnit.prototype.Init = function (entity) {
        var _this = this;
        var addState = function (state) {
            _this.mStateList[state.mType] = state;
        };
        addState(AIUnit.GetStandState(this));
        var dead = new AIUnitDeadState;
        dead.Init(this);
        addState(dead);
        _super.prototype.Init.call(this, entity);
        this.mCurState.OnEnter();
    };
    return RaidAIUnit;
}(AIUnit));
__reflect(RaidAIUnit.prototype, "RaidAIUnit");
//# sourceMappingURL=RaidAIUnit.js.map