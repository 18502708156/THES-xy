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
var CrossGuildTipPanel = (function (_super) {
    __extends(CrossGuildTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CrossGuildTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingSkillTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    CrossGuildTipPanel.prototype.childrenCreated = function () {
        var str = '被动技能是由玄女法宝洗出技能后获得';
        this.descTxt.text = str;
    };
    CrossGuildTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return CrossGuildTipPanel;
}(BaseEuiView));
__reflect(CrossGuildTipPanel.prototype, "CrossGuildTipPanel");
//# sourceMappingURL=CrossGuildTipPanel.js.map