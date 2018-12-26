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
var TotemsIconRule = (function (_super) {
    __extends(TotemsIconRule, _super);
    // public static mIsFirst = true
    function TotemsIconRule(t) {
        var _this = _super.call(this, t) || this;
        // this.effX = RuleIconBase.POS1_X
        // this.effY = 39
        // this.updateMessage = [MessageDef.LEVEL_CHANGE]
        _this.updateMessage = [MessageDef.TOTEMS_REDPOINT_NOTICE, MessageDef.TOTEMS_UPDATEACTIVATION];
        return _this;
    }
    TotemsIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_119, true)) {
            return false;
        }
        return true;
    };
    TotemsIconRule.prototype.checkShowRedPoint = function () {
        if (GameGlobal.TotemsModel.mRedPoint.showRedPoint()) {
            return true;
        }
        return false;
    };
    TotemsIconRule.prototype.tapExecute = function () {
        // TotemsIconRule.mIsFirst = false
        ViewManager.ins().open(TotemsMainWin);
    };
    return TotemsIconRule;
}(RuleIconBase));
__reflect(TotemsIconRule.prototype, "TotemsIconRule");
//# sourceMappingURL=TotemsIconRule.js.map