class GuildTeamModel extends CrossTeamBaseModel {

	public mDungeonInfo: Sproto.cs_guild_dungeon_info_response
	public index=-1;
	
	public constructor() {
		super(UserFb.FB_TYPE_GUILDFB)
		this.mConfigData = new GuildTeamConfigData
	}

	private m_ConfigList: any[]


	public SendGetInfos(){
		this.Rpc(C2sProtocol.cs_guild_dungeon_info, null, this._DoDungeonData, this)
	}	

	private _DoDungeonData(rsp: Sproto.cs_guild_dungeon_info_response) {
		this.mDungeonInfo = rsp
		GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_FUBEN_INFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.GANG_UPDATE_FBCOUNT)
	}

	public GetConfig(): any[] {
		if (!this.m_ConfigList)	{
			this.m_ConfigList = CommonUtils.GetArray(GameGlobal.Config.GuildFubenConfig, "id")
		}
		return this.m_ConfigList
	}

	protected CheckEnter(id: number): boolean {
		let configData = GameGlobal.Config.GuildFubenConfig[id]
		if (!configData) {
			console.error("配置不存在 => " + id)
			return false
		}
		if (GameGlobal.GangModel.myGangInfo.mLevel < configData.needlv) {
			UserTips.InfoTip("帮会" + configData.needlv + "级才能进入")
			return false
		}
		return true
	}

	public GetCount(): number {
		return this.GetProfitCount()
	}

	public GetAssistCount(): number {
		let config = GameGlobal.Config.GuildFubenBaseConfig
		let info = this.mDungeonInfo
		if (info) {
			return Math.max(config.assistcount - info.assistCount, 0)
		}
		return 0
	}

	public GetProfitCount(): number {
		let config = GameGlobal.Config.GuildFubenBaseConfig
		let info = this.mDungeonInfo
		if (info) {
			return Math.max(config.profitCount - info.profitCount, 0)
		}
		return 0
	}

	public IsFirst(key: number) {
		let info = this.mDungeonInfo
		if (info) {
			return info.firstReach.indexOf(key) == -1
		}
		return true
	}

	public IsNotEnter(id: number): string 
	{
		let config = GameGlobal.Config.GuildFubenConfig[id]
		if (!config) {
			return ""
		}
		if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
			return "帮会"+ config.needlv + "级开启"
		}
		return "";
	}
}