class GangBattleTeamModel  extends TeamBaseModel {
	 public constructor() {
		super(UserFb.FB_TYPE_GUILD_WAR)
	}

	protected InnerCheckEnter(id: number): boolean {
		return true
	}

	public SendRecruit() {
		this.Rpc(C2sProtocol.cs_guildwar_team_recruit)
	}
}
