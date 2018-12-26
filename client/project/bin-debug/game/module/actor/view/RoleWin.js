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
var RoleWin = (function (_super) {
    __extends(RoleWin, _super);
    function RoleWin() {
        return _super.call(this) || this;
    }
    RoleWin.prototype.GetRoleInfoPanel = function () {
        return this.commonWindowBg.GetViewStackElementByIndex(0);
    };
    RoleWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "RoleWinSkin";
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(RoleInfoPanel, { skinName: "RoleInfoSkin" }),
            TabView.CreateTabViewData(RoleSkillPanel, { skinName: "RoleSkillSkin" }),
            TabView.CreateTabViewData(RoleRidePanel),
            TabView.CreateTabViewData(RoleWingPanel),
        ]);
    };
    ;
    RoleWin.prototype.destoryView = function () {
        // 不销毁该界面
    };
    ;
    RoleWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var openIndex = args[0];
        var checkOpen = this.OnOpenIndex(openIndex);
        this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : 0);
        this.observe(MessageDef.ROLE_HINT, this.UpdateRedPoint);
        this.observe(MessageDef.RP_ROLE_HINT, this.UpdateRedPoint);
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateRedPoint);
        this.observe(GameGlobal.TianxModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.TianxModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.SwordModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.SwordModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(MessageDef.RP_TREASURE, this.UpdateRedPoint);
        this.observe(MessageDef.DEITYEQUIP_ALL_NOTICE, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.observe(MessageDef.RP_SKILL_UPGRADE, this.UpdateSkillRedPoint);
        this.UpdateSkillRedPoint();
        this.observe(GameGlobal.UserRide.GetItemRpUpdateMsg(), this.UpdateRideRedPoint);
        this.observe(GameGlobal.UserRide.GetItemEquipRpUpdateMsg(), this.UpdateRideRedPoint);
        this.UpdateRideRedPoint();
        this.observe(GameGlobal.UserWing.GetItemRpUpdateMsg(), this.UpdateWingRedPoint);
        this.observe(GameGlobal.UserWing.GetItemEquipRpUpdateMsg(), this.UpdateWingRedPoint);
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.UpdateWingRedPoint();
        this.updateJiJieBtnPng();
        // this.updateFateEff();
    };
    RoleWin.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(0), [ActivityKaiFuJiJieType.fairy, ActivityKaiFuJiJieType.weapon]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.ride]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.wing]);
    };
    RoleWin.prototype.updateFateEff = function () {
        FateEff.isShowEff3(this);
    };
    RoleWin.prototype.OnClose = function () {
        MainBottomPanel.CloseNav(this);
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    RoleWin.prototype.OnOpenIndex = function (selectedIndex) {
        switch (selectedIndex) {
            case 1:
                return Deblocking.Check(DeblockingType.TYPE_8);
            case 2:
                // UIHelper.SetBtnEffe(this.commonWindowBg.tabBar.getChildAt(2) as eui.Button,"ui_fhy002",false);
                return Deblocking.Check(DeblockingType.TYPE_9);
            case 3:
                // UIHelper.SetBtnEffe(this.commonWindowBg.tabBar.getChildAt(3) as eui.Button,"ui_fhy002",false);
                return Deblocking.Check(DeblockingType.TYPE_10);
        }
        return true;
    };
    RoleWin.prototype.UpdateRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(0);
    };
    RoleWin.prototype.UpdateSkillRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(1);
    };
    RoleWin.prototype.UpdateRideRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(2);
    };
    RoleWin.prototype.UpdateWingRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(3);
    };
    RoleWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    RoleWin.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleWin;
}(BaseEuiView));
__reflect(RoleWin.prototype, "RoleWin", ["ICommonWindow"]);
//# sourceMappingURL=RoleWin.js.map