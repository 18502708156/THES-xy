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
var GangIconRule = (function (_super) {
    __extends(GangIconRule, _super);
    function GangIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.GANG_ALL_NOTICE, MessageDef.GANG_EXIT_NOTICE];
        _this.tar["redPoint"] = _this.tar.getChildByName("redPoint");
        return _this;
    }
    GangIconRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.GangModel.mRedPoint.IsRedPoint();
    };
    GangIconRule.prototype.tapExecute = function () {
        if (GameGlobal.GangModel.HasGang())
            ViewManager.ins().open(GangMainWin);
        else
            ViewManager.ins().open(GangListWin);
    };
    return GangIconRule;
}(RuleIconBase));
__reflect(GangIconRule.prototype, "GangIconRule");
//# sourceMappingURL=GangIconRule.js.map