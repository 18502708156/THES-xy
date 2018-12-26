class GangMineModel extends BaseSystem {

	/**我的状态信息 */
	public myInfo: GangMineMyInfo = new GangMineMyInfo;
	/**矿山数据 --key 矿脉ID */
	public mineInfos: { [key: number]: GangMineInfo } = {};
	/**帮派排名 --key 排名类型*/
	public mineRanks: { [key: number]: GangMineRankInfo[] } = {};
	/**矿山总数量，每10个分一页，ID从1开始 */
	public mineTotalNum: number;
	/**矿山每页数量 */
	public static MINE_MAX_NUM: number = 10;
	/**矿脉最大守护数 */
	public static MINE_GUARD_NUM: number = 3;

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_guildmine_mine_info, this.getGangMineInfo);
		this.regNetMsg(S2cProtocol.sc_guildmine_mine_one_info, this.getGangMineOneInfo);
		this.regNetMsg(S2cProtocol.sc_guildmine_mine_mystatus, this.getGangMineMyStatus);
		this.regNetMsg(S2cProtocol.sc_guildmine_score_rank_day, this.getGangMineScoreRankInfo);
		this.regNetMsg(S2cProtocol.sc_guildmine_rob_info, this.getGangMineRob);
	}

	/**矿山争夺数据 */
	private getGangMineInfo(rsp: Sproto.sc_guildmine_mine_info_request) {
		let i = 0, len = this.mineTotalNum = rsp.mineinfos.length;
		let data: Sproto.mine_info;
		let info: GangMineInfo;
		for (i; i < len; i++) {
			data = rsp.mineinfos[i];
			info = this.mineInfos[data.mineId];
			if (info) {
				info.updateInfo(data);
			} else {
				info = new GangMineInfo;
				info.updateInfo(data);
				this.mineInfos[data.mineId] = info;
			}
		}
		MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
	}

	/**单个矿脉数据 */
	private getGangMineOneInfo(rsp: Sproto.sc_guildmine_mine_one_info_request) {
		let info = this.mineInfos[rsp.mineinfo.mineId];
		if (info) {
			info.updateInfo(rsp.mineinfo);
		}
		MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
	}

	/**我自己的状态信息 */
	private getGangMineMyStatus(rsp: Sproto.sc_guildmine_mine_mystatus_request) {
		this.myInfo.updateInfo(rsp);
		MessageCenter.ins().dispatch(MessageDef.GANGMINE_UPDATE_INFO);
	}

	/**帮派排行数据 */
	private getGangMineScoreRankInfo(rsp: Sproto.sc_guildmine_score_rank_day_request) {
		let i = 0, len = rsp.rankdatas.length;
		let data: Sproto.score_info;
		let info: GangMineRankInfo;
		this.mineRanks[rsp.rankType] = [];
		for (i; i < len; i++) {
			data = rsp.rankdatas[i];
			info = new GangMineRankInfo;
			info.rankType = rsp.rankType;
			info.updateInfo(data);
			this.mineRanks[rsp.rankType][i] = info;
		}
		MessageCenter.ins().dispatch(MessageDef.GANGMINE_RANK_INFO);
	}

	/**矿脉被抢通知 */
	private getGangMineRob(rsp: Sproto.sc_guildmine_rob_info_request) {
		WarnWin.show('您在矿山争夺中被【' + rsp.name + '.S' + rsp.serverId + '】击败', this.revengeHandler,
			this, null, null, 'normal', { btnName: '前往复仇' });
	}

	private revengeHandler(...param) {
		if (GameGlobal.ActivityModel.activityList[ActivityModel.TYPE_GANGMINE]) {
			ViewManager.ins().open(GangMinePanel);
		}
		else {
			GameGlobal.UserTips.showTips('活动未开启')
		}
	}

	/**
	 * 帮派积分排行 1=当天活动，2=月度排行
	 * @param rankType 
	 */
	public sendGangMineScoreRank(rankType) {
		let req = new Sproto.cs_guildmine_score_rank_request;
		req.rankType = rankType;
		this.Rpc(C2sProtocol.cs_guildmine_score_rank, req);
	}

	/**进入矿山争夺 */
	public sendGangMineEnter() {
		this.Rpc(C2sProtocol.cs_guildmine_enter);
	}

	/**离开矿脉守护 */
	public sendGangMineLeave() {
		this.Rpc(C2sProtocol.cs_guildmine_leave_mine);
	}

	/**抢占矿脉 */
	public sendGangMineForce(mineId) {
		let req = new Sproto.cs_guildmine_force_join_request;
		req.mineId = mineId;
		this.Rpc(C2sProtocol.cs_guildmine_force_join, req, (rsp: Sproto.cs_guildmine_force_join_response) => {
			if (!rsp.ret) {
				GameGlobal.UserTips.showTips('您不是队长不能操作');
			}
		}, this);;
	}

	/**查看矿脉详情 */
	public sendGangMineDeatial(mineId) {
		let req = new Sproto.cs_guildmine_mine_info_request;
		req.mineId = mineId;
		this.Rpc(C2sProtocol.cs_guildmine_mine_info, req);;
	}

	/**加入守护 */
	public sendGangMineProtect(mineId) {
		let req = new Sproto.cs_guildmine_join_mine_request;
		req.mineId = mineId;
		this.Rpc(C2sProtocol.cs_guildmine_join_mine, req, (rsp: Sproto.cs_guildmine_join_mine_response) => {
			if (rsp.ret) {
				GameGlobal.UserTips.showTips('成功加入采矿队列');
			}
		}, this);
	}
	/**采矿 */
	public sendGangMineCollect() {
		let req = new Sproto.cs_guildmine_gather_request;
		this.Rpc(C2sProtocol.cs_guildmine_gather, req, (rsp: Sproto.cs_guildmine_gather_response) => {
			if (rsp.ret) {

			}
		}, this);
	}
}