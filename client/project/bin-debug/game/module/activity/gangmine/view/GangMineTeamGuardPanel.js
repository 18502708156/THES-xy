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
var GangMineTeamGuardPanel = (function (_super) {
    __extends(GangMineTeamGuardPanel, _super);
    function GangMineTeamGuardPanel() {
        return _super.call(this) || this;
    }
    GangMineTeamGuardPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMineTeamGuardPanelSkin";
        this.CommonDialog.title = '提示';
    };
    ;
    GangMineTeamGuardPanel.prototype.initData = function () {
        this.list.itemRenderer = GangMineTeamRoleItem;
        this.list.dataProvider = null;
    };
    GangMineTeamGuardPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.CommonDialog.OnAdded(this);
        this.AddClick(this.cancelBtn, this.onClickHandler);
        this.AddClick(this.sureBtn, this.onClickHandler);
        this.AddClick(this.exitBtn, this.onClickHandler);
        this.mineId = args[0];
        this.observe(MessageDef.GANGMINE_UPDATE_INFO, this.updateContent);
        this.updateContent();
    };
    GangMineTeamGuardPanel.prototype.updateContent = function () {
        if (this.mineId == GameGlobal.GangMineModel.myInfo.mineId) {
            this.currentState = 'myState';
        }
        else {
            this.currentState = 'normal';
        }
        var guardList = GameGlobal.GangMineModel.mineInfos[this.mineId].guardList;
        var tempList = [];
        for (var i = 0; i < guardList.length; i++) {
            tempList[i] = { guardInfo: guardList[i], mInfo: null, mIndex: 0 };
        }
        this.list.dataProvider = new eui.ArrayCollection(tempList);
    };
    GangMineTeamGuardPanel.prototype.onClickHandler = function (e) {
        this.CloseSelf();
        if (e.target == this.sureBtn) {
            GameGlobal.GangMineModel.sendGangMineForce(this.mineId);
        }
        else if (e.target == this.exitBtn) {
            GameGlobal.GangMineModel.sendGangMineLeave();
        }
    };
    GangMineTeamGuardPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.removeEvents();
        this.CommonDialog.OnRemoved();
    };
    ;
    GangMineTeamGuardPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangMineTeamGuardPanel;
}(BaseEuiView));
__reflect(GangMineTeamGuardPanel.prototype, "GangMineTeamGuardPanel");
//# sourceMappingURL=GangMineTeamGuardPanel.js.map