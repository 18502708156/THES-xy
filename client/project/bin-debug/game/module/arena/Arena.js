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
var Arena = (function (_super) {
    __extends(Arena, _super);
    function Arena() {
        var _this = _super.call(this) || this;
        _this.myRank = 0;
        _this.maxRank = 0;
        _this.medal = 0;
        return _this;
    }
    /**获取机器人排名形象ID
    * @rank  名次
    */
    Arena.prototype.getRobotBodyByRank = function (rank) {
        // let config = GameGlobal.Config.ArenaRobotConfig;
        // let monid = 0;
        // if (config[rank]) {
        // 	let monsters = config[rank].initmonsters;
        // 	let i = 0, len = monsters.length;
        // 	let obj;
        // 	for (i; i < len; i++) {
        // 		obj = monsters[i];
        // 		if (8 == obj.pos) {
        // 			monid = obj.monid;
        // 			break;
        // 		}
        // 	}
        // 	if (0 == monid) monid = monsters[0].monid;
        // }
        // return monid;
        return Arena.MON_LIST[MathUtils.limitInteger(0, Arena.MON_LIST.length - 1)] || 220004;
    };
    /**获取排名奖励数据
     * @rank  名次
     */
    Arena.prototype.getRankRewards = function (rank) {
        var config = GameGlobal.Config.ArenaRankRewardConfig;
        var data;
        for (var id in config) {
            data = config[id];
            if (rank >= data.rankBegin && rank <= data.rankEnd) {
                return data.rankReward;
            }
        }
        return null;
    };
    /**获取自己VIP购买次数
     */
    Arena.prototype.getVipBuyCount = function () {
        var vip = GameGlobal.actorModel.vipLv;
        var config = GameGlobal.Config.ArenaVipConfig;
        if (config[vip]) {
            return config[vip].maxBuyTime;
        }
        return 0;
    };
    /**获取最多可购买次数 - 如果有VIP就取VIP的次数*/
    Arena.prototype.getMaxBuyCount = function () {
        return GameGlobal.Config.ArenaConfig.maxBuyTime;
    };
    /**获取初始挑战次数 */
    Arena.prototype.getPKCount = function () {
        return GameGlobal.Config.ArenaConfig.normalPKCount;
    };
    /**获取购买挑战次数元宝 */
    Arena.prototype.getPKCountBuy = function () {
        return GameGlobal.Config.ArenaConfig.pkCountPrice;
    };
    /**获取元宝购买挑战次数的增加次数 */
    Arena.prototype.getAddPKCount = function () {
        return GameGlobal.Config.ArenaConfig.buyPKCount;
    };
    /**获取挑战次数为零后回复倒计时(分钟) */
    Arena.prototype.getPKTimes = function () {
        return GameGlobal.Config.ArenaConfig.revertInterval;
    };
    /**排名奖励几时几分结算 */
    Arena.prototype.getRankRewardTimes = function () {
        var minute = GameGlobal.Config.ArenaConfig.rewardMinute;
        var hour = GameGlobal.Config.ArenaConfig.rewardHour;
        var str = minute > 0 ? '每天' + hour + '时' + minute + '分结算' : '每天' + hour + '时结算';
        return str;
    };
    /**获取排名上升的奖励绑元数 */
    Arena.prototype.getUpRankReward = function () {
        return GameGlobal.Config.ArenaConfig.promoteReward;
    };
    /**我的排名 */
    Arena.prototype.getMyRank = function () {
        return this.myRank;
    };
    /**历史最高排名 */
    Arena.prototype.getMaxRank = function () {
        return this.maxRank;
    };
    Arena.prototype.getArenaInfoRsp = function () {
        return this.arenaInfoRsp;
    };
    /**
    * 请求竞技场数据
    */
    Arena.prototype.sendArenaData = function () {
        var _this = this;
        var req = new Sproto.cs_arena_info_request;
        this.Rpc(C2sProtocol.cs_arena_info, req, function (rsp) {
            _this.arenaInfoRsp = rsp;
            var rspData = rsp;
            _this.myRank = rspData.rank;
            _this.maxRank = rspData.maxrank;
            _this.medal = rspData.medal;
            _this.HandleDuration(rspData.remaintime);
            MessageCenter.ins().dispatch(MessageDef.ARENA_INFO_DATA, rspData);
        });
    };
    ;
    /**
    * 选择pk目标(排名)
    */
    Arena.prototype.sendArenaChallenge = function (rank) {
        var rsp = new Sproto.cs_arena_pk_request;
        rsp.rank = rank;
        this.Rpc(C2sProtocol.cs_arena_pk, rsp);
    };
    ;
    /**
    * 购买挑战次数
    */
    Arena.prototype.sendArenaBuyCount = function () {
        var _this = this;
        var req = new Sproto.cs_buy_pk_request;
        this.Rpc(C2sProtocol.cs_buy_pk, req, function (rsp) {
            var rspData = rsp;
            if (rspData.ret) {
                _this.arenaInfoRsp.pkcount = rspData.pkcount;
            }
            MessageCenter.ins().dispatch(MessageDef.ARENA_BUY_RESULT, rspData);
        });
    };
    ;
    /**领取竞技挑战奖励 */
    Arena.prototype.sendGetRewards = function () {
        this.Rpc(C2sProtocol.cs_arena_get_reward, new Sproto.cs_arena_get_reward_request);
    };
    /**请求竞技排行榜 */
    Arena.prototype.sendArenaRank = function () {
        var req = new Sproto.cs_arena_rank_request;
        this.Rpc(C2sProtocol.cs_arena_rank, req, function (rsp) {
            var rspData = rsp;
            MessageCenter.ins().dispatch(MessageDef.ARENA_RANK_DATA, rspData);
        });
    };
    /**功勋 */
    Arena.prototype.getMedal = function () {
        return this.medal;
    };
    Arena.prototype.setMedal = function (medal) {
        this.medal = medal;
    };
    Arena.prototype.HandleDuration = function (endTime) {
        if (endTime <= 0) {
            return;
        }
        TimerManager.ins().removeAll(this);
        TimerManager.ins().doTimer(endTime * 1000, 1, this.sendArenaData, this);
    };
    /*竞技场红点提示 */
    Arena.prototype.IsRedPoint = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_42)) {
            return false;
        }
        if (!this.arenaInfoRsp || !this.arenaInfoRsp.pkcount)
            return false;
        return true;
    };
    //============================
    //===========配置数据==========
    //============================
    Arena.MON_LIST = [220004, 220003];
    return Arena;
}(BaseSystem));
__reflect(Arena.prototype, "Arena");
//# sourceMappingURL=Arena.js.map