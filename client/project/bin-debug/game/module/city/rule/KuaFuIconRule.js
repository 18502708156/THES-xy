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
var KuaFuIconRule = (function (_super) {
    __extends(KuaFuIconRule, _super);
    function KuaFuIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.KF_BOSS_UPDATE_INFO, MessageDef.TSUMKOBASE_REDPOINT_NOTICE];
        _this.tar["redPoint"] = _this.tar.getChildByName("redPoint");
        _this.imgDouble = _this.tar.getChildByName("imgDouble");
        return _this;
    }
    KuaFuIconRule.prototype.checkShowRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_63, true)) {
            return false;
        }
        if (GameGlobal.CrossTeamModel.IsDoubleReward()) {
            this.imgDouble.visible = true;
            return false;
        }
        this.imgDouble.visible = false;
        var bool = GameGlobal.AcrossBossController.IsAcrossBossAct();
        if (bool == false)
            bool = GameGlobal.TsumKoBaseModel.mRedPoint.IsRedPoint();
        return bool;
    };
    KuaFuIconRule.prototype.checkShowIcon = function () {
        return true;
    };
    KuaFuIconRule.prototype.tapExecute = function () {
        ViewManager.ins().open(CrossMainPanel);
    };
    return KuaFuIconRule;
}(RuleIconBase));
__reflect(KuaFuIconRule.prototype, "KuaFuIconRule");
//# sourceMappingURL=KuaFuIconRule.js.map