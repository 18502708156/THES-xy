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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/12 18:51
 * @meaning: 技能设置主界面
 *
 **/
var RoleSkilSetLayer = (function (_super) {
    __extends(RoleSkilSetLayer, _super);
    function RoleSkilSetLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tShopData = [];
        return _this;
    }
    // private m_ViewChildren
    RoleSkilSetLayer.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "RoleSkillSetSkin";
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(RoleSkilSetPanel),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
    };
    RoleSkilSetLayer.prototype.OnOpen = function () {
        // this.tShopData = param[0] || [];//商店列表
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.viewStack.UpdateTabShowState(this.viewStack.length, false);
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.tabBar.visible = false;
    };
    RoleSkilSetLayer.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    // destoryView() {
    // 	// 不销毁该界面
    // }
    RoleSkilSetLayer.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    RoleSkilSetLayer.prototype.OnOpenIndex = function (openIndex) {
        return true;
    };
    RoleSkilSetLayer.prototype.UpdateContent = function () { };
    RoleSkilSetLayer.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleSkilSetLayer;
}(BaseEuiView));
__reflect(RoleSkilSetLayer.prototype, "RoleSkilSetLayer", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=RoleSkilSetLayer.js.map