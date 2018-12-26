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
var TeamBaseMemberView = (function (_super) {
    __extends(TeamBaseMemberView, _super);
    function TeamBaseMemberView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        // 是否显示自动快速加入
        _this.mNotAutoJoint = false;
        _this.mTime = new TeamTime(10, 50);
        // 上次请求间隔时间
        _this.m_PreRepTime = 0;
        return _this;
    }
    TeamBaseMemberView.prototype.SetTime = function (t1, t2) {
        this.mTime = new TeamTime(t1, t2);
        this.mTime.Reset();
    };
    TeamBaseMemberView.prototype.childrenCreated = function () {
        if (this.count_label) {
            this.count_label.text = "";
        }
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
        this._AddChange(this.checkBox0, this._OnClick);
        this._AddChange(this.checkBox1, this._OnClick);
        this.myTeamList.itemRenderer = TeamMemberItem;
        this.myTeamList.dataProvider = new eui.ArrayCollection;
        this.teamList.itemRenderer = TeamDataItem;
        this.teamList.dataProvider = new eui.ArrayCollection;
    };
    TeamBaseMemberView.prototype.OnOpen = function () {
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent);
        this.observe(MessageDef.UPDATE_TEAM_LIST, this.UpdateContent);
        this.mModel.SendGetMyTeamInfos();
        this.AddLoopTimer(1000, this.UpdateTime);
        if (this.mNotAutoJoint) {
            this.checkBox1.selected = false;
            this.checkBox1.visible = false;
        }
        else {
            this.checkBox1.selected = true;
            this.checkBox1.visible = true;
        }
    };
    TeamBaseMemberView.prototype.OnResume = function () {
        if (this.mTime) {
            this.mTime.Reset();
        }
    };
    TeamBaseMemberView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCulture:
                if (!UserFb.CheckActMap()) {
                    return;
                }
                if (this.mModel.mTeamInfo.HasTeam()) {
                    this.mModel.SendLeave(this.mModel.mTeamInfo.level);
                }
                else {
                    // let data = this.m_ConfigData
                    // let configData = this.mModel.GetConfigData(data)
                    // this.mModel.SendCreateTeam(configData.GetKey())
                    this.mModel.SendCreateTeam(this.m_ConfigKey);
                }
                break;
            case this.btnAuto:
                if (!UserFb.CheckActMap()) {
                    return;
                }
                var model = this.mModel;
                if (model.mTeamInfo.HasTeam()) {
                    if (model.mTeamInfo.IsMyTeam()) {
                        this.SendBattle();
                    }
                }
                else {
                    this.SendJoin();
                }
                break;
            case this.checkBox0:
                if (!this.checkBox0.selected) {
                    this.mTime.ResetType(0);
                    this.UpdateTime();
                }
                break;
            case this.checkBox1:
                if (!this.checkBox1.selected) {
                    // if (this.m_Model.mTeamInfo.HasTeam()) {
                    // }
                    this.mTime.ResetType(1);
                    this.UpdateTime();
                }
                break;
        }
    };
    TeamBaseMemberView.prototype.SetCountLabel = function (text) {
        if (!this.count_label) {
            return;
        }
        this.count_label.text = text;
    };
    TeamBaseMemberView.prototype.UpdateKey = function (data) {
        // this.m_ConfigData = data
        this.m_ConfigKey = data;
        this.mModel.SendGetTeamList(this.m_ConfigKey);
        this.UpdateContent();
    };
    TeamBaseMemberView.prototype.UpdateContent = function () {
        this.noneLabel.visible = false;
        this.myTeamList.visible = false;
        this.teamList.visible = false;
        var model = this.mModel;
        if (model.mTeamInfo.HasTeam()) {
            this.myTeamList.visible = true;
            var list = [];
            var i = 0;
            for (var _i = 0, _a = model.mTeamInfo.members; _i < _a.length; _i++) {
                var data = _a[_i];
                list.push({
                    mModel: model,
                    mInfo: model.mTeamInfo,
                    mIndex: i++,
                });
            }
            this.myTeamList.dataProvider = new eui.ArrayCollection(list);
            //组队成功 去掉挂机战斗的自动挑战关卡BOSS
            GameGlobal.UserFb.mAuto = false;
            GameGlobal.UserFb.sendSetAuto();
        }
        else {
            // let config = this.m_ConfigData
            // if (!config) {
            //     return
            // }
            if (egret.getTimer() - this.m_PreRepTime > 4000) {
                this.m_PreRepTime = egret.getTimer();
                this.mModel.SendGetTeamList(this.m_ConfigKey);
            }
            if (this.m_ConfigKey) {
                var teamList = model.mTeamList[this.m_ConfigKey];
                if (teamList && teamList.length) {
                    this.teamList.visible = true;
                    var list = [];
                    for (var i = 0; i < 3; i++) {
                        var data = teamList[i];
                        if (!data) {
                            break;
                        }
                        list.push({
                            mModel: model,
                            mInfo: data,
                            config: this.m_ConfigKey
                        });
                    }
                    this.teamList.dataProvider = new eui.ArrayCollection(list);
                }
                else {
                    // this.mModel.SendGetTeamList(this.m_ConfigKey)
                    this.noneLabel.visible = true;
                }
            }
        }
        this.UpdateBtnState();
    };
    TeamBaseMemberView.prototype.UpdateBtnState = function () {
        var model = this.mModel;
        if (model.mTeamInfo.HasTeam()) {
            this.btnCulture.label = TeamBaseMemberView.LABEL.EXIT_ROOM;
            if (model.mTeamInfo.IsMyTeam()) {
                this.btnAuto.visible = true;
                this.btnAuto.label = TeamBaseMemberView.LABEL.START_CHALLENGE;
                if (!this.checkBox0.visible) {
                    this.checkBox0.selected = true;
                    this.checkBox1.selected = true;
                    this.mTime.Reset();
                }
                this.checkBox0.visible = true;
                this.checkBox1.visible = true;
            }
            else {
                this.btnAuto.visible = false;
                this.checkBox0.visible = false;
                this.checkBox1.visible = false;
            }
        }
        else {
            this.btnCulture.label = TeamBaseMemberView.LABEL.CREATE_ROOM;
            this.checkBox0.visible = false;
            this.btnAuto.visible = true;
            if (this.mNotAutoJoint) {
                this.checkBox1.visible = false;
            }
            else {
                this.checkBox1.visible = true;
            }
            this.btnAuto.label = TeamBaseMemberView.LABEL.QUICK_JOIN;
            // let config = this.m_ConfigData
        }
        this.UpdateTime();
    };
    TeamBaseMemberView.prototype.UpdateTime = function () {
        if (!UserFb.CheckActMap(false)) {
            return;
        }
        var model = this.mModel;
        if (model.mTeamInfo.HasTeam()) {
            if (model.mTeamInfo.IsMyTeam()) {
                var isFull = model.mTeamInfo.IsFull();
                if (!isFull) {
                    this.checkBox0.label = TeamBaseMemberView.LABEL.FULL_OPEN1;
                }
                else {
                    if (this.checkBox0.selected) {
                        if (this.mTime.UpdateFull()) {
                            this.SendBattle();
                            this.checkBox0.selected = false;
                        }
                        this.checkBox0.label = this.mTime.mFull + TeamBaseMemberView.LABEL.FULL_OPEN2;
                    }
                    else {
                        this.checkBox0.label = TeamBaseMemberView.LABEL.FULL_OPEN1;
                    }
                }
                if (this.checkBox1.selected && this.mTime.UpdateOpen()) {
                    this.SendBattle();
                    this.checkBox1.selected = false;
                }
                this.checkBox1.label = this.mTime.mAutoOpen + TeamBaseMemberView.LABEL.FULL_OPEN2;
            }
        }
        else {
            // 暂时注释进入检查
            // if (!this.IsNotEnter(this.m_Model.GetConfig()[this.m_CurIndex].id)) {
            if (this.checkBox1.visible && this.checkBox1.selected && this.mTime.UpdateJoin()) {
                this.SendJoin();
                this.checkBox1.selected = false;
            }
            this.checkBox1.label = this.mTime.mJoin + TeamBaseMemberView.LABEL.FULL_OPEN3;
            // }
        }
    };
    TeamBaseMemberView.prototype.SendJoin = function () {
        if (!this.m_ConfigKey) {
            return;
        }
        this.mModel.SendQuickJoin(this.m_ConfigKey);
        // let config = this.m_ConfigData
        // if (!config) {
        // 	return
        // }
        // let configData = this.mModel.GetConfigData(config)
        // this.mModel.SendQuickJoin(configData.GetKey())
    };
    TeamBaseMemberView.prototype.SendBattle = function () {
        this.mModel.SendFight(this.mModel.mTeamInfo.level);
    };
    TeamBaseMemberView.LABEL = {
        CREATE_ROOM: "创建房间",
        EXIT_ROOM: "退出房间",
        START_CHALLENGE: "开始挑战",
        QUICK_JOIN: "快速加入",
        FULL_OPEN1: "满员自动开启副本",
        FULL_OPEN2: "秒自动开启副本",
        FULL_OPEN3: "秒自动加入队伍",
    };
    return TeamBaseMemberView;
}(BaseView));
__reflect(TeamBaseMemberView.prototype, "TeamBaseMemberView");
var TeamTime = (function () {
    function TeamTime(joinTime, openTime) {
        this.mFull = 0;
        this.mAutoOpen = 0;
        this.mJoin = 0;
        this.mGapTime = 0;
        this.mJoinTime = joinTime;
        this.mOpenTime = openTime;
    }
    TeamTime.prototype.GetGapTime = function () {
        if (!this.mGapTime) {
            this.mGapTime = egret.getTimer();
            return 1;
        }
        if (egret.getTimer() - this.mGapTime >= 500) {
            this.mGapTime = egret.getTimer();
            return 1;
        }
        return 0;
    };
    TeamTime.prototype.UpdateFull = function () {
        this.mFull -= this.GetGapTime();
        if (this.mFull <= 0) {
            this.mFull = 5;
            return true;
        }
        return false;
    };
    TeamTime.prototype.UpdateJoin = function () {
        this.mJoin -= this.GetGapTime();
        if (this.mJoin <= 0) {
            this.mJoin = this.mJoinTime;
            return true;
        }
        return false;
    };
    TeamTime.prototype.UpdateOpen = function () {
        this.mAutoOpen -= this.GetGapTime();
        if (this.mAutoOpen <= 0) {
            this.mAutoOpen = this.mOpenTime;
            return true;
        }
        return false;
    };
    TeamTime.prototype.Reset = function () {
        this.mFull = 5;
        this.mAutoOpen = this.mOpenTime;
        this.mJoin = this.mJoinTime;
    };
    TeamTime.prototype.ResetType = function (type) {
        if (type == 0) {
            this.mFull = 5;
        }
        else {
            this.mAutoOpen = this.mOpenTime;
            this.mJoin = this.mJoinTime;
        }
    };
    return TeamTime;
}());
__reflect(TeamTime.prototype, "TeamTime");
//# sourceMappingURL=TeamBaseMemberView.js.map