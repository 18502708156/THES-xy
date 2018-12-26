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
var EffectivenessTip = (function (_super) {
    __extends(EffectivenessTip, _super);
    /////////////////////////////////////////////////////////////////////////////
    function EffectivenessTip() {
        var _this = _super.call(this) || this;
        _this.skinName = "CheckEfficienSkin";
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    EffectivenessTip.prototype.OnOpen = function () {
        var _this = this;
        this.update();
        TimerManager.ins().doTimer(2000, 1, function () {
            var t = egret.Tween.get(_this);
            t.to({ "alpha": 0 }, 1000).call(function () {
                _this.alpha = 1;
                ViewManager.ins().close(_this);
            }, _this);
        }, this);
    };
    ;
    EffectivenessTip.prototype.update = function () {
        var userFb = GameGlobal.UserFb;
        if (userFb.config.expEff == userFb.lastData.expEff) {
            this.groupExp.visible = false;
        }
        else {
            this.groupExp.visible = true;
            this.nextExp.text = userFb.config.expEff + "";
            this.curExp.text = userFb.lastData.expEff + "";
        }
        if (userFb.config.goldEff == userFb.lastData.goldEff) {
            this.groupGold.visible = false;
        }
        else {
            this.groupGold.visible = true;
            this.nextMoney.text = userFb.config.goldEff + "";
            this.curMoney.text = userFb.lastData.goldEff + "";
        }
    };
    ;
    EffectivenessTip.LAYER_LEVEL = LayerManager.UI_Popup;
    return EffectivenessTip;
}(BaseEuiView));
__reflect(EffectivenessTip.prototype, "EffectivenessTip");
//# sourceMappingURL=EffectivenessTip.js.map