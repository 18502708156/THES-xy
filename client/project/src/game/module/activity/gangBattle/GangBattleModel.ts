class GangBattleModel extends BaseSystem {

	public static ACTIVE_TYPE_GATE = 0
	public static ACTIVE_TYPE_OUTSIDER = 1
	public static ACTIVE_TYPE_DRAGON = 2
	public static ACTIVE_TYPE_TEMPLE = 3

	private mActiveOpenFlag: boolean

	private mMyGBattleInfo: MyGangBattleInfo
	private mGBPlayerGlobalInfo: GBattlePlayerGlobalInfo
	private mGBGangGlobalInfo: GBattleGangGlobalInfo
	private mBossInfo: GangBattleBossInfo
	private mKingInfoMap: { [key: number]: GangBattleKingInfo } = {}
	private mGuardsInfo: GuardsInfo
	private mGRanksInfo: GangRanksInfo
	private mGBPlayerRanksInfo: GBattlePlayerRanksInfo

	public mChampionInfo: Sproto.guildwar_guild_info
	public mJoinInfos: Sproto.guildwar_guild_info[]
	public mEnterDragonInfo: Sproto.sc_guildwar_enter_dragon_guild_request
	public mGuardShowTime: number

	public constructor() {
		super()

		this.mMyGBattleInfo = new MyGangBattleInfo
		this.mGBPlayerGlobalInfo = new GBattlePlayerGlobalInfo
		this.mGBGangGlobalInfo = new GBattleGangGlobalInfo
		this.mBossInfo = new GangBattleBossInfo
		this.mGuardsInfo = new GuardsInfo
		this.mGRanksInfo = new GangRanksInfo
		this.mGBPlayerRanksInfo = new GBattlePlayerRanksInfo

		this.regNetMsg(S2cProtocol.sc_guildwar_player_info, this._DoPlayerInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_guild_info, this._DoGangInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_boss_info, this._DoBossInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_barrier_info, this._DoGateInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_four_king_info, this._DoKingInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_guard_info, this._DoGuardInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_guild_rank, this._DoGuildRankInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_player_global_info, this._DoPlayerGlobalInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_player_rank, this._DoPlayerRank)
		this.regNetMsg(S2cProtocol.sc_guildwar_all_guild_rank_info, this._DoAllGangRankInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_all_player_rank_info, this._DoAllPlayerRank)
		this.regNetMsg(S2cProtocol.sc_guildwar_myguild_global_info, this._DoMyGangGlobalInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_enter_war_guild, this._DoBeforeEnterInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_enter_dragon_guild, this._DoEnterDragonInfo)
		this.regNetMsg(S2cProtocol.sc_guildwar_ultimate_attack, this._DoDragonGuardShowTime)
		this.regNetMsg(S2cProtocol.sc_guildwar_report, this.getEndAwardPanelData);

	}

	public Init() {

	}

	private _DoPlayerInfo(rsp: Sproto.sc_guildwar_player_info_request) {
		this.mMyGBattleInfo.UpdateInfo(rsp)
		this.EnterMapScence()
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO)
	}

	private _DoGangInfo(rsp: Sproto.sc_guildwar_guild_info_request) {
		this.mMyGBattleInfo.UpdateGangInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO)
	}

	private _DoBossInfo(rsp: Sproto.sc_guildwar_boss_info_request) {
		this.mBossInfo.UpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_BOSSINFO)
	}

	private _DoGateInfo(rsp: Sproto.sc_guildwar_barrier_info_request) {
		this.mMyGBattleInfo.UpdateGateInfo(rsp)
	}

	private _DoKingInfo(rsp: Sproto.sc_guildwar_four_king_info_request) {
		for (let kingInfo of rsp.bossinfos) {
			let gbKingInfo = this.mKingInfoMap[kingInfo.bossid]
			if (!gbKingInfo) {
				gbKingInfo = new GangBattleKingInfo
				this.mKingInfoMap[kingInfo.bossid] = gbKingInfo
			}

			gbKingInfo.UpdateInfo(kingInfo)
		}

		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_KINGINFO)
	}

	private _DoGuardInfo(rsp: Sproto.sc_guildwar_guard_info_request) {
		this.mGuardsInfo.UpdataInfo(rsp)
	}

	private _DoGuildRankInfo(rsp: Sproto.sc_guildwar_guild_rank_request) {
		this.mGRanksInfo.UpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_GANGRANK)
	}

	private _DoPlayerGlobalInfo(rsp: Sproto.sc_guildwar_player_global_info_request) {
		this.mGBPlayerGlobalInfo.UpdateInfo(rsp)
		GangBattleConst.level = rsp.worldlevel
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_DURATION)
	}

	private _DoPlayerRank(rsp: Sproto.sc_guildwar_player_rank_request) {
		this.mGBPlayerRanksInfo.UpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_PLAYERRANK)
	}

	private _DoAllGangRankInfo(rsp: Sproto.sc_guildwar_all_guild_rank_info_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_ALLGANGRANK, rsp.rankinfos)
	}

	private _DoAllPlayerRank(rsp: Sproto.sc_guildwar_all_player_rank_info_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_ALLPLAYERRANK, rsp)
	}

	private _DoMyGangGlobalInfo(rsp: Sproto.sc_guildwar_myguild_global_info_request) {
		this.mGBGangGlobalInfo.UnpdateInfo(rsp)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_UPDATE_MYINFO)
	}

	private _DoBeforeEnterInfo(rsp: Sproto.sc_guildwar_enter_war_guild_request) {
		this.mChampionInfo = rsp.championGuild
		this.mJoinInfos = rsp.guildinfos
	}

	private _DoEnterDragonInfo(rsp: Sproto.sc_guildwar_enter_dragon_guild_request) {
		this.mEnterDragonInfo = rsp
	}

	private _DoDragonGuardShowTime(rsp: Sproto.sc_guildwar_ultimate_attack_request) {
		this.mGuardShowTime = rsp.countdown
		GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_SHOW_GUARDTIP)
	}

	public SendEnterBattle() {
		let req = new Sproto.cs_guildwar_enter_request

		this.Rpc(C2sProtocol.cs_guildwar_enter, req, (rsp: Sproto.cs_guildwar_enter_response) => {
			if (rsp.ret) {
				this.mActiveOpenFlag = true
				GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW)
				if (this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_GATE) {
					ViewManager.ins().open(GBattleMainWin)
				}
			}
			else {
				this.mActiveOpenFlag = false
				GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW)
				ViewManager.ins().open(GBattleMainWin)
			}
		}, this)
	}

	public SendAttackBoss(bossId) {
		let req = new Sproto.cs_guildwar_attack_boss_request
		req.bossid = bossId
		this.Rpc(C2sProtocol.cs_guildwar_attack_boss, req)
	}

	public SendEnterNext() {
		let req = new Sproto.cs_guildwar_next_barrier_request
		this.Rpc(C2sProtocol.cs_guildwar_next_barrier, req, (rsp: Sproto.cs_guildwar_next_barrier_response) => {
			if (!rsp.ret)
				return

			GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_OPEN_GATEVIEW)
			GameGlobal.MessageCenter.dispatch(MessageDef.GANGBATTLE_ENTER_NEXT_GATE)
		}, this)
	}

	public SendReturnPrev() {
		let req = new Sproto.cs_guildwar_last_barrier_request
		this.Rpc(C2sProtocol.cs_guildwar_last_barrier, req, (rsp: Sproto.cs_guildwar_last_barrier_response) => {
			if (rsp.ret) {

			}
		}, this)
	}

	public SendAttackPlayer(id) {
		let req = new Sproto.cs_guildwar_attack_player_request
		req.targetid = id

		this.Rpc(C2sProtocol.cs_guildwar_attack_player, req, (rsp: Sproto.cs_guildwar_attack_player_response) => {
			if (rsp.ret == 1) //同帮玩家
			{
				UserTips.ins().showTips("同帮玩家不可相互攻击")
				return
			}
			else if (rsp.ret == 2) //玩家等待复活
			{
				UserTips.ins().showTips("不可攻击复活中的玩家")
				return
			}
			else if (rsp.ret == 3) //目标不是队长
			{
				UserTips.ins().showTips("目标不是队长")
				return
			}
		}, this)
	}

	public SendClearRebornCD() {
		let req = new Sproto.cs_guildwar_clear_reborncd_request

		this.Rpc(C2sProtocol.cs_guildwar_clear_reborncd, req, (rsp: Sproto.cs_guildwar_clear_reborncd_response) => {
			if (rsp.ret) {

			}
		}, this)
	}

	public SendAllGangRank() {
		let req = new Sproto.cs_guildwar_all_guild_rank_info_request
		this.Rpc(C2sProtocol.cs_guildwar_all_guild_rank_info, req)
	}

	public SendAllPlayerRank() {
		let req = new Sproto.cs_guildwar_all_player_rank_info_request
		this.Rpc(C2sProtocol.cs_guildwar_all_player_rank_info, req)
	}

	public SendExitGBattle() {
		let req = new Sproto.cs_guildwar_exit_barrier_request
		this.Rpc(C2sProtocol.cs_guildwar_exit_barrier, req)
	}

	public SendGainScoreAward(id) {
		let req = new Sproto.cs_guildwar_get_score_reward_request
		req.rewardid = id

		this.Rpc(C2sProtocol.cs_guildwar_get_score_reward, req)
	}

	public get bossInfo() {
		return this.mBossInfo
	}

	public get myGBattleInfo() {
		return this.mMyGBattleInfo
	}

	public get guardsInfo() {
		return this.mGuardsInfo
	}

	public get gRanksInfo() {
		return this.mGRanksInfo
	}

	public get gbPlayerGlobalInfo() {
		return this.mGBPlayerGlobalInfo
	}

	public get gbGangGlobalInfo() {
		return this.mGBGangGlobalInfo
	}

	public get gbPlayerRanksInfo() {
		return this.mGBPlayerRanksInfo
	}

	public IsActive() {
		return this.mActiveOpenFlag
	}

	public IsBroken(gateType) {
		if (gateType == GangBattleModel.ACTIVE_TYPE_DRAGON) {
			return this.mEnterDragonInfo && this.mEnterDragonInfo.guildinfos != null
		}

		return this.mMyGBattleInfo.mGateId == gateType && this.mMyGBattleInfo.mBrokenFlag
	}

	public CanAttack() {
		return GameServer.serverTime >= this.mMyGBattleInfo.mAttackTime
	}

	public IsKingAlive(bossId) {
		let gbKingInfo = this.mKingInfoMap[bossId]
		if (!gbKingInfo)
			return true

		return gbKingInfo.mRebornTime <= GameServer.serverTime
	}

	public GetKingRebornDiffTime(bossId) {
		let gbKingInfo = this.mKingInfoMap[bossId]
		if (!gbKingInfo)
			return 0

		return Math.max(gbKingInfo.mRebornTime - GameServer.serverTime, 0)
	}

	public GetKingRebornTime(bossId) {
		let gbKingInfo = this.mKingInfoMap[bossId]
		if (!gbKingInfo)
			return 0

		return gbKingInfo.mRebornTime
	}

	public GetRebornTime() {
		return this.mGBPlayerGlobalInfo.mRebornTime - GameServer.serverTime
	}

	public GetNextScoreConfig() {
		if (!this.mGBPlayerGlobalInfo.mScoreReward) {
			return
		}

		let scoreList = GangBattleConst.GetScoreList()
		for (let config of scoreList) {
			if ((this.mGBPlayerGlobalInfo.mScoreReward & Math.pow(2, config.id - 1)) > 0) {
				return config
			}
		}
	}

	public HasScoreRewardGain(rewardId) {
		if (!this.mGBPlayerGlobalInfo.mScoreReward) {
			return false
		}

		return (this.mGBPlayerGlobalInfo.mScoreReward & Math.pow(2, rewardId - 1)) == 0
	}

	public CanScoreRewardGain(rewardId) {
		let config = GangBattleConst.GetScoreConfig(rewardId)
		if (!config) {
			return false
		}

		let curScore = this.mGBPlayerGlobalInfo.mScore
		return curScore >= config.needpoints
	}

	public NeedJumpToOutsider() {
		return this.mMyGBattleInfo.mGateId != GangBattleModel.ACTIVE_TYPE_GATE
	}

	public GetActiveEndTime(): number {
		return this.mGBPlayerGlobalInfo.mEndTime || 0
	}

	public IsInOutsideScience() {
		return this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_OUTSIDER
	}

	public EnterMapScence() {
		if (BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR || BattleMap.mFbType == UserFb.FB_TYPE_GUILD_WAR_PK)
			return

		if (this.mMyGBattleInfo.mGateId == GangBattleModel.ACTIVE_TYPE_GATE)
			return

		let mapId
		switch (this.mMyGBattleInfo.mGateId) {
			case GangBattleModel.ACTIVE_TYPE_OUTSIDER:
				mapId = GameGlobal.Config.GuildBattleBaseConfig.t_mapid
				break
			case GangBattleModel.ACTIVE_TYPE_DRAGON:
				mapId = GameGlobal.Config.GuildBattleBaseConfig.s_mapid
				break
			case GangBattleModel.ACTIVE_TYPE_TEMPLE:
				mapId = GameGlobal.Config.GuildBattleBaseConfig.l_mapid
				break
		}

		if (!GameGlobal.CommonRaidModel.IsInCurMap(mapId))
			GameGlobal.CommonRaidModel._MapGo(mapId)
	}

	public getEndAwardPanelData(rep: Sproto.sc_guildwar_report_request) {
		if (rep) {
			let data = new activityEndAwardData()
			data.award = rep.rewards;
			data.auction = rep.auctionrewards;
			data.paneltitle = "帮会战";
			data.rankTxt = `我的帮会排名：第${rep.guilddetail.rank}名`

			let icon1Date = { titleName: "", name: "", iconSrc: "", iconBgSrc: "", banghuiTxt: "" };
			icon1Date.titleName = "本次帮会胜方";
			icon1Date.name = `${rep.sharedata.victory}(s${rep.sharedata.serverid}服)`;
			icon1Date.iconSrc = "ui_bh_bm_qizi"
			icon1Date.banghuiTxt = icon1Date.name.charAt(0)

			data.icon1 = icon1Date;
			ViewManager.ins().open(ActivityEndAwardPanel, data);
		}
	}
}
