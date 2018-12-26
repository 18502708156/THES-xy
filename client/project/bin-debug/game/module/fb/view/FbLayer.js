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
 * @Date: 2018/4/17 11:51
 * @meaning: 副本主界面
 *
 **/
var FbLayer = (function (_super) {
    __extends(FbLayer, _super);
    function FbLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tShopData = [];
        return _this;
    }
    // 引导对象
    FbLayer.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[3] = this.commonWindowBg.tabBar.getChildAt(2),
            _a[2] = this.commonWindowBg.tabBar.getChildAt(1),
            _a;
        var _a;
    };
    // private m_ViewChildren
    FbLayer.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "FubenSkin";
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(CaiLiaoFbPanel),
            TabView.CreateTabViewData(FbCbtPanel),
            TabView.CreateTabViewData(LingLongTaPanel),
            TabView.CreateTabViewData(TianshilianPanel),
        ];
    };
    FbLayer.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.viewStack.UpdateTabShowState(this.viewStack.length, false);
        this.commonWindowBg.OnAdded(this, nIndex);
        this.uiBg1.visible = true;
        this.uiBg2.visible = false;
        this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.FB_CBT_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.FB_CBT_UPDATE_REWARD, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.FB_TIANTING_UPDATE, this.UpdateTabBtnRedPoint);
        this.mCommonWindowBg.ShowTalRedPoint(1, true); //藏宝图 红点常驻
        this.mCommonWindowBg.ShowTalRedPoint(2, true); //玲珑宝塔 红点常驻
        this.UpdateTabBtnRedPoint();
        var data = GameGlobal.UserTask.mainTaskData[0];
        if (data && data.state == TaskState.GET && data.id == 1034) {
            // 指引坐骑材料副本不需要跳转界面
            GameGlobal.GuideUtil.Finish(this, this.commonWindowBg.returnBtn);
        }
    };
    FbLayer.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    FbLayer.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.UserFb.mRedPoint.IsRedAct(FbModelRedPoint.CAILIAO_FB));
        this.mCommonWindowBg.ShowTalRedPoint(3, GameGlobal.UserFb.mRedPoint.IsRedAct(FbModelRedPoint.TIANTING_FB));
    };
    FbLayer.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    FbLayer.prototype.OnOpenIndex = function (openIndex) {
        switch (openIndex) {
            case 0:
                this.uiBg1.visible = true;
                this.uiBg2.visible = false;
                // this.commonWindowBg.SetTitle("材料副本");
                break;
            case 1:
                this.uiBg1.visible = false;
                this.uiBg2.visible = false;
                // this.commonWindowBg.SetTitle("藏宝图");
                break;
            case 2:
                this.uiBg1.visible = false;
                this.uiBg2.visible = false;
                // this.commonWindowBg.SetTitle("玲珑宝塔");
                break;
            case 3:
                this.uiBg1.visible = false;
                this.uiBg2.visible = false;
                // this.commonWindowBg.SetTitle("勇闯天庭");
                break;
        }
        return true;
    };
    FbLayer.prototype.UpdateContent = function () { };
    FbLayer.LAYER_LEVEL = LayerManager.UI_Main;
    return FbLayer;
}(BaseEuiView));
__reflect(FbLayer.prototype, "FbLayer", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=FbLayer.js.map