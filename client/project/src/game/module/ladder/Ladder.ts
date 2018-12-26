class Ladder extends BaseSystem {

	/**是否可以领取奖励 */
	isCanReward = false;
	upgrade = 1
	upstar = 0
	upWin = 0;

	/**已购买次数 */
	todayBuyTime = 0;
	mWinnerRecords: Sproto.sc_ladder_winner_info_request

	/**排行榜信息 */
	public mRankList: Sproto.rank_data_ladder[] = []
	public upRankList: Sproto.rank_data_ladder[] = []

	/**是否第一次打开购买窗口 */
	isTipsFlag: boolean = false;

	rank: number = 0
	upWeekRank: number = 0
	canJoin: boolean = false
	isOpen: boolean = false
	grade: number = 1		// 段位
	star: number = 0		// 星级
	challgeNum: number = 0
	// 净胜场
	winNum: number = 0
	lianWin: boolean = false
	playUpTime: boolean

	private mCodePlayerInfo: Sproto.sc_ladder_player_back_request

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_ladder_info, this.doLadderInfo);
		this.regNetMsg(S2cProtocol.sc_ladder_player_back, this._DoPlayerBack);
		this.regNetMsg(S2cProtocol.sc_ladder_result, this.doPlayResule);
		this.regNetMsg(S2cProtocol.sc_ladder_rank_list, this.doRankInfoList);
		this.regNetMsg(S2cProtocol.sc_ladder_buy_count, this.doChallageNum);
		this.regNetMsg(S2cProtocol.sc_ladder_winner_info, this.doWinnerRecords);
	}

	public ClearActorInfo() {
		this.mCodePlayerInfo = null
	}

	/**根据索引获取数据 */
	getActorInfo(): Sproto.sc_ladder_player_back_request {
		return this.mCodePlayerInfo
	}

	/**请求匹配玩家 */
	sendGetSomeOne() {
		let req = new Sproto.cs_ladder_get_some_one_request
		req.ladderType = this.GetLadderType()
		this.Rpc(C2sProtocol.cs_ladder_get_some_one, req)
	}

	/**开始挑战 */
	sendStarPlay(id: number, type) {
		let rep = new Sproto.cs_ladder_start_play_request
		rep.ladderType = this.GetLadderType()
		rep.type = type
		this.Rpc(C2sProtocol.cs_ladder_start_play, rep)
	}

	/**领取上周奖励 */
	sendGetWeekReward() {
		let req = new Sproto.cs_ladder_get_week_reward_request
		req.ladderType = this.GetLadderType()
		this.Rpc(C2sProtocol.cs_ladder_get_week_reward, req)
		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_PRE_WEEK_REWARD)

	}

	/**获取排行榜数据 */
	sendGetRankInfo() {
		let req = new Sproto.cs_ladder_get_rank_info_request
		req.ladderType = this.GetLadderType()
		this.Rpc(C2sProtocol.cs_ladder_get_rank_info, req)
	}

	public SendInitInfo() {
		if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
			return
		}
		this.Rpc(C2sProtocol.cs_ladder_info)
		this.SendGetWinnerInfo()
	}

	public SendGetInitInfo() {
		if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
			return
		}
		this.Rpc(C2sProtocol.cs_ladder_info)
	}

	public SendGetWinnerInfo() {
		this.Rpc(C2sProtocol.cs_ladder_get_winner_info)
	}

	public SendWorship() {
		let req = new Sproto.cs_ladder_worship_request
		req.ladderType = this.GetLadderType()
		this.Rpc(C2sProtocol.cs_ladder_worship, req)
	}

	/**购买次数*/
	sendBuyChallgeTime() {
		let req = new Sproto.cs_ladder_buy_count_request
		req.ladderType = this.GetLadderType()
		this.Rpc(C2sProtocol.cs_ladder_buy_count, req)
	}

	/**论剑台相关信息*/
	doLadderInfo(bytes: Sproto.sc_ladder_info_request) {
		if (!this.IsSelfType(bytes)) {
			return
		}
		this.docodeInfo(bytes);
	}

	/**获取到论剑台天战对象*/
	private _DoPlayerBack(bytes: Sproto.sc_ladder_player_back_request) {
		if (!this.IsSelfType(bytes)) {
			return
		}
		this.doCodeplayerInfo(bytes);
		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_PLAYER_BACK)
	}

	/**论剑台挑战结果*/
	doPlayResule(bytes: Sproto.sc_ladder_result_request) {
		if (!this.IsSelfType(bytes)) {
			return
		}
		this.doPlayResult(bytes);
	}

	/**获取排行榜列表*/
	doRankInfoList(bytes: Sproto.sc_ladder_rank_list_request) {
		if (!this.IsSelfType(bytes)) {
			return
		}

		this.rank = bytes.rank
		this.upWeekRank = bytes.upWeekRank

		this.mRankList = bytes.rankData || []
		for (let i = 0; i < this.mRankList.length; ++i) {
			(this.mRankList[i] as any).pos = i + 1
		}

		this.upRankList = bytes.upWeekRankList

		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_UPWEEK_RANK_UPDATE)
	}

	private doWinnerRecords(rsp: Sproto.sc_ladder_winner_info_request) {
		this.mWinnerRecords = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_WINNER)
	}

	/**获取已购买次数*/
	doChallageNum(bytes: Sproto.sc_ladder_buy_count_request) {
		if (!this.IsSelfType(bytes)) {
			return
		}
		this.todayBuyTime = bytes.todayBuyTime
	}

	// 获取剩余时间
	private nextTime = 0

	public get NextTime() {
		return this.nextTime;
	}

	/** 论剑台数据*/
	private docodeInfo(bytes: Sproto.sc_ladder_info_request) {
		this.canJoin = bytes.canJoin
		this.isOpen = bytes.isOpen
		this.grade = bytes.grade
		this.star = bytes.star
		this.challgeNum = bytes.challgeNum
		this.nextTime = bytes.challgeCd
		this.winNum = bytes.winNum
		this.lianWin = bytes.lianWin
		this.playUpTime = bytes.playUpTime
		this.upWeekRank = bytes.rank
		if (this.playUpTime) {
			this.isCanReward = bytes.isCanReward
			this.upgrade = bytes.upgrade
			this.upstar = bytes.upstar
			this.upWin = bytes.upWin
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.LADDER_CHANGE)
	}

	private doCodeplayerInfo(bytes: Sproto.sc_ladder_player_back_request) {
		this.mCodePlayerInfo = bytes
	}

	/**挑战结果*/
	private doPlayResult(bytes: Sproto.sc_ladder_result_request) {
		var isWin = bytes.isWin
		var num = bytes.rewardData.length
		var list: RewardData[] = [];
		for (var i = 0; i < num; i++) {
			let item = new RewardData();
			item.parser(bytes.rewardData[i]);
			list.push(item);
		}
		var upGrade = this.grade
		var upStar = this.star

		this.grade = bytes.grade
		this.star = bytes.star

		let raid = GameGlobal.RaidMgr.mBattleRaid
		if (raid) {
			let finishAction = new LadderFinishData
			finishAction.isWin = isWin
			finishAction.list = list
			finishAction.upGrade = upGrade
			finishAction.upStar = upStar
			finishAction.changeStar = bytes.increasestar
			raid.SetFinishAction(finishAction)
		}
	}

	public IsRedPoint(): boolean {
		if (!Deblocking.IsDeblocking(GameGlobal.Config.KingSportsBaseConfig.openid)) {
			return false
		}
		if (this.isCanReward) {
			return true
		}
		if (this.mWinnerRecords) {
			if (!this.mWinnerRecords.worship) {
				return true
			}
		}
		if (!this.canJoin) {
			return false
		}
		if (this.isOpen && this.challgeNum > 0) {
			return true
		}
		return false
	}

    /**
     * 获取段位配置
     */
	GetSelfLevelConfig() {
		return this.GetLevelConfig(this.grade)
	}

	GetSelfUpLevelConfig() {
		return this.GetLevelConfig(this.upgrade)
	}

	GetLevelConfig(grade: number) {
		return GameGlobal.Config.KingSportsConfig[grade]
	}

	getZhongwenNumber(i) {
		return TextFlowMaker.getCStr(i)
	}

	checkRedShow() {
		if ((this.challgeNum > 0 && this.isOpen) || this.isCanReward) {
			return 1;
		}
		return 0;
	}

	public static GetStatuByLevel(level) {
		var str;
		switch (level) {
			case 1: str = 3; break;
			case 2: str = 4; break;
			case 3: str = 5; break;
			case 4: str = 0; break;
			default: str = 0; break
		}
		return str;
	};

	public static GetRankByLevel(level) {
		var rak;
		switch (level) {
			case 1: rak = "一"; break;
			case 2: rak = "二"; break;
			case 3: rak = "三"; break;
			case 4: rak = "四"; break;
			default: rak = "〇"; break
		}
		return rak;
	};

	protected IsSelfType(rsp): boolean {
		// return (rsp.ladderType || 0) == this.GetLadderType()
		return true
	}

	/** 奖励表 */
	protected GetAwardConfig() {
		return GlobalConfig.ins().DWKingSportsConfig
	}

	// 跨服
	public GetLadderType() {
		return 1
	}
}