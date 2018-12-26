/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/25 10:15
 * @meaning: 跨服boss管理类
 * 
 **/

class AcrossBossManage extends BaseSystem {



    public constructor() {
        super();


        this.regNetMsg(S2cProtocol.sc_kfboss_info, this.doInfo);
        this.regNetMsg(S2cProtocol.sc_kfboss_update_info, this.doUpdateInfo);
        this.regNetMsg(S2cProtocol.sc_kfboss_box_all, this.doBoxAll);
        this.regNetMsg(S2cProtocol.sc_kfboss_box_one, this.doBoxOne);
        this.regNetMsg(S2cProtocol.sc_kfboss_player_dead, this.doPlayerDead);
        this.regNetMsg(S2cProtocol.sc_kfboss_rank_now, this.doRankNow);
        this.regNetMsg(S2cProtocol.sc_kfboss_rewards, this.doRewards);
        this.regNetMsg(S2cProtocol.sc_kfboss_rank_last, this.doRankLast);
        this.regNetMsg(S2cProtocol.sc_kfboss_collect_all, this.doCollentAll);
        this.regNetMsg(S2cProtocol.sc_kfboss_collect_now, this.doCollentNow);
        this.regNetMsg(S2cProtocol.sc_kfboss_report, this.getEndAwardPanelData);


    }

    public Init() {
        super.Init()
    }


    //请求进入跨服地图
    public enterMap() {
        this.Rpc(C2sProtocol.cs_kfboss_entermap)
    };

    //# 请求挑战
    // challengeid 	0 : integer	# 挑战玩家id，为空则挑战boss
    public sendChallenge(challengeid: number) {
        let req = new Sproto.cs_kfboss_challenge_request;
        req.challengeid = challengeid
        this.Rpc(C2sProtocol.cs_kfboss_challenge, req)
    };



    //# 采集宝箱
    //boxid		0 : integer
    public sendCollectBox(boxid: number) {
        let req = new Sproto.cs_kfboss_collect_box_start_request;
        req.boxid = boxid
        this.Rpc(C2sProtocol.cs_kfboss_collect_box_start, req)
    };

    //# 收集宝箱取消
    public sendCollectBoxCancel() {
        this.Rpc(C2sProtocol.cs_kfboss_collect_box_cancel)
    };

    //# 复活
    public sendRelive() {
        this.Rpc(C2sProtocol.cs_kfboss_relive)
    };

    //# 获取上届排行
    public sendGetLastRank() {
        this.Rpc(C2sProtocol.cs_kfboss_getranks)
    };

    //# 采集宝箱
    //success	0 : boolean
    public sendGetRewards(success: number) {
        this.Rpc(C2sProtocol.cs_kfboss_get_rewards, null, (req) => {

        })
    };




    //跨服boss信息
    public doInfo(rsp: Sproto.sc_kfboss_info_request) {
        GameGlobal.AcrossBossController.info(rsp)
    }

    //跨服boss更新信息
    public doUpdateInfo(rsp: Sproto.sc_kfboss_update_info_request) {
        GameGlobal.AcrossBossController.doUpdateInfo(rsp)
    }

    //
    public doBoxAll(rsp: Sproto.sc_kfboss_box_all_request) {
        GameGlobal.AcrossBossController.doBoxAll(rsp)
    }

    //
    public doBoxOne(rsp: Sproto.sc_kfboss_box_one_request) {
        GameGlobal.AcrossBossController.doBoxOne(rsp)
    }

    //
    public doPlayerDead(rsp: Sproto.sc_kfboss_player_dead_request) {
        GameGlobal.AcrossBossController.doPlayerDead(rsp)
    }

    //
    public doRankNow(rsp: Sproto.sc_kfboss_rank_now_request) {
        GameGlobal.AcrossBossController.doRankNow(rsp)
    }

    //
    public doRewards(rsp: Sproto.sc_kfboss_rewards_request) {
        GameGlobal.RaidModel.OnCrossBossResult(rsp)
    }

    public doRankLast(rsp: Sproto.sc_kfboss_rank_last_request) {
        GameGlobal.AcrossBossController.doRankLast(rsp)
    }

    public doCollentNow(rsp: Sproto.sc_kfboss_collect_now_request) {
        if (!rsp.info) {
            return
        }
        GameGlobal.AcrossBossController.doCollentNow(rsp)
    }

    public doCollentAll(rsp: Sproto.sc_kfboss_collect_all_request) {
        GameGlobal.AcrossBossController.doCollentAll(rsp)
    }

    public getEndAwardPanelData(rep: Sproto.sc_kfboss_report_request) {
        if (rep) {
            let data = new activityEndAwardData()
            data.award = rep.rewards;
            data.auction = rep.auctionrewards;
            data.paneltitle = "跨服争霸";

            let icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
            icon1Date.titleName = "跨服BOSS归属帮会";
            icon1Date.name = rep.sharedata.victory;
            icon1Date.iconSrc = "ui_bh_bm_qizi"
            data.icon1 = icon1Date;

            let icon2Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: null };
            icon2Date.titleName = "伤害第一名玩家";
            icon2Date.name = rep.sharedata.first;
            icon2Date.iconSrc = ResDataPath.GetHeadImgName(rep.sharedata.job, rep.sharedata.sex)
            data.icon2 = icon2Date;
            ViewManager.ins().open(ActivityEndAwardPanel, data);
        }
    }
}