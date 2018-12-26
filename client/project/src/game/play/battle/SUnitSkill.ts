class SUnitSkill {
    public mUnit: BattleUnit
    public mSkillId: number

    private penetrate: number = 0
    private m_SkillConfig: any[]

    public mTargets: number[] = []

    public constructor(unit, skillId) {
        this.mUnit = unit
        this.mSkillId = skillId
    }

    public IsAbilitySkill(): boolean {
        return this.m_SkillConfig != null
    }

    public Init() {
        this.m_SkillConfig = GameGlobal.Config.SkillsConfig[this.mSkillId]
    }

    public CheckCondition(): boolean {
        return true
    }

    private _IsRoleType(unit: BattleUnit): boolean {
        return unit.mInfo.type == EntityType.Role
    }

    public ScanEnemyByData(ttype: number, targetType: any): number[] {
        if (ttype == 1) {
            return [this.mUnit.mInfo.handle]
        } else if (ttype == 2) {
            return this.mUnit.mRaid.GetAllFriendlyList(this.mUnit.mTeamIndex)
        } else if (ttype == 3) {
            let enemyList = this.mUnit.mRaid.GetAllFriendlyList(this.mUnit.mTeamIndex)
            let ttypeArgs = targetType
            if (ttypeArgs && ttypeArgs.count) {
                return MathUtils.RandomArrayData(enemyList, ttypeArgs.count)
            }
            return enemyList
        } else if (ttype == 4) {
            return this.mUnit.mRaid.GetAllEmemyList(this.mUnit.mTeamIndex)
        } else if (ttype == 5) {
            let enemyList = this.mUnit.mRaid.GetAllEmemyList(this.mUnit.mTeamIndex)
            let ttypeArgs = targetType
            if (ttypeArgs && ttypeArgs.count) {
                return MathUtils.RandomArrayData(enemyList, ttypeArgs.count)
            }
            return enemyList
        } else {
            console.warn("not impl targetType => " + ttype)
        }
        return []
    }

    public ScanEnemy(): number[] {
        //判空处理
        if (!(this.m_SkillConfig)) return [];
        return this.ScanEnemyByData(this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.ttype], this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.targetType])
    }

    private m_GetTargetFunc: { [key: string]: any } = {}

    private ConcatArgs(...param: any[]): string {
        let str = ""
        for (let data of param) {
            if (data) {
                str += data + "_"
            }
        }
        return str.substr(0, str.length - 1)
    }

    public GetTarget(exeConfigData: any[]): number[] {
        let ttype = exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.ttype]
        if (ttype < 10000) {
            return this.ScanEnemyByData(ttype, exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.targetType])
        }
        let ttypeArgs = exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.targetType]
        let key = ttype
        let funcObj = this.m_GetTargetFunc[key]
        if (!funcObj) {
            let cls = egret.getDefinitionByName("SUnitSkillGetTarget" + key)
            if (!cls) {
                console.error("not GetTarget func key => " + key)
                return null
            }
            funcObj = this.m_GetTargetFunc[key] = new cls()
            funcObj.Init(this.mTargets, ttypeArgs)
        }
        return funcObj.Get()
    }

    public Use(targets: number[]): BUnitAction {
        if (!this.m_SkillConfig) {
            return
        }
        this.mTargets = targets || []
        this.m_GetTargetFunc = {}
        let action = new BUseSkillAction
        action.src = this.mUnit.mInfo.handle
        action.skillId = this.mSkillId
        action.targets = targets
        let event = []
        if (targets && targets.length) {
            // let calcType = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.calcType]
            // if (calcType == 1) {
            //     action.data1 = this.UseCalcType1(targets)
            // } else if (calcType == 2) {
            //     action.data2 = this.UseCalcType2(targets)
            // } else {
            //     console.error(" not calc type => " + calcType)
            // }

            let actions = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.actions]
            let list: BUseSkillAtkAction[] = []
            for (let dt of actions) {
                let dta = this.ExecuteAction(dt)
                dta.skill = action
                list.push(dta)
            }
            action.actions = list
        } else {
            console.warn("not enm")
        }
        return action
    }

    private ExecuteAction(actionId: number): BUseSkillAtkAction {
        let atkData = new BUseSkillAtkAction
        atkData.src = this.mUnit.mInfo.handle
        atkData.actionId = actionId
        let configData = GameGlobal.Config.SkillsExeConfig[actionId]
        if (!configData) {
            console.error("not config id => " + actionId)
            return atkData
        }
        // let targetData = configData[GameGlobal.Config.SkillsExeConfig_keys.targetType]
        let targets = this.GetTarget(configData)
        if (!targets || targets.length == 0) {
            atkData.targets = []
            console.log("not target => " + actionId)
            return atkData
        }
        atkData.targets = targets
        let isFrist = true
        let args = configData[GameGlobal.Config.SkillsExeConfig_keys.args]
        let atkType = configData[GameGlobal.Config.SkillsExeConfig_keys.type]
        let list = []
        for (let targetId of targets) {
            let unit = this.mUnit.mRaid.GetRaidUnit(targetId)
            if (!unit) {
                atkData.event.push({
                    target: targetId,
                    type: DamageTypes.INVALID,
                } as any)
                continue
            }
            // if (isFrist) {
            //     atkData.targets = targetId
            //     // 第一个对象才有保护
            //     let newTarget = unit
            //     // let newTarget = this.mUnit.mRaid.OnAttack(unit) || unit
            //     // if (!BattleUnit.Equal(newTarget, unit)) {
            //     //     atkData.event = new BattleAttackEventProtect(newTarget.mInfo.handle, unit.mInfo.handle)
            //     // }
            //     unit = newTarget
            //     isFrist = false
            // }
            if (atkType == 1) {
                let data = this.AffectType1(unit, args) as BattleDamageBaseData
                if (data) {
                    atkData.event.push(data)
                }
            } else if (atkType == 2) {
                this.AffectType2(atkData.event, unit, args)
            } else {
                console.error("not impl atkType => " + atkType)
            }
        }
        return atkData
    }

    private AffectType2(event: BUnitAction[], targetUnit: BattleUnit, args: any) {
        let addBuff = true
        if (args.p && args.p < 1) {
            addBuff = Math.random() > args.p
        }
        if (addBuff) {
            targetUnit.AddBuffs(event, this.mUnit.mInfo.handle, args.id)
        }
    }

    // private UseCalcType2(targets: number[]): BattleAttackData2[] {
    //     let config_keys = GameGlobal.Config.SkillsConfig_keys
    //     let calcTypeIndex = this.m_SkillConfig[config_keys.calcTypeIndex]
    //     let actions = this.m_SkillConfig[config_keys.actions]
    //     let actionNumber = this.m_SkillConfig[config_keys.actionNumber]

    //     let argsIndex
    //     let values = calcTypeIndex
    //     if (values.length > 0) {
    //         argsIndex = values[0]
    //     } else {
    //         console.error("calcTypeIndex len == 0")
    //         return
    //     }
    //     let args1 = this.m_SkillConfig[config_keys["args" + argsIndex]]

    //     let list1: BattleAttackData2[] = []
    //     for (let i = 0; i < actions; i++) {
    //         let list2 = {} as BattleAttackData2 
    //         list2.damages = []
    //         for (let j = 0; j < actionNumber; j++) {
    //             let list3: BattleAttackDamage2[] = []
    //             for (let targetIndex = 0; targetIndex < targets.length; targetIndex++) {
    //                 let targetId = targets[targetIndex]
    //                 let unit = this.mUnit.mRaid.GetRaidUnit(targetId)
    //                 if (!unit) {
    //                     continue
    //                 }
    //                 let data = this.AffectType1(unit, args1) as BattleAttackDamage2
    //                 if (data) {
    //                     list3.push(data)
    //                 }
    //             }
    //             list2.damages.push(list3)
    //         }
    //         list1.push(list2)
    //     }
    //     return list1
    // }

    // private UseCalcType1(targets: number[]): BattleAttackData1[] {
    //     let config_keys = GameGlobal.Config.SkillsConfig_keys
    //     let calcTypeIndex = this.m_SkillConfig[config_keys.calcTypeIndex]
    //     let actions = this.m_SkillConfig[config_keys.actions]
    //     let actionNumber = this.m_SkillConfig[config_keys.actionNumber]
    //     let datas: BattleAttackData1[] = []
    //     for (let i = 0; i < targets.length; ++i) {
    //         let targetId = targets[i]
    //         let unit = this.mUnit.mRaid.GetRaidUnit(targetId)
    //         if (!unit) {
    //             continue
    //         }
    //         let argsIndex
    //         let values = calcTypeIndex
    //         if (values.length > 0) {
    //             argsIndex = values[i] || values[values.length - 1]
    //         } else {
    //             console.error("calcTypeIndex len == 0")
    //             continue
    //         }
    //         let args1 = this.m_SkillConfig[config_keys["args" + argsIndex]]
    //         if (typeof(actions) == "number") {
    //             for (let a1 = 0; a1 < actions; a1++) {
    //                 let atkData = {} as BattleAttackData1
    //                 atkData.target = targetId
    //                 this.CalcAction(atkData, unit, args1, actionNumber)
    //                 datas.push(atkData)
    //             }
    //         } else {
    //             for (let argsType1 of actions) {
    //                 let args2 = this.ReCalcArgs(args1, argsType1)
    //                 let atkData = {} as BattleAttackData1
    //                 atkData.target = targetId
    //                 this.CalcAction(atkData, unit, args2, actionNumber)
    //                 datas.push(atkData)
    //             }
    //         }
    //     }
    //     return datas
    // }

    // private CalcAction(atkData: BattleAttackData1, target: BattleUnit, args2, actionNumber) {
    //     let list: BattleDamageBaseData[] = []
    //     let newTarget = this.mUnit.mRaid.OnAttack(target) || target
    //     if (!BattleUnit.Equal(newTarget, target)) {
    //         atkData.event = new BattleAttackEventBlock(newTarget.mInfo.handle, target.mInfo.handle)
    //     }
    //     if (typeof(actionNumber) == "number") {
    //         for (let a1 = 0; a1 < actionNumber; a1++) {
    //             let data = this.AffectType1(newTarget, args2)
    //             if (data) {
    //                 list.push(data)
    //             } else {
    //                 break
    //             }
    //         }
    //     } else {
    //         for (let argsType2 of actionNumber) {
    //             let args3 = this.ReCalcArgs(args2, argsType2)
    //             let data = this.AffectType1(newTarget, args3)   
    //             if (data) {
    //                 list.push(data)
    //             }
    //         }
    //     }
    //     atkData.damages = list
    // }

    // private ReCalcArgs(args, data) {
    //     if (data.t == 1) {
    //         return args
    //     }
    //     return args
    // }

    // 伤害
    private AffectType1(targetUnit: BattleUnit, args: any): BattleDamageBaseData {
        if (targetUnit.IsDead()) {
            return
        }
        let hittype, damage
        let deskattr = Math.random()
        let caster = this.mUnit.mInfo
        let target = targetUnit.mInfo
        let crit = Math.min(Math.max(0.05 + (caster.GetAttr(AttributeType.atCrit) - target.GetAttr(AttributeType.atTough)) / 100, 0.05), 0.5)
        if (deskattr < crit) {
            hittype = DamageTypes.CRIT
        } else {
            deskattr = deskattr - crit
            let evade = 1 - Math.max(0.8 + (caster.GetAttr(AttributeType.atHitRate) - target.GetAttr(AttributeType.atEvade)) / 100, 0.5)
            if (deskattr < evade) {
                hittype = DamageTypes.Evade
                damage = 0
            } else {
                hittype = DamageTypes.HIT
            }
        }
        if (hittype != DamageTypes.Evade) {
            let changevalue = caster.GetAttr(AttributeType.atPVEEnhance) - target.GetAttr(AttributeType.atPVEReduction)
            damage = Math.max((Math.max(caster.GetAttr(AttributeType.atAttack) - Math.max(target.GetAttr(AttributeType.atDef) - Math.max(caster.GetAttr(AttributeType.atDefy)
                - target.GetAttr(AttributeType.atDefyReduction), 0), 0), 0)) * Math.max(1 + (caster.GetAttr(AttributeType.atDamageEnhancePerc)
                    - target.GetAttr(AttributeType.atDamageReductionPerc) + changevalue) / 10000, 0) + caster.GetAttr(AttributeType.atDamageEnhance)
                - target.GetAttr(AttributeType.atDamageReduction), 1) * args.a + args.b
            if (hittype == DamageTypes.CRIT) {
                damage = damage * (2 + Math.max((caster.GetAttr(AttributeType.atCritEnhance) - target.GetAttr(AttributeType.atCritReduction)) / 10000, -1))
            }
        }
        damage = Math.floor(damage || 0)
        damage = Math.max(damage, 1)

        let tmpData = new BattleDamageBaseData
        tmpData.target = target.handle
        tmpData.type = hittype
        tmpData.value = -damage

        targetUnit.Hit(hittype, -damage, this.mUnit)
        if (targetUnit.IsDead()) {
            tmpData.Push(new BDeadAction)
        }

        return tmpData
    }
}
