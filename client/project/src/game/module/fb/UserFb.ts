class UserFb extends BaseSystem {

    /** 日常副本数据 FbModel Dictionary */
    fbModel: { [key: number]: FbModel } = {};
    /** 玲珑塔数据 LingLongTaModel Dictionary */
    lltModel: LingLongTaModel;
    // fbKindData: { [kind: number]: FbKindModel } = {};
    // static readonly KIND_FB_NAME = [null, '宝石副本', '经脉副本', '青龙副本', '白虎副本', '门客副本', '侍女副本', '神剑副本']
    bossIndex: number = 0
    /**关卡数据 */
    /** 关卡id */
    private _guanqiaID = -1;
    /** 当前波的掉落物 */
    // rewards: Sproto.wave_drop_data[] = [];
    //----------关卡数据
    waveCD = 0;
    /** 章节关卡奖励领取状态 */
    guanqiaReward = 1;
    /** 世界关卡领取奖励状态 */
    worldReward = 1;
    /** 世界关卡 - 可领取奖励关卡 */
    worldGuanQias = [];
    bossCallNum: number;
    private m_Wave: number;
    bossIsChallenged: boolean;


   
    /** 当前排行榜类型 */
    rankType:number = 0

    //关卡协助内容
    appealtime = 0
    helptime = 0

    public mAuto = false

    public config: Sproto.sc_raid_chapter_init_info_request

    public static MonDict: { [key: number]: Sproto.chapter_mondata } = {}


    private m_personBossArr: FbModel[]


    private tFbCbtData: FbcbtData[] //藏宝图副本列表



    private tFbCbtGetReward = [];//藏宝图副本领取奖励条件

    private tFbTiantingData: FbTiantingData[] //天庭副本列表
    public tFbTiantingServerData: Sproto.sc_fuben_heavenFb_info_request//天庭副本服务端数据

    private bCbtCanSwap = true;//藏宝图副本是否可以扫荡

    public bCbtAutoFight = false;//藏宝图副本是否可以自动战斗
    public bCbtAcross = false;//藏宝图副本当前关卡是否已经通关

    public bTianTingAutoFight = false;//勇闯天庭副本是否可以自动战斗





    public get Desc(): string {
        let str = ""
        if(this.config&&this.config.desc)
        str = this.config.desc
        
        return str
    }

    public constructor() {
        super();

        this.mRedPoint = new FbModelRedPoint()


        //关卡相关
        this.regNetMsg(S2cProtocol.sc_raid_chapter_init_info, this.doGuanqiaInfo);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_wave_data, this.doWaveData);

        this.regNetMsg(S2cProtocol.sc_raid_chapter_reward, this.doGuanqiaReward);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_world_reward, this.doGuanqiaWroldReward);
        this.regNetMsg(S2cProtocol.sc_raid_chapter_offline_reward, this.doOfflineReward);
        //材料副本

        //关卡协助内容
        this.regNetMsg(S2cProtocol.sc_raid_chapter_collaborate, this.raidChapterCollaborate);
        
        // raidChapterCollaborate(rsp: Sproto.sc_raid_chapter_collaborate_request) {


        //藏宝图
        this.regNetMsg(S2cProtocol.sc_fuben_treasuremap_info, this.doCangbaotu);
        //藏宝图获得数据更新
        this.regNetMsg(S2cProtocol.sc_fuben_treasuremap_star_reward, this.doCangbaoGetReward);


        this.regNetMsg(S2cProtocol.sc_fuben_material_info, this.doMaterialInfo);

        //勇闯天庭
        this.regNetMsg(S2cProtocol.sc_fuben_heavenFb_info, this.doTianting);


        //勇闯天庭 领取奖励数据更新
        this.regNetMsg(S2cProtocol.sc_fuben_heavenFb_reward, this.doUpdaeTianting);



        //玲珑宝塔
        this.regNetMsg(S2cProtocol.sc_fuben_wildgeeseFb_info, this.doLinglongTaInfo)

    }
    private doLinglongTaInfo(rsp: Sproto.sc_fuben_wildgeeseFb_info_request): void {
        if (!this.lltModel) {
            this.lltModel = new LingLongTaModel();
        }
        this.lltModel.parser(rsp.hard, rsp.layer);
        MessageCenter.ins().dispatch(MessageDef.TA_INFO_UPDATE);
    }

    public GetLinglongLayer() {
        if (this.lltModel) {
            return this.lltModel.layer
        }
        return 0
    }


    public Init(): void {
        this.m_personBossArr = [];
        let config = GameGlobal.Config.DailyFubenConfig
        for (let key in config) {
            let data = config[key]
            if (data.kind) {

                let fbModel = new FbModel();
                fbModel.fbID = data.id;
                fbModel.levelLimit = data.levelLimit;
                this.fbModel[fbModel.fbID] = fbModel;
            } else {
                let fbModel = new FbModel();
                fbModel.fbID = data.id
                fbModel.levelLimit = data.levelLimit;
                // this.fbModel[fbModel.fbID] = fbModel;
                this.m_personBossArr.push(fbModel);
            }
        }
        SortTools.sortMap(this.m_personBossArr, 'fbID', true);

        //藏宝图
        // 
        this.tFbCbtData = []
        let tCbtConfig = GameGlobal.Config.TreasureMapConfig
        for (const item in tCbtConfig) {
            let data = tCbtConfig[item]

            let fbCbt = new FbcbtData();
            let pExData = this.getFbExData(data.fbId)
            fbCbt.initLocalData(data, pExData)
            this.tFbCbtData.push(fbCbt)
        }

        //天庭副本 HeavenFbConfig
        this.tFbTiantingData = []
        let tTiantingCinfig = GameGlobal.Config.HeavenFbConfig
        for (const item in tTiantingCinfig) {
            let pTianting = new FbTiantingData();
            pTianting.initLocalData(tTiantingCinfig[item])
            this.tFbTiantingData.push(pTianting)
        }

    }

    public getPersonBoss(): FbModel[] {
        return this.m_personBossArr;
    }

    //根据副本id获取副本信息 _fbId
    private getFbExData(_fbId) {
        var pData = { name: "", desc: "" };//初始化
        var tConfig;
        tConfig = GameGlobal.Config.InstanceConfig
        if(tConfig)
        {
            pData.name = tConfig[_fbId][GameGlobal.Config.InstanceConfig_keys.name]
            pData.desc = tConfig[_fbId][GameGlobal.Config.InstanceConfig_keys.desc]
        }

        return pData
    }

    public getPersonBossById(id: number): FbModel {
        let i: number;
        let len: number = this.m_personBossArr.length;
        for (i = 0; i < len; i++) {
            if (this.m_personBossArr[i].fbID == id) {
                return this.m_personBossArr[i];
            }
        }
        return null
    }




    private doMaterialInfo(rsp: Sproto.sc_fuben_material_info_request) {
        let i: number;
        let len: number = rsp.fuben_data ? rsp.fuben_data.length : 0;
        for (i = 0; i < len; i++) {
            let config = GameGlobal.Config.DailyFubenConfig[rsp.fuben_data[i].fubenNo];
            let fbModel
            if (config.kind != 0) {
                fbModel = this.fbModel[rsp.fuben_data[i].fubenNo];
            } else {
                fbModel = this.getPersonBossById(rsp.fuben_data[i].fubenNo)
            }
            if (fbModel) {
                fbModel.parser(rsp.fuben_data[i].clearanceNum, rsp.fuben_data[i].todayNum, rsp.fuben_data[i].buyNum);
            }
        }
        MessageCenter.ins().dispatch(MessageDef.FB_INFO_UPDATE)
    }
    public doFbBossIndex(rsp: Sproto.sc_raid_myboss_top_request) {
        this.bossIndex = rsp.mybossTop
        MessageCenter.ins().dispatch(MessageDef.FB_COUNT_UPDATE)
    }

    //解析藏宝图
    public doCangbaotu(rsp: Sproto.sc_fuben_treasuremap_info_request) {
        //
        var tCbt = rsp
        var bCanSwap = false
        for (const item in this.tFbCbtData) {
            var pCbtData = this.tFbCbtData[item]
            for (const index in tCbt.data) {
                var pData = tCbt.data[index]
                if (!bCanSwap && pData.star > 0 && pData.todayNum == 0) {
                    bCanSwap = true
                    this.bCbtCanSwap = true
                }

                if (pData.fubenNo === pCbtData.id) {
                    pCbtData.updataDataByServer(pData)//更新服务端数据
                }
            }
            // if(pCbtData.fbId)
        }

        if (!bCanSwap) {
            this.bCbtCanSwap = false
        }

        this.tFbCbtGetReward = tCbt.starReward //#星级奖励是否领取了，这里用到了位运算【rewardNo & (2 ^ N)】不为0则表示已经领取了N为位置
        MessageCenter.ins().dispatch(MessageDef.FB_CBT_UPDATE)
    }

    //获取藏宝图奖励数据
    public doCangbaoGetReward(rsp: Sproto.sc_fuben_treasuremap_star_reward_request) {
        this.tFbCbtGetReward = rsp.starReward //#星级奖励是否领取了，这里用到了位运算【rewardNo & (2 ^ N)】不为0则表示已经领取了N为位置
        MessageCenter.ins().dispatch(MessageDef.FB_CBT_UPDATE_REWARD)
    }


    //获取藏宝图是否可以扫荡
    public getCbtCanSwap() {
        if(UserVip.ins().lv<GameGlobal.Config.TreasureMapBaseConfig.viplevel)
        {
            UserTips.ins().showTips("Vip"+ GameGlobal.Config.TreasureMapBaseConfig.viplevel + "可扫荡")
        }
        return this.bCbtCanSwap
    }


    //解析天庭副本数据
    public doTianting(rsp: Sproto.sc_fuben_heavenFb_info_request) {
        // rsp.todayLayer = 10
        // rsp.layer = 10
        this.tFbTiantingServerData = rsp
        MessageCenter.ins().dispatch(MessageDef.FB_TIANTING_UPDATE)
    }



    //天庭副本奖励内容返回
    public doUpdaeTianting(rsp: Sproto.sc_fuben_heavenFb_reward_request) {
        this.tFbTiantingServerData.rewardNo = rsp.rewardNo
        MessageCenter.ins().dispatch(MessageDef.FB_TIANTING_UPDATE)
    }


    //获取天庭奖励副本奖励领取情况

    // index (读取第一位开始  2(10) 6(110) 14(1110) )
    public getTiantingStarReward(_index) {
        var bGet = false
        for (const item in this.tFbTiantingServerData.rewardNo) {
            let num = this.tFbTiantingServerData.rewardNo[item]
            if(_index ==num )
            {
                bGet = true
                break
            }
        }
        return bGet
    }


    //获取奖励天庭列表
    public getTianTingRewardList() {
        var tRewardList = []
        for (const item in this.tFbTiantingData) {
            if (this.tFbTiantingData[item].firstAward && this.tFbTiantingData[item].firstAward.length > 0) {
                tRewardList.push(this.tFbTiantingData[item].firstAward)
            }
        }
        return tRewardList
    }

    //获取天庭副本数据
    public getTianTingLvData() {
        return this.tFbTiantingData
    }

    //page(0位开始) index (读取第一位开始  2(10) 6(110) 14(1110) )
    public getCbtStarReward(_page, _index) {
        var bGet = false

        for (const item in this.tFbCbtGetReward) {
            let data= this.tFbCbtGetReward[item]
            if(data.no === _page)
            {
                if ((data.reward & (1 << _index)) > 0) {
                    bGet = true
                }
            }
        }

        return bGet
    }

    // 是否全部领取
    public getCbtStarRewardPage(_page: number) {
        for (const item in this.tFbCbtGetReward) {
            let data= this.tFbCbtGetReward[item]
            if(data.no === _page && data.reward) {
                return data.reward
            }
        }

        return 0
    }

    //获取藏宝图分页数据
    public getCbtPageData(): {[key: number]: FbcbtData[]} {
        var tPataData = {}
        for (const item in this.tFbCbtData) {
            var nPage = this.tFbCbtData[item].page
            if (!tPataData[nPage]) {
                tPataData[nPage] = []
            }
            if (nPage) {
                tPataData[nPage].push(this.tFbCbtData[item]);//根据标签插入
            }
        }

        return tPataData
    }

    public CanHardCbt(): boolean {
        let can = true
        for (const item in this.tFbCbtData) {
            let data = this.tFbCbtData[item]
            var nPage = data.page
            if (nPage == 32) {
                if (data.star <= 0) {
                    can = false
                    break
                }
            }
        }
        return can
    }

    /**
     * 发送请求召唤boss
     */
    public sendCallBossPlay(id: number): void {
        let req = new Sproto.cs_raid_call_boss_play_request()
        req.id = id
        this.Rpc(C2sProtocol.cs_raid_call_boss_play, req)
    }


    /**
     *  协助挑战
     */
    public raidAssistPkboss(chapterlevel: number,playerid:number): void {
        let req = new Sproto.cs_raid_assist_pkboss_request()
        req.chapterlevel = chapterlevel
		req.playerid = playerid
        this.Rpc(C2sProtocol.cs_raid_assist_pkboss, req)
    }


    /**
     * 处理求助次数和协助次数
     */
    public raidChapterCollaborate(rsp: Sproto.sc_raid_chapter_collaborate_request) {
        this.appealtime = rsp.appealtime
        this.helptime = rsp.helptime
        MessageCenter.ins().dispatch(MessageDef.FUBEN_CHANGE)
    }

    /**进入副本
     *type #1材料副本,2藏宝图,3大雁塔,4勇闯天庭
     */
    public sendfbJoin(type, fbID = 0): void {
        let req = new Sproto.cs_fuben_join_request()
        if (fbID) {
            req.fubenNo = fbID
        }
        req.fubenType = type
        this.Rpc(C2sProtocol.cs_fuben_join, req)
    }
    /**扫荡副本 */
    public sendfbSweep(type): void {
        let req = new Sproto.cs_fuben_sweep_request()
        req.fubenType = type
        this.Rpc(C2sProtocol.cs_fuben_sweep, req)
    }

    public sendfbHard() {
        let req = new Sproto.cs_fuben_wildgeeseFb_hard_request();
        this.Rpc(C2sProtocol.cs_fuben_sweep, req)
    }
    // mapNo		0 : integer #哪页
    // reward		1 : integer #第几个奖励(1,2,3)
    //领取藏宝图奖励
    public getCbtReward(mapNo, reward): void {
        let req = new Sproto.cs_fuben_star_reward_request()
        req.mapNo = mapNo
        req.reward = reward
        this.Rpc(C2sProtocol.cs_fuben_star_reward, req);
    }


    //领取天庭奖励
    //fubenNo		0 : integer #哪个副本的
    public getTianTingReward(fubenNo) {
        let req = new Sproto.cs_fuben_heaven_reward_request()
        req.fubenNo = fubenNo
        this.Rpc(C2sProtocol.cs_fuben_heaven_reward, req)
    }


    ////////////////////////////////////////////////////////////  其他  ///////////////////////////////////

    public get guanqiaID() {
        return this._guanqiaID;
    }

    public set guanqiaID(value) {
        if (this._guanqiaID != value) {
            this._guanqiaID = value;
            this.bossIsChallenged = false;
        }
    }

    /**
     * 当前关卡宝箱是否可领取
     * @param	pass	关卡
     */
    public isReceiveBox(pass) {
        return this.worldGuanQias.indexOf(pass) == -1 ? false : true;
    }

    private m_KillMonsterCount = 0

    public get killMonsterCount() {
        return this.m_KillMonsterCount
    }
    // private canFightBossStarTime:number
    public set killMonsterCount(value) {
        if (this.m_KillMonsterCount != value) {
            this.m_KillMonsterCount = value
            GameGlobal.MessageCenter.dispatch(MessageDef.RAID_KILL_MONSTER_COUNT)
            FuncOpenEffPanel.checkNeedOpen();
        }
        // if(this.guanqiaID > 4 && this.guanqiaID <= 10)
        // {
        //     //5到10关，能挑战boss，但如果10秒内，没有点击挑战，则指引他挑战。
        //     if(this.isShowBossPK() && !this.bossIsChallenged && !FuncGuideView.isShow)
        //     {
        //         if(!this.canFightBossStarTime)
        //         {
        //             this.canFightBossStarTime = egret.getTimer();
        //             TimerManager.ins().doTimer(1000,0,this.checkShowGuild,this)
        //         }
        //     }else{

        //         if(this.canFightBossStarTime)
        //         {
        //             TimerManager.ins().remove(this.checkShowGuild,this);
        //         }
        //         this.canFightBossStarTime = undefined;
        //     }
        // }
    }
    // private checkShowGuild():void
    // {
    //     if(egret.getTimer() - this.canFightBossStarTime >= 10000)
    //     {
    //         if(this.isShowBossPK() && !this.bossIsChallenged)
    //         {
    //             if(!FuncGuideView.isShow)
    //             {
    //                 this.canFightBossStarTime = undefined;
    //                 let view:PlayFunView = <PlayFunView>ViewManager.ins().getView(PlayFunView);
    //                 FuncGuideView.StartShow(view.guanqiaBtn, view)
    //                 if(this.canFightBossStarTime)
    //                 {
    //                     TimerManager.ins().remove(this.checkShowGuild,this);
    //                 }
    //             }

    //         }

    //     }
    // }

    /**
     * 是否能挑战boss
     */
    public isShowBossPK() {
        if (this.guanqiaID == -1)
            return false;
        return this.m_KillMonsterCount >= this.config.bossNeedWave && BattleMap.mFbId == 0;
    }

    public getNeedWave() {
        if (this.guanqiaID == -1)
            return undefined;
        return Math.max(this.config.bossNeedWave - this.m_KillMonsterCount, 0)
    }

    public checkGuanKaMax() {
        return GlobalConfig.ins().ChaptersCommonConfig.maxNum
    }

    /** 获取当前波的掉落物（列表最后一个开始） */
    // public getRewardsPop() {
    //     return this.rewards.pop();
    // }

    //------------------------------------------------------------------------关卡相关
    public lastData: {
        goldEff: number,
        expEff: number,
    } = {} as any

    /**
     * 处理关卡初始化信息
     */
    public doGuanqiaInfo(rsp: Sproto.sc_raid_chapter_init_info_request) {
        var lastID = this.guanqiaID
        if (this.config) {
            this.lastData.goldEff = this.config.goldEff
            this.lastData.expEff = this.config.expEff
        }

        this.guanqiaID = rsp.cid;

        this.killMonsterCount = rsp.killMonsterCount

        this.config = rsp
        // 暂时没有12之后的地图
        if (this.config && this.config.sid > 12) {
            this.config.sid = 12
        }
        UserFb.MonDict = {}
        for (let data of rsp.waveMonsterId) {
            UserFb.MonDict[data.id] = data
        }
        let bossData = rsp.bossId
        if (bossData) {
            UserFb.MonDict[bossData.configId] = {
                id: bossData.configId,
                name: bossData.name,
                level: bossData.level,
                avatar: bossData.avatar,
                talk: bossData.talk,
            } as any
        }

        if (lastID != -1 && this.guanqiaID != lastID) {
            GameGlobal.PlotModel.OnChapterExit(this.guanqiaID)
        }

        GameGlobal.MessageCenter.dispatch(MessageDef.GUANQIA_CHANGE)

        Deblocking.Update(Deblocking.CHECK_TYPE_01)

        let data = new GameMapData
        data.fubenID = this.config.sid
        // 挂机、捕捉、挑战boss
        let immediately = !BattleMap.mFbType || BattleMap.mFbType >= UserFb.FB_TYPE_CATCH_PET || BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS
        GameGlobal.RaidMgr.EnterNewMapRaid(data, immediately)

        Main.Instance.ShowGame()
    }

    public sendWaveComplete() {
        let req = new Sproto.cs_raid_wave_complete_request
        req.killCount = 0
        this.Rpc(C2sProtocol.cs_raid_wave_complete, req)
    }

    public sendWaveMonster() {
        this.sendWaveComplete()
    }

    public CheckAutoPKBoss() {
        if (this.killMonsterCount >= this.config.bossNeedWave && this.mAuto && (!this.config.nextmap)) {
            // if (GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_CITY) {
            //     return false
            // }
            this.sendPKBoss()
            return true
        }
        return false
    }

    public CanPkBoss() {
        return this.killMonsterCount >= this.config.bossNeedWave
    }

    public sendPKBoss() {
        this.bossIsChallenged = true;
        this.Rpc(C2sProtocol.cs_raid_pk_boss, new Sproto.cs_raid_pk_boss_request())
    }

    public sendSetAuto() {
        let req = new Sproto.cs_raid_open_auto_request()
        req.auto = this.mAuto
        this.Rpc(C2sProtocol.cs_raid_open_auto, req)
    }

    public doWaveData(rsp: Sproto.sc_raid_chapter_wave_data_request) {
        this.killMonsterCount = rsp.wave
    }

    /**
     * 退出副本
     */
    public sendExitFb() {
        this.Rpc(C2sProtocol.cs_raid_exit_raid, new Sproto.cs_raid_exit_raid_request())
    }

    /**
     * 发送领取关卡奖励
     */
    public sendGetAward() {
        this.Rpc(C2sProtocol.cs_raid_get_award, new Sproto.cs_raid_get_award_request())
    }

    /**
     * 处理关卡奖励领取状态
     */
    public doGuanqiaReward(rsp: Sproto.sc_raid_chapter_reward_request) {
        this.guanqiaReward = rsp.result;
        this.worldReward = this.getWroldGuanQianCount(this.guanqiaReward);
    }

    /**
     * 领取地区奖励
     */
    public senddoGuanqiaWroldReward(pass) {
        let data = new Sproto.cs_raid_get_world_award_request()
        data.pass = pass
        this.Rpc(C2sProtocol.cs_raid_get_world_award, data)
    }

    /**
     * 地区奖励记录
     */
    public doGuanqiaWroldReward(rsp: Sproto.sc_raid_chapter_world_reward_request) {
        this.worldGuanQias = [];
        for (let i = 0; i < rsp.isReceive.length; ++i) {
            let isReceive = rsp.isReceive[i]
            if (isReceive == 0 && (i + 1) < this.worldReward) {
                this.worldGuanQias.push(i + 1);
            }
        }
    }

    /**
     * 处理离线奖励
     */
    public doOfflineReward(rsp: Sproto.sc_raid_chapter_offline_reward_request) {
        // 如果现实欢迎界面，则不显示奖励界面
        if (ViewManager.ins().isShow(WelComeLandingPanel)) {
            return
        }
        ViewManager.ins().open(OfflineRewardWin, rsp);
    }

    /** 获取 宝箱可领取奖励关卡 */
    public getWorldGuanQia() {
        if (this.worldGuanQias.length > 0)
            return this.worldGuanQias[this.worldGuanQias.length];
        else
            return 0;
    };
    /**
     * 根据章节关卡获取世界关卡
     * @param pass 章节关卡
     */
    public getWroldGuanQianCount(pass) {
        var value = 1;
        // try {
        //     var len = GlobalConfig.ins().WorldRewardConfig.length;
        //     var configs = GlobalConfig.ins().WorldRewardConfig;
        //     for (var i = 1; i <= len; i++) {
        //         var config = configs[i];
        //         var lastConfig = configs[i - 1];
        //         if (i == 1 && config && pass <= config.needLevel) {
        //             value = config.id;
        //         }
        //         else if (config && lastConfig && pass > lastConfig.needLevel && pass <= config.needLevel) {
        //             value = config.id;
        //         }
        //     }
        // }
        // catch (e) {
        //     egret.log("根据章节关卡获取世界关卡");
        //     egret.log(e);
        // }
        return value;
    };

    public GetWaveMonsterCount(): number {
        return this.config.bossNeedWave
    }

    public static CheckFighting(tip = true): boolean {
        if (GameGlobal.UserFb.IsFighting()) {
            if (tip) {
                UserTips.ErrorTip('副本战斗中...');
            }
            return false
        }
        return true
    }

    public static FinishAndCheckFighting(tip = true): boolean {
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
            GameGlobal.RaidMgr.FinishRewardChapterBattle()
            return true
        } else {
            return this.CheckFighting(tip)
        }
    }

    public static FinishAndCheckFighting2(tip = true): boolean {
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
            GameGlobal.RaidMgr.FinishRewardChapterBattle()
            return true
        } else {
            return this.CheckActMap(tip)
        }
    }

    public static CheckActMap(tip = true) {
        if (!this.CheckFighting(tip)) {
            return false
        }
        if (GameGlobal.UserFb.IsActMap()) {
            if (tip) {
                UserTips.ErrorTip('活动副本中...');
            }
            return false
        }
        return true
    }
   
    /**是否副本场景战斗 */
    public IsFighting(): boolean {
        return BattleMap.mFbId > 0 && BattleMap.mFbType > 0
    }

    /** 是否在活动场景 */
    public IsActMap(): boolean {
        return GameMap.fbType > 0 
    }

    public get chapterId() {
        return this.config.chapterid
    }

    public get chapterRewardList() {
        return this.config.chapterreward
    }

    public get nextMap() {
        if (this.config) {
            return this.config.nextmap
        }
        return false
    }

    public gainChapterReward(chapterId) {
        let req = new Sproto.cs_raid_get_chapter_reward_request()
        req.id = chapterId
        this.Rpc(C2sProtocol.cs_raid_get_chapter_reward, req, this.doGainChapterReward, this)
    }

    public doGainChapterReward(data: Sproto.cs_raid_get_chapter_reward_response) {
        let ret = data.ret
    }

    //BOSS 红点提示 
    public IsPersonBossNotice() {
        let list = this.getPersonBoss()
        for (let bossData of list) 
        {
            if (GameGlobal.actorModel.level >= bossData.levelLimit)
            {   
                let config = GameGlobal.Config.DailyFubenConfig[bossData.fbID]
                if (config.freeCount + bossData.vipBuyCount - bossData.useCount > 0)
                    return true
            }
        }

        return false
    }

    //材料副本 红点提示
    public IsCailiaoNotice() {
        for (let key in this.fbModel)
        {
            let fubenData = this.fbModel[key]
            let config = GameGlobal.Config.DailyFubenConfig[fubenData.fbID]
            if (GameGlobal.actorModel.level >= config.levelLimit && config.freeCount > fubenData.useCount)
            {
                return true
            }
        }

        return false
    }

    //勇闯天庭 红点提示
    public IsTianshilianNotice() {
        if (!this.tFbTiantingServerData)
        {
            return false
        }
        
        return this.tFbTiantingServerData.todayLayer < this.tFbTiantingServerData.layer
    }

    public mRedPoint: FbModelRedPoint

	public IsRedPointFB(type: number) {
		return this.mRedPoint.IsRedAct(type)
	}

	public IsRedPoint() {
		this.mRedPoint.Get(FbModelRedPoint.INDEX_ACT)
		return this.mRedPoint.IsRedPoint()
	}

    /** 关卡boss*/
    public static FB_TYPE_GUANQIABOSS = 1;
    /** 个人boss*/
    public static FB_TYPE_PERSONAL_BOSS = 2;
    /** 全民boss*/
    public static FB_TYPE_PUBLIC_BOSS = 3;
    /** 野外boss*/
    public static FB_TYPE_FIELD_BOSS = 4;
    /**生死劫 */
    public static FB_TYPE_LIFE_DEATH_PLUNDER = 5;
    /**材料副本*/
    public static FB_TYPE_MATERIAL = 6
    /**藏宝图*/
    public static FB_TYPE_TREASURE = 7
    /**玲珑塔*/
    public static FB_TYPE_TOWER = 8
    /**勇闯天庭 */
    public static FB_TYPE_TOWER2 = 9
    /**竞技场 */
    public static FB_TYPE_ARENA = 10
    /** 跨服组队 */
    public static FB_TYPE_CROSSTEAMFB = 11
    /** 帮会怪物 */
    public static FB_TYPE_GUILDSPRITE = 12
    /** 帮会副本 */
    public static FB_TYPE_GUILDFB = 13
    /** 护送 */
    public static FB_TYPE_ESCORT = 14
    /** 行会boss */
    public static FB_TYPE_GANG_BOSS = 15;
    /**至尊boss*/
    public static FB_TYPE_VIP_BOSS = 16;
    /**跨服争霸攻城*/
    public static FB_TYPE_KING_CITY = 17;
    /**跨服争霸自由PK*/
    public static FB_TYPE_KING_PK = 18;
    /**帮会矿山争夺*/
    public static FB_TYPE_GANGMINE = 19;
    //跨服boss
    public static KF_BOSS = 20;
    /** 帮会战*/
    public static FB_TYPE_GUILD_WAR = 21
    /** 帮会战PK*/
    public static FB_TYPE_GUILD_WAR_PK = 22
    /**九重天*/
    public static FB_TYPE_CLOUD_NINE = 25
    /** 仙道会*/
    public static FB_TYPE_XIANDAO = 26;
    /**师门 */
    public static FB_TYPE_FOMALHAUT=27;
    /**帮会地图 */
    public static FB_TYPE_GANGMAP = 29;
    /**主城地图 */
    public static FB_TYPE_MAINMAP = 30;
    /**目标活动战宠副本 */
    public static FB_TYPE_ACTIVITY_PET_FIGHT = 31;
    public static FB_TYPE_LADDER = 32;

    /** 捕捉宠物 */
    public static FB_TYPE_CATCH_PET = 9998
}