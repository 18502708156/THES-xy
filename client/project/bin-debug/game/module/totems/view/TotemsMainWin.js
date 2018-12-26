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
var TotemsMainWin = (function (_super) {
    __extends(TotemsMainWin, _super);
    // private guildWarView: CrossGuildWarPanel;
    function TotemsMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    TotemsMainWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            //TabView.CreateTabViewData(CrossTeamPanel),
            TabView.CreateTabViewData(TotemsMainPanel),
        ]);
    };
    TotemsMainWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this, param[0] || 0);
        this.observe(MessageDef.TOTEMS_UPDATEACTIVATION, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.TOTEMS_INFO, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    TotemsMainWin.prototype.UpdateTabBtnRedPoint = function () {
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.TotemsModel.mRedPoint.showRedPoint());
    };
    TotemsMainWin.prototype.OnOpenIndex = function (openIndex) {
        // let openId = -1
        // if (openIndex == 1)
        // {
        // 	return Deblocking.Check(DeblockingType.TYPE_64)
        // }
        // else if (openIndex == 2)
        // {
        // 	return Deblocking.Check(DeblockingType.TYPE_114);
        // }
        return true;
    };
    TotemsMainWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var openID = GameGlobal.Config.TotemsBaseConfig.openlv;
        if (Deblocking.Check(openID, false)) {
            return true;
        }
        return false;
    };
    TotemsMainWin.NAME = "图腾";
    TotemsMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return TotemsMainWin;
}(BaseEuiView));
__reflect(TotemsMainWin.prototype, "TotemsMainWin");
//# sourceMappingURL=TotemsMainWin.js.map