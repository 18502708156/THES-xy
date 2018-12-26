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
var HouseBuildTipWin = (function (_super) {
    __extends(HouseBuildTipWin, _super);
    function HouseBuildTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "HouseBuildTipSkin";
        return _this;
    }
    HouseBuildTipWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "房屋装修";
        this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.CloseSelf);
        this._AddClick(this.btnConfirm, this._OnClick);
        this._AddClick(this.btnCancel, this.CloseSelf);
        this.mGrade = param[0];
        var config = HouseConst.GetHouseShowConfig(this.mGrade);
        this.consumeLabel.Set([GameGlobal.YingYuanModel.GetBuildCost(config.house)]);
        var _a = GameGlobal.YingYuanModel.GetHouseLv(), houseLv = _a[0], houseUpnum = _a[1];
        var power = HouseConst.GetPower(config.house, houseLv, houseUpnum) - GameGlobal.YingYuanModel.GetPower();
        this.labPower.text = power.toString();
        var itemInfo1 = config.id[0];
        this.item1.visible = itemInfo1 != null;
        if (itemInfo1) {
            this.item1.setItemAward(itemInfo1.type, itemInfo1.id, itemInfo1.count);
        }
        var itemInfo2 = config.id[1];
        this.item2.visible = itemInfo2 != null;
        if (itemInfo2) {
            this.item2.setItemAward(itemInfo2.type, itemInfo2.id, itemInfo2.count);
        }
    };
    HouseBuildTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    HouseBuildTipWin.prototype._OnClick = function () {
        var _this = this;
        var cost = GameGlobal.YingYuanModel.GetBuildCost(this.mGrade);
        Checker.Money(cost.id, cost.count, true, null, function () {
            GameGlobal.YingYuanModel.SendHouseBuild(_this.mGrade);
        });
        this.CloseSelf();
    };
    HouseBuildTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return HouseBuildTipWin;
}(BaseEuiView));
__reflect(HouseBuildTipWin.prototype, "HouseBuildTipWin");
//# sourceMappingURL=HouseBuildTipWin.js.map