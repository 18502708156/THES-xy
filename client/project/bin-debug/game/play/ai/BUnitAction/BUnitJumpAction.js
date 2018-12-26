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
var BUnitJumpAction = (function (_super) {
    __extends(BUnitJumpAction, _super);
    function BUnitJumpAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BUnitJumpAction.CreateByTarget = function (entity, src) {
        var p = egret.$TempPoint;
        if (entity) {
            BattleCtrl.GetOffsetPos(entity, p);
        }
        else {
            p.x = src.x;
            p.y = src.y;
        }
        return this.Create(p.x, p.y, src);
    };
    BUnitJumpAction.CreateByBlock = function (entity, src) {
        var p = egret.$TempPoint;
        if (entity) {
            BattleCtrl.GetOffsetBlockPos(entity, p);
        }
        else {
            p.x = src.x;
            p.y = src.y;
        }
        return this.Create(p.x, p.y, src);
    };
    BUnitJumpAction.Create = function (x, y, src) {
        var action = new BUnitJumpAction;
        action.m_EndX = x;
        action.m_EndY = y;
        action.m_Entity = src;
        return action;
    };
    // private GetY(time: number, maxTime: number): number {
    // 	time *= 0.001
    // 	maxTime *= 0.001
    // 	let a = BUnitJumpAction.SPEED_A
    // 	if (maxTime * maxTime * a / 8.0 > BUnitJumpAction.MAX_A) {
    // 		a = BUnitJumpAction.MAX_A * 8 / (maxTime * maxTime)
    // 	}
    // 	return 0.5 * a * maxTime * time - 0.5 * a * time * time
    // }
    BUnitJumpAction.prototype.OnUpdate = function (delta) {
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
        // MathUtils.Lerp(startX, startY, this.m_EndX, this.m_EndY, temp, tempPos)
        // this.m_Entity.SetPos(tempPos.x, tempPos.y)	
        this.bezier.Get(temp, tempPos);
        this.m_Entity.SetPos(tempPos.x, tempPos.y);
        if (temp >= 1) {
            return AIUnitReturn.NEXT;
        }
        return AIUnitReturn.CONTINUE;
    };
    BUnitJumpAction.prototype.OnEnter = function () {
        this.m_Entity.UpdateAction(EntityClipType.JUMP, true);
        var sx = this.m_SX = this.m_Entity.x;
        var sy = this.m_SY = this.m_Entity.y;
        var x1 = sx - this.m_EndX;
        var y1 = sy - this.m_EndY;
        var dx = this.m_EndX - sx;
        var dy = this.m_EndY - sy;
        this.m_Duration = Math.ceil(Math.sqrt(x1 * x1 + y1 * y1) / BUnitJumpAction.SPEED);
        this.m_Time = 0;
        this.bezier = new Bezier([
            { x: sx, y: sy },
            { x: sx + dx * 0.25, y: sy + dy * 0.25 - 70 },
            { x: sx + dx * 0.75, y: sy + dy * 0.75 - 70 },
            { x: this.m_EndX, y: this.m_EndY },
        ]);
    };
    BUnitJumpAction.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        GameMap.GetBattleView().UpdateSort();
    };
    BUnitJumpAction.SPEED = 1.42;
    BUnitJumpAction.SPEED_A = 1000;
    BUnitJumpAction.MAX_A = 150;
    return BUnitJumpAction;
}(BUnitAction));
__reflect(BUnitJumpAction.prototype, "BUnitJumpAction");
//# sourceMappingURL=BUnitJumpAction.js.map