class MoneyTreeModel extends BaseSystem {

	public isOpen: boolean[] = []
	playNum = 0
	boxOn = 0
	addCoefficient = 1
	exp = 0
	boxInfo = 0
	baoji

	public mRechargeDay: number = 0

	public constructor() {
		super()

		this.regNetMsg(S2cProtocol.sc_money_tree_info, this.doMoneyTreeInfo)
		this.regNetMsg(S2cProtocol.sc_money_tree_play_info, this.doPalyBack)
		this.regNetMsg(S2cProtocol.sc_money_tree_reward_info, this.doGetRewardBack)


	}

	sendPlayYaoYao() {
		// var e = this.getBytes();
		// e.writeCmd(this.protoSysID, 2), this.sendToServer(e)

		this.Rpc(C2sProtocol.cs_money_tree_play)
	}

	sendGetCaseReward(e) {
		let req = new Sproto.cs_money_tree_reward_request
		req.id = e
		this.Rpc(C2sProtocol.cs_money_tree_reward, req)
	}

	doMoneyTreeInfo(e: Sproto.sc_money_tree_info_request) {
		this.playNum = e.playNum
		this.boxOn = e.boxOn
		this.addCoefficient = e.addCoefficient
		this.exp = e.exp
		this.boxInfo = e.boxInfo

		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE)
	}

	doPalyBack(e: Sproto.sc_money_tree_play_info_request) {
		this.playNum = e.playNum
		this.boxOn = e.boxOn
		this.addCoefficient = e.addCoefficient
		this.exp = e.exp
		this.baoji = e.baoji

		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE, !1, this.baoji)
	}

	doGetRewardBack(e: Sproto.sc_money_tree_reward_info_request) {
		this.boxInfo = e.boxInfo
		GameGlobal.MessageCenter.dispatch(MessageDef.MONEY_INFO_CHANGE)
	}


	public static ins(): MoneyTreeModel {
		return super.ins()
	}

	getOrderByIndex(e = 0) {

		var t = this.boxInfo >> e & 1;
		return t
	}

	getNowCoefficientinfo(e = 0) {

		var config = GameGlobal.Config.CashCowAmplitudeConfig;
		for (var i in config)
			if (config[i].level == this.addCoefficient + e) return config[i];
		return null
	}

	get maxNum() {
		return this.checkCashCowBasicLenght(UserVip.MAX_LV)

	}

	get cruMaxNum() {
		return this.checkCashCowBasicLenght()
	}

	getIndexCost() {
		var config = GameGlobal.Config.CashCowBasicConfig;
		for (var t in config)
			if (config[t].time == this.boxOn + 1) return config[t];
		return null
	}

	getBoxInfoByIndex(e) {
		var t = GameGlobal.Config.CashCowBoxConfig;
		for (var i in t)
			if (t[i].index == e) return t[i];
		return null
	}

	checkCashCowBasicLenght(e = 0) {
		0 == e && (e = GameGlobal.actorModel.vipLv);
		var t = GameGlobal.Config.CashCowLimitConfig;
		for (var i in t)
			if (t[i].vip == e) return t[i].maxTime;
		return 0
	}

	checkBoxIsCanget(e) {
		var t = this.getBoxInfoByIndex(e);
		return t.time <= this.playNum && this.getOrderByIndex(e - 1) <= 0 ? !0 : !1
	}

	isHaveReward() {
		if (GameServer.serverOpenDay < 2) return !1;
		for (var e = 1; 4 > e; e++)
			if (this.checkBoxIsCanget(e)) return !0;
		return this.HasFreeCountForMoneyTree()
	}

	public static GetTodayRecharge(): number {
		return 0
	}


	public HasFreeCountForMoneyTree(): boolean {
		var cost = MoneyTreeModel.ins().getIndexCost()
		let isFree = cost.yuanbao == 0 ? true : false
		return isFree
	}

	public static CheckOpen(showTip: boolean = false): boolean {
		// if (GameServer.serverOpenDay < 2) {
		// 	if (showTip) {
		// 		UserTips.ins().showTips("|C:0xff0000&T:开服第三天开启聚宝盆|");
		// 	}
		// 	return false
		// }
		return true
	}
}