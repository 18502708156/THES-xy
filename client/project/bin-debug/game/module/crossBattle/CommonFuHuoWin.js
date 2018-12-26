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
var CommonFuHuoWin = (function (_super) {
    __extends(CommonFuHuoWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CommonFuHuoWin() {
        var _this = _super.call(this) || this;
        _this.fuHuoTime = 0;
        _this.skinName = "CommonFuHuSkin";
        _this.percentWidth = 100;
        _this.percentHeight = 100;
        _this.fuhuoBnt.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.click, _this);
        return _this;
    }
    CommonFuHuoWin.prototype.SetData = function (time, yb, func) {
        this.mContext = this.parent;
        TimerManager.ins().removeAll(this);
        this.fuHuoTime = time;
        this.price = yb;
        this.fun = func;
        this.fuhuoPrice.setType(this.price.id);
        this.fuhuoPrice.setPrice(this.price.count);
        this.fuhuoPrice.setColor(0xffffff);
        this.update();
        TimerManager.ins().doTimer(1000, this.fuHuoTime, this.update, this);
    };
    CommonFuHuoWin.prototype.click = function () {
        if (Checker.Money(this.price.id, this.price.count, Checker.YUNBAO_FRAME)) {
            if (this.fun) {
                this.fun();
            }
            DisplayUtils.removeFromParent(this);
        }
    };
    CommonFuHuoWin.prototype.OnClose = function () {
        TimerManager.ins().remove(this.update, this);
        DisplayUtils.removeFromParent(this);
    };
    CommonFuHuoWin.prototype.update = function () {
        this.fuHuoTime--;
        this.fuhuoTime.text = "复活倒计时：" + this.fuHuoTime;
        if (this.fuHuoTime <= 0) {
            TimerManager.ins().remove(this.update, this);
            DisplayUtils.removeFromParent(this);
        }
    };
    CommonFuHuoWin.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.fun = null;
        TimerManager.ins().removeAll(this);
        if (this.mContext) {
            this.mContext.mRebornView = null;
        }
    };
    return CommonFuHuoWin;
}(eui.Component));
__reflect(CommonFuHuoWin.prototype, "CommonFuHuoWin", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=CommonFuHuoWin.js.map