class RaidModel extends BaseSystem {

	public mChapterData: {
		mondata: {[key: number]: Sproto.chapter_mondata} 
		fbcfg: Sproto.fbcfg
	}

	public constructor() {
		super()
		this.regNetMsg(S2cProtocol.sc_battle_action, this._DoBattleAction)
		this.regNetMsg(S2cProtocol.sc_battle_entitys, this._DoBattleRaid)
		this.regNetMsg(S2cProtocol.sc_raid_chapter_boss_result, this._DoBossResult);
		this.regNetMsg(S2cProtocol.sc_raid_sweep_reward, this.onlyResult);
		this.regNetMsg(S2cProtocol.sc_raid_chapter_mondata, this._DoChapterMonData);
		this.regNetMsg(S2cProtocol.sc_arena_pk_result, this._DoArenaPkResult);
		this.regNetMsg(S2cProtocol.sc_battle_record, this._DoBattleRecord);
		this.regNetMsg(S2cProtocol.sc_battle_manual, this._DoBattleManual);
		this.regNetMsg(S2cProtocol.sc_battle_set_auto, this._DoBattleSetAuto);
	}

	private GetBattleRaid(): BattleRaid {
		return GameGlobal.RaidMgr.mBattleRaid
	}

	public _DoChapterMonData(rsp: Sproto.sc_raid_chapter_mondata_request) {
		let dict = {}
		for (let data of rsp.mondata) {
			dict[data.id] = data
		}
		this.mChapterData = {
			fbcfg: rsp.fbcfg,
			mondata: dict
		}
	}
	
	/**最近一次战斗 胜利或者失败 */
	public static IS_FIGHT_WIN = true;

	public _DoBossResult(rsp: Sproto.sc_raid_chapter_boss_result_request) {
		let raid = this.GetBattleRaid()
		if (raid) {
			// 跨服boss击杀奖励的状态
			let notSet = (GameMap.fbType == UserFb.KF_BOSS || GameMap.fbType == UserFb.FB_TYPE_GANG_BOSS) && raid.mFinishAction != null
			if (!notSet) {
				let finishAction = new BattleDefaultFinishData
				finishAction.ret = rsp.result
				finishAction.isWin = rsp.result == 1
				RaidModel.IS_FIGHT_WIN = rsp.result == 1
				finishAction.rewards = RewardData.ToRewardDatas(rsp.rewards)
				finishAction.star = rsp.star
				raid.SetFinishAction(finishAction)
			}
		}
		GameGlobal.MessageCenter.dispatch(MessageDef.GUANQIA_CHANGE)
	}

	public OnCrossBossResult(rsp : Sproto.sc_kfboss_rewards_request | Sproto.sc_guildboss_rewards_request) {
		let raid = this.GetBattleRaid()
		if (raid && (GameMap.fbType == UserFb.KF_BOSS || GameMap.fbType == UserFb.FB_TYPE_GANG_BOSS)) {
			let finishAction = new CrossBossFinishData
			finishAction.rewards = rsp.rewards
			raid.SetFinishAction(finishAction)
		} else {	
			// ViewManager.ins().open(ResultAcrossBossPanel, rsp.rewards) //后端改为发邮件，前端暂时不弹奖励，等待新排版的UI
		}
	}

	public onlyResult(rsp: Sproto.sc_raid_sweep_reward_request) {
		ViewManager.ins().open(rsp.result ? ResultWinPanel : ResultFailPanel, rsp.rewards, () => {
		})
	}

	/**竞技场结果 */
	public _DoArenaPkResult(rsp: Sproto.sc_arena_pk_result_request) {
		//是否秒杀
		if (rsp.iskill) {
			rsp.rewards = RewardData.ToRewardDatas(rsp.rewards);
			ViewManager.ins().open(ArenaPKResultPanel, rsp.result ? true : false, rsp.rewards, rsp.maxrank, rsp.rank, rsp.lastrank, () => {
				GameGlobal.Arena.sendGetRewards();
				GameGlobal.Arena.sendArenaData();
			})
			return;
		}
		let raid = this.GetBattleRaid()
		if (raid) {
			let finishAction = new ArenaPKFinishData
			finishAction.isWin = rsp.result == 1;
			finishAction.rewards = RewardData.ToRewardDatas(rsp.rewards);
			finishAction.maxrank = rsp.lastmaxrank;
			finishAction.lastrank = rsp.lastrank;
			finishAction.rank = rsp.rank;
			raid.SetFinishAction(finishAction)
		}
	}

