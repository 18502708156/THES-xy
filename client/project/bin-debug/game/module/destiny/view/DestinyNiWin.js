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
var DestinyNiWin = (function (_super) {
    __extends(DestinyNiWin, _super);
    function DestinyNiWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        _this.mCommonWindowBg.title = "逆命";
        return _this;
    }
    DestinyNiWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(DestinyNiPanel),
        ]);
    };
    DestinyNiWin.prototype.OnOpen = function () {
        this.mCommonWindowBg.OnAdded(this);
        this.UpdateContent();
    };
    DestinyNiWin.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    DestinyNiWin.prototype.UpdateContent = function () {
        if (GameGlobal.LingtongAttrModel.IsActive()) {
            this.mCommonWindowBg.GetCurViewStackElement().UpdateContent();
        }
    };
    DestinyNiWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        // return Deblocking.Check(DeblockingType.TYPE_116)
        return true;
    };
    DestinyNiWin.LAYER_LEVEL = LayerManager.UI_Main;
    return DestinyNiWin;
}(BaseEuiView));
__reflect(DestinyNiWin.prototype, "DestinyNiWin", ["ICommonWindow"]);
//# sourceMappingURL=DestinyNiWin.js.map