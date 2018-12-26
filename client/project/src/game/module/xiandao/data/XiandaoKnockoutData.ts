class XiandaoKnockoutData {
	public roleDatas: {[key: number]: XiandaoKnockoutRoleData} = {}
	public roleNoList: number[] = []
	// 8强，4强，2强，冠军
	public turnDatas: XiandaoKnockoutTurn[][] = [[], [], [], []]
}

class XiandaoKnockoutTurn {
	noA: number
	noB: number
	winNo: number
	fightRecord: number[] = []

	winPart: number = 0

	public Parse(rsp: Sproto.qualifying_rank_data) {
		this.noA = rsp.noA
		this.noB = rsp.noB
		this.winNo = rsp.winNo
		this.fightRecord = rsp.fightRecord || []

		let list = {}
		for (let data of this.fightRecord) {
			if (list[data]) {
				if (++list[data] >= 2) {
					this.winNo = data == 1 ? this.noA : this.noB
					this.winPart = data
					break
				}
			} else {
				list[data] = 1
			}
		}
	}
}

class XiandaoKnockoutRoleData {
	public no: number = 0
	public roleName: string = ""
	public serverId: number = 0
	public lv: number = 1
	public power: number = 0
	public shows: Sproto.entity_shows

	public Parse(rsp: Sproto.qualifying_player_data) {
		this.no = rsp.no
		this.lv = rsp.lv
		this.power = rsp.power
		this.roleName = rsp.name
		this.serverId = rsp.server
		this.shows = rsp.shows
		this.shows.job = rsp.job
		this.shows.sex = rsp.sex
		this.shows.name = rsp.name
	}
}