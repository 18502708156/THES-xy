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
var AIUnitJumpAction = (function (_super) {
    __extends(AIUnitJumpAction, _super);
    function AIUnitJumpAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIUnitJumpAction.CreateMove = function (entity, src) {
        var action = this.CreateByTarget(entity, src);
        action.m_Entity = src;
        return action;
    };
    AIUnitJumpAction.CreateByTarget = function (entity, src) {
        var p = egret.$TempPoint;
        if (entity) {
            BattleCtrl.GetOffsetPos(entity, p);
        }
        else {
            p.x = src.x;
            p.y = src.y;
        }
        return this.Create(p.x, p.y);
    };
    AIUnitJumpAction.CreateByBlock = function (entity, src) {
        var p = egret.$TempPoint;
        if (entity) {
            BattleCtrl.GetOffsetBlockPos(entity, p);
        }
        else {
            p.x = src.mEntity.x;
            p.y = src.mEntity.y;
        }
        return this.Create(p.x, p.y);
    };
    AIUnitJumpAction.Create = function (x, y) {
        var action = new AIUnitJumpAction;
        action.m_EndX = x;
        action.m_EndY = y;
        return action;
    };
    AIUnitJumpAction.prototype.GetY = function (time, maxTime) {
        time *= 0.001;
        maxTime *= 0.001;
        var a = AIUnitJumpAction.SPEED_A;
        if (maxTime * maxTime * a / 8.0 > AIUnitJumpAction.MAX_A) {
            a = AIUnitJumpAction.MAX_A * 8 / (maxTime * maxTime);
        }
        return 0.5 * a * maxTime * time - 0.5 * a * time * time;
    };
    AIUnitJumpAction.prototype.OnUpdate = function (delta) {
        var startX = this.m_SX;
        var startY = this.m_SY;
        this.m_Time = this.m_Time + delta;
        var temp;
        if (this.m_Time >= this.m_Duration) {
            temp = 1;
        }
        else {
            // temp = egret.Ease.cubicOut(this.m_Time / this.m_Duration)
            temp = this.m_Time / this.m_Duration;
            var e = temp - 1;
            temp = e * e * e + 1;
        }
        var tempPos = MathUtils.TEMP_POS;
        MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos);
        this.m_Entity.SetPos(tempPos.x, tempPos.y);
        if (temp >= 1) {
            return AIUnitReturn.NEXT;
        }
        return AIUnitReturn.CONTINUE;
    };
    AIUnitJumpAction.prototype.OnEnter = function () {
        if (this.m_Entity == null) {
            this.m_Entity = this.GetEntity();
        }
        this.m_Entity.UpdateAction(EntityClipType.JUMP, true);
        var sx = this.m_SX = this.m_Entity.x;
        var sy = this.m_SY = this.m_Entity.y;
        var x1 = sx - this.m_EndX;
        var y1 = sy - this.m_EndY;
        // this.GetEntity().LookPos(args.mEndX, args.mEndY)
        this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / AIUnitJumpAction.SPEED);
        this.m_Time = 0;
    };
    AIUnitJumpAction.SPEED = 1.42;
    AIUnitJumpAction.SPEED_A = 1000;
    AIUnitJumpAction.MAX_A = 150;
    return AIUnitJumpAction;
}(AIUnitAction));
__reflect(AIUnitJumpAction.prototype, "AIUnitJumpAction");
//# sourceMappingURL=AIUnitJumpAction.js.map