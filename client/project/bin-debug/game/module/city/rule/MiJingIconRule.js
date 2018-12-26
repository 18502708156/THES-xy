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
var MiJingIconRule = (function (_super) {
    __extends(MiJingIconRule, _super);
    function MiJingIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [
            MessageDef.MIJING_INIT_INFO
        ];
        return _this;
    }
    MiJingIconRule.prototype.checkShowIcon = function () {
        return false;
    };
    MiJingIconRule.prototype.checkShowRedPoint = function () {
        var b = (GameGlobal.MiJingModel.redPointPaceRw() || GameGlobal.MiJingModel.redPointFloorRw() || GameGlobal.MiJingModel.getFreeTimes()) ? true : false;
        return b;
    };
    MiJingIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    MiJingIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(MiJingPanel);
    };
    return MiJingIconRule;
}(RuleIconBase));
__reflect(MiJingIconRule.prototype, "MiJingIconRule");
//# sourceMappingURL=MiJingIconRule.js.map