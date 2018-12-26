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
var XianlvAllAttrPanel = (function (_super) {
    __extends(XianlvAllAttrPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XianlvAllAttrPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvAllAttrSkin";
        return _this;
    }
    XianlvAllAttrPanel.prototype.OnOpen = function () {
        var model = GameGlobal.XianlvModel;
        this.powerLabel.text = model.GetAllPower();
        this.levelAttr.textFlow = AttributeData.GetAttrTabString(model.GetAllAttrs());
        this.zizhiAttr.textFlow = AttributeData.GetAttrTabString(model.GetAllQyAttr());
        this.commonDialog.OnAdded(this);
        var showId = 0;
        for (var _i = 0, _a = model.mBattleList; _i < _a.length; _i++) {
            var id = _a[_i];
            if (id) {
                showId = id;
                break;
            }
        }
        for (var id in model.mXianlvList) {
            if (model.HasXianlv(parseInt(id))) {
                showId = parseInt(id);
                break;
            }
        }
        if (showId) {
            this.showPanel.SetBody(XianlvConst.GetSkin(showId));
        }
    };
    XianlvAllAttrPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    XianlvAllAttrPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianlvAllAttrPanel;
}(BaseEuiView));
__reflect(XianlvAllAttrPanel.prototype, "XianlvAllAttrPanel");
//# sourceMappingURL=XianlvAllAttrPanel.js.map