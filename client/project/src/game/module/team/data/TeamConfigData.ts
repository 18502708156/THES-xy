interface TeamConfigData {
	Init(config: any)
	GetFirstDropShow()
	GetDropShow()
	GetShowItem()
	GetSuggest(): number
	GetUititle(): string
	GetBossId(): number
	GetKey(): number
}


class GuildTeamConfigData implements TeamConfigData {
	
	private config: any	

	public Init(config: any) {
		this.config = config
	}

	public GetFirstDropShow() {
		return this.config.firstdropshow
	}

	public GetDropShow() {
		return this.config.dropshow
	}

	public GetShowItem() {
		return this.config.showItem
	}

	public GetSuggest() {
		return this.config.suggest
	}

	public GetUititle() {
		return this.config.uititle
	}

	public GetBossId() {
		return this.config.bossid
	}

	public GetKey() {
		return this.config.id
	}
}

class CrossTeamConfigData implements TeamConfigData {
	
	private config: any	

	public Init(config: any) {
		this.config = config
	}

	public GetFirstDropShow() {
		return this.config.firstRewards
	}

	public GetDropShow() {
		return this.config.normalRewards
	}

	public GetShowItem() {
		return this.config.luckRewards
	}

	public GetSuggest() {
		return 0
	}

	public GetUititle() {
		// return this.config.level + "级副本"
		return this.config.uititle
	}

	public GetBossId() {
		return this.config.bossid
	}

	public GetKey() {
		return this.config.level
	}
}