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
var AIUnitRunAction = (function (_super) {
    __extends(AIUnitRunAction, _super);
    function AIUnitRunAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIUnitRunAction.prototype.OnUpdate = function (delta) {
        var startX = this.m_SX;
        var startY = this.m_SY;
        this.m_Time = this.m_Time + delta;
        var temp;
        if (this.m_Time >= this.m_Duration) {
            temp = 1;
        }
        else {
            temp = this.m_Time / this.m_Duration;
        }
        var tempPos = MathUtils.TEMP_POS;
        MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos);
        this.GetEntity().SetPos(tempPos.x, tempPos.y);
        if (temp >= 1) {
            return AIUnitReturn.NEXT;
        }
        return AIUnitReturn.CONTINUE;
    };
    AIUnitRunAction.prototype.OnEnter = function () {
        var sx = this.m_SX = this.GetUnit().mEntity.x;
        var sy = this.m_SY = this.GetUnit().mEntity.y;
        var args = this.GetArgs();
        this.m_EndX = args.mEndX;
        this.m_EndY = args.mEndY;
        var x1 = sx - args.mEndX;
        var y1 = sy - args.mEndY;
        this.GetUnit().mEntity.LookPos(args.mEndX, args.mEndY);
        this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / Const.GetMoveSpeed() * 1000);
        this.m_Time = 0;
    };
    return AIUnitRunAction;
}(AIUnitAction));
__reflect(AIUnitRunAction.prototype, "AIUnitRunAction");
//# sourceMappingURL=AIUnitRunAction.js.map