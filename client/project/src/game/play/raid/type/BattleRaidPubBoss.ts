class BattleRaidPubBoss extends BattleRaid {

	private view: GameBattlePubBossView

	public constructor() {
		super()
	}

	protected ShowBattleLayer() {
		super.ShowBattleLayer()
		// 添加显示的视图
		let panel = ViewManager.ins().getView(GameBattlePanel) as GameBattlePanel
		if (!this.view) {
			this.view = new GameBattlePubBossView
		}
		panel.AddChildBaseView(this.view)
		this.view.UpdateHp(0, 0)
	}

	public OnEnter() {
		super.OnEnter()
		this.UpdateHp()
	}

	private UpdateHp() {
		if (this.mBossHandle) {
			let entity = this.GetEntity(this.mBossHandle)
			if (entity) {
				let info = entity.GetInfo()
				if (this.view) {
					this.view.UpdateHp(info.getAtt(AttributeType.atHp), info.getAtt(AttributeType.atMaxHp))
				}
			}
		}
	}

	// 血量更新事件
	public OnEventDamage(handle: number) {
		if (this.mBossHandle && this.mBossHandle == handle) {
			this.UpdateHp()
		}
	}
}