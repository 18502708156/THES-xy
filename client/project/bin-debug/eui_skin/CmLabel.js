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
var CmLabel = (function (_super) {
    __extends(CmLabel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CmLabel() {
        return _super.call(this) || this;
    }
    Object.defineProperty(CmLabel.prototype, "text", {
        set: function (value) {
            this.val = value;
            this.UpdateLabel();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CmLabel.prototype, "textColor", {
        set: function (color) {
            if (this.label) {
                this.label.textColor = color;
            }
        },
        enumerable: true,
        configurable: true
    });
    CmLabel.prototype.childrenCreated = function () {
        this.UpdateLabel();
    };
    CmLabel.prototype.UpdateLabel = function () {
        if (!this.$stage) {
            return;
        }
        this.label.text = this.val || "";
    };
    return CmLabel;
}(eui.Component));
__reflect(CmLabel.prototype, "CmLabel");
//# sourceMappingURL=CmLabel.js.map