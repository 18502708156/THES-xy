class EntityEffMgr {

	// private static SCALE = 1.7
	private static SCALE = 1

	private m_IsUpdate = false
	private m_IsPlayEffTimer = true
	private m_PlayEffTimer = null

	private m_List: EntityEffData[] = []
	private m_MvList: EntityEffPlayData[] = []
	private m_PlayMvList: EntityEffPlayData[] = []

	private m_ResName: {[key: string]: boolean} = {}

	private REF_LIST: {[key: string]: boolean} = {}
	// private m_PlayFunc: {[key: number]: Function} = {}

	public constructor() {
		// this.m_PlayFunc[0] = this.CreateFunc0
		// this.m_PlayFunc[1] = this.CreateFunc1
		// this.m_PlayFunc[2] = this.CreateFunc2
	}

	// 引用主角的特效
	public RefActorEff(job: number) {
		try {
			let dict = {}
			let skillList = []
			for (let i = 0; i < 10; i++) {
				let skillId = SkillsConfig.GetSkillId(job, i)
				if (!skillId) {
					break
				}
				skillList.push(skillId)
			}
			for (let id of skillList) {
				let effId = GameGlobal.Config.SkillsConfig[id][GameGlobal.Config.SkillsConfig_keys.effectId]
				if (effId) {
					let data = GameGlobal.Config.SkillEffConfig[effId]
					if (data) {
						if (data.castEff) {
							dict[data.castEff] = true
						}
						if (data.becastEff) {
							dict[data.becastEff] = true
						}
					}
				}
			}
			for (let effId in dict) {
				this.RefEff(effId)
				let data = GameGlobal.Config.EffConfig[effId]
				if (data) {
					if (data.dir1) {
						this.RefEff(effId + data.dir1)
					}
					if (data.dir3) {
						this.RefEff(effId + data.dir3)
					}
				}
			}
		} catch(e) {
			console.error(e)
		}
	}

	private RefEff(effName: string) {
		if (this.REF_LIST[effName]) {
			return
		}
		this.REF_LIST[effName] = true
		ResMgr.Ref(ResDataPath.GetSkillPathByID(effName) + ".png")
	}

	public AddResName(resName: string) {
		resName += ".png"
		if (!this.m_ResName[resName]) {
			ResMgr.Ref(resName)
			this.m_ResName[resName] = true
		}
	}

	private HasDir(effName: string): boolean {
		let data = GameGlobal.Config.EffConfig[effName]
		return (data && data.dir) ? true : false
	}

	private GetScale(effName: string): number {
		let data = GameGlobal.Config.EffConfig[effName]
		if (data && data.scale) {
			return 100 / data.scale
		}
		return 1
	}

	private GetEffName(effName: string, dir: number): string {
		let data = GameGlobal.Config.EffConfig[effName]
		if (!data) {
			return effName
		}
		dir = DirUtil.Get5DirBy8Dir(dir)
		let dirData = data["dir" + dir]
		if (!dirData) {
			return effName
		}
		if (dirData) {
			return effName + dirData
		}
		return effName
	}

	private CreateData(skillData: any, effectId: number): EntityEffPlayData {
		let playData = this.m_MvList.pop() || new EntityEffPlayData
		if (playData.mc == null) {
			playData.mc = new MovieBaseObject
		}
		playData.mc.SetFrameRate(SystemSettingPanel.GetSpeed())
		playData.mc.scaleX = playData.mc.scaleY = EntityEffMgr.SCALE
		playData.preTime = 0
		playData.skillData = skillData
		playData.mc.rotation = 0
		playData.bindHandle = null
		playData.ft = null
		playData.time = AIConfig.GetEffTime(effectId)
		this.m_PlayMvList.push(playData)
		return playData
	}

	private CacheData(data: EntityEffPlayData): void {
		data.mc.ClearCache()
		egret.Tween.removeTweens(data.mc)
		DisplayUtils.removeFromParent(data.mc)
		this.m_MvList.push(data)
	}

	public PlayCastSkillEff(skillEffConfig: any, src: MapEntity) {
		let castEff = skillEffConfig.castEff
		if (castEff) {
			let pData = this.CreateData(skillEffConfig, castEff)
			var fileName = castEff
			let dir = src.GetDir()
			pData.resName = ResDataPath.GetSkillPathByID(this.GetEffName(fileName, dir))
			pData.mc.x = src.x
			pData.mc.y = src.y
			pData.mc.scaleX = src.GetDir() > 4 ? -EntityEffMgr.SCALE : EntityEffMgr.SCALE;
			this.StartUpdate()
		}
	}

	public PlayBecastEff(skillEffConfig: any, src: number, x: number = 0, y: number = 0, dir: number = null) {
		if (skillEffConfig && skillEffConfig.becastEff) {
			let pData = this.CreateData(skillEffConfig, skillEffConfig.becastEff)
			var fileName = skillEffConfig.becastEff

			let scaleX = 1
			if (this.HasDir(fileName)) {
				dir = DirUtil.DirOpposit(dir)
				fileName = this.GetEffName(fileName, dir)
				scaleX = dir > 4 ? -1 : 1;
			}

			pData.resName = ResDataPath.GetSkillPathByID(fileName)
			let bind
			if (skillEffConfig.becastPos == SkillsConfig.BECAST_TYPE.TYPE_2) {
				bind = 0
				pData.mc.x = x
				pData.mc.y = y - AIConfig.BODY_OFFSET
			} else if (skillEffConfig.becastPos == SkillsConfig.BECAST_TYPE.TYPE_3) {
				bind = 0
				pData.mc.x = x
				pData.mc.y = y
			} else {
				bind = src
				pData.mc.x = 0
				pData.mc.y = -AIConfig.BODY_OFFSET
			}
			pData.bindHandle = bind
			
			let scale = this.GetScale(fileName) 
			pData.mc.scaleX = scale * scaleX
			pData.mc.scaleY = scale

			this.StartUpdate()
		}
	}

	public PlayEffByPos(skillEffConfig: any, x: number, y: number) {
		if (skillEffConfig && skillEffConfig.becastEff) {
			let pData = this.CreateData(skillEffConfig, skillEffConfig.becastEff)
			var fileName = skillEffConfig.becastEff
			pData.resName = ResDataPath.GetSkillPathByID(fileName)
			pData.mc.x = x
			pData.mc.y = y

			let scale = this.GetScale(fileName)
			pData.mc.scaleX = pData.mc.scaleY = scale
			this.StartUpdate()
		}
	}

	public PlayBecastBuff(skillEffConfig: any, src: number) {
		if (skillEffConfig && skillEffConfig.targetEff) {
			let pData = this.CreateData(skillEffConfig, skillEffConfig.targetEff)
			var fileName = skillEffConfig.targetEff
			pData.resName = ResDataPath.GetSkillPathByID(fileName)
			pData.mc.x = 0
			pData.mc.y = 0
			pData.bindHandle = src
			this.StartUpdate()
		}
	}


	// public UseSkill(skillId: number, src: MapEntity) {
	// 	let skillData = GameGlobal.Config.SkillsConfig[skillId]
	// 	let skillEffConfig = SkillsConfig.GetSkillEffConfig(skillData[GameGlobal.Config.SkillsConfig_keys.id])

	// 	if (skillEffConfig.castEff) {
	// 		let pData = this.CreateData(skillEffConfig, skillEffConfig.castEff)
	// 		var fileName = skillEffConfig.castEff + (skillEffConfig.isDir == 1 ? "_" + DirUtil.get5DirBy8Dir(src.GetDir()) : "");
	// 		pData.resName = ResDataPath.GetSkillPathByID(fileName)
	// 		pData.mc.x = src.x
	// 		pData.mc.y = src.y
	// 		pData.mc.scaleX = src.GetDir() > 4 ? -EntityEffMgr.SCALE : EntityEffMgr.SCALE;
	// 	}
	// 	this.StartUpdate()
	// }

	public PlayScene(data: EntityEffData) {

	}

	// private CreateFunc0(skillEffConfig, data: EntityEffData) {
	// 	if (skillEffConfig.castEff) {
	// 		let pData = this.CreateData(skillEffConfig, skillEffConfig.castEff)
	// 		if (skillEffConfig.mount) {
	// 			if (skillEffConfig.mount.type == 1) {
	// 				pData.mc.x = 0
	// 				pData.mc.y = -AIConfig.BODY_OFFSET
	// 				pData.bindHandle = data.mSourceHandle
	// 				pData.resName = ResDataPath.GetSkillPathByID(skillEffConfig.castEff)
	// 				let jd = MathUtils.getAngle(MathUtils.getRadian2(data.mSelfX, data.mSelfY, data.mTargetX, data.mTargetY));
	// 				pData.mc.rotation = jd + 90;
	// 			} else if (skillEffConfig.mount.type == 2) {
	// 				if (skillEffConfig.mount.pos.x) {
	// 					pData.mc.x = skillEffConfig.mount.pos.x
	// 				} else {
	// 					GameMap.GetMap().mMapEntityView.LocalToGlobal(data.mSelfX, 0, egret.$TempPoint)
	// 					pData.mc.x = egret.$TempPoint.x
	// 				}
	// 				if (skillEffConfig.mount.pos.y) {
	// 					pData.mc.x = skillEffConfig.mount.pos.y
	// 				} else {
	// 					GameMap.GetMap().mMapEntityView.LocalToGlobal(0, data.mSelfY, egret.$TempPoint)
	// 					pData.mc.y = egret.$TempPoint.y
	// 				}
	// 				pData.resName = ResDataPath.GetSkillPathByID(skillEffConfig.castEff)	
	// 				if (GameGlobal.StageUtils.getWidth() > 960) {
	// 					let tween = egret.Tween.get(pData.mc)
	// 					tween.to({x: GameGlobal.StageUtils.getWidth() - (960 - pData.mc.x)}, 400)
	// 				}
	// 			} else {
	// 				console.warn("not impl mount type => " + skillEffConfig.mount.type)
	// 			}
	// 		} else {
	// 			var fileName = skillEffConfig.castEff + (skillEffConfig.isDir == 1 ? "_" + DirUtil.Get5DirBy8Dir(data.mSelfDir) : "");
	// 			pData.resName = ResDataPath.GetSkillPathByID(fileName)
	// 			pData.mc.x = data.mSelfX
	// 			pData.mc.y = data.mSelfY
	// 			pData.mc.scaleX = data.mSelfDir > 4 ? -EntityEffMgr.SCALE : EntityEffMgr.SCALE;
	// 		}
	// 	}
	// 	if (skillEffConfig.flyEff) {
	// 		if (data.mTargetX != null && data.mTargetY != null) {
	// 			let pData = this.CreateData(skillEffConfig, skillEffConfig.flyEff)
	// 			var fileName = ResDataPath.GetSkillPathByID(skillEffConfig.flyEff)
	// 			pData.resName = fileName
	// 			pData.preTime = 300
	// 			pData.time = -1
	// 			pData.et = 200
	// 			pData.ft = 0
	// 			pData.sx = data.mSelfX
	// 			pData.sy = data.mSelfY - AIConfig.BODY_OFFSET
	// 			pData.ex = data.mTargetX
	// 			pData.ey = data.mTargetY - AIConfig.BODY_OFFSET
	// 			pData.mc.x = data.mSelfX
	// 			pData.mc.y = data.mSelfY - AIConfig.BODY_OFFSET

	// 			let jd = MathUtils.getAngle(MathUtils.getRadian2(data.mSelfX, data.mSelfY, data.mTargetX, data.mTargetY));
	// 			pData.mc.rotation = jd + 90;
	// 		}
	// 	} else {
	// 		if (skillEffConfig.becastEff) {
	// 			this.Create(skillEffConfig, skillEffConfig.becastEff, data.mTargetX, data.mTargetY)
	// 		}
	// 	}
	// }

	// private CreateFunc1(skillEffConfig, data: EntityEffData) {
	// 	if (!skillEffConfig.castEff) {
	// 		return
	// 	}
	// 	let cx = data.mSelfX
	// 	let cy = data.mSelfY
	// 	let dis = 250
	// 	let count = 4
	// 	for (let i = 0; i < count; ++i) {
	// 		let playData = this.Create(skillEffConfig, skillEffConfig.castEff, cx, cy)
	// 		playData.preTime = -1
	// 		playData.LoadByUrl(1)
	// 		GameMap.AddBattleEntity(playData.mc)
	// 		let rad = MathUtils.getRadian(i / count * 360)
	// 		let x = Math.cos(rad) * dis
	// 		let y = Math.sin(rad) * dis
	// 		egret.Tween.get(playData.mc).to({x: cx + x, y: cy + y}, playData.time, egret.Ease.circOut)
	// 	}
	// }

	// private CreateFunc2(skillEffConfig, data: EntityEffData) {
	// 	if (!skillEffConfig.castEff) {
	// 		return
	// 	}
	// 	let cx = data.mSelfX
	// 	let cy = data.mSelfY
	// 	let dis = 250
	// 	let count = 3
	// 	for (let i = 0; i < count; ++i) {
	// 		let rad = MathUtils.getRadian(i / count * 360)
	// 		let x = Math.cos(rad) * dis
	// 		let y = Math.sin(rad) * dis
	// 		let playData = this.Create(skillEffConfig, skillEffConfig.castEff, cx + x, cy + y)
	// 		playData.preTime = -1
	// 		playData.LoadByUrl(1)
	// 		GameMap.AddBattleEntity(playData.mc)
	// 	}
	// }

	public Clear(unref = false): void {
		for (let i = this.m_PlayMvList.length - 1; i >= 0; --i) {
			let data = this.m_PlayMvList[i]  
			this.CacheData(data)
			this.m_PlayMvList.splice(i, 1)
		}
		if (unref) {
			for (let key in this.m_ResName) {
				ResMgr.Unref(key)
			}
			this.m_ResName = {}
		}
	}

	public RemoveByHandle(handle: number): void {
		for (let i = this.m_PlayMvList.length - 1; i >= 0; --i) {
			let data = this.m_PlayMvList[i]  
			if (data.bindHandle == handle) {
				data.time = 0
				data.preTime = -1
				data.ft = null
			}
		}
	}

	// 解除绑定
	public UnbindByHandle(handle: number): void {
		for (let i = this.m_PlayMvList.length - 1; i >= 0; --i) {
			let data = this.m_PlayMvList[i]  
			if (data.bindHandle == handle) {
				data.bindHandle = 0
				GameMap.AddBattleEntity(data.mc)
			}
		}
	}

	private Create(skillData: any, effId: number, x: number, y: number): EntityEffPlayData {
		let mc = this.CreateData(skillData, effId)
		mc.resName = ResDataPath.GetSkillPathByID(effId + "")
		mc.mc.x = x
		mc.mc.y = y
		return mc
	}

	private StartUpdate() {
		if (this.m_IsUpdate) {
			return
		}
		this.m_IsUpdate = true
		this.m_LastTime = egret.getTimer()
		egret.startTick(this.Update, this)
	}

	private m_LastTime: number = 0

	private Update(timeStamp: number): boolean {
		let delta = timeStamp - this.m_LastTime

		this.m_LastTime = timeStamp
		for (let i = this.m_PlayMvList.length - 1; i >= 0; --i) {
			let data = this.m_PlayMvList[i]
			if (data.preTime >= 0) {
				if ((data.preTime -= delta) < 0) {
					if (data.bindHandle) {
						let unit = GameGlobal.RaidMgr.mBattleRaid.GetEntity(data.bindHandle)
						if (unit) {
							data.LoadByUrl(data.time == -1 ? -1 : 1)
							unit.addChild(data.mc)
						} else {
							data.time = 0
						}
					} else {
						if (data.skillData.mount && data.skillData.mount.type == 2) {
							data.LoadByUrl(data.time == -1 ? -1 : 1)
							LayerManager.UI_BATTLE.addChild(data.mc)		
						} else {
							data.LoadByUrl(data.time == -1 ? -1 : 1)
							GameMap.AddBattleEntity(data.mc)		
						}
					}
				}
				continue
			}
			if (data.ft != null) {
				data.ft += delta
				let d = data.ft / data.et
				MathUtils.Lerp(data.sx, data.sy, data.ex, data.ey, d, MathUtils.TEMP_POS)
				data.mc.x = MathUtils.TEMP_POS.x
				data.mc.y = MathUtils.TEMP_POS.y
				if (d >= 1) {
					this.CacheData(data)
					this.m_PlayMvList.splice(i, 1)

					let skillId2 = data.skillData.becastEff
					if (skillId2) {
						this.Create(data.skillData, skillId2, MathUtils.TEMP_POS.x, MathUtils.TEMP_POS.y)
					}
				}
				continue
			}
			if (data.time == -1) {
				continue
			}
			if ((data.time -= delta) <= 0) {
				this.CacheData(data)
				this.m_PlayMvList.splice(i, 1)
			}
		}

		return false
	}
}

class EntityEffPlayData {
	public mc: MovieBaseObject
	public preTime: number
	public resName: string
	public skillData: any
	public bindHandle: number
	public time: number

	public ft: number
	public et: number
	public sx: number
	public sy: number
	public ex: number
	public ey: number

	public LoadByUrl(count: number): void {
		if (!this.mc || !(this.resName)) {
			return
		}
		GameGlobal.EntityEffMgr.AddResName(this.resName)
		this.mc.LoadByUrl(this.resName, count)
	}
}

