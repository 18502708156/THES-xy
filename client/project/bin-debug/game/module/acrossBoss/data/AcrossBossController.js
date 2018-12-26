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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/25 10:15
 * @meaning: 跨服boss控制类
 *
 **/
var AcrossBossController = (function (_super) {
    __extends(AcrossBossController, _super);
    function AcrossBossController() {
        var _this = _super.call(this) || this;
        //
        _this.tRankLast = null; //	排行榜数据
        _this.status = 0; //	0 : integer	# 状态   0 关闭  1 等待boss  2 boss存在  3 boss被击杀
        _this.changetime = 0; //	1 : integer # 到达这一状态的时间
        _this.shieldvalue = 0; // : integer
        _this.hp = 0; //		1 : integer
        _this.hpperc = 0; //		1 : integer
        _this.mCurRank = null;
        _this.mBox = {};
        _this.mCollectNow = {};
        _this.mPlayerDead = 0;
        return _this;
    }
    AcrossBossController.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    AcrossBossController.prototype.OnDayTimer = function () {
        this.m_EndTime = null;
    };
    //
    AcrossBossController.prototype.info = function (rsp) {
        // status			0 : integer	# 状态   0 关闭  1 等待boss  2 boss存在  3 boss被击杀
        // changetime		1 : integer # 到达这一状态的时间
        this.status = rsp.status;
        this.changetime = rsp.changetime;
        if (this.status == AcrossBossState.BOSS)
            PlayFunView.GameNotice(MainGameNoticeView.TYPE_CROSS_BOSS, 600, MainGameNoticeView.SHOW_TYPE_GOTO);
        else if (this.status == AcrossBossState.KILL)
            PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_CROSS_BOSS);
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_UPDATE_INFO);
    };
    AcrossBossController.prototype.getEndTime = function () {
        if (!this.m_EndTime) {
            var endTime = GlobalConfig.ins().KfBossBaseConfig.opentime[1];
            var arr = endTime.split(':');
            var date = new Date(GameServer.serverTime * 1000);
            date.setHours(Number(arr[0]), Number(arr[1]), Number(arr[2]), 0);
            this.m_EndTime = Math.floor(date.getTime() / 1000);
        }
        return Math.max(this.m_EndTime - GameServer.serverTime, 0);
    };
    //跨服boss更新信息
    AcrossBossController.prototype.doUpdateInfo = function (rsp) {
        this.shieldvalue = rsp.shieldvalue; //	0 : integer
        this.hp = rsp.hp; //	1 : integer
        this.hpperc = rsp.hpperc;
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_UPDATE_HP);
    };
    //
    AcrossBossController.prototype.doBoxAll = function (rsp) {
        this.mBox = {};
        for (var _i = 0, _a = rsp.boxinfos; _i < _a.length; _i++) {
            var data = _a[_i];
            this.mBox[data.id] = data;
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX);
    };
    //
    AcrossBossController.prototype.doBoxOne = function (rsp) {
        var id = rsp.boxinfo.id;
        delete this.mCollectNow[id];
        delete this.mBox[id];
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX);
    };
    //
    AcrossBossController.prototype.doPlayerDead = function (rsp) {
        this.mPlayerDead = rsp.deadtime + GameGlobal.Config.KfBossBaseConfig.revivecd;
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_DEAD);
    };
    //
    AcrossBossController.prototype.doRankNow = function (rsp) {
        this.mCurRank = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_RANK_NOW);
    };
    AcrossBossController.prototype.doRankLast = function (rsp) {
        this.tRankLast = rsp;
        GameGlobal.MessageCenter.dispatch(MessageDef.ACROSS_BOSS);
    };
    AcrossBossController.prototype.doCollentNow = function (rsp) {
        var data = rsp.info;
        if (data.time) {
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = [];
            }
            this.mCollectNow[data.boxid].push(data);
        }
        else {
            var list = this.mCollectNow[data.boxid];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].playerid == data.playerid) {
                        list.splice(i, 1);
                        break;
                    }
                }
                if (!list.length) {
                    delete this.mCollectNow[data.boxid];
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX_COLLENT);
    };
    AcrossBossController.prototype.doCollentAll = function (rsp) {
        this.mCollectNow = {};
        for (var _i = 0, _a = rsp.infos; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = [];
            }
            this.mCollectNow[data.boxid].push(data);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX_COLLENT);
    };
    AcrossBossController.prototype.RemoveCollentBox = function () {
        GameGlobal.AcrossBossManage.sendCollectBoxCancel();
    };
    AcrossBossController.prototype.GetDeadTime = function () {
        if (this.mPlayerDead) {
            return Math.max(this.mPlayerDead - GameServer.serverTime, 0);
        }
        return 0;
    };
    // 退出场景的时候清理部分数据
    AcrossBossController.prototype.ClearData = function () {
        this.mBox = {};
        this.mCollectNow = {};
        this.mPlayerDead = 0;
    };
    AcrossBossController.prototype.IsAcrossBossAct = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_64)) {
            return false;
        }
        return this.status != 0;
    };
    return AcrossBossController;
}(BaseSystem));
__reflect(AcrossBossController.prototype, "AcrossBossController");
//# sourceMappingURL=AcrossBossController.js.map