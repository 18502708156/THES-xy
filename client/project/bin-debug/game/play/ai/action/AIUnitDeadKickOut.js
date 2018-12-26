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
var AIUnitDeadKickOut = (function (_super) {
    __extends(AIUnitDeadKickOut, _super);
    function AIUnitDeadKickOut() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.way = 1;
        _this.wayInvt = 0;
        _this.top = 50;
        _this.bottom = StageUtils.HEIGHT;
        _this.left = 0;
        _this.right = 820;
        return _this;
    }
    AIUnitDeadKickOut.prototype.OnEnter = function () {
        var self = this;
        self.radius = 50;
        self.count = 0;
        var speed = AIUnitDeadState.speed;
        speed = 1.5 * speed + 1;
        var info = this.GetEntity().GetInfo();
        var posIndex = info.posIndex;
        var data = 3;
        (9 == posIndex || 10 == posIndex || 4 == posIndex || 5 == posIndex) && (data = -5);
        if (info.side == 2) {
            self.vx = 12 * speed;
            self.vy = (12 - data) * speed;
        }
        else {
            self.vx = -12 * speed;
            self.vy = -(12 - data) * speed;
        }
    };
    AIUnitDeadKickOut.prototype.OnUpdate = function (delta) {
        var self = this;
        var entity = this.GetEntity();
        var x = entity.x;
        var y = entity.y;
        self.wayInvt += delta;
        if (self.wayInvt > 100) {
            self.way++;
            self.wayInvt = 0;
            // entity.SetDir(self.way % 8)
            entity.scaleX = self.way % 2 == 0 ? 1 : -1;
        }
        entity.x += self.vx;
        entity.y += self.vy;
        if (self.count >= 2) {
            self.radius = -100;
        }
        if (x + self.radius > self.right) {
            entity.x = self.right - self.radius;
            self.vx *= -1;
            self.count++;
        }
        else if (y + self.radius > self.bottom) {
            entity.y = self.bottom - self.radius;
            self.vy *= -1;
            self.count++;
        }
        else if (x - self.radius < self.left) {
            entity.x = self.left + self.radius;
            self.vx *= -1;
            self.count++;
        }
        else if (y - self.radius < self.top) {
            entity.y = self.top + self.radius;
            self.vy *= -1;
            self.count++;
        }
        if (self.count >= 3) {
            entity.visible = false;
            return AIUnitReturn.NEXT;
        }
        return AIUnitReturn.CONTINUE;
    };
    return AIUnitDeadKickOut;
}(AIUnitAction));
__reflect(AIUnitDeadKickOut.prototype, "AIUnitDeadKickOut");
//# sourceMappingURL=AIUnitDeadKickOut.js.map