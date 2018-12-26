class BattleTurnDataParse {

	public static readonly TYPE_ROUND			= 0		// 下一回合
	public static readonly TYPE_USESKILL		= 1		// 使用技能
	public static readonly TYPE_USEACTION		= 2		// 技能行为
	public static readonly TYPE_ACTIONHP		= 3		// 行为改变血量
	public static readonly TYPE_ACTIONBUFF		= 4		// 行为添加buff
	public static readonly TYPE_BUFFHP			= 5		// buff改变血量
	public static readonly TYPE_DEAD			= 6		// 死亡
	public static readonly TYPE_OUTBOUND		= 7		// 出战
	public static readonly TYPE_BUFFSTATUSHP	= 8		// buff状态改变血量
	public static readonly TYPE_BUFFSTATUSACT 	= 9		// buff状态生效
	public static readonly TYPE_RELIVE		 	= 10	// 复活
	public static readonly TYPE_REMOVEBUFF		= 11	// 移除buff

	public static readonly TYPE_FINISH 			= 9999	// 结束

	public static Parse(rsp: Sproto.sc_battle_action_request) {
		let turnDatas: BUnitAction[][] = []
		let datas: BUnitAction[] = []
		for (let data of rsp.events) {
			let turnData = this.ParseData(data)
			if (data.type == 0) {
				datas = []
				turnDatas.push(datas)
				datas.push(turnData)
			} else {
				datas.push(turnData)
			}
		}
		return turnDatas
	}


	public static ParseDatas(datas: Sproto.battle_event[]): BUnitAction[] {
		if (!datas) {
			return null
		}
		let list = []
		for (let data of datas) {
			let item = this.ParseData(data)
			if (item) {
				list.push(item)
			}
		}
		return list
	}


	public static ParseData(data: Sproto.battle_event): BUnitAction {
		let type = data.type
		if (type == BattleTurnDataParse.TYPE_ROUND) {
			return new BTurnStartAction()
		} else if (type == BattleTurnDataParse.TYPE_USESKILL) {
			return this.CreateBattleSkillAction(data)
		} else if (type == BattleTurnDataParse.TYPE_USEACTION) {
			return BUseSkillAtkAction.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_ACTIONHP) {
			return BattleDamageBaseData.Create(data) as any
		} else if (type == BattleTurnDataParse.TYPE_DEAD) {
			return this.CreateDeadAction(data)
		} else if (type == BattleTurnDataParse.TYPE_OUTBOUND) {
			return BOutBound.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_BUFFSTATUSHP) {
			return BBuffStatusHpAction.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_BUFFSTATUSACT) {
			return BBuffStateAct.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_RELIVE) {
			return BReliveAction.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_BUFFHP) {
			return BBuffChangeHpAction.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_ACTIONBUFF) {
			return BAddBuffAction.Create(data)
		} else if (type == BattleTurnDataParse.TYPE_REMOVEBUFF) {
			return BRemoveBuffAction.Create(data)
		} else {
			console.warn("not ParseData type => " + type)
			return null
		}
	}

	public static CreateDeadAction(data: Sproto.battle_event): BDeadAction {
		return new BDeadAction
	}

	public static CreateBattleSkillAction(data: Sproto.battle_event): BUnitAction {
		let action = new BUseSkillAction
		action.skillId = data.id
		action.targets = data.targets
		action.src = data.src
		for (let d of data.actions) {
			let data = this.ParseData(d)
			if (data) {
				if (d.type == BattleTurnDataParse.TYPE_USEACTION) {
					(data as BUseSkillAtkAction).skill = action
				} else {
					console.warn("battle not impl type => " + d.type)
				}
				action.actions.push(data)
			}
			// action.actions = this.ParseDatas(data.actions)
		}
		return action
	}
	
}