class DabiaoRankData {
	prase(e: Sproto.activity_dabiao_data, type: number) {

		this.name = e.name
		this.numType = e.value
		
	}

	rankIndex: number
	id: number
	name: string
	numType: number
	level: number
	zsLevel: number
	monthCard: number
	vipLv: number
}