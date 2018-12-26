class CloudNineModel extends BaseSystem {
    public rankType: CloudNineRankType;
    protected fighting: number[]
    protected monsterId = {}

    public score;
    public rewardsocre;

    public constructor() {
        super();
        this.regNetMsg(S2cProtocol.sc_climb_score_info, this.getGoodsSucceed);
        this.regNetMsg(S2cProtocol.sc_climb_all_rank, this.getAllRank);
        this.regNetMsg(S2cProtocol.sc_climb_curr_rank, this.getLocalRank);
        this.regNetMsg(S2cProtocol.sc_climb_refresh_mon, this.refreshMonsters);
        this.regNetMsg(S2cProtocol.sc_climb_fighting_change, this.updataFightingState);
        this.regNetMsg(S2cProtocol.sc_climb_info, this.getSceneInfo);
        this.regNetMsg(S2cProtocol.sc_climb_report, this.getEndAwardPanelData);

    }
    public checkPk(playerId: number): boolean {
        for (let i = 0; i < this.fighting.length; i++)
            if (this.fighting[i] == playerId) {
                return true;
            }
        return false
    }

    public addfightingIcon() {
        let allMentityList = GameGlobal.RaidMgr.mMapRaid.mEntityList
        for (let data in allMentityList) {
            allMentityList[data].ChageStatus(EntityStatusView.NONE);
        }
        for (let i = 0; i < this.fighting.length; i++) {
            if (allMentityList[this.fighting[i]]) {
                allMentityList[this.fighting[i]].ChageStatus(EntityStatusView.ATK)
            }
        }
        allMentityList[GameGlobal.GameLogic.actorModel.actorID].ChageStatus(EntityStatusView.NONE);
    }

    public getActivityTime(): number {
        let endTime = GameGlobal.Config.ClimbTowerBaseConfig.opentime.endtime;
        let index = endTime.indexOf(':')
        let endHours = endTime.substr(0, index);
        let endMinutes = endTime.substr(index + 1, endTime.length);
        let date = new Date(GameServer.serverTime * 1000);
        date.setHours(endHours, endMinutes, 0, 0)
        let commonTime = date.getTime() / 1000;
        return commonTime;
    }

    public getMonsterServersId(handle: number) {
        if (this.monsterId[handle] != null)
            return this.monsterId[handle]
    }
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //--------发送请求和接收结果----------------------------------------------------------------------
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public sendCrimbJoin() {
        let req = new Sproto.cs_crimb_join_request;
        this.Rpc(C2sProtocol.cs_crimb_join, req, this.getJoinSucceed, this);
    }
    public getJoinSucceed(req: Sproto.cs_crimb_join_response) {
        if (req.ret) {

        }
    }

    public sendLeaveTime() {
        let req = Sproto.cs_climb_leave_time_request;
        this.Rpc(C2sProtocol.cs_climb_leave_time, req, this.getLeaveTime, this)
    }

    public getLeaveTime(req: Sproto.cs_climb_leave_time_response) {
        let joinDelayTimer = req.time + GameGlobal.Config.ClimbTowerBaseConfig.cd - GameServer.serverTime;
        if (joinDelayTimer <= 0)
            GameGlobal.ActivityModel.sendActivityEnter(ActivityModel.TYPE_CLOUD_NINE);
        else {
            GameGlobal.UserTips.showTips(joinDelayTimer + "秒后可以进入");
        }
    }

    //请求Pk
    public sendPk(id: number) {
        let roleID = new Sproto.cs_crimb_pk_request()
        roleID.targetid = id;
        this.Rpc(C2sProtocol.cs_crimb_pk, roleID);
    }
    //请求奖励
    public sendGetGoods() {
        let req = new Sproto.cs_climb_get_reward_request();
        this.Rpc(C2sProtocol.cs_climb_get_reward, req);
    }

    public getGoodsSucceed(req: Sproto.sc_climb_score_info_request) {
        this.score = req.score;
        this.rewardsocre = req.rewardsocre;
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_GIFT_REFRES);
    }
    //请求本地排行
    public sendLocalRank() {
        let req = new Sproto.cs_climb_curr_rank_request()
        this.Rpc(C2sProtocol.cs_climb_curr_rank, req);
    }

    public getLocalRank(req: Sproto.sc_climb_curr_rank_request) {
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_RANK, req)
        this.rankType = CloudNineRankType.local;
    }
    //请求跨服排行    
    public sendAllRank() {
        let req = new Sproto.cs_climb_all_rank_request()
        this.Rpc(C2sProtocol.cs_climb_all_rank, req);
    }

    public getAllRank(req: Sproto.sc_climb_all_rank_request) {
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_RANK, req)
        this.rankType = CloudNineRankType.legendOfEmpire;
    }
    //请求离开
    public sendLeave() {
        let req = new Sproto.cs_climb_leave_request()
        this.Rpc(C2sProtocol.cs_climb_leave, req);
    }

    public refreshMonsters(req: Sproto.sc_climb_refresh_mon_request) {
        if (req.flag) {//1死亡
            for (let key in this.monsterId) {
                GameGlobal.RaidMgr.mMapRaid.RemoveEntity(parseInt(key))
            }
            this.monsterId = {};
        }
        else {
            for (let i = 0; i < req.monsters.length; i++)
                this.fighting.splice(this.fighting.indexOf(req.monsters[i].id), 1)
        }

        for (let i = 0; i < req.monsters.length; i++) {
            let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(req.monsters[i].monsterid, (req.monsters[i].x), (req.monsters[i].y));
            this.monsterId[entity.GetHandle()] = req.monsters[i].id
        }
    }

    public updataFightingState(req: Sproto.sc_climb_fighting_change_request) {
        if (req.isfighting) {
            this.fighting.push(req.dbid)
        } else {
            this.fighting.splice(this.fighting.indexOf(req.dbid), 1)
        }
        this.addfightingIcon();
    }

    public getSceneInfo(req: Sproto.sc_climb_info_request) {
        this.fighting = req.fighting;
        this.score = req.score;
        this.rewardsocre = req.rewardsocre;
        MessageCenter.ins().dispatch(MessageDef.CLOUD_NINE_SCENE_INIT)
        this.addfightingIcon();
        this.monsterId = {}
        for (let i = 0; i < req.monsters.length; i++) {
            let entity = GameGlobal.RaidMgr.mMapRaid.CreateMonster(req.monsters[i].monsterid, (req.monsters[i].x), (req.monsters[i].y));
            this.monsterId[entity.GetHandle()] = req.monsters[i].id
            // this.monsterId[req.monsters[i].id] = entity.GetHandle()
        }
    }

    public getEndAwardPanelData(rep: Sproto.sc_climb_report_request) {
        if (rep) {
            let data = new activityEndAwardData()
            data.award = rep.rewards
            data.paneltitle = "九重天"
            if (rep.sharedata.shows) {
                data.shows = rep.sharedata.shows;
            }
            ViewManager.ins().open(ActivityEndAwardPanel, data)
        }
    }
}
enum CloudNineRankType {
    local = 1,
    legendOfEmpire = 2,
}