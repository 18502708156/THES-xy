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
var BoostPowerView = (function (_super) {
    __extends(BoostPowerView, _super);
    function BoostPowerView() {
        var _this = _super.call(this) || this;
        _this.lastTime = 0;
        _this.lastPower = 0;
        _this.timeout = 0;
        _this.skinName = "BoostPowerSkin";
        _this.group.verticalCenter = 50;
        _this.group.horizontalCenter = 0;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        return _this;
    }
    BoostPowerView.prototype.destoryView = function () {
    };
    BoostPowerView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
    };
    BoostPowerView.prototype.showBoostPower = function (e, t) {
        if (0 == this.lastPower) {
            this.lastPower = t;
            this.timeId = egret.setTimeout(this.delayPowerUp, this, 500);
        }
        else {
            if (this.timeId) {
                egret.clearTimeout(this.timeId);
            }
            this.timeId = egret.setTimeout(this.delayPowerUp, this, 500);
        }
    };
    BoostPowerView.prototype.clearShow = function () {
        egret.Tween.removeTweens(this.img);
        egret.Tween.removeTweens(this.powerLabel);
        egret.Tween.removeTweens(this.addPowerLabel);
        this.img.visible = !1;
        this.addPowerLabel.text = "";
        TimerManager.ins().removeAll(this);
        egret.clearTimeout(this.timeout);
        this.timeout = 0;
    };
    BoostPowerView.prototype.delayPowerUp = function () {
        this.timeId = null;
        if (!ViewManager.ins().isShow(BoostPowerView)) {
            ViewManager.ins().open(BoostPowerView);
        }
        // this.mc.loadUrl(ResDataPath.GetUIEffePath2("effe_ui_uppower_floor"), true, 1);
        // this.group.addChild(this.mc)
        var power = this.lastPower;
        var curPower = GameLogic.ins().actorModel.power;
        this.lastPower = 0;
        if (curPower > power) {
            this.showPowerUp(power, curPower);
        }
    };
    BoostPowerView.prototype.showPowerUp = function (lastPower, curPower) {
        var _this = this;
        this.clearShow();
        this.img.visible = !0;
        this.img.alpha = 1;
        var bitmapObj = this.powerLabel;
        bitmapObj.alpha = 1;
        var diffValue = curPower - lastPower;
        TimerManager.ins().doTimer(20, 25, function () {
            var t = diffValue;
            t += Math.round(Math.random() * t);
            var lastPowerStr = lastPower.toString();
            var o = t.toString().length == lastPowerStr.length ? t.toString().slice(1) : t + "";
            lastPowerStr = lastPowerStr.charAt(0);
            lastPowerStr += o;
            bitmapObj.text = lastPowerStr;
        }, this, function () {
            bitmapObj.text = GameLogic.ins().actorModel.power.toString();
            var e = "+" + diffValue;
            var addLabel = _this.addPowerLabel;
            addLabel.alpha = 1;
            addLabel.y = 0;
            addLabel.text = e;
            addLabel.x = bitmapObj.width - addLabel.width;
            addLabel.y -= bitmapObj.height;
            var t1 = 1e3;
            var t2 = 500;
            var tween = egret.Tween.get(addLabel);
            tween.to({
                y: addLabel.y - 45
            }, t1).to({
                alpha: 0
            }, t2);
            var tween2 = egret.Tween.get(bitmapObj);
            tween2.wait(t1).to({
                alpha: 0
            }, t2);
            var tween3 = egret.Tween.get(_this.img);
            tween3.wait(t1).to({
                alpha: 0
            }, t2).call(function () {
                _this.img.visible = false;
                _this.CloseSelf();
            }, _this);
        }, this);
    };
    BoostPowerView.LAYER_LEVEL = LayerManager.UI_Tips;
    return BoostPowerView;
}(BaseEuiView));
__reflect(BoostPowerView.prototype, "BoostPowerView");
;
//# sourceMappingURL=BoostPowerView.js.map