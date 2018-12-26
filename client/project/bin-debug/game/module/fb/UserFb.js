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
var UserFb = (function (_super) {
    __extends(UserFb, _super);
    function UserFb() {
        var _this = _super.call(this) || this;
        /** 日常副本数据 FbModel Dictionary */
        _this.fbModel = {};
        // fbKindData: { [kind: number]: FbKindModel } = {};
        // static readonly KIND_FB_NAME = [null, '宝石副本', '经脉副本', '青龙副本', '白虎副本', '门客副本', '侍女副本', '神剑副本']
        _this.bossIndex = 0;
        /**关卡数据 */
        /** 关卡id */
        _this._guanqiaID = -1;
        /** 当前波的掉落物 */
        // rewards: Sproto.wave_drop_data[] = [];
        //----------关卡数据
        _this.waveCD = 0;
        /** 章节关卡奖励领取状态 */
        _this.guanqiaReward = 1;
        /** 世界关卡领取奖励状态 */
        _this.worldReward = 1;
        /** 世界关卡 - 可领取奖励关卡 */
        _this.worldGuanQias = [];
        /** 当前排行榜类型 */
        _this.rankType = 0;
        //关卡协助内容
        _this.appealtime = 0;
        _this.helptime = 0;
        _this.mAuto = false;
        _this.tFbCbtGetReward = []; //藏宝图副本领取奖励条件
        _this.bCbtCanSwap = true; //藏宝图副本是否可以扫荡
        _this.bCbtAutoFight = false; //藏宝图副本是否可以自动战斗
        _this.bCbtAcross = false; //藏宝图副本当前关卡是否已经通关
        _this.bLingLongTaAuto = false;
        _this.bTianTingAutoFight = false; //勇闯天庭副本是否可以自动战斗
        _this.m_KillMonsterCount = 0;
        /** 获取当前波的掉落物（列表最后一个开始） */
        // public getRewardsPop() {
        //     return this.rewards.pop();
        // }
        //------------------------------------------------------------------------关卡相关
        _this.lastData = {};
        _this.mRedPoint = new FbModelRedPoint();
        //关卡相关
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_init_info, _this.doGuanqiaInfo);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_wave_data, _this.doWaveData);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_reward, _this.doGuanqiaReward);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_world_reward, _this.doGuanqiaWroldReward);
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_offline_reward, _this.doOfflineReward);
        //材料副本
        //关卡协助内容
        _this.regNetMsg(S2cProtocol.sc_raid_chapter_collaborate, _this.raidChapterCollaborate);
        // raidChapterCollaborate(rsp: Sproto.sc_raid_chapter_collaborate_request) {
        //藏宝图
        _this.regNetMsg(S2cProtocol.sc_fuben_treasuremap_info, _this.doCangbaotu);
        //藏宝图获得数据更新
        _this.regNetMsg(S2cProtocol.sc_fuben_treasuremap_star_reward, _this.doCangbaoGetReward);
        _this.regNetMsg(S2cProtocol.sc_fuben_material_info, _this.doMaterialInfo);
        //勇闯天庭
        _this.regNetMsg(S2cProtocol.sc_fuben_heavenFb_info, _this.doTianting);
        //勇闯天庭 领取奖励数据更新
        _this.regNetMsg(S2cProtocol.sc_fuben_heavenFb_reward, _this.doUpdaeTianting);
        //玲珑宝塔
        _this.regNetMsg(S2cProtocol.sc_fuben_wildgeeseFb_info, _this.doLinglongTaInfo);
        return _this;
    }
    Object.defineProperty(UserFb.prototype, "Desc", {
        get: function () {
            var str = "";
            if (this.config && this.config.desc)
                str = this.config.desc;
            return str;
        },
        enumerable: true,
        configurable: true
    });
    UserFb.prototype.doLinglongTaInfo = function (rsp) {
        if (!this.lltModel) {
            this.lltModel = new LingLongTaModel();
        }
        this.lltModel.parser(rsp.hard, rsp.layer);
        MessageCenter.ins().dispatch(MessageDef.TA_INFO_UPDATE);
    };
    UserFb.prototype.GetLinglongLayer = function () {
        if (this.lltModel) {
            return this.lltModel.layer;
        }
        return 0;
    };
    UserFb.prototype.Init = function () {
        this.m_personBossArr = [];
        var config = GameGlobal.Config.DailyFubenConfig;
        for (var key in config) {
            var data = config[key];
            if (data.kind) {
                var fbModel = new FbModel();
                fbModel.fbID = data.id;
                fbModel.levelLimit = data.levelLimit;
                this.fbModel[fbModel.fbID] = fbModel;
            }
            else {
                var fbModel = new FbModel();
                fbModel.fbID = data.id;
                fbModel.levelLimit = data.levelLimit;
                // this.fbModel[fbModel.fbID] = fbModel;
                this.m_personBossArr.push(fbModel);
            }
        }
        SortTools.sortMap(this.m_personBossArr, 'fbID', true);
        //藏宝图
        // 
        this.tFbCbtData = [];
        var tCbtConfig = GameGlobal.Config.TreasureMapConfig;
        for (var item in tCbtConfig) {
            var data = tCbtConfig[item];
            var fbCbt = new FbcbtData();
            var pExData = this.getFbExData(data.fbId);
            fbCbt.initLocalData(data, pExData);
            this.tFbCbtData.push(fbCbt);
        }
        //天庭副本 HeavenFbConfig
        this.tFbTiantingData = [];
        var tTiantingCinfig = GameGlobal.Config.HeavenFbConfig;
        for (var item in tTiantingCinfig) {
            var pTianting = new FbTiantingData();
            pTianting.initLocalData(tTiantingCinfig[item]);
            this.tFbTiantingData.push(pTianting);
        }
    };
    UserFb.prototype.getPersonBoss = function () {
        return this.m_personBossArr;
    };
    //根据副本id获取副本信息 _fbId
    UserFb.prototype.getFbExData = function (_fbId) {
        var pData = { name: "", desc: "" }; //初始化
        var tConfig;
        tConfig = GameGlobal.Config.InstanceConfig;
        if (tConfig) {
            pData.name = tConfig[_fbId][GameGlobal.Config.InstanceConfig_keys.name];
            pData.desc = tConfig[_fbId][GameGlobal.Config.InstanceConfig_keys.desc];
        }
        return pData;
    };
    UserFb.prototype.getPersonBossById = function (id) {
        var i;
        var len = this.m_personBossArr.length;
        for (i = 0; i < len; i++) {
            if (this.m_personBossArr[i].fbID == id) {
                return this.m_personBossArr[i];
            }
        }
        return null;
    };
    UserFb.prototype.doMaterialInfo = function (rsp) {
        var i;
        var len = rsp.fuben_data ? rsp.fuben_data.length : 0;
        for (i = 0; i < len; i++) {
            var config = GameGlobal.Config.DailyFubenConfig[rsp.fuben_data[i].fubenNo];
            var fbModel = void 0;
            if (config.kind != 0) {
                fbModel = this.fbModel[rsp.fuben_data[i].fubenNo];
            }
            else {
                fbModel = this.getPersonBossById(rsp.fuben_data[i].fubenNo);
            }
            if (fbModel) {
                fbModel.parser(rsp.fuben_data[i].clearanceNum, rsp.fuben_data[i].todayNum, rsp.fuben_data[i].buyNum);
            }
        }
        MessageCenter.ins().dispatch(MessageDef.FB_INFO_UPDATE);
    };
    UserFb.prototype.doFbBossIndex = function (rsp) {
        this.bossIndex = rsp.mybossTop;
        MessageCenter.ins().dispatch(MessageDef.FB_COUNT_UPDATE);
    };
    //解析藏宝图
    UserFb.prototype.doCangbaotu = function (rsp) {
        //
        var tCbt = rsp;
        var bCanSwap = false;
        for (var item in this.tFbCbtData) {
            var pCbtData = this.tFbCbtData[item];
            for (var index in tCbt.data) {
                var pData = tCbt.data[index];
                if (!bCanSwap && pData.star > 0 && pData.todayNum == 0) {
                    bCanSwap = true;
                    this.bCbtCanSwap = true;
                }
                if (pData.fubenNo === pCbtData.id) {
                    pCbtData.updataDataByServer(pData); //更新服务端数据
                }
            }
            // if(pCbtData.fbId)
        }
        if (!bCanSwap) {
            this.bCbtCanSwap = false;
        }
        this.tFbCbtGetReward = tCbt.starReward; //#星级奖励是否领取了，这里用到了位运算【rewardNo & (2 ^ N)】不为0则表示已经领取了N为位置
        MessageCenter.ins().dispatch(MessageDef.FB_CBT_UPDATE);
    };
    //获取藏宝图奖励数据
    UserFb.prototype.doCangbaoGetReward = function (rsp) {
        this.tFbCbtGetReward = rsp.starReward; //#星级奖励是否领取了，这里用到了位运算【rewardNo & (2 ^ N)】不为0则表示已经领取了N为位置
        MessageCenter.ins().dispatch(MessageDef.FB_CBT_UPDATE_REWARD);
    };
    //获取藏宝图是否可以扫荡
    UserFb.prototype.getCbtCanSwap = function () {
        if (UserVip.ins().lv < GameGlobal.Config.TreasureMapBaseConfig.viplevel) {
            UserTips.ins().showTips("Vip" + GameGlobal.Config.TreasureMapBaseConfig.viplevel + "可扫荡");
        }
        return this.bCbtCanSwap;
    };
    //解析天庭副本数据
    UserFb.prototype.doTianting = function (rsp) {
        // rsp.todayLayer = 10
        // rsp.layer = 10
        this.tFbTiantingServerData = rsp;
        MessageCenter.ins().dispatch(MessageDef.FB_TIANTING_UPDATE);
    };
    //天庭副本奖励内容返回
    UserFb.prototype.doUpdaeTianting = function (rsp) {
        this.tFbTiantingServerData.rewardNo = rsp.rewardNo;
        MessageCenter.ins().dispatch(MessageDef.FB_TIANTING_UPDATE);
    };
    //获取天庭奖励副本奖励领取情况
    // index (读取第一位开始  2(10) 6(110) 14(1110) )
    UserFb.prototype.getTiantingStarReward = function (_index) {
        var bGet = false;
        for (var item in this.tFbTiantingServerData.rewardNo) {
            var num = this.tFbTiantingServerData.rewardNo[item];
            if (_index == num) {
                bGet = true;
                break;
            }
        }
        return bGet;
    };
    //获取奖励天庭列表
    UserFb.prototype.getTianTingRewardList = function () {
        var tRewardList = [];
        for (var item in this.tFbTiantingData) {
            if (this.tFbTiantingData[item].firstAward && this.tFbTiantingData[item].firstAward.length > 0) {
                tRewardList.push(this.tFbTiantingData[item].firstAward);
            }
        }
        return tRewardList;
    };
    //获取天庭副本数据
    UserFb.prototype.getTianTingLvData = function () {
        return this.tFbTiantingData;
    };
    //page(0位开始) index (读取第一位开始  2(10) 6(110) 14(1110) )
    UserFb.prototype.getCbtStarReward = function (_page, _index) {
        var bGet = false;
        for (var item in this.tFbCbtGetReward) {
            var data = this.tFbCbtGetReward[item];
            if (data.no === _page) {
                if ((data.reward & (1 << _index)) > 0) {
                    bGet = true;
                }
            }
        }
        return bGet;
    };
    // 是否全部领取
    UserFb.prototype.getCbtStarRewardPage = function (_page) {
        for (var item in this.tFbCbtGetReward) {
            var data = this.tFbCbtGetReward[item];
            if (data.no === _page && data.reward) {
                return data.reward;
            }
        }
        return 0;
    };
    //获取藏宝图分页数据
    UserFb.prototype.getCbtPageData = function () {
        var tPataData = {};
        for (var item in this.tFbCbtData) {
            var nPage = this.tFbCbtData[item].page;
            if (!tPataData[nPage]) {
                tPataData[nPage] = [];
            }
            if (nPage) {
                tPataData[nPage].push(this.tFbCbtData[item]); //根据标签插入
            }
        }
        return tPataData;
    };
    UserFb.prototype.CanHardCbt = function () {
        var can = true;
        for (var item in this.tFbCbtData) {
            var data = this.tFbCbtData[item];
            var nPage = data.page;
            if (nPage == 32) {
                if (data.star <= 0) {
                    can = false;
                    break;
                }
            }
        }
        return can;
    };
    /**
     * 发送请求召唤boss
     */
    UserFb.prototype.sendCallBossPlay = function (id) {
        var req = new Sproto.cs_raid_call_boss_play_request();
        req.id = id;
        this.Rpc(C2sProtocol.cs_raid_call_boss_play, req);
    };
    /**
     *  协助挑战
     */
    UserFb.prototype.raidAssistPkboss = function (chapterlevel, playerid) {
        var req = new Sproto.cs_raid_assist_pkboss_request();
        req.chapterlevel = chapterlevel;
        req.playerid = playerid;
        this.Rpc(C2sProtocol.cs_raid_assist_pkboss, req);
    };
    /**
     * 处理求助次数和协助次数
     */
    UserFb.prototype.raidChapterCollaborate = function (rsp) {
        this.appealtime = rsp.appealtime;
        this.helptime = rsp.helptime;
        MessageCenter.ins().dispatch(MessageDef.FUBEN_CHANGE);
    };
    /**进入副本
     *type #1材料副本,2藏宝图,3大雁塔,4勇闯天庭
     */
    UserFb.prototype.sendfbJoin = function (type, fbID) {
        if (fbID === void 0) { fbID = 0; }
        var req = new Sproto.cs_fuben_join_request();
        if (fbID) {
            req.fubenNo = fbID;
        }
        req.fubenType = type;
        this.Rpc(C2sProtocol.cs_fuben_join, req);
    };
    /**扫荡副本 */
    UserFb.prototype.sendfbSweep = function (type) {
        var req = new Sproto.cs_fuben_sweep_request();
        req.fubenType = type;
        this.Rpc(C2sProtocol.cs_fuben_sweep, req);
    };
    UserFb.prototype.sendfbHard = function () {
        var req = new Sproto.cs_fuben_wildgeeseFb_hard_request();
        this.Rpc(C2sProtocol.cs_fuben_sweep, req);
    };
    // mapNo		0 : integer #哪页
    // reward		1 : integer #第几个奖励(1,2,3)
    //领取藏宝图奖励
    UserFb.prototype.getCbtReward = function (mapNo, reward) {
        var req = new Sproto.cs_fuben_star_reward_request();
        req.mapNo = mapNo;
        req.reward = reward;
        this.Rpc(C2sProtocol.cs_fuben_star_reward, req);
    };
    //领取天庭奖励
    //fubenNo		0 : integer #哪个副本的
    UserFb.prototype.getTianTingReward = function (fubenNo) {
        var req = new Sproto.cs_fuben_heaven_reward_request();
        req.fubenNo = fubenNo;
        this.Rpc(C2sProtocol.cs_fuben_heaven_reward, req);
    };
    Object.defineProperty(UserFb.prototype, "guanqiaID", {
        ////////////////////////////////////////////////////////////  其他  ///////////////////////////////////
        get: function () {
            return this._guanqiaID;
        },
        set: function (value) {
            if (this._guanqiaID != value) {
                this._guanqiaID = value;
                this.bossIsChallenged = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 当前关卡宝箱是否可领取
     * @param	pass	关卡
     */
    UserFb.prototype.isReceiveBox = function (pass) {
        return this.worldGuanQias.indexOf(pass) == -1 ? false : true;
    };
    Object.defineProperty(UserFb.prototype, "killMonsterCount", {
        get: function () {
            return this.m_KillMonsterCount;
        },
        // private canFightBossStarTime:number
        set: function (value) {
            if (this.m_KillMonsterCount != value) {
                this.m_KillMonsterCount = value;
                GameGlobal.MessageCenter.dispatch(MessageDef.RAID_KILL_MONSTER_COUNT);
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
        },
        enumerable: true,
        configurable: true
    });
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
    UserFb.prototype.isShowBossPK = function () {
        if (this.guanqiaID == -1)
            return false;
        return this.m_KillMonsterCount >= this.config.bossNeedWave && BattleMap.mFbId == 0;
    };
    UserFb.prototype.getNeedWave = function () {
        if (this.guanqiaID == -1)
            return undefined;
        return Math.max(this.config.bossNeedWave - this.m_KillMonsterCount, 0);
    };
    UserFb.prototype.checkGuanKaMax = function () {
        return GlobalConfig.ins().ChaptersCommonConfig.maxNum;
    };
    /**
     * 处理关卡初始化信息
     */
    UserFb.prototype.doGuanqiaInfo = function (rsp) {
        var lastID = this.guanqiaID;
        if (this.config) {
            this.lastData.goldEff = this.config.goldEff;
            this.lastData.expEff = this.config.expEff;
        }
        this.guanqiaID = rsp.cid;
        this.killMonsterCount = rsp.killMonsterCount;
        this.config = rsp;
        // 暂时没有12之后的地图
        if (this.config && this.config.sid > 12) {
            this.config.sid = 12;
        }
        UserFb.MonDict = {};
        for (var _i = 0, _a = rsp.waveMonsterId; _i < _a.length; _i++) {
            var data_1 = _a[_i];
            UserFb.MonDict[data_1.id] = data_1;
        }
        var bossData = rsp.bossId;
        if (bossData) {
            UserFb.MonDict[bossData.configId] = {
                id: bossData.configId,
                name: bossData.name,
                level: bossData.level,
                avatar: bossData.avatar,
                talk: bossData.talk,
            };
        }
        if (lastID != -1 && this.guanqiaID != lastID) {
            GameGlobal.PlotModel.OnChapterExit(this.guanqiaID);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.GUANQIA_CHANGE);
        Deblocking.Update(Deblocking.CHECK_TYPE_01);
        var data = new GameMapData;
        data.fubenID = this.config.sid;
        // 挂机、捕捉、挑战boss
        var immediately = !BattleMap.mFbType || BattleMap.mFbType >= UserFb.FB_TYPE_CATCH_PET || BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS;
        GameGlobal.RaidMgr.EnterNewMapRaid(data, immediately);
        Main.Instance.ShowGame();
    };
    UserFb.prototype.sendWaveComplete = function () {
        var req = new Sproto.cs_raid_wave_complete_request;
        req.killCount = 0;
        this.Rpc(C2sProtocol.cs_raid_wave_complete, req);
    };
    UserFb.prototype.sendWaveMonster = function () {
        this.sendWaveComplete();
    };
    UserFb.prototype.CheckAutoPKBoss = function () {
        if (this.killMonsterCount >= this.config.bossNeedWave && this.mAuto && (!this.config.nextmap)) {
            // if (GameGlobal.RaidMgr.mShowType == RaidMgr.TYPE_CITY) {
            //     return false
            // }
            this.sendPKBoss();
            return true;
        }
        return false;
    };
    UserFb.prototype.CanPkBoss = function () {
        return this.killMonsterCount >= this.config.bossNeedWave;
    };
    UserFb.prototype.sendPKBoss = function () {
        this.bossIsChallenged = true;
        this.Rpc(C2sProtocol.cs_raid_pk_boss, new Sproto.cs_raid_pk_boss_request());
    };
    UserFb.prototype.sendSetAuto = function () {
        var req = new Sproto.cs_raid_open_auto_request();
        req.auto = this.mAuto;
        this.Rpc(C2sProtocol.cs_raid_open_auto, req);
    };
    UserFb.prototype.doWaveData = function (rsp) {
        this.killMonsterCount = rsp.wave;
    };
    /**
     * 退出副本
     */
    UserFb.prototype.sendExitFb = function () {
        this.Rpc(C2sProtocol.cs_raid_exit_raid, new Sproto.cs_raid_exit_raid_request());
    };
    /**
     * 发送领取关卡奖励
     */
    UserFb.prototype.sendGetAward = function () {
        this.Rpc(C2sProtocol.cs_raid_get_award, new Sproto.cs_raid_get_award_request());
    };
    /**
     * 处理关卡奖励领取状态
     */
    UserFb.prototype.doGuanqiaReward = function (rsp) {
        this.guanqiaReward = rsp.result;
        this.worldReward = this.getWroldGuanQianCount(this.guanqiaReward);
    };
    /**
     * 领取地区奖励
     */
    UserFb.prototype.senddoGuanqiaWroldReward = function (pass) {
        var data = new Sproto.cs_raid_get_world_award_request();
        data.pass = pass;
        this.Rpc(C2sProtocol.cs_raid_get_world_award, data);
    };
    /**
     * 地区奖励记录
     */
    UserFb.prototype.doGuanqiaWroldReward = function (rsp) {
        this.worldGuanQias = [];
        for (var i = 0; i < rsp.isReceive.length; ++i) {
            var isReceive = rsp.isReceive[i];
            if (isReceive == 0 && (i + 1) < this.worldReward) {
                this.worldGuanQias.push(i + 1);
            }
        }
    };
    /**
     * 处理离线奖励
     */
    UserFb.prototype.doOfflineReward = function (rsp) {
        // 如果现实欢迎界面，则不显示奖励界面
        if (ViewManager.ins().isShow(WelComeLandingPanel)) {
            return;
        }
        ViewManager.ins().open(OfflineRewardWin, rsp);
    };
    /** 获取 宝箱可领取奖励关卡 */
    UserFb.prototype.getWorldGuanQia = function () {
        if (this.worldGuanQias.length > 0)
            return this.worldGuanQias[this.worldGuanQias.length];
        else
            return 0;
    };
    ;
    /**
     * 根据章节关卡获取世界关卡
     * @param pass 章节关卡
     */
    UserFb.prototype.getWroldGuanQianCount = function (pass) {
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
    ;
    UserFb.prototype.GetWaveMonsterCount = function () {
        return this.config.bossNeedWave;
    };
    UserFb.CheckFighting = function (tip) {
        if (tip === void 0) { tip = true; }
        if (GameGlobal.UserFb.IsFighting()) {
            if (tip) {
                UserTips.ErrorTip('副本战斗中...');
            }
            return false;
        }
        return true;
    };
    UserFb.FinishAndCheckFighting = function (tip) {
        if (tip === void 0) { tip = true; }
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
            GameGlobal.RaidMgr.FinishRewardChapterBattle();
            return true;
        }
        else {
            return this.CheckFighting(tip);
        }
    };
    UserFb.FinishAndCheckFighting2 = function (tip) {
        if (tip === void 0) { tip = true; }
        if (BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
            GameGlobal.RaidMgr.FinishRewardChapterBattle();
            return true;
        }
        else {
            return this.CheckActMap(tip);
        }
    };
    UserFb.CheckActMap = function (tip) {
        if (tip === void 0) { tip = true; }
        if (!this.CheckFighting(tip)) {
            return false;
        }
        if (GameGlobal.UserFb.IsActMap()) {
            if (tip) {
                UserTips.ErrorTip('活动副本中...');
            }
            return false;
        }
        return true;
    };
    /**是否副本场景战斗 */
    UserFb.prototype.IsFighting = function () {
        return BattleMap.mFbId > 0 && BattleMap.mFbType > 0;
    };
    /** 是否在活动场景 */
    UserFb.prototype.IsActMap = function () {
        return GameMap.fbType > 0;
    };
    Object.defineProperty(UserFb.prototype, "chapterId", {
        get: function () {
            return this.config.chapterid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserFb.prototype, "chapterRewardList", {
        get: function () {
            return this.config.chapterreward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserFb.prototype, "nextMap", {
        get: function () {
            if (this.config) {
                return this.config.nextmap;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    UserFb.prototype.gainChapterReward = function (chapterId) {
        var req = new Sproto.cs_raid_get_chapter_reward_request();
        req.id = chapterId;
        this.Rpc(C2sProtocol.cs_raid_get_chapter_reward, req, this.doGainChapterReward, this);
    };
    UserFb.prototype.doGainChapterReward = function (data) {
        var ret = data.ret;
    };
    //BOSS 红点提示 
    UserFb.prototype.IsPersonBossNotice = function () {
        var list = this.getPersonBoss();
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var bossData = list_1[_i];
            if (GameGlobal.actorModel.level >= bossData.levelLimit) {
                var config = GameGlobal.Config.DailyFubenConfig[bossData.fbID];
                if (config.freeCount + bossData.vipBuyCount - bossData.useCount > 0)
                    return true;
            }
        }
        return false;
    };
    //材料副本 红点提示
    UserFb.prototype.IsCailiaoNotice = function () {
        for (var key in this.fbModel) {
            var fubenData = this.fbModel[key];
            var config = GameGlobal.Config.DailyFubenConfig[fubenData.fbID];
            if (GameGlobal.actorModel.level >= config.levelLimit && config.freeCount > fubenData.useCount) {
                return true;
            }
        }
        return false;
    };
    //勇闯天庭 红点提示
    UserFb.prototype.IsTianshilianNotice = function () {
        if (!this.tFbTiantingServerData) {
            return false;
        }
        return this.tFbTiantingServerData.todayLayer < this.tFbTiantingServerData.layer;
    };
    UserFb.prototype.IsRedPointFB = function (type) {
        return this.mRedPoint.IsRedAct(type);
    };
    UserFb.prototype.IsRedPoint = function () {
        this.mRedPoint.Get(FbModelRedPoint.INDEX_ACT);
        return this.mRedPoint.IsRedPoint();
    };
    UserFb.MonDict = {};
    /** 关卡boss*/
    UserFb.FB_TYPE_GUANQIABOSS = 1;
    /** 个人boss*/
    UserFb.FB_TYPE_PERSONAL_BOSS = 2;
    /** 全民boss*/
    UserFb.FB_TYPE_PUBLIC_BOSS = 3;
    /** 野外boss*/
    UserFb.FB_TYPE_FIELD_BOSS = 4;
    /**生死劫 */
    UserFb.FB_TYPE_LIFE_DEATH_PLUNDER = 5;
    /**材料副本*/
    UserFb.FB_TYPE_MATERIAL = 6;
    /**藏宝图*/
    UserFb.FB_TYPE_TREASURE = 7;
    /**玲珑塔*/
    UserFb.FB_TYPE_TOWER = 8;
    /**勇闯天庭 */
    UserFb.FB_TYPE_TOWER2 = 9;
    /**竞技场 */
    UserFb.FB_TYPE_ARENA = 10;
    /** 跨服组队 */
    UserFb.FB_TYPE_CROSSTEAMFB = 11;
    /** 帮会怪物 */
    UserFb.FB_TYPE_GUILDSPRITE = 12;
    /** 帮会副本 */
    UserFb.FB_TYPE_GUILDFB = 13;
    /** 护送 */
    UserFb.FB_TYPE_ESCORT = 14;
    /** 行会boss */
    UserFb.FB_TYPE_GANG_BOSS = 15;
    /**至尊boss*/
    UserFb.FB_TYPE_VIP_BOSS = 16;
    /**跨服争霸攻城*/
    UserFb.FB_TYPE_KING_CITY = 17;
    /**跨服争霸自由PK*/
    UserFb.FB_TYPE_KING_PK = 18;
    /**帮会矿山争夺*/
    UserFb.FB_TYPE_GANGMINE = 19;
    //跨服boss
    UserFb.KF_BOSS = 20;
    /** 帮会战*/
    UserFb.FB_TYPE_GUILD_WAR = 21;
    /** 帮会战PK*/
    UserFb.FB_TYPE_GUILD_WAR_PK = 22;
    /**九重天*/
    UserFb.FB_TYPE_CLOUD_NINE = 25;
    /** 仙道会*/
    UserFb.FB_TYPE_XIANDAO = 26;
    /**师门 */
    UserFb.FB_TYPE_FOMALHAUT = 27;
    /**帮会地图 */
    UserFb.FB_TYPE_GANGMAP = 29;
    /**主城地图 */
    UserFb.FB_TYPE_MAINMAP = 30;
    /**目标活动战宠副本 */
    UserFb.FB_TYPE_ACTIVITY_PET_FIGHT = 31;
    UserFb.FB_TYPE_LADDER = 32;
    /** 捕捉宠物 */
    UserFb.FB_TYPE_CATCH_PET = 9998;
    return UserFb;
}(BaseSystem));
__reflect(UserFb.prototype, "UserFb");
//# sourceMappingURL=UserFb.js.map