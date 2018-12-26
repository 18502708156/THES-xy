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
/**
 * 我要變強 Rule
 */
var UpLvIconRule = (function (_super) {
    __extends(UpLvIconRule, _super);
    function UpLvIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    UpLvIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(136, true);
    };
    UpLvIconRule.prototype.checkShowRedPoint = function () {
        if (GameGlobal.UpLvWayModel.mRedPoint.showRedPoint()) {
            return true;
        }
        return false;
    };
    UpLvIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(UpLvWayMainWin);
    };
    return UpLvIconRule;
}(RuleIconBase));
__reflect(UpLvIconRule.prototype, "UpLvIconRule");
//# sourceMappingURL=UpLvIconRule.js.map