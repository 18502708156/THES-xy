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
var XiandaoModel = (function (_super) {
    __extends(XiandaoModel, _super);
    function XiandaoModel() {
        var _this = _super.call(this) || this;
        _this.m_MyRankData = new XiandaoRankData;
        _this.m_RankList = [];
        _this.m_FightRankList = [];
        _this.m_IsOpenFlag = true;
        _this.m_KnockoutData = new XiandaoKnockoutData;
        _this.m_Gamble = [];
        _this.m_MapData = null;
        _this.mType = XiandaoState.NOT_STARTED;
        _this.mSign = false;
        _this.mMyTime = null;
        _this.m_Rank = 0;
        _this.m_PreliminariesStartTime = null;
        _this.mRedPoint = new XiandaoModelRedPoint;
        _this.regNetMsg(S2cProtocol.sc_qualifyingMgr_info_res, _this._UpdateInfo);
        _this.regNetMsg(S2cProtocol.sc_qualifyingMgr_map_info_res, _this._UpdateMapInfo);
        _this.regNetMsg(S2cProtocol.sc_qualifyingMgr_war_info, _this._DoResultInfo);
        return _this;
    }
    // 进入预选赛
    XiandaoModel.prototype.EnterPreliminaries = function () {
        if (GameGlobal.XiandaoModel.CanEnter()) {
            if (UserFb.CheckFighting()) {
                GameGlobal.XiandaoModel.SendEnter();
            }
        }
        else {
            UserTips.InfoTip("预选赛结束");
        }
    };
    // 预选赛开始时间
    XiandaoModel.prototype.GetPreliminariesStartTime = function () {
        if (this.m_PreliminariesStartTime == null) {
            this.m_PreliminariesStartTime = DateUtils.FormatTimeString(GameGlobal.Config.XianDuMatchBaseConfig.preliminaries[0]);
        }
        return Math.floor(this.m_PreliminariesStartTime / 1000);
    };
    // 预选赛开始剩余时间
    XiandaoModel.prototype.ShowPreliminariesTime = function () {
        if (this.mType == XiandaoState.APPLY_DONE) {
            var time = this.GetPreliminariesStartTime() - GameServer.serverTime;
            if (time > 0) {
                return time;
            }
        }
        return 0;
    };
    // 获取信息
    XiandaoModel.prototype.SendGetInfo = function () {
        this.Rpc(C2sProtocol.cs_qualifyingMgr_info);
    };
    XiandaoModel.prototype.SendGetTime = function () {
        this.mMyTime = null;
        this.Rpc(C2sProtocol.cs_qualifyingMgr_timeout, null, this._DoGetTime, this);
    };
    XiandaoModel.prototype._DoGetTime = function (rsp) {
        this.mMyTime = rsp;
        if (rsp.timeout != null) {
            rsp.timeout = GameServer.serverTime + rsp.timeout;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE);
    };
    // 报名
    XiandaoModel.prototype.SendApply = function () {
        this.Rpc(C2sProtocol.cs_qualifyingMgr_sign_up, null, this._DoApply, this);
    };
    XiandaoModel.prototype._DoApply = function (rsp) {
        if (rsp.ret) {
            this.mSign = true;
            UserTips.InfoTip("报名成功");
            GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE);
        }
        else {
            UserTips.InfoTip("已报名");
        }
    };
    // 海选排行榜
    XiandaoModel.prototype.SendGetRank = function () {
        this.Rpc(C2sProtocol.cs_qualifyingMgr_rank, null, this._DoRank, this);
    };
    XiandaoModel.prototype._DoRank = function (rsp) {
        this.m_RankList = [];
        for (var i = 0, list = rsp.rank_data || [], len = list.length; i < len; i++) {
            var data = list[i];
            var item = new XiandaoRankData;
            item.rank = i + 1;
            item.Parse(data);
            this.m_RankList.push(item);
        }
        this.m_FightRankList = [];
        for (var i = 0, list = rsp.fightRecord || [], len = list.length; i < len; i++) {
            var data = list[i];
            var item = new XiandaoRecordData;
            item.trunId = i + 1;
            item.Parse(data);
            this.m_FightRankList.push(item);
        }
        this.m_MyRankData.rank = rsp.rankNo;
        this.m_MyRankData.score = rsp.point;
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE);
    };
    // 下注
    XiandaoModel.prototype.SendGamble = function (field, no, type) {
        var req = new Sproto.cs_qualifyingMgr_gamble_request;
        req.field = field + 1;
        req.no = no + 1;
        req.typ = type + 1;
        this.Rpc(C2sProtocol.cs_qualifyingMgr_gamble, req, function (rsp) {
            if (rsp.ret) {
                UserTips.InfoTip("下注成功");
                if (!this.m_Gamble) {
                    this.m_Gamble = [];
                }
                var data = new Sproto.qualifyingMgr_gamble_data;
                data.field = field + 1;
                data.no = no + 1;
                data.typ = type + 1;
                this.m_Gamble.push(data);
                GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE);
            }
            else {
                UserTips.InfoTip("下注失败");
            }
        }, this);
    };
    // 观看录像
    XiandaoModel.prototype.SendVideo = function (the, field, round) {
        var req = new Sproto.cs_qualifyingMgr_video_request;
        req.the = the;
        req.field = field;
        req.round = round;
        this.Rpc(C2sProtocol.cs_qualifyingMgr_video, req);
    };
    XiandaoModel.prototype.SendEnterKnockout = function () {
        if (GameMap.fbType == UserFb.FB_TYPE_XIANDAO) {
            UserTips.InfoTip("正在场景中");
            return;
        }
        if (UserFb.CheckFighting()) {
            TeamBaseModelMsg.Exit();
            GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.XianDuMatchBaseConfig.mapid);
        }
    };
    // 进入场景，或者请求信息
    XiandaoModel.prototype.SendEnter = function () {
        if (GameMap.fbType == UserFb.FB_TYPE_XIANDAO) {
            UserTips.InfoTip("正在场景中");
            return;
        }
        this.SendGetMapInfo();
    };
    XiandaoModel.prototype.SendGetMapInfo = function () {
        this.Rpc(C2sProtocol.cs_qualifyingMgr_map_info);
    };
    XiandaoModel.prototype.ClearGetMapInfo = function () {
        TimerManager.ins().remove(this.SendGetMapInfo, this);
    };
    XiandaoModel.prototype._DoResultInfo = function (rsp) {
        var action = new XiandaoFinishData;
        action.isWin = rsp.win;
        action.roleData = rsp.roleData;
        GameGlobal.RaidMgr.mBattleRaid.SetFinishAction(action);
    };
    XiandaoModel.prototype._UpdateMapInfo = function (rsp) {
        if (rsp.ret == 1 && GameMap.fbType != UserFb.FB_TYPE_XIANDAO) {
            if (UserFb.CheckFighting()) {
                TeamBaseModelMsg.Exit();
                GameGlobal.CommonRaidModel._MapGo(GameGlobal.Config.XianDuMatchBaseConfig.mapid);
            }
        }
        this.m_MapData = rsp;
        // 剩余时间转时间戳
        if (rsp.timeout != null) {
            TimerManager.ins().doTimer(rsp.timeout * 1000, 1, this.SendGetMapInfo, this);
            rsp.timeout = rsp.timeout + GameServer.serverTime;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_MAP_UPDATE);
    };
    XiandaoModel.prototype._UpdateInfo = function (rsp) {
        if (rsp.champion != null) {
            this.mChampion = rsp.champion;
        }
        if (rsp.sign != null) {
            this.mSign = rsp.sign;
        }
        if (rsp.ret != null) {
            this.m_IsOpenFlag = rsp.ret;
        }
        if (rsp.type != null) {
            var preType = this.mType;
            this.mType = rsp.type;
            // 在海选赛之前，忽略openflag
            if (this.mType < XiandaoState.PRIMARY) {
                this.m_IsOpenFlag = true;
            }
            if (preType != this.mType && this.mType == XiandaoState.APPLY_DONE && this.mSign && this.m_IsOpenFlag) {
                // let time = this.ShowPreliminariesTime()
                // if (time > 0) {
                // PlayFunView.GameNotice(MainGameNoticeView.TYPE_XIANDAO, time, MainGameNoticeView.SHOW_TYPE_GOTO)
                // }
                PlayFunView.GameNotice(MainGameNoticeView.TYPE_XIANDAO, 300, MainGameNoticeView.SHOW_TYPE_GOTO);
            }
            else {
                PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_XIANDAO);
            }
        }
        if (rsp.rank != null) {
            this.m_Rank = rsp.rank;
        }
        if (rsp.player_data) {
            var list = this.m_KnockoutData.roleDatas = {};
            this.m_KnockoutData.roleNoList = [];
            for (var _i = 0, _a = rsp.player_data; _i < _a.length; _i++) {
                var data = _a[_i];
                var item = new XiandaoKnockoutRoleData;
                item.Parse(data);
                list[item.no] = item;
            }
        }
        this._UpdateKnockoutData(0, rsp.knockouttime16);
        if (this.m_KnockoutData.turnDatas[0].length) {
            var list = [];
            for (var _b = 0, _c = this.m_KnockoutData.turnDatas[0]; _b < _c.length; _b++) {
                var data = _c[_b];
                list.push(data.noA);
                list.push(data.noB);
            }
            this.m_KnockoutData.roleNoList = list;
        }
        this._UpdateKnockoutData(1, rsp.knockouttime8);
        this._UpdateKnockoutData(2, rsp.knockouttime4);
        this._UpdateKnockoutData(3, rsp.knockouttime2);
        if (rsp.gamble) {
            this.m_Gamble = rsp.gamble || [];
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.XIANDAO_UPDATE);
        this.SendGetTime();
    };
    XiandaoModel.prototype._UpdateKnockoutData = function (index, rsp) {
        if (!rsp) {
            return;
        }
        var list = this.m_KnockoutData.turnDatas[index] = [];
        for (var _i = 0, rsp_1 = rsp; _i < rsp_1.length; _i++) {
            var data = rsp_1[_i];
            var item = new XiandaoKnockoutTurn;
            item.Parse(data);
            list.push(item);
        }
    };
    // 正在比赛
    XiandaoModel.prototype.IsGame = function () {
        var state = this.mType;
        return state == XiandaoState._16_FINAL
            || state == XiandaoState._8_FINAL
            || state == XiandaoState._4_FINAL
            || state == XiandaoState._2_FINAL;
    };
    // 当前淘汰赛轮数
    XiandaoModel.prototype.GetKnockoutId = function () {
        if (this.mType < XiandaoState._16_FINAL_DONE) {
            return 0;
        }
        if (this.mType < XiandaoState._8_FINAL_DONE) {
            return 1;
        }
        if (this.mType < XiandaoState._4_FINAL_DONE) {
            return 2;
        }
        if (this.mType < XiandaoState._2_FINAL_DONE) {
            return 3;
        }
        return 3;
    };
    XiandaoModel.prototype.GetRoleData = function (no) {
        return this.m_KnockoutData.roleDatas[no];
    };
    XiandaoModel.prototype.GetTurnData = function (turnId, index) {
        var data = this.m_KnockoutData.turnDatas[turnId];
        if (!data) {
            return;
        }
        return data[index];
    };
    XiandaoModel.prototype.GetBetData = function (index) {
        // let the = [16, 8, 4, 2][turnId]
        for (var _i = 0, _a = this.m_Gamble; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.field == index + 1) {
                return data;
            }
        }
        return null;
    };
    // 是否在淘汰赛
    XiandaoModel.prototype.IsKnockout = function () {
        // return this.mType >= XiandaoState._16_FINAL && this.mType < XiandaoState._2_FINAL_DONE
        return this.mType >= XiandaoState.PRIMARY_DONE && this.mType < XiandaoState._2_FINAL_DONE;
    };
    // 预选赛结果
    XiandaoModel.prototype.IsShowResult = function () {
        return this.mType == XiandaoState.PRIMARY_DONE;
    };
    // 是否报名
    XiandaoModel.prototype.IsApply = function () {
        return this.mType == XiandaoState.APPLY;
    };
    XiandaoModel.prototype.IsClose = function () {
        return this.mType == XiandaoState.NOT_STARTED || !this.m_IsOpenFlag;
    };
    // 能否进入场景
    XiandaoModel.prototype.CanEnter = function () {
        return this.mType == XiandaoState.PRIMARY || this.mType == XiandaoState.APPLY_DONE;
    };
    // 上届冠军
    XiandaoModel.prototype.GetLast = function () {
        return this.mChampion;
    };
    // 失败自动退出
    XiandaoModel.prototype.IsExitGame = function () {
        if (this.m_MapData) {
            return this.m_MapData.ret == 3;
        }
        return false;
    };
    // 活动结束退出
    XiandaoModel.prototype.IsCloseAct = function () {
        if (this.m_MapData) {
            return this.m_MapData.ret == 2;
        }
        return false;
    };
    // 下一场开始剩余的时间
    XiandaoModel.prototype.GetNextTime = function () {
        if (this.m_MapData) {
            return Math.max(this.m_MapData.timeout - GameServer.serverTime, 0);
        }
        return 0;
    };
    XiandaoModel.prototype.GetSimpleRankData = function () {
        var list = [];
        if (this.m_MapData) {
            var i = 0;
            for (var _i = 0, _a = this.m_MapData.rank_data || []; _i < _a.length; _i++) {
                var data = _a[_i];
                var item = new XiandaoRankData;
                item.rank = i + 1;
                item.Parse(data);
                list.push(item);
                ++i;
            }
        }
        return list;
    };
    XiandaoModel.prototype.GetSimpleMyRank = function () {
        if (this.m_MapData) {
            return this.m_MapData.rankNo || 0;
        }
        return 0;
    };
    XiandaoModel.prototype.GetSimpleMyRankScore = function () {
        if (this.m_MapData) {
            return this.m_MapData.point || 0;
        }
        return 0;
    };
    XiandaoModel.prototype.GetRankData = function () {
        return this.m_RankList;
    };
    XiandaoModel.prototype.GetMyRankData = function () {
        return this.m_MyRankData;
    };
    XiandaoModel.prototype.GetGroupType = function () {
        return this.m_Rank || 1;
    };
    XiandaoModel.prototype.GetGroupTypeStr = function () {
        var type = GameGlobal.XiandaoModel.GetGroupType();
        var range = GameGlobal.Config.XianDuMatchBaseConfig["rank" + type];
        return XiandaoKnockoutView.RANK_TYPE_STR[type] + ("\uFF08" + range[0] + "-" + range[1] + "\u540D\uFF09");
    };
    XiandaoModel.prototype.GetRankRecord = function () {
        return this.m_FightRankList || [];
    };
    XiandaoModel.prototype.GetKnockoutData = function () {
        return this.m_KnockoutData;
    };
    return XiandaoModel;
}(BaseSystem));
__reflect(XiandaoModel.prototype, "XiandaoModel");
var XiandaoModelRedPoint = (function (_super) {
    __extends(XiandaoModelRedPoint, _super);
    function XiandaoModelRedPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XiandaoModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[XiandaoModelRedPoint.INDEX_APPLY] = this.GetIndexApply,
            _a;
        var _a;
    };
    XiandaoModelRedPoint.prototype.IsRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_43, true)) {
            return false;
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    XiandaoModelRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.XIANDAO_UPDATE
        ];
    };
    XiandaoModelRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_XIANDAO);
    };
    XiandaoModelRedPoint.prototype.GetIndexApply = function () {
        return GameGlobal.XiandaoModel.mType == XiandaoState.APPLY && !GameGlobal.XiandaoModel.mSign;
    };
    XiandaoModelRedPoint.INDEX_APPLY = 0;
    return XiandaoModelRedPoint;
}(IRedPoint));
__reflect(XiandaoModelRedPoint.prototype, "XiandaoModelRedPoint");
//# sourceMappingURL=XiandaoModel.js.map