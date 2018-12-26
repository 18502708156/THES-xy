class Arena extends BaseSystem {

	//============================
	//===========配置数据==========
	//============================

	private static MON_LIST = [220004, 220003]

	/**获取机器人排名形象ID
	* @rank  名次
	*/
	public getRobotBodyByRank(rank): number {
		// let config = GameGlobal.Config.ArenaRobotConfig;
		// let monid = 0;
		// if (config[rank]) {
		// 	let monsters = config[rank].initmonsters;
		// 	let i = 0, len = monsters.length;
		// 	let obj;
		// 	for (i; i < len; i++) {
		// 		obj = monsters[i];
		// 		if (8 == obj.pos) {
		// 			monid = obj.monid;
		// 			break;
		// 		}
		// 	}
		// 	if (0 == monid) monid = monsters[0].monid;
		// }
		// return monid;
		return Arena.MON_LIST[MathUtils.limitInteger(0, Arena.MON_LIST.length - 1)] || 220004
	}

	/**获取排名奖励数据
	 * @rank  名次
	 */
	public getRankRewards(rank): any {
		let config = GameGlobal.Config.ArenaRankRewardConfig;
		let data;
		for (let id in config) {
			data = config[id];
			if (rank >= data.rankBegin && rank <= data.rankEnd) {
				return data.rankReward;
			}
		}
		return null;
	}

	/**获取自己VIP购买次数
	 */
	public getVipBuyCount(): number {
		let vip = GameGlobal.actorModel.vipLv;
		let config = GameGlobal.Config.ArenaVipConfig;
		if (config[vip]) {
			return config[vip].maxBuyTime;
		}
		return 0;
	}

	/**获取最多可购买次数 - 如果有VIP就取VIP的次数*/
	public getMaxBuyCount(): number {
		return GameGlobal.Config.ArenaConfig.maxBuyTime;
	}
	/**获取初始挑战次数 */
	public getPKCount(): number {
		return GameGlobal.Config.ArenaConfig.normalPKCount;
	}
	/**获取购买挑战次数元宝 */
	public getPKCountBuy(): number {
		return GameGlobal.Config.ArenaConfig.pkCountPrice;
	}
	/**获取元宝购买挑战次数的增加次数 */
	public getAddPKCount(): number {
		return GameGlobal.Config.ArenaConfig.buyPKCount;
	}
	/**获取挑战次数为零后回复倒计时(分钟) */
	public getPKTimes(): number {
		return GameGlobal.Config.ArenaConfig.revertInterval;
	}

	/**排名奖励几时几分结算 */
	public getRankRewardTimes(): string {
		let minute = GameGlobal.Config.ArenaConfig.rewardMinute;
		let hour = GameGlobal.Config.ArenaConfig.rewardHour;
		let str = minute > 0 ? '每天' + hour + '时' + minute + '分结算' : '每天' + hour + '时结算';
		return str;
	}

	/**获取排名上升的奖励绑元数 */
	public getUpRankReward(): number {
		return GameGlobal.Config.ArenaConfig.promoteReward;
	}

	public constructor() {
		super();
	}

	private myRank: number = 0;
	/**我的排名 */
	public getMyRank(): number {
		return this.myRank;
	}

	private maxRank: number = 0;
	/**历史最高排名 */
	public getMaxRank(): number {
		return this.maxRank;
	}




	/**记录竞技场基本数据 */
	private arenaInfoRsp: Sproto.cs_arena_info_response
	public getArenaInfoRsp() {
		return this.arenaInfoRsp
	}

    /**
    * 请求竞技场数据
    */
	public sendArenaData() {
		let req = new Sproto.cs_arena_info_request;
		this.Rpc(C2sProtocol.cs_arena_info, req, (rsp) => {
			this.arenaInfoRsp = rsp
			let rspData: Sproto.cs_arena_info_response = rsp;
			this.myRank = rspData.rank;
			this.maxRank = rspData.maxrank;
			this.medal = rspData.medal;
			this.HandleDuration(rspData.remaintime)
			MessageCenter.ins().dispatch(MessageDef.ARENA_INFO_DATA, rspData);
		})
	};

    /**
    * 选择pk目标(排名)
    */
	public sendArenaChallenge(rank) {
		let rsp = new Sproto.cs_arena_pk_request;
		rsp.rank = rank;
		this.Rpc(C2sProtocol.cs_arena_pk, rsp);
	};

	/**
	* 购买挑战次数
	*/
	public sendArenaBuyCount() {
		let req = new Sproto.cs_buy_pk_request;
		this.Rpc(C2sProtocol.cs_buy_pk, req, (rsp) => {
			let rspData: Sproto.cs_buy_pk_response = rsp;
			if (rspData.ret)
			{
				this.arenaInfoRsp.pkcount = rspData.pkcount
			}
			
			MessageCenter.ins().dispatch(MessageDef.ARENA_BUY_RESULT, rspData);
		})
	};

	/**领取竞技挑战奖励 */
	public sendGetRewards() {
		this.Rpc(C2sProtocol.cs_arena_get_reward, new Sproto.cs_arena_get_reward_request);
	}

	/**请求竞技排行榜 */
	public sendArenaRank() {
		let req = new Sproto.cs_arena_rank_request;
		this.Rpc(C2sProtocol.cs_arena_rank, req, (rsp) => {
			let rspData: Sproto.cs_arena_rank_response = rsp;
			MessageCenter.ins().dispatch(MessageDef.ARENA_RANK_DATA, rspData);
		});
	}

	private medal: number = 0;
	/**功勋 */
	public getMedal(): number {
		return this.medal;
	}

	public setMedal(medal: number) {
		this.medal = medal;
	}

	public HandleDuration(endTime) {
		if (endTime <= 0)
		{
			return
		}

		TimerManager.ins().removeAll(this)
		TimerManager.ins().doTimer(endTime * 1000, 1, this.sendArenaData, this)
	}


	/*竞技场红点提示 */
	public IsRedPoint() {
		if (!Deblocking.IsDeblocking(DeblockingType.TYPE_42)) {
			return false
		}
		if (!this.arenaInfoRsp || !this.arenaInfoRsp.pkcount)
			return false
		
		return true
	}
}