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
var LadderRule = (function (_super) {
    __extends(LadderRule, _super);
    function LadderRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    LadderRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    LadderRule.prototype.checkShowIcon = function () {
        return true;
    };
    LadderRule.prototype.tapExecute = function () {
        // ViewManager.ins().open(LadderWin)
    };
    return LadderRule;
}(RuleIconBase));
__reflect(LadderRule.prototype, "LadderRule");
//# sourceMappingURL=LadderRule.js.map