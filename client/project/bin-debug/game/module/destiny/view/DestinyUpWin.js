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
var DestinyUpWin = (function (_super) {
    __extends(DestinyUpWin, _super);
    function DestinyUpWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        _this.mCommonWindowBg.title = "命格";
        return _this;
    }
    DestinyUpWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(DestinyPanel),
            TabView.CreateTabViewData(DestinyNiPanel),
        ]);
    };
    DestinyUpWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this, param[0], param[1]);
        this.observe(MessageDef.DESTINY_RP, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    DestinyUpWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    DestinyUpWin.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.DestinyController.mRedPoint.IsRedPoint());
    };
    DestinyUpWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DestinyUpWin;
}(BaseEuiView));
__reflect(DestinyUpWin.prototype, "DestinyUpWin", ["ICommonWindow"]);
//# sourceMappingURL=DestinyUpWin.js.map