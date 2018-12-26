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
var UpLvWayMainWin = (function (_super) {
    __extends(UpLvWayMainWin, _super);
    // private guildWarView: CrossGuildWarPanel;
    function UpLvWayMainWin() {
        var _this = _super.call(this) || this;
        _this.skinName = UIHelper.PANEL;
        return _this;
    }
    UpLvWayMainWin.prototype.childrenCreated = function () {
        this.mCommonWindowBg.SetTabView([
            //TabView.CreateTabViewData(CrossTeamPanel),
            TabView.CreateTabViewData(X1Panel, { Type: 1 }),
            TabView.CreateTabViewData(X2Panel, { Type: 2 }),
            TabView.CreateTabViewData(X3Panel, { Type: 3 }),
        ]);
    };
    UpLvWayMainWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this, param[0] || 0);
        this.observe(MessageDef.UPLVWAY_CHANGE_SCORE, this.UpdateTabBtnRedPoint);
        this.observe(MessageDef.UPLVWAY_ACQUIRE_ITEM, this.UpdateTabBtnRedPoint);
        this.UpdateTabBtnRedPoint();
    };
    UpLvWayMainWin.prototype.UpdateTabBtnRedPoint = function () {
        //this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.ShowTalRedPoint(0, GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
        this.mCommonWindowBg.ShowTalRedPoint(1, GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
        this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.UpLvWayModel.mRedPoint.showRedPoint());
    };
    UpLvWayMainWin.prototype.OnOpenIndex = function (openIndex) {
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
    UpLvWayMainWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        // if (param[0] == 2) {
        // 	return Deblocking.Check(DeblockingType.TYPE_114);	
        // }
        return true; // Deblocking.Check(DeblockingType.TYPE_63);
    };
    UpLvWayMainWin.NAME = "我要变强";
    UpLvWayMainWin.LAYER_LEVEL = LayerManager.UI_Main;
    return UpLvWayMainWin;
}(BaseEuiView));
__reflect(UpLvWayMainWin.prototype, "UpLvWayMainWin");
//# sourceMappingURL=UpLvWayMainWin.js.map