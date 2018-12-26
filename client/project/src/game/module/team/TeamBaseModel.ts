class TeamBaseModel extends BaseSystem {

	private m_Team: { [key: number]: number[] } = {}

	// 最后选中的副本
	public mSelectKey: number

	public mRaidType: number
	public mTeamInfo: MyTeamInfo
	public mTeamList: { [key: number]: Sproto.team_data[] } = {}

	protected mConfigData: TeamConfigData

	protected constructor(type: number) {
		super()
		this.mRaidType = type
		this.mTeamInfo = new MyTeamInfo
		TeamBaseModelMsg.Add(this)
	}

	private _NotifyTeamListData() {
		this.m_Team = null
		GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_UPDATE_MAP_LIST)
	}

	public _ChageTeam(rsp: Sproto.sc_team_one_request) {
		let list = this.mTeamList[rsp.level]
		if (!list) {
			list = this.mTeamList[rsp.level] = []
		}

		let members = rsp.members || []
		members.sort(function (lhs, rhs) {
			if (lhs.dbid == rsp.leaderid) {
				return -1
			}
			if (rhs.dbid == rsp.leaderid) {
				return 1
			}
			return -1
		})

		let has = false
		for (let data of list) {
			if (data.leaderid == rsp.leaderid) {
				data.count = members.length
				data.members = members
				data.needpower = rsp.needpower
				has = true
				break
			}
		}
		if (!has && members.length) {
			let team = new Sproto.team_data;
			team.leaderid = rsp.leaderid
			team.members = members
			team.needpower = rsp.needpower
			team.count = members.length
			list.push(team)
		}

		for (let mem of members) {
			if (mem.dbid == GameGlobal.actorModel.actorID) {
				GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO)
				break
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST)
		this._NotifyTeamListData()
	}

	private _RemoveSelfFromTeam(level: number, leaderId: number) {
		let actorId = GameGlobal.actorModel.actorID
		if (this.mTeamList[level]) {
			for (let data of this.mTeamList[level]) {
				if (leaderId == data.leaderid) {
					let i = 0
					for (let mem of data.members) {
						if (mem.dbid == actorId) {
							data.members.splice(i, 1)
							break
						}
						++i
					}
					break
				}
			}
		}
	}

	public _DoTeamInfo(rsp: Sproto.sc_team_info_request) {
		var teamInfo = this.mTeamInfo
		if (!rsp) {
			this._RemoveSelfFromTeam(teamInfo.level, teamInfo.leaderid)
			teamInfo.Clear()
		} else {
			teamInfo.parser(rsp);
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST)

		this._NotifyTeamListData()
	}

	public _DoTeamList(rsp: Sproto.sc_team_list_request) {
		let datas = rsp.teamlist
		if (!datas) {
			return
		}
		for (let data of datas) {
			let mems = data.members || []
			mems.sort(function (lhs, rhs) {
				if (lhs.dbid == data.leaderid) {
					return -1
				}
				if (rhs.dbid == data.leaderid) {
					return 1
				}
				return -1
			})
		}
		this.mTeamList[rsp.level] = rsp.teamlist
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_LIST)

		this._NotifyTeamListData()
	}

	public SendGetMyTeamInfos() {
		let req = new Sproto.cs_team_info_request
		this.Rpc(C2sProtocol.cs_team_info, req);
	}

	/**设置队伍加入条件 */
	public SendGetTeamCondition(level: number, needpower: number) {
		let req = new Sproto.cs_team_condition_request
		req.level = level;
		req.needpower = needpower;
		req.raidtype = this.mRaidType;
		this.Rpc(C2sProtocol.cs_team_condition, req);
	}

	public SendGetTeamList(level: number) {
		let req = new Sproto.cs_team_list_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_list, req)
	}

	public SendCreateTeam(level: number) {
		if (!this.InnerCheckEnter(level)) {
			return
		}
		let req = new Sproto.cs_team_create_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_create, req, this._DoCreate, this)
	}

	public _DoCreate(rsp: Sproto.cs_team_create_response) {

	}

	public SendQuickJoin(level: number) {
		if (!this.InnerCheckEnter(level)) {
			return
		}
		let req = new Sproto.cs_team_quick_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_quick, req, this._DoQuickJoin, this)
	}

	public _DoQuickJoin(rsp: Sproto.cs_team_join_response) {

	}

	public SendJoin(level: number, leaderId: number) {
		if (!UserFb.CheckFighting()) {
			return
		}
		if (!this.InnerCheckEnter(level)) {
			return
		}
		let req = new Sproto.cs_team_join_request
		req.raidtype = this.mRaidType
		req.level = level
		req.leaderid = leaderId
		this.Rpc(C2sProtocol.cs_team_join, req, this._DoJoin, this)
	}

	public _DoJoin(rsp: Sproto.cs_team_join_response) {
		if (!rsp.ret) {
			// //八十一难
			// if(ViewIndexDef.TYPE_1063)
			// {
			// 	if(GameGlobal.TsumKoBaseModel.IsOpenViewReturn()!=false)
			// 		//UserTips.ins().showTips("队伍不存在，不可加入");
			// }
			// else
			// {
			// 	UserTips.ins().showTips("队伍不存在，不可加入")
			// }
		}
	}

	public SendLeave(level: number) {
		let req = new Sproto.cs_team_leave_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_leave, req, this._DoLeave, this)
	}

	private _DoLeave(rsp: Sproto.cs_team_leave_response) {
		let info = this.mTeamInfo
		this._RemoveSelfFromTeam(info.level, info.leaderid)
		this.mTeamInfo.Clear()
		GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MYINFO)
		GameGlobal.MessageCenter.dispatch(MessageDef.TEAM_UPDATE_LEAVE)

		this._NotifyTeamListData()
	}

	public SendKick(level: number, memberid: number) {
		let req = new Sproto.cs_team_kick_request
		req.raidtype = this.mRaidType
		req.level = level
		req.memberid = memberid
		this.Rpc(C2sProtocol.cs_team_kick, req, this._DoKick, this)
	}

	private _DoKick() {

	}

	public SendFight(key: number) {
		this.mSelectKey = key
		let req = new Sproto.cs_team_fight_request
		req.raidtype = this.mRaidType
		req.level = key
		this.Rpc(C2sProtocol.cs_team_fight, req, this._DoFight, this)
	}

	private _DoFight() {

	}

	public SendCallRobot(level: number) {
		let req = new Sproto.cs_team_call_robot_request
		req.raidtype = this.mRaidType
		req.level = level
		this.Rpc(C2sProtocol.cs_team_call_robot, req, this._DoFight, this)
	}

	protected InnerCheckEnter(id: number): boolean {
		if (UserWarn.CheckBagCapacity()) {
			return this.CheckEnter(id)
		}
		return false
	}

	public GetConfigData(data: any): TeamConfigData {
		if (data) {
			this.mConfigData.Init(data)
			return this.mConfigData
		}
		return null
	}

	protected CheckEnter(id: number): boolean {
		return false
	}

	public GetConfig(): any[] {
		return []
	}

	public GetCount(): number {
		return 0
	}

	public GetAllTeam() {
		if (!this.m_Team) {
			this.m_Team = {}
			for (let data in this.mTeamList) {
				let teams = this.mTeamList[Number(data)]
				for (let i = 0; i < teams.length; i++) {
					let mems = teams[i].members
					let list = []
					for (let mem of mems) {
						list.push(mem.dbid)
					}
					this.m_Team[teams[i].leaderid] = list
				}
			}
		}
		return this.m_Team
	}
}

