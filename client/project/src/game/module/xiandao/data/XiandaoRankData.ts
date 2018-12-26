
// 仙道排行数据
class XiandaoRankData {
	public rank: number = 0
	public roleName: string = ""
	public serverId: number = 0
	public score: number = 0
	public power: number = 0

	public Parse(data: Sproto.qualifyingMgr_rank_data) {
		this.roleName = data.name
		this.serverId = data.server
		this.score = data.point
	}

	public GetRank(): string {
		if (this.rank) {
			return this.rank + ""
		}
		return "未上榜"
	}

	public GetPower(): string {
		return CommonUtils.overLength(this.power)
	}
}