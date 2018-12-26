class CrossBattleTeamModel extends TeamBaseModel {
	 public constructor() {
		super(UserFb.FB_TYPE_KING_CITY)
	}

	public _DoTeamInfo(rsp:Sproto.sc_team_info_request){
		let hasTeam = this.mTeamInfo.HasTeam()
		super._DoTeamInfo(rsp)
		if (!hasTeam && this.mTeamInfo.HasTeam()) {
			ViewManager.ins().open(CrossBattleTeamPanel);
		}
	}

	public _DoTeamList(rsp: Sproto.sc_team_list_request) {
		super._DoTeamList(rsp)
	}

	public _ChageTeam(rsp:Sproto.sc_team_one_request) {
         super._ChageTeam(rsp)
 	}

	public SendQuickJoin(level: number) {

		let req = new Sproto.cs_team_quick_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_quick, req, this._DoQuickJoin, this)
	}

	public SendCreateTeam(level: number) {
		let req = new Sproto.cs_team_create_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_create, req, this._DoCreate, this)
	}

	public SendJoin(level: number, leaderId: number,raidtype = this.mRaidType) {
		if (!UserFb.CheckFighting()) {
			return
		}
		let req = new Sproto.cs_team_join_request
		req.raidtype = raidtype
		req.level = level
		req.leaderid = leaderId
		this.Rpc(C2sProtocol.cs_team_join, req, this._DoJoin, this)
	}
}