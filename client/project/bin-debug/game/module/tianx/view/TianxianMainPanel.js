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
var TianxianMainPanel = (function (_super) {
    __extends(TianxianMainPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TianxianMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "TianxianMainSkin";
        return _this;
    }
    TianxianMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(TianxPanel),
            TabView.CreateTabViewData(SwordPanel),
        ]);
    };
    TianxianMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this, param[0] || 0);
        this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex0);
        this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex0);
        this.UpdateRedPointIndex0();
        this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex1);
        this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex1);
        this.UpdateRedPointIndex1();
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.updateJiJieBtnPng();
    };
    TianxianMainPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(0), [ActivityKaiFuJiJieType.fairy]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(1), [ActivityKaiFuJiJieType.weapon]);
    };
    TianxianMainPanel.prototype.UpdateRedPointIndex0 = function () {
        this.commonWindowBg.CheckTalRedPoint(0);
    };
    TianxianMainPanel.prototype.UpdateRedPointIndex1 = function () {
        this.commonWindowBg.CheckTalRedPoint(1);
    };
    TianxianMainPanel.prototype.OnClose = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.CHANGE_EQUIP);
    };
    TianxianMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_27);
    };
    TianxianMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return TianxianMainPanel;
}(BaseEuiView));
__reflect(TianxianMainPanel.prototype, "TianxianMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=TianxianMainPanel.js.map