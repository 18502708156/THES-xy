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
var YingYuanWin = (function (_super) {
    __extends(YingYuanWin, _super);
    function YingYuanWin() {
        return _super.call(this) || this;
    }
    YingYuanWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "YingyueWinSkin";
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(YingYuanInfoPanel, { skinName: "YingyueInfoSkin" }),
            // TabView.CreateTabViewData(YingYuanEnAiInfoPanel, {skinName: "YingyueEnAiSkin"}),
            TabView.CreateTabViewData(HouseUpgradePanel, { skinName: "HouseUpgradeSkin" }),
            // TabView.CreateTabViewData({NAME: "灵童"}),
            TabView.CreateTabViewData(TeacherPanel)
        ]);
    };
    ;
    YingYuanWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var openIndex = args[0];
        var checkOpen = this.OnOpenIndex(openIndex);
        this.commonWindowBg.OnAdded(this, checkOpen ? openIndex : Deblocking.Check(DeblockingType.TYPE_39) ? 0 : 2);
        //this.commonWindowBg["helpBtn"].visible = true
        //this.commonWindowBg.setHelp(18,"规则说明")
        this.observe(MessageDef.HOUSE_UPDATE_INFO, this.UpdateTabBtnRedPoint);
        this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateTeacherRedPoint);
        this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateTeacherRedPoint);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateTeacherRedPoint);
        this.UpdateTeacherRedPoint();
        this.UpdateTabBtnRedPoint();
    };
    YingYuanWin.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.YingYuanModel.CanUpgrade());
    };
    YingYuanWin.prototype.UpdateTeacherRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.TeacherController.teacherInfo.messageData.length > 0);
    };
    YingYuanWin.prototype.OnClose = function () {
        this.removeObserve();
        this.commonWindowBg.OnRemoved();
    };
    ;
    YingYuanWin.prototype.checkIsOpen = function (e) {
    };
    ;
    YingYuanWin.prototype.OnOpenIndex = function (selectedIndex) {
        if (selectedIndex == 3) {
            ViewManager.ins().open(LingtongMainPanel);
            return false;
        }
        if (selectedIndex == 2) {
            return Deblocking.Check(DeblockingType.TYPE_41, false);
        }
        if (selectedIndex == 1) {
            if (GameGlobal.YingYuanModel.iSMarry()) {
                return true;
            }
            UserTips.ins().showTips("结婚后开启功能");
            return false;
        }
        if (selectedIndex == 0) {
            return Deblocking.Check(DeblockingType.TYPE_39, false);
        }
        return true;
    };
    YingYuanWin.prototype.updateRedPoint = function () {
    };
    ;
    YingYuanWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    YingYuanWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_39);
    };
    YingYuanWin.LAYER_LEVEL = LayerManager.UI_Main;
    return YingYuanWin;
}(BaseEuiView));
__reflect(YingYuanWin.prototype, "YingYuanWin", ["ICommonWindow"]);
//# sourceMappingURL=YingYuanWin.js.map