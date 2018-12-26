class MapRaidXiandao extends CommonMapRaid {

	private view: XiandaoSceneView

	public constructor() {
		super()
	}

	public OnEnter() {
		super.OnEnter()
		if (!this.view) {
			this.view = new XiandaoSceneView
		}
		this.AddView(this.view)
	}

	public Clear() {
		super.Clear()
		// 退出的时候清理定时器
		GameGlobal.XiandaoModel.ClearGetMapInfo()
	}
}