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
var HouseBuildWin = (function (_super) {
    __extends(HouseBuildWin, _super);
    function HouseBuildWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "HouseBuildSkin";
        _this.commonWindowBg.SetTitle("房屋装修");
        _this._AddClick(_this.btnPrev, _this._OnClick);
        _this._AddClick(_this.btnNext, _this._OnClick);
        _this._AddClick(_this.btnBuild, _this._OnClick);
        return _this;
    }
    HouseBuildWin.prototype.childrenCreated = function () {
        this.labMaxGrade.visible = false;
    };
    HouseBuildWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.HOUSE_UPDATE_SINGLE, this.DoSingle);
        this.UpdateContent();
    };
    HouseBuildWin.prototype.SetChooseItemInfo = function () {
        var config = this.mBuildList[this.mCurChoose - 1];
        this.imgIcon.source = config.image;
        this.cmLabName.text = config.name;
        this.labName.text = config.name;
        this.consumeLabel.Set([GameGlobal.YingYuanModel.GetBuildCost(config.house)]);
        var grade = GameGlobal.YingYuanModel.GetHouseGrade();
        this.btnPrev.visible = this.mCurChoose > 1;
        this.btnNext.visible = this.mCurChoose < this.mBuildList.length;
        this.btnBuild.visible = config.house > grade;
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
    HouseBuildWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    HouseBuildWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnNext:
                this.mCurChoose = Math.min(this.mCurChoose + 1, this.mBuildList.length);
                this.SetChooseItemInfo();
                break;
            case this.btnPrev:
                this.mCurChoose = Math.max(this.mCurChoose - 1, 1);
                this.SetChooseItemInfo();
                break;
            case this.btnBuild:
                var config = this.mBuildList[this.mCurChoose - 1];
                ViewManager.ins().open(HouseBuildTipWin, config.house);
                break;
        }
    };
    HouseBuildWin.prototype.UpdateContent = function () {
        if (!GameGlobal.YingYuanModel.iSMarry()) {
            return;
        }
        this.mCurChoose = 1;
        var grade = GameGlobal.YingYuanModel.GetHouseGrade();
        this.mBuildList = HouseConst.GetBuildList(grade);
        if (this.mBuildList.length == 0) {
            this.groupBuild.visible = false;
            this.labMaxGrade.visible = true;
            return;
        }
        this.SetChooseItemInfo();
    };
    HouseBuildWin.prototype.DoSingle = function () {
        UserTips.ins().showTips("您的伴侣已经离开了你");
        this.CloseSelf();
    };
    HouseBuildWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return HouseBuildWin;
}(BaseEuiView));
__reflect(HouseBuildWin.prototype, "HouseBuildWin", ["ICommonWindow"]);
//# sourceMappingURL=HouseBuildWin.js.map