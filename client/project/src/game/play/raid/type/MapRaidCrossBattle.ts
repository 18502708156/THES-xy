class MapRaidCrossBattle extends CommonMapRaid {

	protected m_HelpId: number = 23

	public constructor() {
		super()
	}

	public Init() {
		super.Init()
		GameMap.GetMap().addMapCity()
	}

	public Clear() {
		super.Clear()
		GameMap.GetMap().removeMapCity()
		GameGlobal.ViewManagerImpl.Destroy(CrossBattleWin)
	}

	public OnEnter() {
		super.OnEnter()

		GameGlobal.MessageCenter.addListener(MessageDef.FUHUO_UPDATE_INFO, this._DoFuHuoUpData, this);
		this._DoFuHuoUpData()

		GameGlobal.ViewManagerImpl.Open(CrossBattleWin)

		let view = this.GetGameMapPanel()
		if (view) {
			view.helpBtn.y = 230
		}
	}

	public OnExit() {
		super.OnExit()
		GameGlobal.ViewManagerImpl.Close(CrossBattleWin)

		GameGlobal.MessageCenter.removeAll(this)
	}

	protected GetRebornYb(): IRewardData {
		return GameGlobal.Config.KingBaseConfig.revivecost
	}

	protected SendRelive(): void {
		GameGlobal.CrossBattleModel.fuHuo();
	}

	private _DoFuHuoUpData() {
		let time = GameGlobal.CrossBattleModel.GetDeadTime()
		if (time > 0) {
			this.ShowRebornView(time)
		} else {
			this.RemoveRebornView()
		}
	}

	public MoveOrder(orderId: number, localX: number, localY: number): boolean {
		// if(GameGlobal.CrossBattleModel.status == 1){
		// 	UserTips.ErrorTip("活动未开始，请在出生点等待")
		// 	return 
		// }
		if (GameGlobal.CrossBattleModel.status == 3) {
			UserTips.ErrorTip("无法移动，处于死亡状态")
			return
		}
		if (GameGlobal.CrossBattleModel.status == 4) {
			UserTips.ErrorTip("无法移动，处于守城状态")
			return
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.MOVE_UPDATE_INFO, localX, localY)
		return super.MoveOrder(orderId, localX, localY)
	}

	public Create(entityData: EntityData): MapEntity {
		let entity = super.Create(entityData)
		if (entity) {
			entity.SetClick();
		}
		GameGlobal.CrossBattleModel.DelayAddfightingIcon()
		return entity
	}

	// 角色点击
	public OnEntityClick(handle: number) {
		if (GameGlobal.CrossBattleModel.status == 1 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 1) {
			UserTips.ErrorTip("活动未开始，请在出生点等待")
			return
		}
		if (GameGlobal.CrossBattleModel.status == 3 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 3) {
			UserTips.ErrorTip("无法攻击，处于死亡状态")
			return
		}
		if (GameGlobal.CrossBattleModel.status == 4 || GameGlobal.CrossBattleModel.getPlayerStatus(handle) == 4) {
			UserTips.ErrorTip("无法攻击，处于守城状态")
			return
		}
		GameGlobal.CrossBattleModel.freePk(handle)
	}

	public OnMoveLeval(orderId: number, handle: number, taget_x: number, taget_y: number) {
		GameGlobal.CrossBattleModel.getCity(orderId, handle)
	}

	public OnLeave() {
		GameGlobal.CrossBattleModel.kingLeave()
		// 退出的时候清理组队数据
		GameGlobal.CrossBattleTeamModel.mTeamInfo.Clear()
	}

	public UpdatePlayerStatus(id: number, status: number): void {
		// 跨服争霸不处理通用状态更新信息
	}

	protected GetTeamModel(): TeamBaseModel {
		return GameGlobal.CrossBattleTeamModel
	}
}