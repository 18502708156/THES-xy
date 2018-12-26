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
var KaiFuIconRule = (function (_super) {
    __extends(KaiFuIconRule, _super);
    function KaiFuIconRule(t) {
        var _this = _super.call(this, t) || this;
        _this.updateMessage = [MessageDef.ACTIVITY_INFO, MessageDef.ACTIVITY_UPDATE, MessageDef.ACTIVITY_DABIAO_UPDATE, MessageDef.ACTIVITY_IS_GET_AWARDS,
            MessageDef.ACTIVITY_ADVANCED_INFO, MessageDef.ACTIVITY_ADVANCED_ICON_SHOW];
        return _this;
    }
    KaiFuIconRule.prototype.checkShowRedPoint = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_124)) {
            return false;
        }
        if (GameGlobal.ActivityKaiFuModel.RedPointAdvanced()) {
            return true;
        }
        if (GameGlobal.ActivityKaiFuModel.RedPointQiTian()) {
            return true;
        }
        if (GameGlobal.ActivityKaiFuModel.RedPointTarget()) {
            return true;
        }
        if (GameGlobal.ActivityKaiFuModel.RedPointAdvanceShop()) {
            return true;
        }
        return false;
    };
    KaiFuIconRule.prototype.checkShowIcon = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_124)) {
            return false;
        }
        // if (GameGlobal.ActivityKaiFuModel.hasActivityQiTian())
        // {
        // 	return true;
        // }	
        // if (GameGlobal.ActivityKaiFuModel.hasActivityTarget())
        // {
        // 	return true;
        // }
        // return false;
        return true;
    };
    KaiFuIconRule.prototype.tapExecute = function () {
        KaiFuActivityWin.Show();
    };
    return KaiFuIconRule;
}(RuleIconBase));
__reflect(KaiFuIconRule.prototype, "KaiFuIconRule");
//# sourceMappingURL=KaiFuIconRule.js.map