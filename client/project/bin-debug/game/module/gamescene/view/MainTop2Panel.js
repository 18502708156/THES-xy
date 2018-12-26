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
var MainTop2Panel = (function (_super) {
    __extends(MainTop2Panel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function MainTop2Panel() {
        var _this = _super.call(this) || this;
        _this.skinName = "MainTop2PanelSkin";
        return _this;
    }
    MainTop2Panel.prototype.destoryView = function () { };
    MainTop2Panel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.OnOpen.call(this, param);
        this.playerInfo.OnOpen();
    };
    MainTop2Panel.prototype.OnClose = function () {
        this.playerInfo.OnClose();
    };
    MainTop2Panel.LAYER_LEVEL = LayerManager.UI_USER_INFO;
    return MainTop2Panel;
}(BaseEuiView));
__reflect(MainTop2Panel.prototype, "MainTop2Panel");
//# sourceMappingURL=MainTop2Panel.js.map