class TeamBaseModelMsg {

	private mShowTeamType = {
		[UserFb.FB_TYPE_CROSSTEAMFB]: true,
		[UserFb.FB_TYPE_GUILDFB]: true,
		[UserFb.FB_TYPE_LIFE_DEATH_PLUNDER]:true,
	}
	private mTeamList: { [key: number]: TeamBaseModel } = {}

	private static mIns: TeamBaseModelMsg

	public static Add(model: TeamBaseModel) {
		if (!this.mIns) {
			this.mIns = new TeamBaseModelMsg
		}
		this.mIns.mTeamList[model.mRaidType] = model
	}

	public static HasTeam(): number {
		let self = TeamBaseModelMsg.mIns
		for (let k in self.mShowTeamType) {
			if (self.mTeamList[k] && self.mTeamList[k].mTeamInfo.HasTeam()) {
				return Number(k)
			}
		}
		return 0
	}

	public static GoHasTeamPanel(): void {
		let fbId = this.HasTeam()
		if (fbId) {
			if (fbId == UserFb.FB_TYPE_CROSSTEAMFB) {
				ViewManager.ins().open(CrossMainPanel)
			} else if (fbId == UserFb.FB_TYPE_GUILDFB) {
				ViewManager.ins().open(GangMainWin, 1)
			}
			else if(fbId == UserFb.FB_TYPE_LIFE_DEATH_PLUNDER) //八十一難
			{
				ViewManager.ins().open(TsumKoBasePanel)
			}
			else {
				console.error("not fbId = > " + fbId)
			}
		}
	}

	/**
	 * 退出所有组队副本
	 */
	public static Exit() {
		if (!this.mIns) {
			return
		}
		let list = this.mIns.mTeamList
		for (let key in list) {
			let data = list[key]
			if (data.mTeamInfo.HasTeam()) {
				data.SendLeave(data.mTeamInfo.level)
			}
		}
	}

	constructor() {
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_info, this._DoTeamInfo, this)
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_list, this._DoTeamList, this)
		Sproto.SprotoReceiver.AddHandler(S2cProtocol.sc_team_one, this._ChageTeam, this)
	}

	public _ChageTeam(rsp: Sproto.sc_team_one_request) {
		let model = this.mTeamList[rsp.raidtype]
		if (model) {
			model._ChageTeam(rsp)
		}
	}


	private _DoTeamInfo(rsp: Sproto.sc_team_info_request) {
		if (!rsp.raidtype) {
			for (let key in this.mTeamList) {
				this.mTeamList[key]._DoTeamInfo(null)
			}
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MAIN_INFO)
		} else {
			let model = this.mTeamList[rsp.raidtype]
			if (model) {
				model._DoTeamInfo(rsp)
			}
		}
		if (this.mShowTeamType[rsp.raidtype]) {
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_TEAM_MAIN_INFO)
		}
	}

	private _DoTeamList(rsp: Sproto.sc_team_list_request) {
		let model = this.mTeamList[rsp.raidtype]
		if (model) {
			model._DoTeamList(rsp)
		}
	}
}