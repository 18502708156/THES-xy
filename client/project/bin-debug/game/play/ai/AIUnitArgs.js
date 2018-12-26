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
var IAIUnitArgs = (function () {
    function IAIUnitArgs() {
    }
    IAIUnitArgs.prototype.SetAnimName = function (anim) {
    };
    IAIUnitArgs.prototype.SetMovePos = function (x, y) {
    };
    IAIUnitArgs.prototype.SetTurnData = function (turnData) {
    };
    IAIUnitArgs.prototype.Protect = function (src, beSrc) {
    };
    IAIUnitArgs.prototype.Clear = function () {
    };
    return IAIUnitArgs;
}());
__reflect(IAIUnitArgs.prototype, "IAIUnitArgs");
var AIUnitArgs = (function (_super) {
    __extends(AIUnitArgs, _super);
    function AIUnitArgs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AIUnitArgs.prototype.SetAnimName = function (anim) {
        this.mAnim = anim;
    };
    AIUnitArgs.prototype.SetMovePos = function (x, y) {
        this.mEndX = x;
        this.mEndY = y;
    };
    AIUnitArgs.prototype.SetTurnData = function (turnData) {
        this.mTurnData = turnData;
    };
    AIUnitArgs.prototype.Protect = function (src, beSrc) {
        this.mBlockSrc = src;
        this.mBeBlockSrc = beSrc;
    };
    AIUnitArgs.prototype.Clear = function () {
        this.mAnim = null;
        this.mEndX = null;
        this.mEndY = null;
    };
    return AIUnitArgs;
}(IAIUnitArgs));
__reflect(AIUnitArgs.prototype, "AIUnitArgs");
//# sourceMappingURL=AIUnitArgs.js.map