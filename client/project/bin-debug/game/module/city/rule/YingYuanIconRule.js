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
var YingYuanIconRule = (function (_super) {
    __extends(YingYuanIconRule, _super);
    function YingYuanIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.HOUSE_UPDATE_INFO];
        return _this;
    }
    YingYuanIconRule.prototype.checkShowIcon = function () {
        return Deblocking.Check(DeblockingType.TYPE_39, true) || Deblocking.Check(DeblockingType.TYPE_41, true);
    };
    YingYuanIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.YingYuanModel.CanUpgrade();
    };
    YingYuanIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(YingYuanWin);
    };
    return YingYuanIconRule;
}(RuleIconBase));
__reflect(YingYuanIconRule.prototype, "YingYuanIconRule");
//# sourceMappingURL=YingYuanIconRule.js.map