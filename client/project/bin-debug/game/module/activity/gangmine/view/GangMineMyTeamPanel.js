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
var GangMineMyTeamPanel = (function (_super) {
    __extends(GangMineMyTeamPanel, _super);
    function GangMineMyTeamPanel() {
        var _this = _super.call(this) || this;
        _this.model = GameGlobal.GangMineTeamModel;
        return _this;
    }
    GangMineMyTeamPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMineMyTeamPanelSkin";
        this.CommonDialog.title = '组队成员';
    };
    ;
    GangMineMyTeamPanel.prototype.initData = function () {
        this.list.itemRenderer = GangMineTeamRoleItem;
        this.list.dataProvider = null;
        this.tpower.restrict = '0-9';
        this.tpower.maxChars = 9;
    };
    GangMineMyTeamPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.CommonDialog.OnAdded(this);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateTeamInfo);
        this.AddClick(this.setUpBtn, this.onClickHandler);
        this.AddClick(this.zaomuBtn, this.onClickHandler);
        this.AddClick(this.exitBtn, this.onClickHandler);
        this.UpdateTeamInfo();
    };
    GangMineMyTeamPanel.prototype.UpdateTeamInfo = function () {
        // 如果队伍退出队伍，或者被剔除队伍
        if (!this.model.mTeamInfo.HasTeam()) {
            this.CloseSelf();
            return;
        }
        var members = [];
        var i = 0;
        for (var _i = 0, _a = this.model.mTeamInfo.members; _i < _a.length; _i++) {
            var data = _a[_i];
            members.push({
                guardInfo: null,
                mInfo: this.model.mTeamInfo,
                mIndex: i++,
            });
        }
        this.list.dataProvider = new eui.ArrayCollection(members);
        this.tpower.text = this.model.mTeamInfo.needpower + '';
    };
    GangMineMyTeamPanel.prototype.onClickHandler = function (e) {
        switch (e.target) {
            case this.exitBtn:
                this.OnClickExit();
                break;
            case this.zaomuBtn:
                this.OnClickZaomu();
                break;
            case this.setUpBtn:
                if (this.model.mTeamInfo.IsMyTeam()) {
                    // this.model.SendGetTeamCondition(1, parseInt(this.tpower.text));
                    this.OnClickSetup();
                }
                else {
                    this.tpower.text = this.model.mTeamInfo.needpower + '';
                    GameGlobal.UserTips.showTips('您不是队长没有权限操作');
                }
                break;
        }
    };
    GangMineMyTeamPanel.prototype.OnClickExit = function () {
        this.CloseSelf();
        this.model.SendLeave(1);
    };
    GangMineMyTeamPanel.prototype.OnClickZaomu = function () {
        if (this.model.mTeamInfo.IsMyTeam()) {
            //发送到聊天
        }
        else {
            GameGlobal.UserTips.showTips('您不是队长没有权限操作');
        }
    };
    GangMineMyTeamPanel.prototype.OnClickSetup = function () {
        this.model.SendGetTeamCondition(1, parseInt(this.tpower.text));
    };
    GangMineMyTeamPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.removeEvents();
        this.CommonDialog.OnRemoved();
    };
    ;
    GangMineMyTeamPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangMineMyTeamPanel;
}(BaseEuiView));
__reflect(GangMineMyTeamPanel.prototype, "GangMineMyTeamPanel");
//# sourceMappingURL=GangMineMyTeamPanel.js.map