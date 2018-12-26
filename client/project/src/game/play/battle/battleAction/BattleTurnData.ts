class BUseSkillAction extends BUnitListAction {
	public mType = BattleTurnDataParse.TYPE_USESKILL

	public skillId: number
	public src: number
	public targets: number[]
	public actions: BUnitAction[] = []

	public Init(context: BattleRaid) {
		super.Init(context)
		this.mList = this.actions
		let srcEntity = context.GetEntity(this.src);
		if (!srcEntity) {
			console.log("not found entity => " + this.src)
			return
		}
		let entityData = srcEntity.GetInfo()

		this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.STAND, false))
		this.mList.push(BUnitJumpAction.Create(entityData.x, entityData.y, srcEntity))
		this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.STAND, false))
	}
}

class CatchSkillAction extends BUnitListAction {
	public mType = BattleTurnDataParse.TYPE_USESKILL

	public skillId: number
	public src: number
	public targets: number[]
	public actions: BUnitAction[] = []

	public Init(context: CatchPetRaid) {
		super.Init(context)
		this.mList = this.actions
		let srcEntity =  context.mEntityList[this.src]
		let entityData = srcEntity.GetInfo()
		let tage = context.mEntityList[this.targets[0]]

		this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.ATTACK, false))                     /*施法 */

		let list = new BUnitParallelAction
		list.mList.push(BUnitJumpAction.Create(entityData.x, entityData.y, srcEntity))
		list.mList.push(BUnitJumpAction.CreateByTarget(srcEntity, tage))
		this.mList.push(list)

		if(!GameGlobal.CatchPetModel.result){
			this.mList.push(BUnitJumpAction.Create(tage.GetInfo().x, tage.GetInfo().y, tage))
		}
	}	
}

class BTurnStartAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_ROUND
}


class BDeadAction extends BUnitAction {
	public mType = BattleTurnDataParse.TYPE_DEAD
}

class BattleAction {
	public type: string
	public src: number

	public Excute(context: BattleRaid): void {

	}

}

interface IBattleAttackEvent {
	type: string
	Create(): AIUnitAction
}

class BattleAttackEventProtect implements IBattleAttackEvent {
	public type = "protect"

	public handle: number
	public beHandle: number 	// 受保护的对象

	public constructor(handle: number, beHandle: number) {
		this.handle = handle
		this.beHandle = beHandle
	}

	Create(): AIUnitAction {
		return AIUnitTriggerProtectAction.CreateByData(this.handle, this.beHandle)
	}
}

class BattleAttackEventBlock implements IBattleAttackEvent {
	public type = "block"

	public handle: number
	public beHandle: number 	// 受保护的对象

	public constructor(handle: number, beHandle: number) {
		this.handle = handle
		this.beHandle = beHandle
	}

	Create(): AIUnitAction {
		return AIUnitTriggerBlockAction.CreateByData(this.handle, this.beHandle)
	}
}