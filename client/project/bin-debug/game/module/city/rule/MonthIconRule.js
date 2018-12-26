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
var MonthIconRule = (function (_super) {
    __extends(MonthIconRule, _super);
    //月卡
    function MonthIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [];
        return _this;
    }
    MonthIconRule.prototype.checkShowIcon = function () {
        this.iconDisplay.source = "ui_zc_bt_yueka";
        return Deblocking.Check(DeblockingType.TYPE_127, true);
    };
    MonthIconRule.prototype.checkShowRedPoint = function () {
        return false;
    };
    MonthIconRule.prototype.getEffName = function (e) {
        return this.DefEffe(e);
    };
    MonthIconRule.prototype.tapExecute = function () {
        // this.firstTap = false
        // let config = GameGlobal.Config.LvRewardConfig;
        // let showLvPanel = true;
        // for (let key in config) {
        // 	showLvPanel = (GameGlobal.FuliModel.FuliData.lvMark & 1 << config[key].id) < 1
        // 	if (showLvPanel) break
        // }
        // if(showLvPanel==false)
        // 	ViewManager.ins().open(FuliWin,4);
        // else
        // 	ViewManager.ins().open(FuliWin,4);
        for (var i = 0; i < FuliWin.WelfareIcon.length; i++) {
            if (FuliWin.WelfareIcon[i].type == 4) {
                ViewManager.ins().open(FuliWin, i);
            }
        }
    };
    return MonthIconRule;
}(RuleIconBase));
__reflect(MonthIconRule.prototype, "MonthIconRule");
//# sourceMappingURL=MonthIconRule.js.map