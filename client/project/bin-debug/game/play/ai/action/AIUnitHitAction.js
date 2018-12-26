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
var AIUnitHitAction = (function (_super) {
    __extends(AIUnitHitAction, _super);
    function AIUnitHitAction() {
        var _this = _super.call(this) || this;
        _this.m_Move = null;
        _this.mHit = 0;
        return _this;
    }
    AIUnitHitAction.prototype.OnEnter = function () {
        this.m_Move = null;
        this.mHit = AIConfig.PLAY_ANIM_TIME - 200;
        this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.HIT, true);
        if (!this.m_Pos) {
            this.m_Pos = {};
        }
        var entity = this.GetEntity();
        this.m_Pos.x = entity.x;
        this.m_Pos.y = entity.y;
    };
    AIUnitHitAction.prototype.OnExit = function () {
        var entity = this.GetEntity();
        entity.x = this.m_Pos.x;
        entity.y = this.m_Pos.y;
        this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.STAND, false);
    };
    AIUnitHitAction.prototype.OnUpdate = function (delta) {
        var v = this.mHit -= delta;
        if (v <= 0) {
            this.m_Move = null;
            this.mHit = 0;
            return AIUnitReturn.NEXT;
        }
        else {
            var entity = this.GetEntity();
            var resetTime = 80;
            if (v < resetTime) {
                var moveData = this.m_Move;
                if (moveData == null) {
                    moveData = this.m_Move = {
                        sx: entity.x,
                        sy: entity.y,
                    };
                }
                MathUtils.Lerp(moveData.sx, moveData.sy, this.m_Pos.x, this.m_Pos.y, (resetTime - v) / resetTime, entity);
            }
            else if (v > 300 || v < 120) {
                var isMy = !entity.GetInfo().IsSide();
                var mx = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed;
                var my = (isMy ? -1.2 : 1.2) * AIUnitDeadState.speed;
                entity.x += mx;
                entity.y += my;
            }
        }
        return AIUnitReturn.CONTINUE;
    };
    return AIUnitHitAction;
}(AIUnitAction));
__reflect(AIUnitHitAction.prototype, "AIUnitHitAction");
//# sourceMappingURL=AIUnitHitAction.js.map