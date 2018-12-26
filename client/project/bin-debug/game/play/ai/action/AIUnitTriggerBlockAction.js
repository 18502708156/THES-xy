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
var AIUnitTriggerBlockAction = (function (_super) {
    __extends(AIUnitTriggerBlockAction, _super);
    function AIUnitTriggerBlockAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIUnitTriggerBlockAction.CreateByData = function (handle, beHandle) {
        var action = new AIUnitTriggerBlockAction;
        action.handle = handle;
        action.beHandle = beHandle;
        return action;
    };
    AIUnitTriggerBlockAction.prototype.OnEnter = function () {
        var unit = this.m_UnitState.mUnit.mEntity.mRaid.GetEntity(this.handle);
        unit.mAI.Protect(this.handle, this.beHandle);
    };
    return AIUnitTriggerBlockAction;
}(AIUnitAction));
__reflect(AIUnitTriggerBlockAction.prototype, "AIUnitTriggerBlockAction");
//# sourceMappingURL=AIUnitTriggerBlockAction.js.map