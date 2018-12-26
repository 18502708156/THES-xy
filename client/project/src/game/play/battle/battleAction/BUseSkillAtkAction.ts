
class BUseSkillAtkAction extends BUnitListAction {
	public mType = BattleTurnDataParse.TYPE_USEACTION

	public skill: BUseSkillAction
	public actionId: number
	public src: number
	public targets: number[]
	// public damages: BattleDamageBaseData[] = []
	// public buff: BAddBuffAction = null
	public event: BUnitAction[] = []

	public static Create(data: Sproto.battle_event): BUseSkillAtkAction {
		let atkAction = new BUseSkillAtkAction
		atkAction.actionId = data.id
		atkAction.src = data.src
		atkAction.targets = data.targets
		for (let item of BattleTurnDataParse.ParseDatas(data.actions)) {
			atkAction.event.push(item)
		}
		return atkAction
	}

	public Init(context: BattleRaid) {
		super.Init(context)
		let srcentity = context.GetEntity(this.src);
		if (!this.targets.length) {
			if (DEBUG) {
				console.warn("not target list !!!")
			}
			return
		}
		let target = this.targets[0]
		let entity = context.GetEntity(target)
		if (!entity) {
			console.error("not entity => ")
			return
		}
		let exeConfig =  GameGlobal.Config.SkillsExeConfig[this.actionId]
		if (!exeConfig) {
			console.error("not exeConfig => " + this.actionId)
			return
		}
		let exeConfigType = exeConfig[GameGlobal.Config.SkillsExeConfig_keys.type]
		if (exeConfigType == 1) {
			let list: BUnitAction[] = []
			let config = GameGlobal.Config.SkillEffConfig[GameGlobal.Config.SkillsConfig[this.skill.skillId][GameGlobal.Config.SkillsConfig_keys.effectId]]
			if (config) {
				if (config.wordEff) {
					list.push(BUnitPlayWordAction.Create(srcentity, config.wordEff))           //技能名显示
				}
				let animType = config.animType
				if (animType == 1) {
					list.push(BUnitJumpAction.CreateByTarget(entity, srcentity))
				} else if (animType == 3) {
					list.push(BUnitJumpAction.Create(BattleCtrl.POS_CENTER.x, BattleCtrl.POS_CENTER.y, srcentity))
				} else if (animType == 2) {
					// 不需要移动
				} else {
					console.error("not impl anim type => " + animType)
				}
			} else {
				list.push(BUnitJumpAction.CreateByTarget(entity, srcentity))
			}
			let type10List: BBuffStatusHpAction[] = null
			if (this.event) {
				for (let i = this.event.length - 1; i >= 0; --i) {
					let data = this.event[i]
					if (data.mType == BattleTurnDataParse.TYPE_BUFFSTATUSHP && ((data as BBuffStatusHpAction).IsLianji() || (data as BBuffStatusHpAction).IsFanji())) {
						if (!type10List) {
							type10List = []
						}
						type10List.push(data as any)
						this.event.splice(i, 1)
					}
				}
			}
			list.push(BUnitAtkAction.Create(context, srcentity, this.skill.skillId, [this.event]))
			if (type10List) {
				type10List.reverse()
				for (let data of type10List) {
					if (data.IsLianji()) {
						let tmpData = new BattleDamageBaseData
						tmpData.target = data.target
						tmpData.type = DamageTypes.BUFF_TYPE_10
						tmpData.value = data.args[1]
						if (data.HasDead()) {
							tmpData.Push(new BDeadAction)
						}

						list.push(BUnitAtkAction.Create(context, srcentity, this.skill.skillId, [[tmpData]]))
					} else if (data.IsFanji()) {
						let tmpData = new BattleDamageBaseData
						tmpData.target = data.target
						tmpData.type = DamageTypes.BUFF_TYPE_5
						tmpData.value = data.args[1]
						if (data.HasDead()) {
							tmpData.Push(new BDeadAction)
						}
						let entity = context.GetEntity(data.src)
						if (entity) {
							list.push(BDelayAction.Create(100))
							list.push(BUnitAtkAction.Create(context, context.GetEntity(data.src), EntityData.default_skill_ids[0], [[tmpData]]))
						}
					} else {
						console.warn("not impl type => ", data)
					}
				}
			}
			this.mList = list
		} else if (exeConfigType == 2) {
			// 直接执行结果
			this.mList = this.event
		} else {
			console.warn("not impl exeConfigType => " + exeConfigType)
		}
		
	}
}
