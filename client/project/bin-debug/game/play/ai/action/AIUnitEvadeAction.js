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
var AIUnitEvadeAction = (function (_super) {
    __extends(AIUnitEvadeAction, _super);
    function AIUnitEvadeAction() {
        var _this = _super.call(this) || this;
        _this.m_Move = null;
        _this.m_Time = 0;
        return _this;
    }
    AIUnitEvadeAction.prototype.OnEnter = function () {
        this.m_Time = 0;
        this.m_Move = null;
        if (!this.m_Pos) {
            this.m_Pos = {};
        }
        var entity = this.GetEntity().GetInfo();
        BattleCtrl.GetPos(entity.IsSide(), entity.posIndex, this.m_Pos);
    };
    AIUnitEvadeAction.prototype.OnExit = function () {
        var entity = this.GetEntity();
        entity.x = this.m_Pos.x;
        entity.y = this.m_Pos.y;
    };
    AIUnitEvadeAction.prototype.OnUpdate = function (delta) {
        this.m_Time += delta;
        var dt = this.m_Time / 600;
        var entity = this.GetEntity();
        if (dt >= 1) {
            entity.x = this.m_Pos.x;
            entity.y = this.m_Pos.y;
            return AIUnitReturn.NEXT;
        }
        var x = Math.sin(dt * Math.PI) * 40;
        entity.x = this.m_Pos.x - x;
        return AIUnitReturn.CONTINUE;
    };
    return AIUnitEvadeAction;
}(AIUnitAction));
__reflect(AIUnitEvadeAction.prototype, "AIUnitEvadeAction");
//# sourceMappingURL=AIUnitEvadeAction.js.map