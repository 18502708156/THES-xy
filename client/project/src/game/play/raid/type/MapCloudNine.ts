class MapCloudNine extends CommonMapRaid {

	private view: CloudNineSceneView

	public constructor() {
		super()
	}

	public OnEnter() {
		super.OnEnter()
		let panel = ViewManager.ins().getView(GameMapPanel) as GameMapPanel
		panel.setOnLeaveDlgStr("退出后进入冷却时间" + GameGlobal.Config.ClimbTowerBaseConfig.cd + "秒");
		if (!this.view) {
			this.view = new CloudNineSceneView
		}
		this.AddView(this.view)
	}

	public GetEntityNameStyle(info: EntityData): string {
		return this.GetEntityNameStyleSvr(info)
	}

	// 角色点击
	public OnEntityClick(handle: number) {
		if (!GameGlobal.CloudNineModel.checkPk(handle)) {
			let monsterServersId = GameGlobal.CloudNineModel.getMonsterServersId(handle)
			if (monsterServersId) {
				if (!GameGlobal.CloudNineModel.checkPk(monsterServersId))
					GameGlobal.CloudNineModel.sendPk(monsterServersId)
				else
					GameGlobal.UserTips.showTips("目标战斗中");
			}
			else
				GameGlobal.CloudNineModel.sendPk(handle)
		}
		else
			GameGlobal.UserTips.showTips("目标战斗中");
	}

	public Create(entityData: EntityData): MapEntity {
		let entity = super.Create(entityData)
		if (entity) {
			entity.SetClick();
		}
		return entity
	}

	public OnExit() {
		super.OnExit()
		ViewManager.ins().close(CloudNineSceneView)
	}
	public Clear() {
		super.Clear()
	}

	public OnLeave() {
		GameGlobal.CloudNineModel.sendLeave();
	}
}