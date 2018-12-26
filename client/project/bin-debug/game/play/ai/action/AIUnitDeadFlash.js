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
var AIUnitDeadFlash = (function (_super) {
    __extends(AIUnitDeadFlash, _super);
    function AIUnitDeadFlash() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIUnitDeadFlash.prototype.OnEnter = function () {
        var self = this;
        self.remain = 800;
        self.alpha = 1;
        self.alphaDir = -1;
        self.cv = .1 * AIUnitDeadState.speed;
        this.m_UnitState.mUnit.mEntity.UpdateAction(EntityClipType.DIE, true);
    };
    AIUnitDeadFlash.prototype.OnUpdate = function (delta) {
        var self = this;
        self.remain -= delta;
        if (self.remain <= 0) {
            return AIUnitReturn.NEXT;
        }
        else if (self.remain <= 600) {
            self.alpha += self.alphaDir * self.cv;
            if (self.alpha <= 0 || self.alpha >= 1) {
                self.alphaDir = -self.alphaDir;
            }
            this.GetEntity().alpha = self.alpha;
        }
        return AIUnitReturn.CONTINUE;
    };
    AIUnitDeadFlash.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        this.GetEntity().visible = false;
    };
    return AIUnitDeadFlash;
}(AIUnitAction));
__reflect(AIUnitDeadFlash.prototype, "AIUnitDeadFlash");
//# sourceMappingURL=AIUnitDeadFlash.js.map