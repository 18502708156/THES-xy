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
var BDelayAction = (function (_super) {
    __extends(BDelayAction, _super);
    function BDelayAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mDelay = 0;
        return _this;
    }
    BDelayAction.Create = function (delay) {
        var action = new BDelayAction;
        action.mDelay = delay;
        return action;
    };
    BDelayAction.prototype.OnUpdate = function (delta) {
        return (this.mDelay -= delta) > 0 ? AIUnitReturn.CONTINUE : AIUnitReturn.NEXT;
    };
    return BDelayAction;
}(BUnitAction));
__reflect(BDelayAction.prototype, "BDelayAction");
//# sourceMappingURL=BDelayAction.js.map