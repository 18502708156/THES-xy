class FuncOpenModel extends BaseSystem {
	public static MAX_COUNT = 31
	// public static MAX = 10

	// public static INDEX_TO_NAME = [
	// 	"",
	// 	"个人BOSS",
	// 	"披风",
	// 	"威名",
	// 	"PK",
	// 	"宝石副本",
	// 	"元神副本",
	// 	"龙装副本",
	// 	"斩将台",
	// 	"经验玉",
	// 	"帮会"
	// ]

	public static ins(): FuncOpenModel {
		return super.ins()
	}

	public constructor() {
		super()
		// GameGlobal.MessageCenter.addListener(MessageDef.LEVEL_CHANGE, this._ConditionChange, this)
		// GameGlobal.MessageCenter.addListener(MessageDef.GUANQIA_CHANGE, this._ConditionChange, this)
	}

	public SendGetFuncOpen(index: number): void {
		let req = new Sproto.cs_get_gongnengyugao_reward_request
		req.index = index
		this.Rpc(C2sProtocol.cs_get_gongnengyugao_reward, req, (rsp) => {
			let rspData: Sproto.cs_get_gongnengyugao_reward_response = rsp
			if (rspData.index == 0) {
				UserTips.ins().showTips("领取错误")
			} else {
				GameGlobal.actorModel.mFuncOpen = BitUtil.Set(GameGlobal.actorModel.mFuncOpen, rspData.index, true);
				// let icon:FuncOpenIconRule = FuncOpenIconRule.SelfTarget;
				// if(icon)
				// {
				// 	icon.checkShowIcon();
				// 	icon.checkShowRedPoint();
				// 	icon.update();
				// }
				// GameGlobal.MessageCenter.dispatch(MessageDef.FUNC_OPEN_UPDATE)
			}
		})
	}

	// 初始化计时器
	// private m_InitCounter = 1
	// private m_CurConfigData = null

	// private _ConditionChange() {
	// 	if (--this.m_InitCounter > 0) {
	// 		return
	// 	}
	// 	if (this.m_CurConfigData == null) {
	// 		this._SetNextConfigData()
	// 		return
	// 	}
	// 	this.CheckAndShow()
	// }

	// public CheckAndShow() {
	// 	if (this.m_CurConfigData == null) {
	// 		return
	// 	}
	// 	if (!ViewManager.ins().isShow(PlayFunView)) {
	// 		return
	// 	}
	// 	if (FuncOpenModel.CheckByData(this.m_CurConfigData)) {
	// 		this._SetNextConfigData()
	// 		ViewManager.ins().open(FuncOpenPanel)
	// 	}
	// }

	// 设置下一个检查的数据
	// private _SetNextConfigData() {
	// 	let data = this.GetNextConfigData()
	// 	if (data == null) {
	// 		//  清空数据
	// 		this.m_CurConfigData = null
	// 		GameGlobal.MessageCenter.removeListener(MessageDef.LEVEL_CHANGE, this._ConditionChange, this)
	// 		GameGlobal.MessageCenter.removeListener(MessageDef.GUANQIA_CHANGE, this._ConditionChange, this)
	// 		return
	// 	}
	// 	this.m_CurConfigData = data.openLv
	// }

	private get m_Reward(): number {
		return GameGlobal.actorModel.mFuncOpen
	}

	public GetNextIndex(): number {
		let config = GameGlobal.Config.FuncNoticeConfig
		let i: number = FuncOpenModel.MAX_COUNT;
		let index = -1
		let len: number = 0;
		for (i; i > len; i--) {
			let cfgObj = config[i];
			if (cfgObj) {
				if (BitUtil.Has(this.m_Reward, i) == false) {
					let state = FuncOpenModel.ins().GetRewardState(i)
					if (state == RewardState.CanGet) {
						index = i;
						break;
					} else if (state == RewardState.NotReached) {
						index = i;
					}
				}
			}
		}
		return index
	}

	// public GetNextConfigData(): any {
	// 	let index = this.GetNextIndex()
	// 	if (index != -1) {
	// 		return GameGlobal.Config.FuncNoticeConfig[index]
	// 	}
	// 	return null
	// }

	// public GetCurCanRewardIndex(): number {
	// 	for (let i = 1; i <= FuncOpenModel.MAX; ++i) {
	// 		if (this.CanReward(i)) {
	// 			return i
	// 		}
	// 	}
	// 	return -1
	// }

	public CanReward(index: number): boolean {
		return this.GetRewardState(index) == RewardState.CanGet
	}

	public GetRewardState(index: number): RewardState {
		let configData = GameGlobal.Config.FuncNoticeConfig[index];
		if (!configData) return RewardState.Undo
		if (FuncOpenModel.CheckByData(configData.openLv)) {
			if (BitUtil.Has(this.m_Reward, index)) {
				return RewardState.Gotten
			}
			return RewardState.CanGet
		}
		return RewardState.NotReached
	}

	public HasReward(): boolean {
		for (let i = 1; i <= FuncOpenModel.MAX_COUNT; ++i) {
			if (this.CanReward(i)) {
				return true
			}
		}
		return false
	}

	public static Check(type: number, value: number): boolean {
		switch (type) {
			case 1:
				return GameGlobal.UserFb.guanqiaID >= value
			case 2:
				return GameGlobal.actorModel.level >= value
			case 4:
				return GameServer.serverOpenDay >= value
			case 5:
				return GameServer.loginDay >= value
		}
		return false
	}

	public static CheckByData(openLvs): boolean {
		let i: number;
		let len: number = openLvs.length;
		for (i = 0; i < len; i++) {
			if (FuncOpenModel.Check(openLvs[i][0], openLvs[i][1]) == false) {
				return false;
			}
		}
		return true;
	}
	public static GetTipStrByData(openLvs, sign?: string): string {
		let str = ""
		let i: number;
		let len: number = openLvs.length;
		for (i = 0; i < len; i++) {
			if (sign && str != "") str += sign;
			str += this.GetTipStr(openLvs[i][0], openLvs[i][1])
		}
		return str;
	}

	// public static GetTipStrByIndex(index: number): string {
	// 	let data = GameGlobal.Config.FuncNoticeConfig[index]
	// 	let prefix = FuncOpenModel.GetTipStr(data.openLv[0], data.openLv[1])
	// 	return prefix// + "开启" + FuncOpenModel.INDEX_TO_NAME[index]
	// }

	private static GetTipStr(type: number, value: number): string {
		switch (type) {
			case 1:
				return `通过第${value}关`
			case 2:
				if (value >= 1000) {
					return `角色${Math.floor(value / 1000)}阶`
				} else {
					return `角色等级达到${value}级`
				}

			case 4:
				return `开服第${value}天`
			case 5:
				return `登陆第${value}天`
		}
		return ""
	}

	// public static GetTipStr2(type: number, value: number): string {
	// 	switch (type) {
	// 		case 1:
	// 			return `通过第${value}关`
	// 		case 2:
	// 			return `角色等级达到${value}级`
	// 	}
	// 	return ""
	// }

	// 客户端保存数据

	public static SAVE_GAME_OTHER_PLAYER = 1
	public static SAVE_GAME_BLOOD_VIEW = 2
	public static SAVE_BAG_RONG_LIAN = 3
	public static SAVE_SYSTEM_SETTING_SY = 4
	public static SAVE_SYSTEM_SETTING_YX = 5
	public static SAVE_SYSTEM_SETTING_CB = 6
	public static SAVE_SYSTEM_SETTING_CH = 7
	public static SAVE_SYSTEM_SETTING_TX = 8
	public static SAVE_SYSTEM_SETTING_XW = 9
	public static SAVE_SYSTEM_SETTING_FZ = 10
	public static SAVE_SYSTEM_SETTING_TL = 11
	public static SAVE_SYSTEM_SETTING_SH = 12
	public static SAVE_SYSTEM_SETTING_OTHER_PLAYER = 13
	// public static SAVE_SYSTEM_SETTING_ZDSD1 = 14
	public static SAVE_SYSTEM_SETTING_ZDSD2 = 15
	public static SAVE_SYSTEM_SETTING_ZDSD3 = 16

	public static SAVE_SYSTEM_SHOW_XUANNV = 17	// 第一次限时玄女界面

	public static SAVE_GOD_PIE = 18	// 天降好礼提示

	public static SAVE_DATA_FALG = false

	public static SAVE_VAL_SOUND = 0
	private static DEF_VALUE = {
		[FuncOpenModel.SAVE_VAL_SOUND]: 0.5,
	}

	private static Send(): void {
		let req = new Sproto.cs_set_clientvalue_request
		req.value = GameGlobal.actorModel.mSaveData
		req.list = GameGlobal.actorModel.mSaveDataList
		GameSocket.ins().Rpc(C2sProtocol.cs_set_clientvalue, req)
	}

	public static HasSaveData(value: number): boolean {
		return BitUtil.Has(GameGlobal.actorModel.mSaveData, value)
	}

	public static SetData(index: number, value: boolean): void {
		GameGlobal.actorModel.mSaveData = BitUtil.Set(GameGlobal.actorModel.mSaveData, index, value)
		this.Send()
	}

	public static GetValue(index: number): number {
		let value = GameGlobal.actorModel.mSaveDataList[index]
		if (value == null) {
			value = FuncOpenModel.DEF_VALUE[index]
		}
		return value || 0
	}

	public static SetValue(index: number, value: number): void {
		let oldValue = GameGlobal.actorModel.mSaveDataList[index]
		if (oldValue == value) {
			return
		}
		GameGlobal.actorModel.mSaveDataList[index] = value
		this.Send()
	}
}