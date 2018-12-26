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
var PlotSimplePanel = (function (_super) {
    __extends(PlotSimplePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PlotSimplePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PlotSimpleSkin";
        _this.width = 0;
        _this.height = 0;
        _this.posGroup.x = 0;
        _this.posGroup.y = -140;
        _this.anim.play();
        return _this;
    }
    PlotSimplePanel.prototype.SetMsg = function (str) {
        this.label.text = str;
        this.leftImg.width = this.rightImg.width = (this.label.width >> 1) + 30;
    };
    return PlotSimplePanel;
}(eui.Component));
__reflect(PlotSimplePanel.prototype, "PlotSimplePanel");
//# sourceMappingURL=PlotSimplePanel.js.map