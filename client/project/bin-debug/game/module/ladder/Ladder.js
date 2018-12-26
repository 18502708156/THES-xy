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
var Ladder = (function (_super) {
    __extends(Ladder, _super);
    function Ladder() {
        var _this = _super.call(this) || this;
        /**是否可以领取奖励 */
        _this.isCanReward = false;
        _this.upgrade = 1;
        _this.upstar = 0;
        _this.upWin = 0;
        /**已购买次数 */
        _this.todayBuyTime = 0;
        /**排行榜信息 */
        _this.mRankList = [];
        _this.upRankList = [];
        /**是否第一次打开购买窗口 */
        _this.isTipsFlag = false;
        _this.rank = 0;
        _this.upWeekRank = 0;
        _this.canJoin = false;
        _this.isOpen = false;
        _this.grade = 1; // 段位
        _this.star = 0; // 星级
        _this.challgeNum = 0;
        // 净胜场
        _this.winNum = 0;
        _this.lianWin = false;
        // 获取剩余时间
        _this.nextTime = 0;
        _this.regNetMsg(S2cProtocol.sc_ladder_info, _this.doLadderInfo);
        _this.regNetMsg(S2cProtocol.sc_ladder_player_back, _this._DoPlayerBack);
        _this.regNetMsg(S2cProtocol.sc_ladder_result, _this.doPlayResule);
        _this.regNetMsg(S2cProtocol.sc_ladder_rank_list, _this.doRankInfoList);
        _this.regNetMsg(S2cProtocol.sc_ladder_buy_count, _this.doChallageNum);
        _this.regNetMsg(S2cProtocol.sc_ladder_winner_info, _this.doWinnerRecords);
        return _this;
    }
    Ladder.prototype.ClearActorInfo = function () {
        this.mCodePlayerInfo = null;
    };
    /**根据索引获取数据 */
    Ladder.prototype.getActorInfo = function () {
        return this.mCodePlayerInfo;
    };
    /**请求匹配玩家 */
    Ladder.prototype.sendGetSomeOne = function () {
        var req = new Sproto.cs_ladder_get_some_one_request;
        req.ladderType = this.GetLadderType();
        this.Rpc(C2sProtocol.cs_ladder_get_some_one, req);
    };
    /**开始挑战 */
    Ladder.prototype.sendStarPlay = function (id, type) {
        var rep = new Sproto.cs_ladder_start_play_request;
        rep.ladderType = this.GetLadderType();
        rep.type = type;
        this.Rpc(C2sProtocol.cs_ladder_start_play, rep);
    };
    /**领取上周奖励 */
    Ladder.prototype.sendGetWeekReward = function () {
        var req = new Sproto.cs_ladder_get_week_reward_request;
        req.ladderType = this.GetLadderType();
        this.Rpc(C2sProtocol.cs_ladder_get_week_reward, req);
        GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_PRE_WEEK_REWARD);
    };
    /**获取排行榜数据 */
    Ladder.prototype.sendGetRankInfo = function () {
        var req = new Sproto.cs_ladder_get_rank_info_request;
        req.ladderType = this.GetLadderType();
        this.Rpc(C2sProtocol.cs_ladder_get_rank_info, req);
    };
    Ladder.prototype.SendInitInfo = function () {
        if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
            return;
        }
        this.Rpc(C2sProtocol.cs_ladder_info);
        this.SendGetWinnerInfo();
    };
    Ladder.prototype.SendGetInitInfo = function () {
        if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
            return;
        }
        this.Rpc(C2sProtocol.cs_ladder_info);
    };
    Ladder.prototype.SendGetWinnerInfo = function () {
        this.Rpc(C2sProtocol.cs_ladder_get_winner_info);
    };
    Ladder.prototype.SendWorship = function () {
        var req = new Sproto.cs_ladder_worship_request;
        req.ladderType = this.GetLadderType();
        this.Rpc(C2sProtocol.cs_ladder_worship, req);
    };
    /**购买次数*/
    Ladder.prototype.sendBuyChallgeTime = function () {
        var req = new Sproto.cs_ladder_buy_count_request;
        req.ladderType = this.GetLadderType();
        this.Rpc(C2sProtocol.cs_ladder_buy_count, req);
    };
    /**论剑台相关信息*/
    Ladder.prototype.doLadderInfo = function (bytes) {
        if (!this.IsSelfType(bytes)) {
            return;
        }
        this.docodeInfo(bytes);
    };
    /**获取到论剑台天战对象*/
    Ladder.prototype._DoPlayerBack = function (bytes) {
        if (!this.IsSelfType(bytes)) {
            return;
        }
        this.doCodeplayerInfo(bytes);
        GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_PLAYER_BACK);
    };
    /**论剑台挑战结果*/
    Ladder.prototype.doPlayResule = function (bytes) {
        if (!this.IsSelfType(bytes)) {
            return;
        }
        this.doPlayResult(bytes);
    };
    /**获取排行榜列表*/
    Ladder.prototype.doRankInfoList = function (bytes) {
        if (!this.IsSelfType(bytes)) {
            return;
        }
        this.rank = bytes.rank;
        this.upWeekRank = bytes.upWeekRank;
        this.mRankList = bytes.rankData || [];
        for (var i = 0; i < this.mRankList.length; ++i) {
            this.mRankList[i].pos = i + 1;
        }
        this.upRankList = bytes.upWeekRankList;
        GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_UPWEEK_RANK_UPDATE);
    };
    Ladder.prototype.doWinnerRecords = function (rsp) {
        this.mWinnerRecords = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_WINNER);
    };
    /**获取已购买次数*/
    Ladder.prototype.doChallageNum = function (bytes) {
        if (!this.IsSelfType(bytes)) {
            return;
        }
        this.todayBuyTime = bytes.todayBuyTime;
    };
    Object.defineProperty(Ladder.prototype, "NextTime", {
        get: function () {
            return this.nextTime;
        },
        enumerable: true,
        configurable: true
    });
    /** 论剑台数据*/
    Ladder.prototype.docodeInfo = function (bytes) {
        this.canJoin = bytes.canJoin;
        this.isOpen = bytes.isOpen;
        this.grade = bytes.grade;
        this.star = bytes.star;
        this.challgeNum = bytes.challgeNum;
        this.nextTime = bytes.challgeCd;
        this.winNum = bytes.winNum;
        this.lianWin = bytes.lianWin;
        this.playUpTime = bytes.playUpTime;
        this.upWeekRank = bytes.rank;
        if (this.playUpTime) {
            this.isCanReward = bytes.isCanReward;
            this.upgrade = bytes.upgrade;
            this.upstar = bytes.upstar;
            this.upWin = bytes.upWin;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_CHANGE);
    };
    Ladder.prototype.doCodeplayerInfo = function (bytes) {
        this.mCodePlayerInfo = bytes;
    };
    /**挑战结果*/
    Ladder.prototype.doPlayResult = function (bytes) {
        var isWin = bytes.isWin;
        var num = bytes.rewardData.length;
        var list = [];
        for (var i = 0; i < num; i++) {
            var item = new RewardData();
            item.parser(bytes.rewardData[i]);
            list.push(item);
        }
        var upGrade = this.grade;
        var upStar = this.star;
        this.grade = bytes.grade;
        this.star = bytes.star;
        var raid = GameGlobal.RaidMgr.mBattleRaid;
        if (raid) {
            var finishAction = new LadderFinishData;
            finishAction.isWin = isWin;
            finishAction.list = list;
            finishAction.upGrade = upGrade;
            finishAction.upStar = upStar;
            finishAction.changeStar = bytes.increasestar;
            raid.SetFinishAction(finishAction);
        }
    };
    Ladder.prototype.IsRedPoint = function () {
        if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
            return false;
        }
        if (this.isCanReward) {
            return true;
        }
        if (this.mWinnerRecords) {
            if (!this.mWinnerRecords.worship) {
                return true;
            }
        }
        if (!this.canJoin) {
            return false;
        }
        if (this.isOpen && this.challgeNum > 0) {
            return true;
        }
        return false;
    };
    /**
     * 获取段位配置
     */
    Ladder.prototype.GetSelfLevelConfig = function () {
        return this.GetLevelConfig(this.grade);
    };
    Ladder.prototype.GetSelfUpLevelConfig = function () {
        return this.GetLevelConfig(this.upgrade);
    };
    Ladder.prototype.GetLevelConfig = function (grade) {
        return GameGlobal.Config.KingSportsConfig[grade];
    };
    Ladder.prototype.getZhongwenNumber = function (i) {
        return TextFlowMaker.getCStr(i);
    };
    Ladder.prototype.checkRedShow = function () {
        if ((this.challgeNum > 0 && this.isOpen) || this.isCanReward) {
            return 1;
        }
        return 0;
    };
    Ladder.GetStatuByLevel = function (level) {
        var str;
        switch (level) {
            case 1:
                str = 3;
                break;
            case 2:
                str = 4;
                break;
            case 3:
                str = 5;
                break;
            case 4:
                str = 0;
                break;
            default:
                str = 0;
                break;
        }
        return str;
    };
    ;
    Ladder.GetRankByLevel = function (level) {
        var rak;
        switch (level) {
            case 1:
                rak = "一";
                break;
            case 2:
                rak = "二";
                break;
            case 3:
                rak = "三";
                break;
            case 4:
                rak = "四";
                break;
            default:
                rak = "〇";
                break;
        }
        return rak;
    };
    ;
    Ladder.prototype.IsSelfType = function (rsp) {
        // return (rsp.ladderType || 0) == this.GetLadderType()
        return true;
    };
    /** 奖励表 */
    Ladder.prototype.GetAwardConfig = function () {
        return GlobalConfig.ins().DWKingSportsConfig;
    };
    // 跨服
    Ladder.prototype.GetLadderType = function () {
        return 1;
    };
    return Ladder;
}(BaseSystem));
__reflect(Ladder.prototype, "Ladder");
//# sourceMappingURL=Ladder.js.map