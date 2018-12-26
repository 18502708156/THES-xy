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
var KaiFuActivityWin = (function (_super) {
    __extends(KaiFuActivityWin, _super);
    function KaiFuActivityWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL_NO_TAB;
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    KaiFuActivityWin.Show = function (val, isId) {
        if (val === void 0) { val = null; }
        if (isId === void 0) { isId = true; }
        var data = null;
        if (val) {
            data = {
                val: val,
                isId: isId,
            };
        }
        ViewManager.ins().open(KaiFuActivityWin, data);
    };
    KaiFuActivityWin.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(KaiFuActivityPanel),
        ]);
    };
    // private changeTitle(e): void
    // {
    // 	this.commonWindowBg.SetTitle(e[0])
    // }
    KaiFuActivityWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this, 0, param[0]);
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_DABIAO_UPDATE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_IS_GET_AWARDS, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.ACTIVITY_RACE_HISTORY, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    KaiFuActivityWin.prototype.UpdateTabBtnRedPoint = function () {
        this.commonWindowBg.ShowTalRedPoint(0, GameGlobal.ActivityKaiFuModel.RedPointAdvanced() || GameGlobal.ActivityKaiFuModel.RedPointTarget());
        // this.commonWindowBg.ShowTalRedPoint(1, GameGlobal.ActivityKaiFuModel.RedPointTarget())
        // this.commonWindowBg.ShowTalRedPoint(2, GameGlobal.ActivityKaiFuModel.RedPointQiTian())
    };
    KaiFuActivityWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    KaiFuActivityWin.LAYER_LEVEL = LayerManager.UI_Main;
    return KaiFuActivityWin;
}(BaseEuiView));
__reflect(KaiFuActivityWin.prototype, "KaiFuActivityWin");
//# sourceMappingURL=KaiFuActivityWin.js.map