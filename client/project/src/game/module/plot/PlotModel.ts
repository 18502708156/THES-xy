class PlotModel extends BaseSystem {
	public constructor() {
		super()
	}

	private m_Task: {[key: number]: number} = {}
	private m_ChapterEnter: {[key: number]: number} = {}
	private m_ChapterExit: {[key: number]: number} = {}

	public Init() {
		let config = GameGlobal.Config.StoryConfig
		for (let k in config) {
			let data = config[k]
			if (data.type) {
				let type = data.type.type
				let id = data.type.id
				switch (type) {
					case 0:
						this.m_ChapterEnter[id] = data.id
					break
					case 1:
						this.m_Task[id] = data.id
					break
					case 2:
						this.m_ChapterExit[id] = data.id
					break
				}
			}
		}
	}

	private OnPlot(dict: any, id: number) {
		let data = dict[id]
		if (!data) {
			return false
		}
		delete dict[id]
		let storyid = GameGlobal.Config.StoryConfig[data].storyid
		PlotPanel.OpenPlot(storyid, id)
		return true
	}

	public OnTaskFinish(id: number) {
		return this.OnPlot(this.m_Task, id)
	}

	public OnChapterBattleEnter(id: number) {
		return this.OnPlot(this.m_ChapterEnter, id)
	}

	public OnChapterExit(id: number) {
		return this.OnPlot(this.m_ChapterExit, id)
	}
}