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
var PowerLabel = (function (_super) {
    __extends(PowerLabel, _super);
    function PowerLabel() {
        return _super.call(this) || this;
    }
    Object.defineProperty(PowerLabel.prototype, "text", {
        set: function (value) {
            this.m_Value = value;
            this._SetText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerLabel.prototype, "hideBg", {
        set: function (value) {
            this.m_HideBg = true;
        },
        enumerable: true,
        configurable: true
    });
    PowerLabel.prototype._SetText = function () {
        if (this.m_Value != null && this.$stage) {
            // this.label.text = `战斗力  ${this.m_Value}`
            // if (this.bg) {
            // 	this.label.text = `战 ${this.m_Value}`
            // } else {
            // 	this.label.text = `战 ${this.m_Value}`
            // }
            this.label.text = " " + this.m_Value;
        }
    };
    PowerLabel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    PowerLabel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._SetText();
        if (this.m_HideBg) {
            this.bg.visible = false;
        }
        if (this.checkAttr) {
            this.checkAttr.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        }
    };
    PowerLabel.prototype._OnClick = function () {
        this.dispatchEventWith(egret.TouchEvent.TOUCH_TAP);
    };
    PowerLabel.prototype.SetCheckAttrVisible = function (visible) {
        if (this.checkAttr) {
            this.checkAttr.visible = visible;
        }
    };
    return PowerLabel;
}(eui.Component));
__reflect(PowerLabel.prototype, "PowerLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=PowerLabel.js.map