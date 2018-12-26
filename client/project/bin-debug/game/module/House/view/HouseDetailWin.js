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
var HouseDetailWin = (function (_super) {
    __extends(HouseDetailWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HouseDetailWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "HouseDetailSkin";
        return _this;
    }
    HouseDetailWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "房屋";
        this.labMaxLv.visible = GameGlobal.YingYuanModel.IsMaxLevel();
        this.groupUnMax.visible = !this.labMaxLv.visible;
        var grade = GameGlobal.YingYuanModel.GetHouseGrade();
        var config = HouseConst.GetHouseShowConfig(grade);
        if (!config) {
            return;
        }
        this.imgIcon.source = config.image;
        this.labCurAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.YingYuanModel.GetCurAttr());
        this.labNextAttr.textFlow = AttributeData.GetAttrTabString(GameGlobal.YingYuanModel.GetNextAttr());
    };
    HouseDetailWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    HouseDetailWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return HouseDetailWin;
}(BaseEuiView));
__reflect(HouseDetailWin.prototype, "HouseDetailWin");
//# sourceMappingURL=HouseDetailWin.js.map