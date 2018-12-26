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
var HavingSkillTipPanel = (function (_super) {
    __extends(HavingSkillTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HavingSkillTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingSkillTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    HavingSkillTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        /**1 玄女， 2 天神 */
        var type = param[0];
        var str = '';
        if (1 == type) {
            str = '被动技能是由玄女法器洗出技能后获得';
        }
        else if (2 == type) {
            str = '被动技能是由天神突破天赋技能后获得';
        }
        this.descTxt.text = str;
    };
    HavingSkillTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return HavingSkillTipPanel;
}(BaseEuiView));
__reflect(HavingSkillTipPanel.prototype, "HavingSkillTipPanel");
//# sourceMappingURL=HavingSkillTipPanel.js.map