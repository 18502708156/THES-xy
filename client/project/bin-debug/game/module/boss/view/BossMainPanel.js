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
var BossMainPanel = (function (_super) {
    __extends(BossMainPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function BossMainPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "BossMainSkin";
        return _this;
    }
    BossMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(PersonBossPanel),
            TabView.CreateTabViewData(PublicBossPanel),
            TabView.CreateTabViewData(FieldBossPanel),
            TabView.CreateTabViewData(VipBossPanel),
        ]);
    };
    BossMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.commonWindowBg.OnAdded(this, nIndex);
        this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.PUBLIC_BOSS_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.FIELD_BOSS_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    BossMainPanel.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.UserFb.IsPersonBossNotice());
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.BossModel.IsPublicBossNotice());
        this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.BossModel.IsFieldBossNotice());
        this.commonWindowBg.ShowTalRedPoint(3, GameGlobal.BossModel.IsVIPBossNotice());
    };
    BossMainPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    BossMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_44);
    };
    BossMainPanel.prototype.OnOpenIndex = function (selectedIndex) {
        if (1 == selectedIndex) {
            return Deblocking.Check(DeblockingType.TYPE_45);
        }
        else if (2 == selectedIndex) {
            return Deblocking.Check(DeblockingType.TYPE_46);
        }
        return true;
    };
    BossMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return BossMainPanel;
}(BaseEuiView));
__reflect(BossMainPanel.prototype, "BossMainPanel");
//# sourceMappingURL=BossMainPanel.js.map