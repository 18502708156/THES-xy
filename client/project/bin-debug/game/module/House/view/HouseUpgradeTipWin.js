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
var HouseUpgradeTipWin = (function (_super) {
    __extends(HouseUpgradeTipWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HouseUpgradeTipWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "HouseUpgradeTipSkin";
        _this._AddClick(_this.btnGain, _this._OnClick);
        return _this;
    }
    HouseUpgradeTipWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = HouseUpgradeItem;
    };
    HouseUpgradeTipWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "升阶进度领取";
        this.observe(MessageDef.HOUSE_SHARED_NOTICE, this.DoNotice);
        var shareBuildUpInfo = GameGlobal.YingYuanModel.shareUpInfo;
        var list = shareBuildUpInfo.times;
        this.list.dataProvider = new eui.ArrayCollection(list);
        this.labCount.text = "" + GameGlobal.YingYuanModel.GetHouseUpnum() * shareBuildUpInfo.upnum;
    };
    HouseUpgradeTipWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    HouseUpgradeTipWin.prototype.DoNotice = function () {
        if (!GameGlobal.YingYuanModel.iSMarry()) {
            UserTips.ins().showTips("您的伴侣已经离开了你");
            this.CloseSelf();
        }
    };
    HouseUpgradeTipWin.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnGain:
                GameGlobal.YingYuanModel.SendAddHouseShareExp();
                this.CloseSelf();
                break;
        }
    };
    HouseUpgradeTipWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return HouseUpgradeTipWin;
}(BaseEuiView));
__reflect(HouseUpgradeTipWin.prototype, "HouseUpgradeTipWin", ["ICommonWindow"]);
var HouseUpgradeItem = (function (_super) {
    __extends(HouseUpgradeItem, _super);
    function HouseUpgradeItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    HouseUpgradeItem.prototype.dataChanged = function () {
        var time = this.data;
        this.imgBg.visible = this.itemIndex % 2 == 0;
        this.labTime.text = GameServer.PanTaoHui(time);
        var count = GameGlobal.YingYuanModel.GetHouseUpnum();
        var text = "\u60A8\u7684\u4F34\u4FA3\u5347\u9636\u623F\u5C4B\uFF0C\u60A8\u53EF\u9886\u53D6\u5171\u4EAB\u8FDB\u9636\u8FDB\u5EA6|C:0x019704&T:" + count + "\u70B9|";
        this.labText.textFlow = TextFlowMaker.generateTextFlow(text);
    };
    return HouseUpgradeItem;
}(eui.ItemRenderer));
__reflect(HouseUpgradeItem.prototype, "HouseUpgradeItem");
//# sourceMappingURL=HouseUpgradeTipWin.js.map