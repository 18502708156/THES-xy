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
var GangMineTeamPanel = (function (_super) {
    __extends(GangMineTeamPanel, _super);
    function GangMineTeamPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.model = GameGlobal.GangMineTeamModel;
        _this.mMyTeamPanel = GangMineMyTeamPanel;
        return _this;
    }
    GangMineTeamPanel.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "GangMineTeamPanelSkin";
        this.commonWindowBg.SetTitle('组队');
    };
    ;
    GangMineTeamPanel.prototype.initData = function () {
        this.list.itemRenderer = GangMineTeamItem;
        this.list.dataProvider = null;
    };
    GangMineTeamPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.AddClick(this.createBtn, this.onClickHandler);
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.updateContent);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.showMyTeamPanel);
        this.model.SendGetTeamList(1);
    };
    GangMineTeamPanel.prototype.showMyTeamPanel = function () {
        this.CloseSelf();
        ViewManager.ins().open(this.mMyTeamPanel);
    };
    GangMineTeamPanel.prototype.updateContent = function () {
        this.list.dataProvider = new eui.ArrayCollection(this.model.mTeamList[1]);
    };
    GangMineTeamPanel.prototype.onClickHandler = function (e) {
        this.model.SendCreateTeam(1);
    };
    GangMineTeamPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.removeEvents();
        this.commonWindowBg.OnRemoved();
    };
    ;
    GangMineTeamPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return GangMineTeamPanel;
}(BaseEuiView));
__reflect(GangMineTeamPanel.prototype, "GangMineTeamPanel");
var GangMineTeamItem = (function (_super) {
    __extends(GangMineTeamItem, _super);
    function GangMineTeamItem() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GangMineTeamItemSkin';
        return _this;
    }
    GangMineTeamItem.prototype.childrenCreated = function () {
        this.joinBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickHandler, this);
    };
    GangMineTeamItem.prototype.onClickHandler = function (e) {
        if (this.needPower > GameGlobal.actorModel.power) {
            GameGlobal.UserTips.showTips('战力不足，不能加入');
            return;
        }
        if (this.memberLen >= 3) {
            GameGlobal.UserTips.showTips('队伍满员，不能加入');
            return;
        }
        var parent = Util.GetParentByType(this, GangMineTeamPanel);
        if (parent) {
            parent.model.SendJoin(1, this.leaderId);
        }
        else {
            console.error("not parent !!!");
        }
    };
    GangMineTeamItem.prototype.dataChanged = function () {
        if (!this.data)
            return;
        var info = this.data;
        this.leaderId = info.leaderid;
        this.needPower = info.needpower;
        this.tname.text = this.getLeaderName(info.members);
        this.tpower.text = '需战力' + CommonUtils.overLength(info.needpower, true);
        this.memberLen = info.members.length;
        this.tnum.text = '(' + this.memberLen + '/3)';
        this.showMembers(info.members);
    };
    /**显示成员数据 */
    GangMineTeamItem.prototype.showMembers = function (members) {
        var i = 0, len = 3;
        var info;
        var role;
        for (i; i < len; i++) {
            role = this['role' + i];
            info = members[i];
            role.updateContent(info, this.leaderId);
        }
    };
    GangMineTeamItem.prototype.getLeaderName = function (members) {
        var i = 0, len = members.length;
        for (i; i < len; i++) {
            if (this.leaderId == members[i].dbid) {
                return members[i].name;
            }
        }
        return '';
    };
    return GangMineTeamItem;
}(eui.ItemRenderer));
__reflect(GangMineTeamItem.prototype, "GangMineTeamItem");
var GangMineTeamRoleItem2 = (function (_super) {
    __extends(GangMineTeamRoleItem2, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangMineTeamRoleItem2() {
        var _this = _super.call(this) || this;
        _this.skinName = 'GangMineTeamRoleItem2Skin';
        return _this;
    }
    GangMineTeamRoleItem2.prototype.updateContent = function (info, leaderId) {
        if (info) {
            this.currentState = info.dbid == leaderId ? 'state1' : 'state2';
            this.iconImg.source = ResDataPath.GetHeadImgName(info.job, info.sex);
            this.tname.text = info.name;
            this.tserviceID.text = '';
            this.tlevel.text = 'Lv.' + info.level;
        }
        else {
            this.currentState = 'state3';
        }
    };
    return GangMineTeamRoleItem2;
}(eui.Component));
__reflect(GangMineTeamRoleItem2.prototype, "GangMineTeamRoleItem2");
//# sourceMappingURL=GangMineTeamPanel.js.map