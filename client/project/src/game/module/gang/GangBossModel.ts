class GangBossModel extends BaseSystem {

    public tRankLast:Sproto.sc_guildboss_rank_last_request	= null 
    public status = 0	
    public changetime = 0	
    public shieldvalue	= 0
	public hp = 0	
	public hpperc = 0	
    public mCurRank: Sproto.sc_guildboss_rank_now_request = null
    public mBox: {[key: number]: Sproto.guildboss_boxinfo} = {}
    public mCollectNow: {[key: number]: Sproto.guildboss_collect_info[]} = {}
    public mPlayerDead: number = 0

    private m_EndTime: number

	public constructor() {
		super();

        this.regNetMsg(S2cProtocol.sc_guildboss_info, this.doInfo);
        this.regNetMsg(S2cProtocol.sc_guildboss_update_info, this.doUpdateInfo);
        this.regNetMsg(S2cProtocol.sc_guildboss_box_all, this.doBoxAll);
        this.regNetMsg(S2cProtocol.sc_guildboss_box_one, this.doBoxOne);
        this.regNetMsg(S2cProtocol.sc_guildboss_player_dead, this.doPlayerDead);
        this.regNetMsg(S2cProtocol.sc_guildboss_rank_now, this.doRankNow);
        this.regNetMsg(S2cProtocol.sc_guildboss_rewards, this.doRewards);
        this.regNetMsg(S2cProtocol.sc_guildboss_rank_last, this.doRankLast);
        this.regNetMsg(S2cProtocol.sc_guildboss_collect_all, this.doCollentAll);
        this.regNetMsg(S2cProtocol.sc_guildboss_collect_now, this.doCollentNow);
	}

	public Init() {
		super.Init()
	}

    public OnDayTimer() {
        this.m_EndTime = null
    }

    
    public doInfo(rsp: Sproto.sc_guildboss_info_request)
    {
        this.status = rsp.status
        this.changetime = rsp.changetime

        if (this.status == AcrossBossState.BOSS)
			PlayFunView.GameNotice(MainGameNoticeView.TYPE_GANG_BOSS, 600, MainGameNoticeView.SHOW_TYPE_GOTO)
		else
			PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_GANG_BOSS)

        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_UPDATE_INFO)
    }

    public getEndTime(): number {
        if (!this.m_EndTime) {
            let endTime =GameGlobal.Config.GuildBossBaseConfig.opentime[1];
            let arr = endTime.split(':')
            let date = new Date(GameServer.serverTime * 1000);
            date.setHours(Number(arr[0]), Number(arr[1]), Number(arr[2]), 0)
            this.m_EndTime = Math.floor(date.getTime() / 1000)
        }
        return Math.max(this.m_EndTime - GameServer.serverTime, 0)
    }

    public getBossRebornTime(): number {
        if (this.status != AcrossBossState.REBORNING)
            return 0

        let rebornCD = GameGlobal.Config.GuildBossBaseConfig.bossrevivetime
        return Math.max(this.changetime + rebornCD - GameServer.serverTime, 0)
    }

    public doUpdateInfo(rsp: Sproto.sc_guildboss_update_info_request)
    {
		this.shieldvalue =  rsp.shieldvalue
		this.hp = rsp.hp
        this.hpperc = rsp.hpperc
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_UPDATE_HP)
    }

    public doBoxAll(rsp: Sproto.sc_guildboss_box_all_request)
    {
        this.mBox = {}
        for (let data of rsp.boxinfos) {
            this.mBox[data.id] = data
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX)
    }

    public doBoxOne(rsp: Sproto.sc_guildboss_box_one_request)
    {
        let id = rsp.boxinfo.id
        delete this.mCollectNow[id]
        delete this.mBox[id]
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX)
    }

    public doPlayerDead(rsp: Sproto.sc_guildboss_player_dead_request)
    {
        this.mPlayerDead = rsp.deadtime + GameGlobal.Config.GuildBossBaseConfig.revivecd
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_DEAD)
    }

    public doRankNow(rsp: Sproto.sc_guildboss_rank_now_request)
    {
        this.mCurRank = rsp
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_RANK_NOW)
    }

    public doRewards(rsp: Sproto.sc_guildboss_rewards_request)
    {
        GameGlobal.RaidModel.OnCrossBossResult(rsp) 
    }

    public doRankLast(rsp: Sproto.sc_guildboss_rank_last_request)
    {
        this.tRankLast = rsp
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_CHANGE)
    }
    
    public doCollentNow(rsp: Sproto.sc_guildboss_collect_now_request) {
        let data = rsp.info
        if (data.time) {
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = []
            }
            this.mCollectNow[data.boxid].push(data)
        } else {
            let list = this.mCollectNow[data.boxid]
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].playerid == data.playerid) {
                        list.splice(i, 1)
                        break
                    }
                }
                if (!list.length) {
                    delete this.mCollectNow[data.boxid]
                }
            }
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX_COLLENT)
    } 

    public doCollentAll(rsp: Sproto.sc_guildboss_collect_all_request) {
        this.mCollectNow = {}
        for (let data of rsp.infos) {
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = []
            }
            this.mCollectNow[data.boxid].push(data)
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GANGBOSS_BOX_COLLENT)
    }
    
    public GetDeadTime(): number {
        if (this.mPlayerDead) {
            return Math.max(this.mPlayerDead - GameServer.serverTime, 0)
        }
        return 0
    }

    public ClearData(): void {
        this.mBox = {}
        this.mCollectNow = {}
        this.mPlayerDead = 0
    }

    public IsGangBossAct() {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_50)) {
            return false
        }
        if (!GameGlobal.GangModel.HasGang())
            return false
        
        return this.status != 0 && this.status != 4
    }

    public enterMap() {
        this.Rpc(C2sProtocol.cs_guildboss_entermap)
	}
    
    public sendChallenge(challengeid:number) {
		let req = new Sproto.cs_guildboss_challenge_request
        req.challengeid = challengeid
        this.Rpc(C2sProtocol.cs_guildboss_challenge, req)
	}

    public sendCollectBox(boxid:number) {
		let req = new Sproto.cs_guildboss_collect_box_start_request
        req.boxid = boxid
        this.Rpc(C2sProtocol.cs_guildboss_collect_box_start, req)
	}

    public RemoveCollentBox() {
        this.Rpc(C2sProtocol.cs_guildboss_collect_box_cancel)
	}

    public sendRelive() {
        this.Rpc(C2sProtocol.cs_guildboss_relive)
	}

    public sendGetLastRank() {
        this.Rpc(C2sProtocol.cs_guildboss_getranks)
	}

    public sendGetRewards(success:number) {
        this.Rpc(C2sProtocol.cs_guildboss_get_rewards,null,(req)=>{

        })
	}
}