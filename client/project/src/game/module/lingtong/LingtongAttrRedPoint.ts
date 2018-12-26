class LingtongAttrRedPoint extends IRedPoint {

	public static readonly INDEX_ACTIVE = 0
	public static readonly INDEX_RANK = 1
	public static readonly INDEX_SKILL = 2
	
	public constructor() {
		super()
	}

	protected OnChange(index: number) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_LINGTONG)
	}

	public GetMessageDef(): string[] {
		let list = [
			MessageDef.LINGTONG_UPDATE_INFO,
			MessageDef.LINGTONG_ACT_ITEM,
			MessageDef.LINGTONG_RANK_ITEM,
			MessageDef.LINGTONG_SKILL_ITEM,
			MessageDef.DESTINY_CHANGE,
		]
		return list
	}

	protected GetCheckFuncList() {
		let dict = {
			[LingtongAttrRedPoint.INDEX_ACTIVE]: this.GetIndexAct,
			[LingtongAttrRedPoint.INDEX_RANK]: this.GetIndexRank,
			[LingtongAttrRedPoint.INDEX_SKILL]: this.GetIndexSkill,
			
		}
		return dict
	}

	// UserTemplateRedPoint.INDEX_EQUIP
	public GetIndexAct(): boolean {
		if (GameGlobal.LingtongAttrModel.IsActive()) {
            return false
        }
		let material = GameGlobal.Config.BabyBasisConfig.material
		let count = this.GetActCount()
		return count >= material.num
	}

	public GetActCount(): number {
		let datas = GameGlobal.DestinyController.getUseDestinyData()
		let count = 0
		let material = GameGlobal.Config.BabyBasisConfig.material
		for (let data of datas) {
			if (data && data.id && data.level) {
				let config = GameGlobal.Config.ItemConfig[data.id]
				if (config && config.quality >= material.quality) {
					++count
				}
			}
		}
		return count
	}

	private GetIndexRank(): boolean {
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return false
        }
		if (GameGlobal.LingtongAttrModel.giftlv >= GameGlobal.LingtongAttrModel.MAX_GIFT_LEVEL) {
            return false
        }
        let config = GameGlobal.Config.BabyTalentConfig[GameGlobal.LingtongAttrModel.mSex][GameGlobal.LingtongAttrModel.giftlv - 1]
        if (!config) {
            return false
        }
		return GameGlobal.UserBag.GetCount(config.cost[0].id) >= config.cost[0].count
	}

	private GetIndexSkill(): boolean {
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return false
        }
		for (let data of GameGlobal.Config.BabyBasisConfig.freshitemid) {
			if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
				return true
			}
		}
		return false
	}

}