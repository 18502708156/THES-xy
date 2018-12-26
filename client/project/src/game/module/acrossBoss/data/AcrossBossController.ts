/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/25 10:15
 * @meaning: 跨服boss控制类
 * 
 **/
class AcrossBossController extends BaseSystem {


    //
    public tRankLast:Sproto.sc_kfboss_rank_last_request	= null //	排行榜数据
    

    public status	 = 0	//	0 : integer	# 状态   0 关闭  1 等待boss  2 boss存在  3 boss被击杀
    public changetime = 0	//	1 : integer # 到达这一状态的时间

    public	shieldvalue	=	0// : integer
	public	hp	= 0	//		1 : integer
	public	hpperc	= 0	//		1 : integer

    public mCurRank: Sproto.sc_kfboss_rank_now_request = null

    public mBox: {[key: number]: Sproto.kfboss_boxinfo} = {}
    public mCollectNow: {[key: number]: Sproto.kfboss_collect_info[]} = {}
    public mPlayerDead: number = 0

    private m_EndTime: number

	public constructor() {
		super();


	}

	public Init() {
		super.Init()
	}

    public OnDayTimer() {
        this.m_EndTime = null
    }

    //
    public info(rsp : Sproto.sc_kfboss_info_request)
    {
		// status			0 : integer	# 状态   0 关闭  1 等待boss  2 boss存在  3 boss被击杀
		// changetime		1 : integer # 到达这一状态的时间
        this.status = rsp.status
        this.changetime = rsp.changetime

        if (this.status == AcrossBossState.BOSS)
			PlayFunView.GameNotice(MainGameNoticeView.TYPE_CROSS_BOSS, 600, MainGameNoticeView.SHOW_TYPE_GOTO)
		else if (this.status == AcrossBossState.KILL)
			PlayFunView.RemoveGameNotice(MainGameNoticeView.TYPE_CROSS_BOSS)

        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_UPDATE_INFO)
    }

    public getEndTime(): number {
        if (!this.m_EndTime) {
            let endTime =GlobalConfig.ins().KfBossBaseConfig.opentime[1];
            let arr = endTime.split(':')
            let date = new Date(GameServer.serverTime * 1000);
            date.setHours(Number(arr[0]), Number(arr[1]), Number(arr[2]), 0)
            this.m_EndTime = Math.floor(date.getTime() / 1000)
        }
        return Math.max(this.m_EndTime - GameServer.serverTime, 0)
    }

     //跨服boss更新信息
    public doUpdateInfo(rsp : Sproto.sc_kfboss_update_info_request)
    {
		this.shieldvalue =  rsp.shieldvalue	//	0 : integer
		this.hp = rsp.hp			//	1 : integer
        this.hpperc = rsp.hpperc
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_UPDATE_HP)
    }

    //
    public doBoxAll(rsp : Sproto.sc_kfboss_box_all_request)
    {
        this.mBox = {}
        for (let data of rsp.boxinfos) {
            this.mBox[data.id] = data
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX)
    }

    //
    public doBoxOne(rsp : Sproto.sc_kfboss_box_one_request)
    {
        let id = rsp.boxinfo.id
        delete this.mCollectNow[id]
        delete this.mBox[id]
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX)
    }

    //
    public doPlayerDead(rsp : Sproto.sc_kfboss_player_dead_request)
    {
        this.mPlayerDead = rsp.deadtime + GameGlobal.Config.KfBossBaseConfig.revivecd
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_DEAD)
    }

    //
    public doRankNow(rsp : Sproto.sc_kfboss_rank_now_request)
    {
        this.mCurRank = rsp
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_RANK_NOW)
    }


    public doRankLast(rsp : Sproto.sc_kfboss_rank_last_request)
    {
        this.tRankLast = rsp
        GameGlobal.MessageCenter.dispatch(MessageDef.ACROSS_BOSS)
    }
    
    public doCollentNow(rsp: Sproto.sc_kfboss_collect_now_request) {
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
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX_COLLENT)
    } 

    public doCollentAll(rsp: Sproto.sc_kfboss_collect_all_request) {
        this.mCollectNow = {}
        for (let data of rsp.infos) {
            if (!this.mCollectNow[data.boxid]) {
                this.mCollectNow[data.boxid] = []
            }
            this.mCollectNow[data.boxid].push(data)
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.KF_BOSS_BOX_COLLENT)
    }

    public RemoveCollentBox() {
        GameGlobal.AcrossBossManage.sendCollectBoxCancel()
    }
    
    public GetDeadTime(): number {
        if (this.mPlayerDead) {
            return Math.max(this.mPlayerDead - GameServer.serverTime, 0)
        }
        return 0
    }

    // 退出场景的时候清理部分数据
    public ClearData(): void {
        this.mBox = {}
        this.mCollectNow = {}
        this.mPlayerDead = 0
    }

    public IsAcrossBossAct() {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_64)) {
            return false
        }
        return this.status != 0
    }
}