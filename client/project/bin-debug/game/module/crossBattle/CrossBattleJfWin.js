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
var CrossBattleJfWin = (function (_super) {
    __extends(CrossBattleJfWin, _super);
    function CrossBattleJfWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    CrossBattleJfWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(CrossBattleJfView),
            TabView.CreateTabViewData(CrossBattleMJfView)
        ]);
    };
    CrossBattleJfWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this);
    };
    CrossBattleJfWin.prototype.OnClose = function () {
    };
    CrossBattleJfWin.prototype._OnClick = function (e) {
    };
    CrossBattleJfWin.LAYER_LEVEL = LayerManager.UI_Main;
    return CrossBattleJfWin;
}(BaseEuiView));
__reflect(CrossBattleJfWin.prototype, "CrossBattleJfWin");
//# sourceMappingURL=CrossBattleJfWin.js.map