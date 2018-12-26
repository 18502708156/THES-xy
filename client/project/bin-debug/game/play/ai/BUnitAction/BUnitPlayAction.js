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
var BUnitPlayAction = (function (_super) {
    __extends(BUnitPlayAction, _super);
    function BUnitPlayAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BUnitPlayAction.Create = function (src, anim, once) {
        if (once === void 0) { once = true; }
        var action = new BUnitPlayAction;
        action.m_Anim = anim;
        action.m_Src = src;
        return action;
    };
    BUnitPlayAction.prototype.OnEnter = function () {
        this.m_Src.UpdateAction(this.m_Anim, this.m_Once);
    };
    return BUnitPlayAction;
}(BUnitAction));
__reflect(BUnitPlayAction.prototype, "BUnitPlayAction");
//# sourceMappingURL=BUnitPlayAction.js.map