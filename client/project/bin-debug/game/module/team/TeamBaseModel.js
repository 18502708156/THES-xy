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
var TeamBaseModel = (function (_super) {
    __extends(TeamBaseModel, _super);
    function TeamBaseModel(type) {
        var _this = _super.call(this) || this;
        _this.m_Team = {};
        _this.mTeamList = {};
        _this.mRaidType = type;
        _this.mTeamInfo = new MyTeamInfo;
        TeamBaseModelMsg.Add(_this);
        return _this;
    }
    TeamBaseModel.prototype._NotifyTeamListData = function () {
        this.m_Team = null;
        GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_UPDATE_MAP_LIST);
    };
    TeamBaseModel.prototype._ChageTeam = function (rsp) {
        var list = this.mTeamList[rsp.level];
        if (!list) {
            list = this.mTeamList[rsp.level] = [];
        }
        var members = rsp.members || [];
        members.sort(function (lhs, rhs) {
            if (lhs.dbid == rsp.leaderid) {
                return -1;
            }
            if (rhs.dbid == rsp.leaderid) {
                return 1;
            }
            return -1;
        });
        var has = false;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            if (data.leaderid == rsp.leaderid) {
                data.count = members.length;
                data.members = members;
                data.needpower = rsp.needpower;
                has = true;
                break;
            }
        }
        if (!has && members.length) {
            var team = new Sproto.team_data;
            team.leaderid = rsp.leaderid;
            team.members = members;
            team.needpower = rsp.needpower;
            team.count = members.length;
            list.push(team);
        }
        for (var _a = 0, members_1 = members; _a < members_1.length; _a++) {
            var mem = members_1[_a];
            if (mem.dbid == GameGlobal.actorModel.actorID) {
                GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO);
                break;
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST);
        this._NotifyTeamListData();
    };
    TeamBaseModel.prototype._RemoveSelfFromTeam = function (level, leaderId) {
        var actorId = GameGlobal.actorModel.actorID;
        if (this.mTeamList[level]) {
            for (var _i = 0, _a = this.mTeamList[level]; _i < _a.length; _i++) {
                var data = _a[_i];
                if (leaderId == data.leaderid) {
                    var i = 0;
                    for (var _b = 0, _c = data.members; _b < _c.length; _b++) {
                        var mem = _c[_b];
                        if (mem.dbid == actorId) {
                            data.members.splice(i, 1);
                            break;
                        }
                        ++i;
                    }
                    break;
                }
            }
        }
    };
    TeamBaseModel.prototype._DoTeamInfo = function (rsp) {
        var teamInfo = this.mTeamInfo;
        if (!rsp) {
            this._RemoveSelfFromTeam(teamInfo.level, teamInfo.leaderid);
            teamInfo.Clear();
        }
        else {
            teamInfo.parser(rsp);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST);
        this._NotifyTeamListData();
    };
    TeamBaseModel.prototype._DoTeamList = function (rsp) {
        var datas = rsp.teamlist;
        if (!datas) {
            return;
        }
        var _loop_1 = function (data) {
            var mems = data.members || [];
            mems.sort(function (lhs, rhs) {
                if (lhs.dbid == data.leaderid) {
                    return -1;
                }
                if (rhs.dbid == data.leaderid) {
                    return 1;
                }
                return -1;
            });
        };
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            _loop_1(data);
        }
        this.mTeamList[rsp.level] = rsp.teamlist;
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST);
        this._NotifyTeamListData();
    };
    TeamBaseModel.prototype.SendGetMyTeamInfos = function () {
        var req = new Sproto.cs_team_info_request;
        this.Rpc(C2sProtocol.cs_team_info, req);
    };
    /**设置队伍加入条件 */
    TeamBaseModel.prototype.SendGetTeamCondition = function (level, needpower) {
        var req = new Sproto.cs_team_condition_request;
        req.level = level;
        req.needpower = needpower;
        req.raidtype = this.mRaidType;
        this.Rpc(C2sProtocol.cs_team_condition, req);
    };
    TeamBaseModel.prototype.SendGetTeamList = function (level) {
        var req = new Sproto.cs_team_list_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_list, req);
    };
    TeamBaseModel.prototype.SendCreateTeam = function (level) {
        if (!this.InnerCheckEnter(level)) {
            return;
        }
        var req = new Sproto.cs_team_create_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_create, req, this._DoCreate, this);
    };
    TeamBaseModel.prototype._DoCreate = function (rsp) {
    };
    TeamBaseModel.prototype.SendQuickJoin = function (level) {
        if (!this.InnerCheckEnter(level)) {
            return;
        }
        var req = new Sproto.cs_team_quick_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_quick, req, this._DoQuickJoin, this);
    };
    TeamBaseModel.prototype._DoQuickJoin = function (rsp) {
    };
    TeamBaseModel.prototype.SendJoin = function (level, leaderId) {
        if (!UserFb.CheckFighting()) {
            return;
        }
        if (!this.InnerCheckEnter(level)) {
            return;
        }
        var req = new Sproto.cs_team_join_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        req.leaderid = leaderId;
        this.Rpc(C2sProtocol.cs_team_join, req, this._DoJoin, this);
    };
    TeamBaseModel.prototype._DoJoin = function (rsp) {
        if (!rsp.ret) {
            // //八十一难
            // if(ViewIndexDef.TYPE_1063)
            // {
            // 	if(GameGlobal.TsumKoBaseModel.IsOpenViewReturn()!=false)
            // 		//UserTips.ins().showTips("队伍不存在，不可加入");
            // }
            // else
            // {
            // 	UserTips.ins().showTips("队伍不存在，不可加入")
            // }
        }
    };
    TeamBaseModel.prototype.SendLeave = function (level) {
        var req = new Sproto.cs_team_leave_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_leave, req, this._DoLeave, this);
    };
    TeamBaseModel.prototype._DoLeave = function (rsp) {
        var info = this.mTeamInfo;
        this._RemoveSelfFromTeam(info.level, info.leaderid);
        this.mTeamInfo.Clear();
        GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO);
        GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_UPDATE_LEAVE);
        this._NotifyTeamListData();
    };
    TeamBaseModel.prototype.SendKick = function (level, memberid) {
        var req = new Sproto.cs_team_kick_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        req.memberid = memberid;
        this.Rpc(C2sProtocol.cs_team_kick, req, this._DoKick, this);
    };
    TeamBaseModel.prototype._DoKick = function () {
    };
    TeamBaseModel.prototype.SendFight = function (key) {
        this.mSelectKey = key;
        var req = new Sproto.cs_team_fight_request;
        req.raidtype = this.mRaidType;
        req.level = key;
        this.Rpc(C2sProtocol.cs_team_fight, req, this._DoFight, this);
    };
    TeamBaseModel.prototype._DoFight = function () {
    };
    TeamBaseModel.prototype.SendCallRobot = function (level) {
        var req = new Sproto.cs_team_call_robot_request;
        req.raidtype = this.mRaidType;
        req.level = level;
        this.Rpc(C2sProtocol.cs_team_call_robot, req, this._DoFight, this);
    };
    TeamBaseModel.prototype.InnerCheckEnter = function (id) {
        if (UserWarn.CheckBagCapacity()) {
            return this.CheckEnter(id);
        }
        return false;
    };
    TeamBaseModel.prototype.GetConfigData = function (data) {
        if (data) {
            this.mConfigData.Init(data);
            return this.mConfigData;
        }
        return null;
    };
    TeamBaseModel.prototype.CheckEnter = function (id) {
        return false;
    };
    TeamBaseModel.prototype.GetConfig = function () {
        return [];
    };
    TeamBaseModel.prototype.GetCount = function () {
        return 0;
    };
    TeamBaseModel.prototype.GetAllTeam = function () {
        if (!this.m_Team) {
            this.m_Team = {};
            for (var data in this.mTeamList) {
                var teams = this.mTeamList[Number(data)];
                for (var i = 0; i < teams.length; i++) {
                    var mems = teams[i].members;
                    var list = [];
                    for (var _i = 0, mems_1 = mems; _i < mems_1.length; _i++) {
                        var mem = mems_1[_i];
                        list.push(mem.dbid);
                    }
                    this.m_Team[teams[i].leaderid] = list;
                }
            }
        }
        return this.m_Team;
    };
    return TeamBaseModel;
}(BaseSystem));
__reflect(TeamBaseModel.prototype, "TeamBaseModel");
var TeamBaseModelMsg = (function () {
    function TeamBaseModelMsg() {
        this.mShowTeamType = (_a = {},
            _a[UserFb.FB_TYPE_CROSSTEAMFB] = true,
            _a[UserFb.FB_TYPE_GUILDFB] = true,
            _a[UserFb.FB_TYPE_LIFE_DEATH_PLUNDER] = true,
            _a);
        this.mTeamList = {};
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_info, this._DoTeamInfo, this);
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_list, this._DoTeamList, this);
        Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_one, this._ChageTeam, this);
        var _a;
    }
    TeamBaseModelMsg.Add = function (model) {
        if (!this.mIns) {
            this.mIns = new TeamBaseModelMsg;
        }
        this.mIns.mTeamList[model.mRaidType] = model;
    };
    TeamBaseModelMsg.HasTeam = function () {
        var self = TeamBaseModelMsg.mIns;
        for (var k in self.mShowTeamType) {
            if (self.mTeamList[k] && self.mTeamList[k].mTeamInfo.HasTeam()) {
                return Number(k);
            }
        }
        return 0;
    };
    TeamBaseModelMsg.GoHasTeamPanel = function () {
        var fbId = this.HasTeam();
        if (fbId) {
            if (fbId == UserFb.FB_TYPE_CROSSTEAMFB) {
                ViewManager.ins().open(CrossMainPanel);
            }
            else if (fbId == UserFb.FB_TYPE_GUILDFB) {
                ViewManager.ins().open(GangMainWin, 1);
            }
            else if (fbId == UserFb.FB_TYPE_LIFE_DEATH_PLUNDER) {
                ViewManager.ins().open(TsumKoBasePanel);
            }
            else {
                console.error("not fbId = > " + fbId);
            }
        }
    };
    /**
     * 退出所有组队副本
     */
    TeamBaseModelMsg.Exit = function () {
        if (!this.mIns) {
            return;
        }
        var list = this.mIns.mTeamList;
        for (var key in list) {
            var data = list[key];
            if (data.mTeamInfo.HasTeam()) {
                data.SendLeave(data.mTeamInfo.level);
            }
        }
    };
    TeamBaseModelMsg.prototype._ChageTeam = function (rsp) {
        var model = this.mTeamList[rsp.raidtype];
        if (model) {
            model._ChageTeam(rsp);
        }
    };
    TeamBaseModelMsg.prototype._DoTeamInfo = function (rsp) {
        if (!rsp.raidtype) {
            for (var key in this.mTeamList) {
                this.mTeamList[key]._DoTeamInfo(null);
            }
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MAIN_INFO);
        }
        else {
            var model = this.mTeamList[rsp.raidtype];
            if (model) {
                model._DoTeamInfo(rsp);
            }
        }
        if (this.mShowTeamType[rsp.raidtype]) {
            GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MAIN_INFO);
        }
    };
    TeamBaseModelMsg.prototype._DoTeamList = function (rsp) {
        var model = this.mTeamList[rsp.raidtype];
        if (model) {
            model._DoTeamList(rsp);
        }
    };
    return TeamBaseModelMsg;
}());
__reflect(TeamBaseModelMsg.prototype, "TeamBaseModelMsg");
//# sourceMappingURL=TeamBaseModel.js.map