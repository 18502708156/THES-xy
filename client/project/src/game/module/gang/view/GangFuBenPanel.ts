class GangFuBenPanel extends TeamBasePanel {
    public static NAME = "帮会副本";

    public constructor() {
        super()
        this.m_Model = GameGlobal.GuildTeamModel
		let config = GameGlobal.Config.GuildFubenBaseConfig
		// this.mTime = new TeamTime(config.aotuteam, config.fubenaotu)
		// this.mTime.Reset()
    }

	public childrenCreated() {
		super.childrenCreated()
		let config = GameGlobal.Config.GuildFubenBaseConfig
		this.teamBaseMemberView.SetTime(config.aotuteam, config.fubenaotu)
	}

	// protected IsNotEnter(id: number): string {
    //     let config = GameGlobal.Config.GuildFubenConfig[id]
	// 	if (!config) {
	// 		return ""
	// 	}
	// 	if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
	// 		return "帮会等级达到" + config.needlv + "级开启"
	// 	}
    //     return ""
	// }

	protected InitInfo(): void {
		GameGlobal.GuildTeamModel.SendGetInfos()
		this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateInfo)
		this.UpdateInfo()
	}

	protected GetFirstShowKey(): number {
		let list = this.m_Model.GetConfig()
		let key = null
		for (let data of list) {
			if (GameGlobal.GangModel.myGangInfo.mLevel >= data.needlv) {
				key = data.id
			} else {
				break
			}
		}
		return key
	}
	
	private UpdateInfo(): void {
		let config = GameGlobal.Config.GuildFubenBaseConfig
		let info = GameGlobal.GuildTeamModel.mDungeonInfo
		this.infoLabel.text = `协助他人通关副本，可获得协助奖励，每天协助次数(${GameGlobal.GuildTeamModel.GetAssistCount()}/${config.assistcount})`
		// this.count_label.text = `剩余收益次数\n${GameGlobal.GuildTeamModel.GetProfitCount()}/${config.profitCount}`
		this.teamBaseMemberView.SetCountLabel(`剩余收益次数\n${GameGlobal.GuildTeamModel.GetProfitCount()}/${config.profitCount}`)
	}
}
