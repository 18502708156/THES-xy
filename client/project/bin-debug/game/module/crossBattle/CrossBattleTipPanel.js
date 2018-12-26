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
var CrossBattleTipPanel = (function (_super) {
    __extends(CrossBattleTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function CrossBattleTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "CrossBattleTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    CrossBattleTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        //let forgeType = param[0]
        var str = "";
        switch (param[0]) {
            case 1:
                str = "与人族阵营战斗时,减伤20%  激活条件：占领人族边城激活";
                break;
            case 2:
                str = "与仙族阵营战斗时,减伤20%  激活条件：占领仙族边城激活";
                break;
            case 3:
                str = "与魔族阵营战斗时,减伤20%  激活条件：占领魔族边城激活";
                break;
            case 4:
                str = "Tip:占领守城都阵营的边城  守城者每30秒掉血1%";
                break;
        }
        this.text.text = str;
    };
    CrossBattleTipPanel.prototype.OnClose = function () {
    };
    CrossBattleTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return CrossBattleTipPanel;
}(BaseEuiView));
__reflect(CrossBattleTipPanel.prototype, "CrossBattleTipPanel");
//# sourceMappingURL=CrossBattleTipPanel.js.map