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
var DestinyArrDescPanel = (function (_super) {
    __extends(DestinyArrDescPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function DestinyArrDescPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "DestinyArrTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    DestinyArrDescPanel.Show = function (textL, textR, title) {
        var view = ViewManager.ins().open(DestinyArrDescPanel);
        view.SetDesc(textL, textR, title);
    };
    DestinyArrDescPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.SetDesc(args[0] || "", args[1] || "", args[2] || "属性加成");
    };
    DestinyArrDescPanel.prototype.SetDesc = function (textL, textR, title) {
        this.tdescL.multiline = this.tdescL.wordWrap = true;
        this.tdescR.multiline = this.tdescR.wordWrap = true;
        this.tdescL.textFlow = TextFlowMaker.generateTextFlow(textL);
        this.tdescR.textFlow = TextFlowMaker.generateTextFlow(textR);
        if (title) {
            this.title.text = title;
        }
    };
    DestinyArrDescPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return DestinyArrDescPanel;
}(BaseEuiView));
__reflect(DestinyArrDescPanel.prototype, "DestinyArrDescPanel");
//# sourceMappingURL=DestinyArrDescPanel.js.map