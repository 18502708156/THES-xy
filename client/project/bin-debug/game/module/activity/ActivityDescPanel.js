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
var ActivityDescPanel = (function (_super) {
    __extends(ActivityDescPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ActivityDescPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "ActivityTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    ActivityDescPanel.Show = function (desc, title) {
        var view = ViewManager.ins().open(ActivityDescPanel);
        view.SetDesc(desc, title);
    };
    ActivityDescPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var config = GameGlobal.Config.HelpInfoConfig[args[0]];
        if (config) {
            this.SetDesc(config.text, args[1] || config.title);
        }
    };
    ActivityDescPanel.prototype.SetDesc = function (text, title) {
        this.tdesc.multiline = this.tdesc.wordWrap = true;
        this.tdesc.textFlow = TextFlowMaker.generateTextFlow(text);
        if (title) {
            this.title.text = title;
        }
    };
    ActivityDescPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ActivityDescPanel;
}(BaseEuiView));
__reflect(ActivityDescPanel.prototype, "ActivityDescPanel");
//# sourceMappingURL=ActivityDescPanel.js.map