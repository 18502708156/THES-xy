class BOutBound extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_OUTBOUND

	public id: number
	public target: number

	private m_Create: number
	private m_MoveData: AIUnitMoveData

	public static Create(data: Sproto.battle_event): BOutBound {
		let action = new BOutBound
		action.target = data.target
		action.id = data.id
		return action
	}

	public OnUpdate(delta: number): AIUnitReturn {
		if (this.m_Create == null) {
			let handle = this.DoExecute()
			if (handle) {
				let entity = this.mContext.GetEntity(handle)
				if (entity) {
					let pos = egret.$TempPoint
					let info = entity.GetInfo()
					BattleCtrl.GetPos(info.IsSide(), info.posIndex + 5, pos)
					let x = entity.x
					let y = entity.y
					entity.SetPos(pos.x, pos.y)
					this.m_MoveData = new AIUnitMoveData
					this.m_MoveData.Init(pos.x, pos.y, x, y, MoveTeam.MOVE_SPEED * 2, 0)
				}
			}
			this.m_Create = handle || 0
			return AIUnitReturn.CONTINUE
		} else {
			let entity = this.mContext.GetEntity(this.m_Create)
			if (entity && this.m_MoveData) {
				let pos = egret.$TempPoint
				let ret = this.m_MoveData.Update(delta, pos)
				entity.SetPos(pos.x, pos.y)
				if (ret == AIUnitMoveData.STATE_FINISH) {
					this.m_MoveData = null
					return AIUnitReturn.NEXT
				}
				return AIUnitReturn.CONTINUE
			}
		}
		return AIUnitReturn.NEXT
	}

	protected DoExecute() {
		for (let data1 of this.mContext.mEntityDatas) {
			for (let data2 of data1) {
				if (data2.handle == this.target) {
					data2.posIndex = this.id
					this.mContext.Create(data2)	

					return data2.handle
				}
			}
		}
		return 0
	}
}