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
 * @Date: 2018/5/7 11:11
 * @meaning: 法宝图鉴主界面
 *
 **/
var TreasureShowWin = (function (_super) {
    __extends(TreasureShowWin, _super);
    function TreasureShowWin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tShopData = [];
        return _this;
    }
    TreasureShowWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "FubenSkin"; //重用了副本界面的ui
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.commonWindowBg.title = "法宝图鉴";
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(TreasureShowFirPanel),
            TabView.CreateTabViewData(TreasureShowSecPanel),
            TabView.CreateTabViewData(TreasureShowThrPanel),
        ];
        this.uiBg1.visible = true;
        this.uiBg2.visible = false;
    };
    TreasureShowWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.viewStack.UpdateTabShowState(this.viewStack.length, false);
        this.commonWindowBg.OnAdded(this, nIndex);
    };
    TreasureShowWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        MessageCenter.ins().removeAll(this);
    };
    TreasureShowWin.prototype.destoryView = function () {
        // 不销毁该界面
    };
    TreasureShowWin.prototype.OnBackClick = function (clickType) {
        return 0;
    };
    TreasureShowWin.prototype.OnOpenIndex = function (openIndex) {
        switch (openIndex) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
        return true;
    };
    TreasureShowWin.prototype.UpdateContent = function () { };
    TreasureShowWin.LAYER_LEVEL = LayerManager.UI_Main;
    return TreasureShowWin;
}(BaseEuiView));
__reflect(TreasureShowWin.prototype, "TreasureShowWin", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=TreasureShowWin.js.map