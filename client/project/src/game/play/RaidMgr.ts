class RaidMgr extends BaseSystem {

	private static m_Ins: RaidMgr

	private m_CurRaid: Raid
	private m_NextRaid: Raid

	private m_LastTime: number = 0

	// public mCityRaid: CommonMapRaid
	// 全局唯一的地图数据
	public mMapRaid: MapRaid
	// 当前的战斗副本
	public mBattleRaid: BattleRaid

	public constructor() {
		super()
	}

    public static readonly TYPE_NORMAL = 0
    public static readonly TYPE_CITY = 1
	public mShowType = 0

	public GetCurMapId(): number {
		// if (this.mShowType == RaidMgr.TYPE_CITY) {
		// 	if (this.mCityRaid) {
		// 		return this.mCityRaid.GetSceneId()
		// 	}
		// } else {
			if (this.mMapRaid) {
				return this.mMapRaid.GetSceneId()
			}
		// }
		return 0
	}

	public UpdateBGM() {
		if (this.mShowType == RaidMgr.TYPE_NORMAL) {
			if (this.mBattleRaid && !this.mBattleRaid.mIsExit && !egret.is(this.mBattleRaid, "NormalBattleRaid")) {
				GameGlobal.SoundManager.PlayBg("war_mp3");
			} else {
				GameGlobal.SoundManager.PlayBg("guaji_mp3");
			}
		} else {
			GameGlobal.SoundManager.PlayBg("city_mp3");
		}
	}

	// public SetShowType(type: number) {
	// 	GameMap.SetShowState(type)
	// 	if (this.mShowType == type) {
	// 		return
	// 	}
	// 	this.mShowType = type
	// 	if (type == RaidMgr.TYPE_NORMAL) {
	// 		if (this.mCityRaid) {
	// 			this.mCityRaid.OnBackground()
	// 		}
	// 		if (this.mMapRaid) {
	// 			this.mMapRaid.OnForeground()
	// 		}
	// 		if (this.mBattleRaid && !this.mBattleRaid.mIsExit) {
	// 			this.mBattleRaid.OnForeground()
	// 		}
	// 	} else {
	// 		if (this.mMapRaid) {
	// 			this.mMapRaid.OnBackground()
	// 		}
	// 		if (this.mBattleRaid && !this.mBattleRaid.mIsExit) {
	// 			this.mBattleRaid.OnBackground()
	// 		}
	// 		if (this.mCityRaid) {
	// 			this.mCityRaid.OnForeground()
	// 		}
	// 	}
	// 	this.UpdateBGM()
	// 	GameGlobal.ViewManagerImpl.DoRaidShowType()
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.MAP_TYPE_CHANGE)
	// }

	public UpdateSetting(settingId: number) {
		if (this.mMapRaid) {
			this.mMapRaid.UpdateSetting(settingId)
		}
		if (this.mBattleRaid) {
			this.mBattleRaid.UpdateSetting(settingId)
		}
	}

	public Init(): void {
		GameMap.SetShowState(this.mShowType)
		GameGlobal.MessageCenter.addListener(MessageDef.NAME_CHANGE, this._OnChangeName, this)
		egret.startTick(this.UpdateTime, this)
	}

	private _OnChangeNameRaid(raid: Raid) {
		if (!raid) {
			return
		}
		for (let k in raid.mEntityList) {
			let entity = raid.mEntityList[k]
			let handle = entity.GetHandle()
			if (handle == GameGlobal.SubRoles.GetRoleData().handle || handle == GameGlobal.actorModel.actorID) {
				entity.GetInfo().entityName = GameGlobal.actorModel.name
				entity.UpdateInfo()
				break
			}
		}
	}

	// 更新场景中的名字
	private _OnChangeName() {
		this._OnChangeNameRaid(this.mMapRaid)	
		this._OnChangeNameRaid(this.mBattleRaid)	
	}

	public UpdateTime(timeStamp: number): boolean {
		let delta = timeStamp - this.m_LastTime;
		this.m_LastTime = timeStamp;
		if (this.m_NextRaid) {
			if (this.m_CurRaid) {
				this.m_CurRaid.mIsExit = true
				this.m_CurRaid.OnExit()
			}
			this.m_CurRaid = this.m_NextRaid
			this.m_NextRaid = null
			this.m_CurRaid.mIsExit = false
			this.m_CurRaid.OnEnter()
		}
		let dt = Math.min(delta, 40)
		if (this.m_CurRaid) {
			this.m_CurRaid.DoUpdate(dt)
		}
		// if (this.mCityRaid) {
		// 	this.mCityRaid.DoUpdate(dt)
		// }
		return false
	}

	public Clear(): void {
		if (this.mMapRaid) {
			this.mMapRaid.OnExit()
			this.mMapRaid.Clear()
			this.mMapRaid.mFbId = 0
			this.mMapRaid.mFbType = 0
		}
		if (this.mBattleRaid) {
			this.mBattleRaid.OnExit()
		}
		// if (this.mCityRaid) {
		// 	this.mCityRaid.OnExit()
		// 	this.mCityRaid.Clear()
		// 	this.mCityRaid = null
		// }
		this.mShowType = RaidMgr.TYPE_NORMAL
		GameMap.SetShowState(RaidMgr.TYPE_NORMAL)
	}

	public SetNextRaid(raid: Raid): void {
		this.m_NextRaid = raid
	}

	public OnMapClick(x: number, y: number) {
		// if (this.mShowType == RaidMgr.TYPE_CITY) {
		// 	if (this.mCityRaid) {
		// 		this.mCityRaid.OnMapClick(x, y)
		// 	}
		// } else {
			if (this.mMapRaid) {
				this.mMapRaid.OnMapClick(x, y)
			}
		// }
	}

	// 大地图副本
	// 副本类型，副本id（挂机关卡是章节id）
	public GetMapRaid(fbType: number, fbId: number): MapRaid {
		if (this.mMapRaid) {
			if (this.mMapRaid.mFbType != fbType || this.mMapRaid.mFbId != fbId) {
				this.mMapRaid.Clear()
				this.mMapRaid = null
			}
		}
		if (!this.mMapRaid) {
			if (fbType) {
				if (fbType == UserFb.FB_TYPE_CLOUD_NINE) {
					this.mMapRaid = new MapCloudNine
				}
				else if (fbType == UserFb.FB_TYPE_XIANDAO) {
					this.mMapRaid = new MapRaidXiandao
				}
				else if (fbId == 100001) {
					this.mMapRaid = new MapRaidCrossBattle
				}
				else if (fbType == UserFb.FB_TYPE_GUILD_WAR) {
					this.mMapRaid = new MapRaidGangBattle(fbId)
				}
				else if(fbType == UserFb.KF_BOSS)
				{
					this.mMapRaid = new MapRaidAcrossBoss
				}
				else if(fbType == UserFb.FB_TYPE_GANG_BOSS)
				{
					this.mMapRaid = new MapRaidGangBoss
				}
				else if (fbType == UserFb.FB_TYPE_GANGMAP)
				{
					this.mMapRaid = new MapRaidGangMap
				}
				else {
					console.error("GetMapRaid not def fbtype => " + fbType + ", fbid => " + fbId)
					this.mMapRaid = new CommonMapRaid
				}
			} else {
				this.mMapRaid = new NormalMapRaid
			}
			this.mMapRaid.mMapId= fbId
			this.mMapRaid.mFbType = fbType
			this.mMapRaid.mFbId = fbId
			this.mMapRaid.Init()
		}
		return this.mMapRaid
	}

	public ExitFbRewardAndEnterMap() {
		GameGlobal.RaidModel.SendGetBossReward();
		GameGlobal.RaidMgr.ExitFbAndEnterMap();
	}

	public ExitFbAndEnterMap() {
		GameGlobal.UserFb.sendExitFb();
		GameGlobal.RaidMgr.EnterCurMapRaid();
	}

	// public EnterCityMapRaid(): CommonMapRaid {
	// 	if (!this.mCityRaid) {
	// 		let raid = this.mCityRaid = new MapRaidCity
	// 		raid.mMapId = GameMap.TYPE_ID_CITY
	// 		raid.Init()
	// 		raid.OnEnter()
	// 	}
	// 	return this.mCityRaid
	// }

	/**
	 * 进入当前存在的大地图
	 */
	public EnterCurMapRaid() {
		let raid = this.mMapRaid
		if (!raid) {
			raid = this.GetMapRaid(0, 0)
		}
		this.EnterMapRaid(raid);
	}

	/**
	 * 进入新的大地图
	 */
	public EnterNewMapRaid(mapData: GameMapData, immediately = true): MapRaid {
		GameMap.parser(mapData);
		let raid = GameGlobal.RaidMgr.GetMapRaid(GameMap.fbType, GameMap.fubenID)
		if (!immediately) {
			return
		}
		this.EnterMapRaid(raid)
		GameGlobal.ViewManagerImpl.CheckPlayFunviewState()
		GameGlobal.ViewManagerImpl.DoMapChange()
		return raid
	}

	/**
	 * 进入大地图
	 */
	private EnterMapRaid(raid: MapRaid) {
		if (BattleMap.Exit()) {
			GameGlobal.ViewManagerImpl.DoBattleChange()
		}
		this.SetNextRaid(raid)
	}


	/**
	 * 进入挂机战斗副本
	 */
	public EnterNormalBattle() {
		let raid = new NormalBattleRaid()
		raid.Init()
		raid.SetBattleData()
		this.mBattleRaid = raid
		this.SetNextRaid(raid)
	}
    
	/** 
	 * 进入捕捉场景副本
	*/
	public EnterCatchPet() {
		let rsp = new BattleMapData
		rsp.mFbId = UserFb.FB_TYPE_CATCH_PET
		rsp.mMapId = 0
		rsp.mFbType = UserFb.FB_TYPE_CATCH_PET
		rsp.mFbName = ""
		rsp.mFbDesc = ""
		BattleMap.Parse(rsp)

		let raid = new CatchPetRaid()
		raid.Init()
		raid.SetBattleData()
		this.mBattleRaid = raid
		this.SetNextRaid(raid)

		GameGlobal.ViewManagerImpl.DoBattleChange()
	}

	public BuZhuoPet() {
		let raid = this.mBattleRaid as CatchPetRaid
		if (!egret.is(raid, "CatchPetRaid")) {
			return
		}
		raid.Turn(raid.CreatSkill())
	}

	/**
	 * 进入战斗副本
	 */
	public EnterBattleRaid(mapData: BattleMapData): BattleRaid {
		let raid: BattleRaid
		if (mapData.mFbType == UserFb.FB_TYPE_PUBLIC_BOSS) {
			raid = new BattleRaidPubBoss()
		} else {
			raid = new BattleRaid()
		}
		raid.Init()
		raid.SetBattleData(mapData.entitys)

		this.mBattleRaid = raid
		BattleMap.Parse(mapData)
		this.SetNextRaid(raid)

		GameGlobal.ViewManagerImpl.DoBattleChange()
		
		GameGlobal.MessageCenter.dispatch(MessageDef.FUBEN_CHANGE)

		return raid
	}

	public GetRaid(): Raid {
		return this.m_CurRaid
	}

	public CreateEntity(entityModel: EntityData) {
		this.GetRaid().CreateEntity(entityModel)
	}

	public DoExitFb(): boolean {
		return this.GetRaid().DoExitFb()
	}

	public GetNextRaid(): Raid {
		return this.m_NextRaid
	}

	private GetNormalMapRaid(): NormalMapRaid {
		if (this.mMapRaid && Util.GetClass(this.mMapRaid) == NormalMapRaid) {
			return (this.mMapRaid as NormalMapRaid)
		}
		return null
	}

	public UpdateRole() {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRole()
		}
		// if (this.mCityRaid) {
		// 	this.mCityRaid.UpdateRole()
		// }
	}

	public UpdateRolePet(petId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRolePet(petId)
		}
	}

	public UpdateRoleTiannv() {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleTiannv()
		}
	}

	public UpdateRoleXianlv(xianlvId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleXianlv(xianlvId)
		}
	}

	public UpdateRoleXianlvXw(xwId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleXianlvXw(xwId)
		}
	}

	public UpdateRolePetTongl(xwId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRolePetTongl(xwId)
		}
	}

	public UpdateRolePetShouh(xwId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRolePetShouh(xwId)
		}
	}

	public UpdateRoleXianlvFz(xwId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleXianlvFz(xwId)
		}
	}

	public UpdateRoleTiannvLq(lqId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleTiannvLq(lqId)
		}
	}

	public UpdateRoleTiannvHua(lqId: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleTiannvHua(lqId)
		}
	}

	public UpdateRoleTianshen(shengj: number) {
		let raid = this.GetNormalMapRaid()
		if (raid) {
			raid.UpdateRoleTianshen(shengj)
		}
	}

	//获取当前焦点的地图场景对象
	public GetCurMapRaid() {
		// if (this.mShowType == RaidMgr.TYPE_CITY)
		// 	return this.mCityRaid

		return this.mMapRaid
	}

	// 结算并且领取当前关卡战斗的奖励
	public FinishRewardChapterBattle() {
		if (this.mBattleRaid && BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
			this.mBattleRaid.FinishBattleAndReward()
		}
	}
}