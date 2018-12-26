class DestinyRedPoint extends IRedPoint {

	public static INDEX_UPGRADE = 0

	private m_Upgrade: {[key: number]: boolean} = {}

	public constructor() {
		super()
	}
	
	/**
	 * 检查索引对应的方法
	 */
	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[DestinyRedPoint.INDEX_UPGRADE]: this.GetIndexEquip
		}
	}

	/**
	 * 事件定义，根据事件类型更新状态
	 */
	public GetMessageDef(): string[] {
		return [
			MessageDef.DESTINY_CHANGE,
			MessageDef.DESTINY_UP_ITEM
		]
	}

	/**
	 * 如果某个索引状态发生变化，会回调这个方法，子类重写这个用来广播事件
	 */
	protected OnChange(index: number): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.DESTINY_RP)
	}

	private GetIndexEquip() {
		this.m_Upgrade = {}
		let list = GameGlobal.DestinyController.getUseDestinyData() || []
		let index = 0
		for (let data of list) {
			let i = index++
			if (data && data.level && data.id) {
				let config = GameGlobal.Config.DestinyResolveConfig[data.type][data.level - 1]
				if (!config) {
					continue
				}
				let upId = GameGlobal.Config.DestinyBaseConfig.uplevelitemid
				var curNum = GameGlobal.UserBag.GetCount(upId);
				if (curNum >= config.promotestar) {
					this.m_Upgrade[i] = true
				}
			}
		}
		for (let key in this.m_Upgrade) {
			if (this.m_Upgrade[key]) {
				return true
			}
		}
		return false
	}

	public IsRedUp(index: number) {
		return this.m_Upgrade[index]
	}
}