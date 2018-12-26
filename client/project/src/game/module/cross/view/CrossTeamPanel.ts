class CrossTeamPanel  extends TeamBasePanel {
    public static NAME = "跨服组队";

    public constructor() {
        super()
        this.m_Model = GameGlobal.CrossTeamModel
		let config = GameGlobal.Config.CrossTeamConfig
		// this.mTime = new TeamTime(config.autoQuickTIme, config.autoFightTime)
		// this.mTime.Reset()
    }

	public childrenCreated() {
		super.childrenCreated()
		let config = GameGlobal.Config.CrossTeamConfig
		this.teamBaseMemberView.SetTime(config.autoQuickTIme, config.autoFightTime)
	}

	protected InitInfo(): void {
		GameGlobal.CrossTeamModel.SendGetInfos()
		this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateInfo)
		this.UpdateInfo()
	}
	
	private UpdateInfo(): void {
		let config = GameGlobal.Config.CrossTeamConfig
		this.infoLabel.text = GameGlobal.CrossTeamModel.GetDesc()
		// this.count_label.text = `剩余收益次数\n${GameGlobal.CrossTeamModel.mCount}/${config.rewardCount}`
		this.teamBaseMemberView.SetCountLabel(`剩余收益次数\n${GameGlobal.CrossTeamModel.mCount}/${config.rewardCount}`)
	}

	protected GetFirstShowKey(): number {
		let list = this.m_Model.GetConfig()
		let key = null
		for (let data of list) {
			if (GameGlobal.actorModel.level >= data.level) {
				key = data.level
			} else {
				break
			}
		}
		return key
	}
	
	// protected IsNotEnter(level: number): string {
    //     let config = GameGlobal.Config.CrossTeamFbConfig[level]
	// 	if (!config) {
	// 		return ""
	// 	}
	// 	if (GameGlobal.actorModel.level < config.level) {
	// 		return "等级达到" + config.level + "级开启"
	// 	}
    //     return ""
	// }
	
    public static RedPointCheck(): boolean {
        return GameGlobal.CrossTeamModel.IsDoubleReward()
    }
}