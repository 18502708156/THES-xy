
class XianlvModelRedPoint extends IRedPoint {

	public static readonly INDEX_ACT = 0
	public static readonly INDEX_RANK = 1
	public static readonly INDEX_STAR = 2
	public static readonly INDEX_BATTLE = 3

	private m_ActiveList: {[key: number]: boolean} = {}
	private m_RankList: {[key: number]: boolean} = {}
	private m_StarList: {[key: number]: boolean} = {}
	private m_Model: XianlvModel

	constructor(model: XianlvModel) {
		super()
		this.m_Model = model
	}

	public IsRedPoint(): boolean {
		if (!Deblocking.Check(DeblockingType.TYPE_15, true)) {
			return false
		}
		return super.IsRedPoint()
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[XianlvModelRedPoint.INDEX_ACT]: this.GetIndexAct,
			[XianlvModelRedPoint.INDEX_RANK]: this.GetIndexRank,
			[XianlvModelRedPoint.INDEX_STAR]: this.GetIndexStar,
			[XianlvModelRedPoint.INDEX_BATTLE]: this.GetIndexBattle,
		}
	}

	public OnMessage(type: string) {
		if (type == MessageDef.BAG_XIANLV_RANK_ITEM) {
			this.ClearFlag(XianlvModelRedPoint.INDEX_RANK)
		} else {
			super.OnMessage(type)
		}
		return true
	}

	public OnChange(index: number): void {
		if (index == XianlvModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_XIANLV_ACT_ITEM)
		} else {
			GameGlobal.MessageCenter.dispatch(MessageDef.RP_XIANLV)
		}
	}
	
	public GetMessageDef(): string[] {
		return [MessageDef.BAG_XIANLV_ACT_ITEM, MessageDef.XIANLV_ACTIVE, MessageDef.XIANLV_INIT_INFO,
			MessageDef.BAG_XIANLV_RANK_ITEM,
			MessageDef.BAG_XIANLV_STAR_ITEM,
			MessageDef.XIANLV_UPATE_BATTLE,
		]
	}

	private GetIndexRank(): boolean {
		this.m_RankList = {}
		let list = this.m_Model.mXianlvList
		for (let k in list) {
			let xianlvInfo = list[k]
			if (xianlvInfo.mLevel > 0 && xianlvInfo.mLevel < this.m_Model.MAX_LEVEL) {
				let config = xianlvInfo.GetLevelConfig()
				// let upnum = Math.floor(config.proexp / config.exp)
				// upnum = upnum - xianlvInfo.mExp
				let upnum = 1
				let enough = true
				for (let data of config.cost) {
					if (!Checker.Data({type: data.type, id: data.id, count: data.count * upnum}, false)) {
						enough = false	
						break
					}
				}
				if (enough) {
					this.m_RankList[xianlvInfo.mXianlvId] = true
				}
			}
		}
		for (let k in this.m_RankList) {
			return true
		}
		return false
	}

	private GetIndexStar(): boolean {
		this.m_StarList = {}
		let list = this.m_Model.mXianlvList
		for (let k in list) {
			let xianlvInfo = list[k]
			if (xianlvInfo.mLevel > 0 && xianlvInfo.mStar < this.m_Model.MAX_STAR) {
				let config = GameGlobal.Config.partnerAttrsConfig[xianlvInfo.mXianlvId][(xianlvInfo.mStar || 1) - 1]
				if (Checker.Datas(config.cost, false)) {
					this.m_StarList[xianlvInfo.mXianlvId] = true
				}
			}
		}
		for (let k in this.m_StarList) {
			return true
		}
		return false
	}

	public GetIndexBattle(): boolean {
		let emptyCount = 0
		for (let data of this.m_Model.mBattleList) {
			if (!data) {
				emptyCount++
			}
		}
		if (!emptyCount) {
			return false
		}
		let list = this.m_Model.mXianlvList
		for (let k in list) {
			let xianlvInfo = list[k]
			if (xianlvInfo.mLevel > 0 && !this.m_Model.HasBattle(xianlvInfo.mXianlvId)) {
				return true
			}
		}
		return false
	}

	protected GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.m_ActiveList) {
			if (key) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.m_ActiveList = {}
		let config = GameGlobal.Config.partnerBiographyConfig
		for (let k in config) {
			if (this.m_Model.HasXianlv(parseInt(k))) {
				continue
			}
			let data = config[k].material
			if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
				this.m_ActiveList[k] = true
			}
		}
	}

	public IsRedAct(xianlvId: number) {
		this.Get(XianlvModelRedPoint.INDEX_ACT)
		return this.m_ActiveList[xianlvId]
	}

	public IsRedRank(xianlvId: number) : boolean {
		return this.m_RankList[xianlvId] ? true : false
	}

	public IsRedStar(xianlvId: number) : boolean {
		return this.m_StarList[xianlvId] ? true : false
	}
}