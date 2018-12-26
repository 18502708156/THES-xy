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
var HavingMainPanel = (function (_super) {
    __extends(HavingMainPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function HavingMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "HavingMainSkin";
        return _this;
    }
    HavingMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(HavingUpLevelPanel, { skinName: "HavingUpLevelSkin", mContext: this }),
            TabView.CreateTabViewData(HavingMagicPanel, { skinName: "HavingMagicSkin", mContext: this }),
            TabView.CreateTabViewData(HavingHuanPanel),
            TabView.CreateTabViewData(HavingReikiPanel),
        ]);
    };
    HavingMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_19);
    };
    HavingMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var openIndex = args[0];
        var checkOpen = this.OnOpenIndex(openIndex);
        this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0);
        this.observe(GameGlobal.HavingModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.HavingModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.HavingHuanModel.GetItemRpUpdateMsg(), this.UpdateRedPoint2);
        this.observe(GameGlobal.HavingHuanModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint2);
        this.observe(GameGlobal.HavingLingqModel.GetItemRpUpdateMsg(), this.UpdateRedPoint3);
        this.observe(GameGlobal.HavingLingqModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint3);
        this.UpdateRedPoint();
        this.UpdateRedPoint2();
        this.UpdateRedPoint3();
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.updateJiJieBtnPng();
    };
    HavingMainPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.tiannv_flower]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.tiannv_nimbus]);
    };
    HavingMainPanel.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.CheckTalRedPoint(1);
    };
    HavingMainPanel.prototype.UpdateRedPoint2 = function () {
        this.mCommonWindowBg.CheckTalRedPoint(2);
    };
    HavingMainPanel.prototype.UpdateRedPoint3 = function () {
        this.mCommonWindowBg.CheckTalRedPoint(3);
    };
    HavingMainPanel.prototype.OnClose = function () {
        MainBottomPanel.CloseNav(this);
    };
    HavingMainPanel.prototype.OnOpenIndex = function (selectedIndex) {
        switch (selectedIndex) {
            case 1:
                return Deblocking.Check(DeblockingType.TYPE_20);
            case 2:
                return Deblocking.Check(DeblockingType.TYPE_21);
            case 3:
                return Deblocking.Check(DeblockingType.TYPE_22);
        }
        return true;
    };
    HavingMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return HavingMainPanel;
}(BaseEuiView));
__reflect(HavingMainPanel.prototype, "HavingMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=HavingMainPanel.js.map