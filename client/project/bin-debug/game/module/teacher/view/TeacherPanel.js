/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/31 11:01
 * @meaning: 师徒详情
 *
 **/
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
var TeacherPanel = (function (_super) {
    __extends(TeacherPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TeacherPanel() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.selectedIndex = 0;
        _this.skinName = "TeacherSkin";
        _this.group.tabChildren = [
            TabView.CreateTabViewData(TeacherFirstView),
            TabView.CreateTabViewData(TeacherSecondView),
            TabView.CreateTabViewData(TeacherThirdView),
        ];
        return _this;
    }
    TeacherPanel.prototype.childrenCreated = function () {
        this.tabBar.dataProvider = new eui.ArrayCollection(["我的师傅", "我的徒弟", "师徒邀请"]);
        this.tabBar.itemRenderer = BtnTab1Item;
    };
    TeacherPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.TEACHER_TURN, this.onTurn); //师徒跳转
        this.observe(MessageDef.TEACHER_CHANGE, this.UpdateContent); //
        this.group.selectedIndex = 0;
        this.AddClick(this.btnShop, this.onClick);
        this.AddClick(this.btnInfo, this.onClick);
        this.AddItemClick(this.tabBar, this.onTabTap);
        this.tabBar.selectedIndex = 0;
        this.selectedIndex = 0;
        GameGlobal.TeacherManage.getMessage();
    };
    TeacherPanel.prototype.OnClose = function () {
        this.group.CloseView();
    };
    TeacherPanel.prototype.onTurn = function (_index) {
        this.tabBar.selectedIndex = _index;
        this.onTabTap();
    };
    TeacherPanel.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.tabBar);
    };
    TeacherPanel.prototype.onTabTap = function () {
        this.group.selectedIndex = this.tabBar.selectedIndex;
        this.selectedIndex = this.tabBar.selectedIndex;
    };
    TeacherPanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnShop:
                ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_WEIWANG]);
                break;
            case this.btnInfo:
                ViewManager.ins().open(ActivityDescPanel, GlobalConfig.ins().MasterBaseConfig.helpinfo);
                break;
        }
    };
    TeacherPanel.NAME = "师徒";
    return TeacherPanel;
}(BaseView));
__reflect(TeacherPanel.prototype, "TeacherPanel", ["ICommonWindowTitle"]);
var BtnTab1Item = (function (_super) {
    __extends(BtnTab1Item, _super);
    function BtnTab1Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    BtnTab1Item.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.itemIndex == 2 && GameGlobal.TeacherController.teacherInfo.messageData) {
            var length_1 = GameGlobal.TeacherController.teacherInfo.messageData.length;
            this.redPoint.visible = length_1 > 0;
        }
    };
    return BtnTab1Item;
}(eui.ItemRenderer));
__reflect(BtnTab1Item.prototype, "BtnTab1Item");
//# sourceMappingURL=TeacherPanel.js.map