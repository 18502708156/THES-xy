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
var PositionRule = (function (_super) {
    __extends(PositionRule, _super);
    function PositionRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.POSITION_AWARD_CHANGE, MessageDef.LEVEL_CHANGE];
        return _this;
    }
    PositionRule.prototype.checkShowIcon = function () {
        var config = GameGlobal.Config.StationConfig;
        var position_info = GameGlobal.PositionForeshowModel.position_info;
        var show = false;
        if (position_info) {
            for (var key in position_info.data) {
                if (position_info.data[key].typ != 3 && GameGlobal.actorModel.level >= config[parseInt(key) + 1].showlv) {
                    this.iconDisplay.source = "ui_gk_bt_zw" + (parseInt(key) + 2);
                    show = true;
                    break;
                }
            }
        }
        return Deblocking.IsDeblocking(DeblockingType.TYPE_142) && show;
    };
    PositionRule.prototype.checkShowRedPoint = function () {
        return GameGlobal.PositionForeshowModel.isRedPoint();
    };
    PositionRule.prototype.tapExecute = function () {
        ViewManager.ins().open(PositionForeshowPanel);
    };
    return PositionRule;
}(RuleIconBase));
__reflect(PositionRule.prototype, "PositionRule");
//# sourceMappingURL=PositionRule.js.map