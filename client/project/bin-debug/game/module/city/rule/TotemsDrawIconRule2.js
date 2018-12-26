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
 * 图腾_Rule
 */
var TotemsDrawIconRule2 = (function (_super) {
    __extends(TotemsDrawIconRule2, _super);
    // public static mIsFirst = true
    function TotemsDrawIconRule2(t) {
        return _super.call(this, t) || this;
        // this.effX = RuleIconBase.POS1_X
        // this.effY = 39
        // this.updateMessage = [MessageDef.LEVEL_CHANGE]
    }
    TotemsDrawIconRule2.prototype.checkShowIcon = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_143)) {
            return false;
        }
        return true;
    };
    TotemsDrawIconRule2.prototype.checkShowRedPoint = function () {
        // if (TreasureIconRule.mIsFirst) {
        // 	return true
        // }
        return false;
    };
    TotemsDrawIconRule2.prototype.tapExecute = function () {
        // TreasureIconRule.mIsFirst = false
        //ViewManager.ins().open(TotemsGoodLuckWin2);
        ViewManager.ins().open(TotemsGoodLuckMainWin, 1);
    };
    return TotemsDrawIconRule2;
}(RuleIconBase));
__reflect(TotemsDrawIconRule2.prototype, "TotemsDrawIconRule2");
//# sourceMappingURL=TotemsDrawIconRule2.js.map