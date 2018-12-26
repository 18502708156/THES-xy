/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/25 10:15
 * @meaning: 跨服boss管理类
 *
 **/
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
var AcrossBossManage = (function (_super) {
    __extends(AcrossBossManage, _super);
    function AcrossBossManage() {
        var _this = _super.call(this) || this;
        _this.regNetMsg(S2cProtocol.sc_kfboss_info, _this.doInfo);
        _this.regNetMsg(S2cProtocol.sc_kfboss_update_info, _this.doUpdateInfo);
        _this.regNetMsg(S2cProtocol.sc_kfboss_box_all, _this.doBoxAll);
        _this.regNetMsg(S2cProtocol.sc_kfboss_box_one, _this.doBoxOne);
        _this.regNetMsg(S2cProtocol.sc_kfboss_player_dead, _this.doPlayerDead);
        _this.regNetMsg(S2cProtocol.sc_kfboss_rank_now, _this.doRankNow);
        _this.regNetMsg(S2cProtocol.sc_kfboss_rewards, _this.doRewards);
        _this.regNetMsg(S2cProtocol.sc_kfboss_rank_last, _this.doRankLast);
        _this.regNetMsg(S2cProtocol.sc_kfboss_collect_all, _this.doCollentAll);
        _this.regNetMsg(S2cProtocol.sc_kfboss_collect_now, _this.doCollentNow);
        _this.regNetMsg(S2cProtocol.sc_kfboss_report, _this.getEndAwardPanelData);
        return _this;
    }
    AcrossBossManage.prototype.Init = function () {
        _super.prototype.Init.call(this);
    };
    //请求进入跨服地图
    AcrossBossManage.prototype.enterMap = function () {
        this.Rpc(C2sProtocol.cs_kfboss_entermap);
    };
    ;
    //# 请求挑战
    // challengeid 	0 : integer	# 挑战玩家id，为空则挑战boss
    AcrossBossManage.prototype.sendChallenge = function (challengeid) {
        var req = new Sproto.cs_kfboss_challenge_request;
        req.challengeid = challengeid;
        this.Rpc(C2sProtocol.cs_kfboss_challenge, req);
    };
    ;
    //# 采集宝箱
    //boxid		0 : integer
    AcrossBossManage.prototype.sendCollectBox = function (boxid) {
        var req = new Sproto.cs_kfboss_collect_box_start_request;
        req.boxid = boxid;
        this.Rpc(C2sProtocol.cs_kfboss_collect_box_start, req);
    };
    ;
    //# 收集宝箱取消
    AcrossBossManage.prototype.sendCollectBoxCancel = function () {
        this.Rpc(C2sProtocol.cs_kfboss_collect_box_cancel);
    };
    ;
    //# 复活
    AcrossBossManage.prototype.sendRelive = function () {
        this.Rpc(C2sProtocol.cs_kfboss_relive);
    };
    ;
    //# 获取上届排行
    AcrossBossManage.prototype.sendGetLastRank = function () {
        this.Rpc(C2sProtocol.cs_kfboss_getranks);
    };
    ;
    //# 采集宝箱
    //success	0 : boolean
    AcrossBossManage.prototype.sendGetRewards = function (success) {
        this.Rpc(C2sProtocol.cs_kfboss_get_rewards, null, function (req) {
        });
    };
    ;
    //跨服boss信息
    AcrossBossManage.prototype.doInfo = function (rsp) {
        GameGlobal.AcrossBossController.info(rsp);
    };
    //跨服boss更新信息
    AcrossBossManage.prototype.doUpdateInfo = function (rsp) {
        GameGlobal.AcrossBossController.doUpdateInfo(rsp);
    };
    //
    AcrossBossManage.prototype.doBoxAll = function (rsp) {
        GameGlobal.AcrossBossController.doBoxAll(rsp);
    };
    //
    AcrossBossManage.prototype.doBoxOne = function (rsp) {
        GameGlobal.AcrossBossController.doBoxOne(rsp);
    };
    //
    AcrossBossManage.prototype.doPlayerDead = function (rsp) {
        GameGlobal.AcrossBossController.doPlayerDead(rsp);
    };
    //
    AcrossBossManage.prototype.doRankNow = function (rsp) {
        GameGlobal.AcrossBossController.doRankNow(rsp);
    };
    //
    AcrossBossManage.prototype.doRewards = function (rsp) {
        GameGlobal.RaidModel.OnCrossBossResult(rsp);
    };
    AcrossBossManage.prototype.doRankLast = function (rsp) {
        GameGlobal.AcrossBossController.doRankLast(rsp);
    };
    AcrossBossManage.prototype.doCollentNow = function (rsp) {
        if (!rsp.info) {
            return;
        }
        GameGlobal.AcrossBossController.doCollentNow(rsp);
    };
    AcrossBossManage.prototype.doCollentAll = function (rsp) {
        GameGlobal.AcrossBossController.doCollentAll(rsp);
    };
    AcrossBossManage.prototype.getEndAwardPanelData = function (rep) {
        if (rep) {
            var data = new activityEndAwardData();
            data.award = rep.rewards;
            data.auction = rep.auctionrewards;
            data.paneltitle = "跨服争霸";
            var icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
            icon1Date.titleName = "跨服BOSS归属帮会";
            icon1Date.name = rep.sharedata.victory;
            icon1Date.iconSrc = "ui_bh_bm_qizi";
            data.icon1 = icon1Date;
            var icon2Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
            icon2Date.titleName = "伤害第一名玩家";
            icon2Date.name = rep.sharedata.first;
            icon2Date.iconSrc = ResDataPath.GetHeadImgName(rep.sharedata.job, rep.sharedata.sex);
            data.icon2 = icon2Date;
            ViewManager.ins().open(ActivityEndAwardPanel, data);
        }
    };
    return AcrossBossManage;
}(BaseSystem));
__reflect(AcrossBossManage.prototype, "AcrossBossManage");
//# sourceMappingURL=AcrossBossManage.js.map