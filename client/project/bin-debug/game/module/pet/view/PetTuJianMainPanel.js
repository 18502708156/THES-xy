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
var PetTuJianMainPanel = (function (_super) {
    __extends(PetTuJianMainPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function PetTuJianMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetTuJianMainSkin";
        return _this;
    }
    PetTuJianMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(PetTuJianPanel, { skinName: "PetTuJianSkin", mContext: this }),
            TabView.CreateTabViewData(PetGodQualityPanel, { skinName: "PetGodQualitySkin", mContext: this }),
        ]);
    };
    PetTuJianMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var openIndex = args[0];
        var checkOpen = this.OnOpenIndex(openIndex);
        this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0);
    };
    PetTuJianMainPanel.prototype.OnClose = function () {
    };
    PetTuJianMainPanel.prototype.OnOpenIndex = function (selectedIndex) {
        return true;
    };
    PetTuJianMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return PetTuJianMainPanel;
}(BaseEuiView));
__reflect(PetTuJianMainPanel.prototype, "PetTuJianMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=PetTuJianMainPanel.js.map