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
var GangMineModel = (function (_super) {
    __extends(GangMineModel, _super);
    function GangMineModel() {
        var _this = _super.call(this) || this;
        /**我的状态信息 */
        _this.myInfo = new GangMineMyInfo;
        /**矿山数据 --key 矿脉ID */
        _this.mineInfos = {};
        /**帮派排名 --key 排名类型*/
        _this.mineRanks = {};
        _this.regNetMsg(S2cProtocol.sc_guildmine_mine_info, _this.getGangMineInfo);
        _this.regNetMsg(S2cProtocol.sc_guildmine_mine_one_info, _this.getGangMineOneInfo);
        _this.regNetMsg(S2cProtocol.sc_guildmine_mine_mystatus, _this.getGangMineMyStatus);
        _this.regNetMsg(S2cProtocol.sc_guildmine_score_rank_day, _this.getGangMineScoreRankInfo);
        _this.regNetMsg(S2cProtocol.sc_guildmine_rob_info, _this.getGangMineRob);
        return _this;
    }
    /**矿山争夺数据 */
    GangMineModel.prototype.getGangMineInfo = function (rsp) {
        var i = 0, len = this.mineTotalNum = rsp.mineinfos.length;
        var data;
        var info;
        for (i; i < len; i++) {
            data = rsp.mineinfos[i];
            info = this.mineInfos[data.mineId];
            if (info) {
                info.updateInfo(data);
            }
            else {
                info = new GangMineInfo;
                info.updateInfo(data);
                this.mineInfos[data.mineId] = info;
            }
        }
        MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
    };
    /**单个矿脉数据 */
    GangMineModel.prototype.getGangMineOneInfo = function (rsp) {
        var info = this.mineInfos[rsp.mineinfo.mineId];
        if (info) {
            info.updateInfo(rsp.mineinfo);
        }
        MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
    };
    /**我自己的状态信息 */
    GangMineModel.prototype.getGangMineMyStatus = function (rsp) {
        this.myInfo.updateInfo(rsp);
        MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
    };
    /**帮派排行数据 */
    GangMineModel.prototype.getGangMineScoreRankInfo = function (rsp) {
        var i = 0, len = rsp.rankdatas.length;
        var data;
        var info;
        this.mineRanks[rsp.rankType] = [];
        for (i; i < len; i++) {
            data = rsp.rankdatas[i];
            info = new GangMineRankInfo;
            info.rankType = rsp.rankType;
            info.updateInfo(data);
            this.mineRanks[rsp.rankType][i] = info;
        }
        MessageCenter.ins().dispatch(MessageDef.GANGMINE_RANK_INFO);
    };
    /**矿脉被抢通知 */
    GangMineModel.prototype.getGangMineRob = function (rsp) {
        WarnWin.show('您在矿山争夺中被【' + rsp.name + '.S' + rsp.serverId + '】击败', this.revengeHandler, this, null, null, 'normal', { btnName: '前往复仇' });
    };
    GangMineModel.prototype.revengeHandler = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (GameGlobal.ActivityModel.activityList[ActivityModel.TYPE_GANGMINE]) {
            ViewManager.ins().open(GangMinePanel);
        }
        else {
            GameGlobal.UserTips.showTips('活动未开启');
        }
    };
    /**
     * 帮派积分排行 1=当天活动，2=月度排行
     * @param rankType
     */
    GangMineModel.prototype.sendGangMineScoreRank = function (rankType) {
        var req = new Sproto.cs_guildmine_score_rank_request;
        req.rankType = rankType;
        this.Rpc(C2sProtocol.cs_guildmine_score_rank, req);
    };
    /**进入矿山争夺 */
    GangMineModel.prototype.sendGangMineEnter = function () {
        this.Rpc(C2sProtocol.cs_guildmine_enter);
    };
    /**离开矿脉守护 */
    GangMineModel.prototype.sendGangMineLeave = function () {
        this.Rpc(C2sProtocol.cs_guildmine_leave_mine);
    };
    /**抢占矿脉 */
    GangMineModel.prototype.sendGangMineForce = function (mineId) {
        var req = new Sproto.cs_guildmine_force_join_request;
        req.mineId = mineId;
        this.Rpc(C2sProtocol.cs_guildmine_force_join, req, function (rsp) {
            if (!rsp.ret) {
                GameGlobal.UserTips.showTips('您不是队长不能操作');
            }
        }, this);
        ;
    };
    /**查看矿脉详情 */
    GangMineModel.prototype.sendGangMineDeatial = function (mineId) {
        var req = new Sproto.cs_guildmine_mine_info_request;
        req.mineId = mineId;
        this.Rpc(C2sProtocol.cs_guildmine_mine_info, req);
        ;
    };
    /**加入守护 */
    GangMineModel.prototype.sendGangMineProtect = function (mineId) {
        var req = new Sproto.cs_guildmine_join_mine_request;
        req.mineId = mineId;
        this.Rpc(C2sProtocol.cs_guildmine_join_mine, req, function (rsp) {
            if (rsp.ret) {
                GameGlobal.UserTips.showTips('成功加入采矿队列');
            }
        }, this);
    };
    /**采矿 */
    GangMineModel.prototype.sendGangMineCollect = function () {
        var req = new Sproto.cs_guildmine_gather_request;
        this.Rpc(C2sProtocol.cs_guildmine_gather, req, function (rsp) {
            if (rsp.ret) {
            }
        }, this);
    };
    /**矿山每页数量 */
    GangMineModel.MINE_MAX_NUM = 10;
    /**矿脉最大守护数 */
    GangMineModel.MINE_GUARD_NUM = 3;
    return GangMineModel;
}(BaseSystem));
__reflect(GangMineModel.prototype, "GangMineModel");
//# sourceMappingURL=GangMineModel.js.map