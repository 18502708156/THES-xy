class XiandaoRecordData {
	public trunId: number
	public name1: string
	public server1: number
	public name2: string
	public server2: number
	public isWin: boolean

	public Parse(data: Sproto.qualifyingMgr_fight_data) {
		this.isWin = data.win
		this.name1 = data.name1
		this.server1 = data.server1
		this.name2 = data.name2
		this.server2 = data.server2
	}
}