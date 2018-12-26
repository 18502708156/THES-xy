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
var TianxianIconRule = (function (_super) {
    __extends(TianxianIconRule, _super);
    function TianxianIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    TianxianIconRule.prototype.checkShowRedPoint = function () {
        return 0;
    };
    TianxianIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(TianxianMainPanel);
    };
    return TianxianIconRule;
}(RuleIconBase));
__reflect(TianxianIconRule.prototype, "TianxianIconRule");
//# sourceMappingURL=TianxianIconRule.js.map