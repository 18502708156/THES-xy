
class GangModelRedPoint extends IRedPoint {
	public static readonly INDEX_ACT = 0

	/** 红点通知类型 */
	//////////////////////////////////////////
		public static readonly VIEW_APPILICANT = 1
		public static readonly CONTRIBUTE = 2
		public static readonly GUARD_UPGRADE = 3
		public static readonly DAILY_AWARD = 4
		public static readonly SKILL_UPGRADE = 5
		public static readonly EAT_PEACH = 6
		public static readonly PEACH_AWARD = 7
		public static readonly GANG_MONSTER = 8
		public static readonly GANG_MAP_ASSEMBLED = 9
		public static readonly GANG_EXCHANGE = 10
		public static readonly GANG_BATTLE = 11
		public static readonly GANG_FUBEN = 12
		public static readonly NO_GANG = 13
	//////////////////////////////////////////

	private mRedPointMap: {[key: number]: boolean} = {}

	constructor() {
		super()
	}

	public GetMessageDef(): string[] {
		return [MessageDef.GANG_UPDATE_BASE_INFO, MessageDef.GANG_UPDATE_APPLICANT_LIST,
				MessageDef.GANG_UPDATE_PANTAOINFO, MessageDef.GANG_SKILL_UP,
				MessageDef.GANG_SKILL_LEARN_UP, MessageDef.GANG_UPDATA_PROTECTOR_INFO,
				MessageDef.GANGMAP_UPDATE_EXCHANGEINFO, MessageDef.GUILD_CONTRIB_UPDATE,
				MessageDef.ITEM_COUNT_CHANGE, MessageDef.GANG_EXIT_NOTICE,
				MessageDef.GANG_UPDATE_FBCOUNT, MessageDef.GANGBOSS_UPDATE_INFO,
				MessageDef.GANG_UPDATE_CONTRIBUTECOUNT, MessageDef.ACTIVITY_LIST_INFO,
				MessageDef.GANG_ID_CHANGE]
	}

	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[GangModelRedPoint.INDEX_ACT]: this.GetIndexAct
		}
	}

	public OnChange(index: number): void {
		if (index == GangModelRedPoint.INDEX_ACT) {
			GameGlobal.MessageCenter.dispatch(MessageDef.GANG_ALL_NOTICE)
		}
	}
	
	private GetIndexAct(): boolean {
		this.DoActive()
		for (let key in this.mRedPointMap) {
			if (this.mRedPointMap[key]) {
				return true
			}
		}
		return false
	}

	private DoActive() {
		this.mRedPointMap[GangModelRedPoint.VIEW_APPILICANT] = GameGlobal.GangModel.HasApplicant()
		this.mRedPointMap[GangModelRedPoint.CONTRIBUTE] = GameGlobal.GangModel.HasContributeAward()
		this.mRedPointMap[GangModelRedPoint.GUARD_UPGRADE] = GameGlobal.GangModel.CanGangProtectorUpgrade()
		this.mRedPointMap[GangModelRedPoint.DAILY_AWARD] = GameGlobal.GangModel.HasDailyAward()
		this.mRedPointMap[GangModelRedPoint.SKILL_UPGRADE] = GameGlobal.GangModel.CanGangSkillUpgrade()
		this.mRedPointMap[GangModelRedPoint.EAT_PEACH] = GameGlobal.GangModel.HasPantao()
		this.mRedPointMap[GangModelRedPoint.PEACH_AWARD] = GameGlobal.GangModel.HasPanTaoAward()
		this.mRedPointMap[GangModelRedPoint.GANG_MONSTER] = GameGlobal.GangBossModel.IsGangBossAct()
		this.mRedPointMap[GangModelRedPoint.GANG_MAP_ASSEMBLED] = GangConst.IsGangMapAssembledTIme()
		this.mRedPointMap[GangModelRedPoint.GANG_EXCHANGE] = GameGlobal.GangMapModel.CanItemExchange()
		this.mRedPointMap[GangModelRedPoint.GANG_BATTLE] = GameGlobal.GangModel.IsGangBattleOpen()
		this.mRedPointMap[GangModelRedPoint.GANG_FUBEN] = GameGlobal.GuildTeamModel.GetProfitCount() > 0
		this.mRedPointMap[GangModelRedPoint.NO_GANG] = !GameGlobal.GangModel.HasGang()
	}

	public IsRedAct(type: number) {
		this.Get(GangModelRedPoint.INDEX_ACT)
		return this.mRedPointMap[type]
	}
}