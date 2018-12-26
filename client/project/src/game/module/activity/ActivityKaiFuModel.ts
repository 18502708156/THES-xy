class ActivityKaiFuModel extends BaseSystem {


	private m_type_activityId: { [key: number]: number } = {}

	private m_activityData: { [key: number]: IActivityBaseData } = {}
	private m_ReachData: { [key: number]: Sproto.sc_activity_dabiao_info_request } = {}
	private m_rankInfoList: { [key: number]: DabiaoRankData[] } = {}
	private m_RaceHistory: Sproto.sc_activity_race_history_request

	public advancedInfo: ActivityAdvancedInfo;
	public advancedRank: Sproto.rank_data_list[] = [];
	public advancedRankMySelfe: number = 0
	public advancedSelfPower: number = 0

	public answerFisrstNe = "";

	public static Ids_ActivityTarget = [];
	public static Ids_ActivityQiTian = [];

	public constructor() {
		super();
		this.advancedInfo = new ActivityAdvancedInfo();
		this.regNetMsg(S2cProtocol.sc_activity_info_res, this._DoActivity_init_answer);
		this.regNetMsg(S2cProtocol.sc_activity_init_info, this._DoActivity_init_info);
		this.regNetMsg(S2cProtocol.sc_activity_reward_result, this._DoRewardResult)
		this.regNetMsg(S2cProtocol.sc_activity_dabiao_info, this._DoDaBiaoInfo)
		this.regNetMsg(S2cProtocol.sc_activity_dabiao_reward, this._DoDaBiaoRewardStatu)
		this.regNetMsg(S2cProtocol.sc_activity_update_info, this._DoActivityUpdate)
		this.regNetMsg(S2cProtocol.sc_activity_race_history, this._DoRaceHistory)
		//------开服进阶
		this.regNetMsg(S2cProtocol.sc_advanced_info, this._DoAdvanced_info)
		this.regNetMsg(S2cProtocol.sc_advanced_update, this._DoAdvanced_update)
		this.regNetMsg(S2cProtocol.sc_advanced_rank, this._DoAdvanced_Rank)

		this.regNetMsg(S2cProtocol.sc_activity_luckwheel_ret, this.luckwheel_ret)

		GameGlobal.MessageCenter.addListener(MessageDef.GAME_SERVER_UPDATE_DAY, this.updateAdvancedData, this)
		GameGlobal.MessageCenter.addListener(MessageDef.LEVEL_CHANGE, this.updateAdvancedData, this)
	}
	private updateAdvancedData(): void {
		// this.advancedInfo.updateEndTime();
		this.advancedRank = [];
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW)
	}
	public init(): void {
		for (let key in GameGlobal.Config.ActivitySumBtnConfig) {
			if (GameGlobal.Config.ActivitySumBtnConfig.hasOwnProperty(key)) {
				let cfgObj = GameGlobal.Config.ActivitySumBtnConfig[key];
				if (cfgObj) {
					if (cfgObj.openId == 2) {
						ActivityKaiFuModel.Ids_ActivityTarget.push(cfgObj.id)
					} else if (cfgObj.openId == 3) {
						ActivityKaiFuModel.Ids_ActivityQiTian.push(cfgObj.id)
					}
				}
			}
		}
	}


	// enum ActivityKaiFuJiJieType{
	// ride = 1,//坐骑 
	// wing = 2 ,//翅膀
	// fairy = 3 ,//守护
	// weapon = 4,//神兵
	// pet_psychic = 5 ,//宠物兽魂
	// pet_soul = 6,//宠物通灵
	// xianlv_circle = 7 ,//仙侣仙位
	// xianlv_position = 8,//仙侣法阵
	// tiannv = 9 ,//玄女
	// tiannv_nimbus = 10 ,//玄女灵气
	// tiannv_flower = 11,//玄女花辇



	/**获取自己的进阶等级 */
	public GetMyAdvancedLevel(type: number): number {
		var stage = 0;
		switch (type) {
			case ActivityKaiFuJiJieType.ride:
				stage = GameGlobal.UserRide.mLevel;
				break;
			case ActivityKaiFuJiJieType.wing:
				stage = GameGlobal.UserWing.mLevel;
				break;
			case ActivityKaiFuJiJieType.fairy:
				stage = GameGlobal.TianxModel.mLevel
				break;
			case ActivityKaiFuJiJieType.weapon:
				stage = GameGlobal.SwordModel.mLevel
				break;
			case ActivityKaiFuJiJieType.pet_psychic:
				stage = GameGlobal.PetShouhModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.pet_soul:
				stage = GameGlobal.PetTonglModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.xianlv_circle:
				stage = GameGlobal.XianlvXwModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.xianlv_position:
				stage = GameGlobal.XianlvFzModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.tiannv:
				stage = GameGlobal.HavingModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.tiannv_nimbus:
				stage = GameGlobal.HavingLingqModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.tiannv_flower:
				stage = GameGlobal.HavingHuanModel.mLevel;
				break;
			case ActivityKaiFuJiJieType.lingtong:
				stage = GameGlobal.LingtongModel.mLevel;
				break;
			case 100:
				stage = GameGlobal.actorModel.vipLv;
				break
		}
		return stage;
	}
	/**打开进阶界面 */
	public OpenAdvancedPanel(type: number): number {
		switch (type) {
			case ActivityKaiFuJiJieType.ride:
				if (Deblocking.Check(DeblockingType.TYPE_9))
					ViewManager.ins().open(RoleWin, 2);
				break;
			case ActivityKaiFuJiJieType.wing:
				if (Deblocking.Check(DeblockingType.TYPE_10))
					ViewManager.ins().open(RoleWin, 3);
				break;
			case ActivityKaiFuJiJieType.fairy:
				if (Deblocking.Check(DeblockingType.TYPE_27))
					ViewManager.ins().open(TianxianMainPanel, 0);
				break;
			case ActivityKaiFuJiJieType.weapon:
				if (Deblocking.Check(DeblockingType.TYPE_28))
					ViewManager.ins().open(TianxianMainPanel, 1);
				break;
			case ActivityKaiFuJiJieType.pet_psychic:
				if (Deblocking.Check(DeblockingType.TYPE_14))
					ViewManager.ins().open(PetMainPanel, 3);
				break;
			case ActivityKaiFuJiJieType.pet_soul:
				if (Deblocking.Check(DeblockingType.TYPE_13))
					ViewManager.ins().open(PetMainPanel, 2);
				break;
			case ActivityKaiFuJiJieType.xianlv_circle:
				if (Deblocking.Check(DeblockingType.TYPE_18))
					ViewManager.ins().open(XianlvMainPanel, 3);
				break;
			case ActivityKaiFuJiJieType.xianlv_position:
				if (Deblocking.Check(DeblockingType.TYPE_17))
					ViewManager.ins().open(XianlvMainPanel, 2);
				break;
			case ActivityKaiFuJiJieType.tiannv:
				if (Deblocking.Check(DeblockingType.TYPE_19))
					ViewManager.ins().open(HavingMainPanel, 0);
				break;
			case ActivityKaiFuJiJieType.tiannv_nimbus:
				if (Deblocking.Check(DeblockingType.TYPE_22))
					ViewManager.ins().open(HavingMainPanel, 3);
				break;
			case ActivityKaiFuJiJieType.tiannv_flower:
				if (Deblocking.Check(DeblockingType.TYPE_21))
					ViewManager.ins().open(HavingMainPanel, 2);
				break;
			case ActivityKaiFuJiJieType.lingtong:
				ViewManager.ins().open(LingtongMainPanel);
				break;
		}
		return 0;
	}

	public GetActivityDataById(id: number): IActivityBaseData {
		if (!id) {
			return null
		}
		return this.m_activityData[id]
	}
	public GetActivityDataByType(type: number): IActivityBaseData {
		for (let key in this.m_activityData) {
			let data = this.m_activityData[key]
			if (type == data.type) {
				return data
			}
		}
		return null
	}
	public getisCangetDabiao(id) {
		for (let i = 1; i <= this.GetMyReachIndex(id); ++i) {
			if (!BitUtil.Has(this.GetMyReachDraw(id), i)) {
				return true
			}
		}
		return this.checkRedPointTemp(id);
	}
	public GetMyReachIndex(id: number): number {
		if (this.m_ReachData[id] == null) {
			return 0
		}
		return this.m_ReachData[id].index
	}
	public GetMyReachDraw(id: number): number {
		if (this.m_ReachData[id] == null) {
			return 0
		}
		return this.m_ReachData[id].draw
	}
	/**客户端自己判断个人达标活动奖励 */
	checkRedPointTemp(id): boolean {
		let IActivityBaseData: IActivityBaseData = this.GetActivityDataById(id)
		if (!IActivityBaseData || !IActivityBaseData.isOpenActivity()) {
			return false;
		}

		return false;
	}
	//*************************发送协议************************** */
	Send_advanced_charger_reward(id: number): void {
		let req = new Sproto.cs_advanced_charger_reward_request
		req.id = id
		this.Rpc(C2sProtocol.cs_advanced_charger_reward, req)
	}
	Send_advanced_lv_reward(type: number, id: number): void {
		let req = new Sproto.cs_advanced_lv_reward_request
		req.typ = type
		req.id = id
		this.Rpc(C2sProtocol.cs_advanced_lv_reward, req)
	}
	Send_advanced_rank(): void {
		this.Rpc(C2sProtocol.cs_advanced_rank)
	}
	Send_advanced_buy(id: number, num: number, type: number): void {
		let req = new Sproto.cs_advanced_buy_request
		req.id = id
		req.num = num
		req.typ = type;
		this.Rpc(C2sProtocol.cs_advanced_buy, req)
	}


	SendLevelInfo(activityId: number): void {
		let req = new Sproto.cs_activity_send_level_info_request
		req.activityID = activityId
		this.Rpc(C2sProtocol.cs_activity_send_level_info, req)
	}
	SendRaceHistory(): void {
		this.Rpc(C2sProtocol.cs_activity_race_history)
	}
	/**
	 * 获取奖励
	 */
	sendReward(id: number, index: number) {
		let req = new Sproto.cs_activity_send_reward_request
		req.id = id
		req.index = index
		this.Rpc(C2sProtocol.cs_activity_send_reward, req)
	}
	sendDabiaoInfo(activityID: number) {
		let req = new Sproto.cs_activity_send_dabiao_info_request
		req.activityID = activityID
		this.Rpc(C2sProtocol.cs_activity_send_dabiao_info, req)
	}
	//战宠副本 挑战战宠
	sendPetFightInfo(activityID: number) {
		let req = new Sproto.cs_activity_action_request
		req.activityId = activityID
		this.Rpc(C2sProtocol.cs_activity_action, req)
	}
	/**投资 */
	sendInvestment(activityID: number) {
		let req = new Sproto.cs_activity_open_request
		req.id = activityID;
		this.Rpc(C2sProtocol.cs_activity_open, req)
	}
	//=============================================

	private _DoActivity_init_info(rsp: Sproto.sc_activity_init_info_request) {
		let baseConfig = GameGlobal.Config.ActivityConfig
		for (let data of rsp.datas) {
			if (data.basecfg) {
				baseConfig[data.basecfg.Id] = data.basecfg
				if (data.btncfg) {
					try {
						GameGlobal.Config.ActivitySumBtnConfig[data.basecfg.Id] = JSON.parse(data.btncfg) || {}
					} catch(e) {
						console.error(data.btncfg)
						console.error(e)
					}
				}
				if (data.basecfg.activityType) { 
					try {
						GameGlobal.Config["ActivityType" + data.basecfg.activityType + "Config"][data.basecfg.Id] = JSON.parse(data.config) || {}
					} catch(e) {
						console.error(data.basecfg)
						console.error(e)
					}
				} else {
					console.error("not activityType => ", data.basecfg)
				}
			}
			let acdata = ActivityKaiFuModel.GetActivityData(data)
			if (acdata) {
				let id = acdata.baseData.id
				if (this.m_activityData[id]) {
					this.m_activityData[id].UpdateBase(acdata.baseData)
					this.m_activityData[id].update(acdata)
					GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, id)

				} else {
					var n = ActivityDataFactory.create(acdata)
					n && (this.m_activityData[n.id] = n)
				}
			}
		}
		MessageCenter.ins().dispatch(MessageDef.ACTIVITY_INFO);
		// console.log(GameServer.serverTime);
		// console.log("==========================");
	}


	private _DoActivity_init_answer(rsp: Sproto.sc_activity_info_res_request) {
		this.answerFisrstNe = rsp.answer
	}



	private _DoRewardResult(e: Sproto.sc_activity_reward_result_request) {
		var index = e.id
		if (this.m_activityData[index]) {
			let activityData = ActivityKaiFuModel.GetActivityData(e.data)
			this.m_activityData[index].UpdateBase(activityData.baseData)
			this.m_activityData[index].update(activityData)
			GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, index)
		}
	}
	private _DoDaBiaoInfo(rsp: Sproto.sc_activity_dabiao_info_request) {
		let array = this.m_rankInfoList[rsp.acId] = [];
		for (var i = 0; rsp.rankInfo.length > i; i++) {
			let data = new DabiaoRankData()
			array.push(data)
			data.prase(rsp.rankInfo[i], null)
		}
		this.m_ReachData[rsp.acId] = rsp
		rsp.rankInfo = null

		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_DABIAO_UPDATE)
	}
	private _DoDaBiaoRewardStatu(e: Sproto.sc_activity_dabiao_reward_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_IS_GET_AWARDS)
	}

	private _DoActivityUpdate(rsp: Sproto.sc_activity_update_info_request) {
		var index = rsp.index
		if (this.m_activityData[index]) {
			let activityData = ActivityKaiFuModel.GetActivityData(rsp.data)
			this.m_activityData[index].UpdateBase(activityData.baseData)
			this.m_activityData[index].update(activityData)
			GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_UPDATE, index)
		}
	}
	private _DoRaceHistory(rsp: Sproto.sc_activity_race_history_request) {
		this.m_RaceHistory = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_RACE_HISTORY)
	}
	private _DoAdvanced_info(rsp: Sproto.sc_advanced_info_request) {
		this.advancedInfo.prase(rsp);
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW)
	}
	private _DoAdvanced_update(rsp: Sproto.sc_advanced_update_request) {
		if (rsp.shop) this.advancedInfo.updateShop(rsp.shop)
		if (rsp.advancedReward) this.advancedInfo.updateAdvancedReward(rsp.advancedReward)
		if (rsp.chargerReward) this.advancedInfo.chargerReward = rsp.chargerReward
		if (rsp.dayCharger) this.advancedInfo.dayChargeValue = rsp.dayCharger

		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW)
	}
	private _DoAdvanced_Rank(rsp: Sproto.sc_advanced_rank_request) {
		this.advancedRank = rsp.datas || [];
		this.advancedRankMySelfe = rsp.selfRank;
		this.advancedSelfPower = rsp.selfPower;
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_RANK)
	}

	//===================================
	static GetActivityData(data: Sproto.activity_data_collection): any {
		// for (let i = 1; i <= 27; ++i) {
		// 	let typeData = data["type" + (i < 10 ? ("0" + i) : i)]
		// 	if (typeData) {
		// 		return typeData
		// 	}
		// }
		for (let key in data) {
			if (key.indexOf("type") == 0)
				return data[key]
		}
		return null
	}
	// private static open_jjkh_view = {};
	private static jjkh_btns = [];
	public static pushJiJieBtn(comp): void {
		this.jjkh_btns.push(comp);
	}
	public static setJiJieOpenViewData(type): void {
		// if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
		// 	return;
		// }
		// this.open_jjkh_view[type] = true;
		// GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW)
	}
	public static ShowJiJieKuangHuanIcon(btn, typeArr: Array<number>): void {
		if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
			return;
		}
		let types = GameGlobal.ActivityKaiFuModel.GetAdvancedTypeArr();
		if (btn && btn['jjkh_img']) {
			let type
			let show: boolean = false;
			let i: number;
			let len: number = typeArr.length;
			for (i = 0; i < len; i++) {
				type = typeArr[i]
				// if (!this.open_jjkh_view[type]) {
				if (types.indexOf(type) != -1) {
					show = true;
					break;
				}
				// }

			}
			btn['jjkh_img'].visible = show
		}
	}

	public GetAdvancedTypeArr(): number[] {
		let arr = []
		let serverDay = GameServer.serverOpenDay;
		let ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig
		if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
			arr.push(ProgressCrazyBaseConfig.initialorder[serverDay - 1])
		} else {
			let i: number;
			let index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length
			arr = ProgressCrazyBaseConfig.progressorder[index]

		}
		return arr;
	}
	public GetAdvancedReChargeType(): number {
		let serverDay = GameServer.serverOpenDay;
		let ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig
		if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
			return ProgressCrazyBaseConfig.initialorder[serverDay - 1]
		} else {
			let i: number;
			let index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length
			return ProgressCrazyBaseConfig.rechargeorder[index];
		}
	}
	/**开服进阶 */
	RedPointAdvanced(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_109, true)) {
			return false;
		}
		let arr = this.GetAdvancedTypeArr();
		let i: number;
		let len: number = arr.length;
		for (i = 0; i < len; i++) {
			if (this.RedPointAdvancedUpLevelByType(arr[i]) == true) {
				return true;
			}
		}
		if (this.RedPointAdvancedReCharge() == true) {
			return true;
		}
		return false;
	}

	RedPointAdvancedUpLevelByType(type): boolean {
		let config = GameGlobal.Config.ProgressCrazyRewardConfig;
		let obj = config[type];
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				let cfgObj = obj[key];

				let canGet = GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(type) >= cfgObj.value
				if (canGet) {
					let getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetAdvancedReward(type, cfgObj.index);
					if (!getted) return true;
				}

			}
		}
		return false;
	}
	
	RedPointAdvancedReCharge(): boolean {
		let type = this.GetAdvancedReChargeType();
		let config = GameGlobal.Config.ProgressCrazyRechargeConfig;
		let obj = config[type];
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				let cfgObj = obj[key];
				let canGet = GameGlobal.ActivityKaiFuModel.advancedInfo.dayChargeValue >= cfgObj.money
				if (canGet) {
					let getted = GameGlobal.ActivityKaiFuModel.advancedInfo.GetChargeReward(cfgObj.id);
					if (!getted) return true;
				}

			}
		}
		return false;
	}

	RedPointAdvanceShop(): boolean {
		let type = this.GetAdvancedReChargeType();
		let config = GameGlobal.Config.ProgressCrazyShopConfig;
        let configData = config[type];
		for (let key in configData) {
			let data = configData[key]
			if (data.type.type == 3 && this.advancedInfo.getBuyNum(data.shopid) >= data.type.value) {
                continue
            }
			if (GameGlobal.ActivityKaiFuModel.GetMyAdvancedLevel(data.value.type) < data.value.value) {
                continue
            } 
			let goldId = data.gold.id
			if (goldId == MoneyConst.byb || goldId == MoneyConst.gold) {
				if (Checker.Money(goldId, data.gold.count, false)) {
					return true
				}
			}
		}
		return false
	}

	/**七天目标 */
	RedPointTarget(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_97, true) &&
			!Deblocking.Check(DeblockingType.TYPE_98, true) &&
			!Deblocking.Check(DeblockingType.TYPE_99, true) &&
			!Deblocking.Check(DeblockingType.TYPE_100, true) &&
			!Deblocking.Check(DeblockingType.TYPE_101, true) &&
			!Deblocking.Check(DeblockingType.TYPE_102, true)
		) {
			return false;
		}
		let ids = ActivityKaiFuModel.Ids_ActivityTarget;
		let i: number;
		let len: number = ids.length;
		for (i = 0; i < len; i++) {
			let actData = this.GetActivityDataById(ids[i]);
			if (actData && actData.isOpenActivity()) {
				if (actData.hasReward()) {
					return true;
				}
			}
		}
		return false;
	}
	/**七天尊享 */
	RedPointQiTian(): boolean {
		return false
		// if (!Deblocking.Check(DeblockingType.TYPE_103, true)) {
		// 	return false;
		// }
		// let ids = ActivityKaiFuModel.Ids_ActivityQiTian;
		// let i: number;
		// let len: number = ids.length;
		// for (i = 0; i < len; i++) {
		// 	let actData = this.GetActivityDataById(ids[i]);
		// 	if (actData) {
		// 		if (actData.hasReward()) {
		// 			return true;
		// 		}
		// 	}
		// }
		// return false;

	}

	hasActivityQiTian(): boolean {
		return false
		// if (!Deblocking.Check(DeblockingType.TYPE_103, true)) {
		// 	return false;
		// }
		// let ids = ActivityKaiFuModel.Ids_ActivityQiTian;
		// let i: number;
		// let len: number = ids.length;
		// for (i = 0; i < len; i++) {
		// 	let actData = this.GetActivityDataById(ids[i]);
		// 	if (actData && actData.isOpenActivity()) {
		// 		return true;
		// 	}
		// }
		// return false;

	}

	hasActivityTarget(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_97, true) &&
			!Deblocking.Check(DeblockingType.TYPE_98, true) &&
			!Deblocking.Check(DeblockingType.TYPE_99, true) &&
			!Deblocking.Check(DeblockingType.TYPE_100, true) &&
			!Deblocking.Check(DeblockingType.TYPE_101, true) &&
			!Deblocking.Check(DeblockingType.TYPE_102, true)
		) {
			return false;
		}
		let ids = ActivityKaiFuModel.Ids_ActivityTarget;
		let i: number;
		let len: number = ids.length;
		for (i = 0; i < len; i++) {
			let actData = this.GetActivityDataById(ids[i]);
			if (actData && actData.isOpenActivity()) {
				return true;
			}
		}
		return false;
	}

	jingCai_huoDong() {
		let serverDay = GameServer.serverOpenDay;
		let ActivityConfig = GameGlobal.Config.ActivityConfig
		let ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig
		let dataList = []
		let idList = []
		for (let Config in ActivitySumBtnConfig) {
			if (ActivitySumBtnConfig[Number(Config)].openId == 4) {
				dataList.push(Number(Config))
			}
		}
		for (let i = 0; i < dataList.length; i++) {
			let id = dataList[i]
			let cls
			if (ActivityConfig[id].activityType == 6) {
				cls = ZhuangPanShopPanel
			}
			if (ActivityConfig[id].activityType == 26) {
				cls = zheKouBasePanel
			}
			let BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(id)
			if (BaseModel) {
				if (BaseModel.openState) {
					idList.push(id);
				}
			}
		}
		return idList
	}

	jingCaiIconRedPoin(): boolean {
		let dataList = this.jingCai_huoDong()
		let ActivityConfig = GameGlobal.Config.ActivityConfig
		for (let i = 0; i < dataList.length; i++) {
			if (this.jingCaiRedPoint(ActivityConfig[dataList[i]].activityType, dataList[i], i)[1]) {
				return true
			}
		}
		return false
	}

	luckwheel_ret(rsp: Sproto.sc_activity_luckwheel_ret_request) {
		GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_ADVANCED_ZHUANG_PAN_RULE, rsp)
	}

	jingCaiRedPoint(type, id, index) {
		if (type == 6) {
			let data = this.GetActivityDataById(id) as ActivityType6Data
			if (!data) {
				return [index, false]
			}
			if (data.drawtime > 0) {
				return [index, true]
			}
		}
		return [index, false]
	}
}