	private _DoBattleAction(rsp: Sproto.sc_battle_action_request) {
		let data = BattleTurnDataParse.Parse(rsp)
		let raid = this.GetBattleRaid()
		if (raid) {
			if (raid.mIsManual) {
				raid.Turn(data[0])
			} else {
				raid.TurnAll(data)
			}
		}
	}

	private _DoBattleRecord(rsp: Sproto.sc_battle_record_request) {
		let raidType = rsp.raidType
		let manual = rsp.manual
		let entityDatas = rsp.entitydatas
		if (!entityDatas) {
			console.error("_DoBattleRecord entitydatas == null")
			return
		}
		let list1: EntityData[] = []
		let list2: EntityData[] = []
		for (let data of entityDatas) {
			let entityData = this._GetEntityData(data)
			if (data.side == EntityBattleSide.Def) {
				list1.push(entityData)
			} else {
				list2.push(entityData)
			}
		}
		let raid = this.EnterBattle(raidType, rsp.fbid, [list1, list2])
		if (raid) {
			raid.mIsVideo = true
			raid.TurnAll(BattleTurnDataParse.Parse(rsp))
			raid.SetFinishAction(new BattleVideoFinishData(() => {
				ViewManager.ins().open(ArenaWin, 1)
			}))
		}
		ViewManager.ins().close(XiandaoVideoPanel)
		ViewManager.ins().close(ArenaWin)
	}

	private _DoBattleRaid(rsp: Sproto.sc_battle_entitys_request) {
		let raidType = rsp.raidType
		let manual = rsp.manual
		let entityDatas = rsp.entitydatas
		let list1: EntityData[] = []
		let list2: EntityData[] = []
		for (let data of entityDatas) {
			let entityData = this._GetEntityData(data)
			if (data.side == EntityBattleSide.Def) {
				list1.push(entityData)
			} else {
				list2.push(entityData)
			}
		}
		let raid = this.EnterBattle(raidType, rsp.fbid, [list1, list2])
		if (manual) {
			if (raid) {
				raid.SetManual(true)
			}
		}
	}

	/**
	 * 进入战斗
	 */
	public EnterBattle(raidType: number, fbid: number, entitys: EntityData[][]): BattleRaid {
		let rsp = new BattleMapData
		if (raidType == UserFb.FB_TYPE_GUANQIABOSS) {
			let cfg = GameGlobal.RaidModel.mChapterData.fbcfg
			rsp.mFbId = cfg.fbid
			rsp.mMapId = cfg.scenes[0]
			rsp.mFbType = UserFb.FB_TYPE_GUANQIABOSS
			rsp.mFbName = cfg.name
			rsp.mFbDesc = cfg.desc
		} else {
			let cfg = GameGlobal.Config.InstanceConfig[fbid]
			rsp.mFbId = fbid
			rsp.mMapId = cfg[GameGlobal.Config.InstanceConfig_keys.scenes][0]
			rsp.mFbType = raidType
			rsp.mFbName = cfg[GameGlobal.Config.InstanceConfig_keys.name]
			rsp.mFbDesc = cfg[GameGlobal.Config.InstanceConfig_keys.desc]
		}
		rsp.entitys = entitys

		return GameGlobal.RaidMgr.EnterBattleRaid(rsp)
	}

	private _GetEntityData(rsp: Sproto.entity_data) {
		let entityData: EntityData
		if (rsp.type == EntityType.Role) {
			entityData = new EntityRole
		} else if (rsp.type == EntityType.Monster) {
			entityData = new EntityData
		} else if (rsp.type == EntityType.Xianlv) {
			entityData = new EntityXianlv
		} else if (rsp.type == EntityType.Pet) {
			entityData = new EntityPet
		} else if (rsp.type == EntityType.Tiannv) {
			entityData = new EntityTiannv
		} else if (rsp.type == EntityType.Shenjiang) {
			entityData = new EntityTianshen
		} else if (rsp.type == EntityType.Lingtong) {
			entityData = new EntityLingtong
		} else {
			console.error("not entity type => " + rsp.type)
		}
		if (entityData) {
			entityData.parserBase(rsp)
			entityData.posIndex = rsp.pos
			entityData.side = rsp.side
		}
		return entityData
	}

	public SendGetBossReward() {
		this.Rpc(C2sProtocol.cs_raid_get_boss_reward, new Sproto.cs_raid_get_boss_reward_request())
	}


	/** 手动战斗 */

	public _DoBattleManual(rsp: Sproto.sc_battle_manual_request) {
		GameGlobal.RaidMgr.mBattleRaid.StartManual(rsp.time, rsp.useskills)
	}

	public _DoBattleSetAuto(rsp: Sproto.sc_battle_set_auto_request) {
		GameGlobal.RaidMgr.mBattleRaid.SetAuto(rsp.isauto == 1)
	}
}