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
var GainLabel = (function (_super) {
    __extends(GainLabel, _super);
    function GainLabel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mLabels = [];
        return _this;
    }
    GainLabel.prototype.childrenCreated = function () {
        this.mLabels = this.getGroup.$children;
        for (var i = 0; i < this.mLabels.length; i++) {
            this.mLabels[i].name = i + "";
            this.mLabels[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
        }
        if (this.mId) {
            this.SetId(this.mId);
        }
    };
    GainLabel.prototype.OnClick = function (e) {
        if (!this.gainWayData) {
            return;
        }
        var index = Number(e.currentTarget.name);
        var data = this.gainWayData[index];
        if (data && data[2] == 1) {
            GameGlobal.ViewManager.Guide(data[1][0]);
        }
        else if (data && data[2] == 2) {
            GameGlobal.UserTips.showTips(data[0]);
        }
    };
    GainLabel.prototype.SetId = function (id) {
        this.mId = id;
        if (!this.mLabels.length) {
            return;
        }
        for (var _i = 0, _a = this.mLabels; _i < _a.length; _i++) {
            var label = _a[_i];
            UIHelper.SetVisible(label, false);
        }
        var gainConfig = GameGlobal.Config.GainItemConfig[id];
        if (gainConfig && gainConfig.gainWay && gainConfig.gainWay.length) {
            this.gainWayData = gainConfig.gainWay;
            for (var i = 0; i < gainConfig.gainWay.length; i++) {
                var data = gainConfig.gainWay[i];
                var label = this.mLabels[i];
                if (!label) {
                    break;
                }
                UIHelper.SetVisible(label, true);
                if (!data[2]) {
                    label.text = data[0];
                }
                else {
                    UIHelper.SetLinkStyleLabel(label, data[0]);
                }
            }
        }
        else {
            this.mLabels[0].text = "暂无";
            UIHelper.SetVisible(this.mLabels[0], true);
        }
    };
    return GainLabel;
}(eui.Component));
__reflect(GainLabel.prototype, "GainLabel");
//# sourceMappingURL=GainLabel.js.map