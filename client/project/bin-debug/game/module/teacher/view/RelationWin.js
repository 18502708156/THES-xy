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
var RelationWin = (function (_super) {
    __extends(RelationWin, _super);
    function RelationWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    RelationWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            TabView.CreateTabViewData(TeacherPanel),
        ]);
    };
    RelationWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.mCommonWindowBg.OnAdded(this, nIndex);
    };
    RelationWin.LAYER_LEVEL = LayerManager.UI_Main;
    return RelationWin;
}(BaseEuiView));
__reflect(RelationWin.prototype, "RelationWin");
//# sourceMappingURL=RelationWin.js.map