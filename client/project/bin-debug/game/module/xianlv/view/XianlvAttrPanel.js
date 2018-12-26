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
var XianlvAttrPanel = (function (_super) {
    __extends(XianlvAttrPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XianlvAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvAttrSkin";
        return _this;
    }
    XianlvAttrPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var xianlvId = param[0];
        var info = GameGlobal.XianlvModel.GetXianlvInfo(xianlvId);
        this.powerLabel.text = info.GetPower();
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(info.GetAttrs());
        XianlvBaseInfoPanel.SetStarGroup(this.starGroup, info.mStar);
        this.commonDialog.OnAdded(this);
        this.lbLev.text = info.mLevel + "\n阶";
        this.showPanel.SetBody(XianlvConst.GetSkin(xianlvId));
    };
    XianlvAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    XianlvAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianlvAttrPanel;
}(BaseEuiView));
__reflect(XianlvAttrPanel.prototype, "XianlvAttrPanel");
//# sourceMappingURL=XianlvAttrPanel.js.map