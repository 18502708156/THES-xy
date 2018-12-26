class CrossTeamModel extends CrossTeamBaseModel {

	public mCount: number = 0
	public clear: Sproto.fb_clear_count[] = []

	private m_Double: {start: number, end: number}[]

	public constructor() {
		super(UserFb.FB_TYPE_CROSSTEAMFB)
		this.mConfigData = new CrossTeamConfigData

		this.regNetMsg(S2cProtocol.sc_cross_team_reward_count, this._DoDungeonData)
	}

	public OnDayTimer() {
		this.m_Double = null
	}

	public SendGetInfos(){
		this.Rpc(C2sProtocol.cs_cross_team_reward_count)
	}	

	private _DoDungeonData(rsp: Sproto.sc_cross_team_reward_count_request) {
		this.mCount = rsp.count
		this.clear = rsp.clear || []
		GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_FUBEN_INFO)		
	}

	protected CheckEnter(level: number): boolean {
		let configData = GameGlobal.Config.CrossTeamFbConfig[level]
		if (!configData) {
			console.error("配置不存在 => " + level)
			return false
		}
		if (GameGlobal.actorModel.level < configData.level) {
			UserTips.InfoTip("玩家" + configData.level + "级才能进入")
			return false
		}
		return true
	}

	private m_ConfigList: any[]

	public GetConfig(): any[] {
		if (!this.m_ConfigList)	{
			this.m_ConfigList = CommonUtils.GetArray(GameGlobal.Config.CrossTeamFbConfig, "level")
		}
		return this.m_ConfigList
	}

	// 是否是双倍奖励
	public IsDoubleReward(): boolean {
		if (GameServer.serverOpenDay == 1) {
			return true
		}
		if (!this.m_Double) {
			let data = this.m_Double = []
			let config = GameGlobal.Config.CrossTeamConfig
			data.push({start: this.GetTimeNum(config.doubleBeginTimeSecond, -1), end: this.GetTimeNum(config.doubleEndTimeSecond)})
			data.push({start: this.GetTimeNum(config.doubleBeginTime), end: this.GetTimeNum(config.doubleEndTime)})
			data.push({start: this.GetTimeNum(config.doubleBeginTimeSecond), end: this.GetTimeNum(config.doubleEndTimeSecond, 1)})
		}
		let t = GameServer.serverTime * 1000
		for (let time of this.m_Double) {
			if (t >= time.start && t <= time.end) {
				return true
			}
		}
		return false
	}

	// 获取剩余收益次数
	public GetCount(): number {
		return this.mCount || 0
	}

	public GetDesc(): string {
		if (GameServer.serverOpenDay == 1) {
			return "全天银两和经验双倍收益，3人组队再加成30%"
		}
		let config = GameGlobal.Config.CrossTeamConfig
		return `${this.GetTimeStr(config.doubleBeginTime)}-${this.GetTimeStr(config.doubleEndTime)}和${this.GetTimeStr(config.doubleBeginTimeSecond)}-${this.GetTimeStr(config.doubleEndTimeSecond)}银两和经验双倍收益，3人组队再加成30%`
	}

	public GetDescForDaily() {
		if (GameServer.serverOpenDay == 1) {
			return "跨服组队银两和经验双倍收益"
		}
		let config = GameGlobal.Config.CrossTeamConfig
		return `${this.GetTimeStr(config.doubleBeginTime)}-${this.GetTimeStr(config.doubleEndTime)}和${this.GetTimeStr(config.doubleBeginTimeSecond)}-${this.GetTimeStr(config.doubleEndTimeSecond)}跨服组队银两和经验双倍收益`
	}

	private GetTimeNum(data, day: number = 0): number {
		let h = data.hour
		let m = data.minute
		let date = new Date()
		if (day) {
			date.setDate(date.getDate() + day)
		}
		date.setHours(h, m, 0, 0)
		return date.getTime()
	}

	private GetTimeStr(data): string {
		return DateUtils.formatTimeNum(data.hour) + ":" + DateUtils.formatTimeNum(data.minute)
	}

	public IsFirst(key: number) {
		for (let data of this.clear) {
			if (data.level == key) {
				return data.count < 1
			}
		}
		return true
	}

	public IsNotEnter(level: number): string 
	{
		
		let config = GameGlobal.Config.CrossTeamFbConfig[level]
		if (!config) {
			return ""
		}
		if (GameGlobal.actorModel.level < config.level) {
			return  config.level + "级开启"
		}
		return "";
	}
}