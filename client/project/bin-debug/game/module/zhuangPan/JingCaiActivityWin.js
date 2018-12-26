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
var JingCaiActivityWin = (function (_super) {
    __extends(JingCaiActivityWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function JingCaiActivityWin() {
        var _this = _super.call(this) || this;
        //this.skinName = "FuliMainSkin"
        _this.skinName = UIHelper.PANEL_NO_TAB;
        return _this;
    }
    JingCaiActivityWin.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(ZhuangPanActivityPanel),
        ]);
    };
    JingCaiActivityWin.prototype.changeTitle = function (e) {
        this.commonWindowBg.SetTitle(e[0]);
    };
    JingCaiActivityWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.commonWindowBg.OnAdded(this, nIndex);
        var openActid = param[1]; //默认第二个参数是要打开的子窗口的子窗口 
        if (openActid) {
            this.commonWindowBg.GetCurViewStackElement().OnOpen(null, openActid);
        }
    };
    JingCaiActivityWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    JingCaiActivityWin.LAYER_LEVEL = LayerManager.UI_Main;
    return JingCaiActivityWin;
}(BaseEuiView));
__reflect(JingCaiActivityWin.prototype, "JingCaiActivityWin");
//# sourceMappingURL=JingCaiActivityWin.js.map