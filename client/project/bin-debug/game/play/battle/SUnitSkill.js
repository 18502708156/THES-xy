var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var SUnitSkill = (function () {
    function SUnitSkill(unit, skillId) {
        this.penetrate = 0;
        this.mTargets = [];
        this.m_GetTargetFunc = {};
        this.mUnit = unit;
        this.mSkillId = skillId;
    }
    SUnitSkill.prototype.IsAbilitySkill = function () {
        return this.m_SkillConfig != null;
    };
    SUnitSkill.prototype.Init = function () {
        this.m_SkillConfig = GameGlobal.Config.SkillsConfig[this.mSkillId];
    };
    SUnitSkill.prototype.CheckCondition = function () {
        return true;
    };
    SUnitSkill.prototype._IsRoleType = function (unit) {
        return unit.mInfo.type == EntityType.Role;
    };
    SUnitSkill.prototype.ScanEnemyByData = function (ttype, targetType) {
        if (ttype == 1) {
            return [this.mUnit.mInfo.handle];
        }
        else if (ttype == 2) {
            return this.mUnit.mRaid.GetAllFriendlyList(this.mUnit.mTeamIndex);
        }
        else if (ttype == 3) {
            var enemyList = this.mUnit.mRaid.GetAllFriendlyList(this.mUnit.mTeamIndex);
            var ttypeArgs = targetType;
            if (ttypeArgs && ttypeArgs.count) {
                return MathUtils.RandomArrayData(enemyList, ttypeArgs.count);
            }
            return enemyList;
        }
        else if (ttype == 4) {
            return this.mUnit.mRaid.GetAllEmemyList(this.mUnit.mTeamIndex);
        }
        else if (ttype == 5) {
            var enemyList = this.mUnit.mRaid.GetAllEmemyList(this.mUnit.mTeamIndex);
            var ttypeArgs = targetType;
            if (ttypeArgs && ttypeArgs.count) {
                return MathUtils.RandomArrayData(enemyList, ttypeArgs.count);
            }
            return enemyList;
        }
        else {
            console.warn("not impl targetType => " + ttype);
        }
        return [];
    };
    SUnitSkill.prototype.ScanEnemy = function () {
        //判空处理
        if (!(this.m_SkillConfig))
            return [];
        return this.ScanEnemyByData(this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.ttype], this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.targetType]);
    };
    SUnitSkill.prototype.ConcatArgs = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var str = "";
        for (var _a = 0, param_1 = param; _a < param_1.length; _a++) {
            var data = param_1[_a];
            if (data) {
                str += data + "_";
            }
        }
        return str.substr(0, str.length - 1);
    };
    SUnitSkill.prototype.GetTarget = function (exeConfigData) {
        var ttype = exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.ttype];
        if (ttype < 10000) {
            return this.ScanEnemyByData(ttype, exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.targetType]);
        }
        var ttypeArgs = exeConfigData[GameGlobal.Config.SkillsExeConfig_keys.targetType];
        var key = ttype;
        var funcObj = this.m_GetTargetFunc[key];
        if (!funcObj) {
            var cls = egret.getDefinitionByName("SUnitSkillGetTarget" + key);
            if (!cls) {
                console.error("not GetTarget func key => " + key);
                return null;
            }
            funcObj = this.m_GetTargetFunc[key] = new cls();
            funcObj.Init(this.mTargets, ttypeArgs);
        }
        return funcObj.Get();
    };
    SUnitSkill.prototype.Use = function (targets) {
        if (!this.m_SkillConfig) {
            return;
        }
        this.mTargets = targets || [];
        this.m_GetTargetFunc = {};
        var action = new BUseSkillAction;
        action.src = this.mUnit.mInfo.handle;
        action.skillId = this.mSkillId;
        action.targets = targets;
        var event = [];
        if (targets && targets.length) {
            // let calcType = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.calcType]
            // if (calcType == 1) {
            //     action.data1 = this.UseCalcType1(targets)
            // } else if (calcType == 2) {
            //     action.data2 = this.UseCalcType2(targets)
            // } else {
            //     console.error(" not calc type => " + calcType)
            // }
            var actions = this.m_SkillConfig[GameGlobal.Config.SkillsConfig_keys.actions];
            var list = [];
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var dt = actions_1[_i];
                var dta = this.ExecuteAction(dt);
                dta.skill = action;
                list.push(dta);
            }
            action.actions = list;
        }
        else {
            console.warn("not enm");
        }
        return action;
    };
    SUnitSkill.prototype.ExecuteAction = function (actionId) {
        var atkData = new BUseSkillAtkAction;
        atkData.src = this.mUnit.mInfo.handle;
        atkData.actionId = actionId;
        var configData = GameGlobal.Config.SkillsExeConfig[actionId];
        if (!configData) {
            console.error("not config id => " + actionId);
            return atkData;
        }
        // let targetData = configData[GameGlobal.Config.SkillsExeConfig_keys.targetType]
        var targets = this.GetTarget(configData);
        if (!targets || targets.length == 0) {
            atkData.targets = [];
            console.log("not target => " + actionId);
            return atkData;
        }
        atkData.targets = targets;
        var isFrist = true;
        var args = configData[GameGlobal.Config.SkillsExeConfig_keys.args];
        var atkType = configData[GameGlobal.Config.SkillsExeConfig_keys.type];
        var list = [];
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var targetId = targets_1[_i];
            var unit = this.mUnit.mRaid.GetRaidUnit(targetId);
            if (!unit) {
                atkData.event.push({
                    target: targetId,
                    type: DamageTypes.INVALID,
                });
                continue;
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
                var data = this.AffectType1(unit, args);
                if (data) {
                    atkData.event.push(data);
                }
            }
            else if (atkType == 2) {
                this.AffectType2(atkData.event, unit, args);
            }
            else {
                console.error("not impl atkType => " + atkType);
            }
        }
        return atkData;
    };
    SUnitSkill.prototype.AffectType2 = function (event, targetUnit, args) {
        var addBuff = true;
        if (args.p && args.p < 1) {
            addBuff = Math.random() > args.p;
        }
        if (addBuff) {
            targetUnit.AddBuffs(event, this.mUnit.mInfo.handle, args.id);
        }
    };
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
    SUnitSkill.prototype.AffectType1 = function (targetUnit, args) {
        if (targetUnit.IsDead()) {
            return;
        }
        var hittype, damage;
        var deskattr = Math.random();
        var caster = this.mUnit.mInfo;
        var target = targetUnit.mInfo;
        var crit = Math.min(Math.max(0.05 + (caster.GetAttr(AttributeType.atCrit) - target.GetAttr(AttributeType.atTough)) / 100, 0.05), 0.5);
        if (deskattr < crit) {
            hittype = DamageTypes.CRIT;
        }
        else {
            deskattr = deskattr - crit;
            var evade = 1 - Math.max(0.8 + (caster.GetAttr(AttributeType.atHitRate) - target.GetAttr(AttributeType.atEvade)) / 100, 0.5);
            if (deskattr < evade) {
                hittype = DamageTypes.Evade;
                damage = 0;
            }
            else {
                hittype = DamageTypes.HIT;
            }
        }
        if (hittype != DamageTypes.Evade) {
            var changevalue = caster.GetAttr(AttributeType.atPVEEnhance) - target.GetAttr(AttributeType.atPVEReduction);
            damage = Math.max((Math.max(caster.GetAttr(AttributeType.atAttack) - Math.max(target.GetAttr(AttributeType.atDef) - Math.max(caster.GetAttr(AttributeType.atDefy)
                - target.GetAttr(AttributeType.atDefyReduction), 0), 0), 0)) * Math.max(1 + (caster.GetAttr(AttributeType.atDamageEnhancePerc)
                - target.GetAttr(AttributeType.atDamageReductionPerc) + changevalue) / 10000, 0) + caster.GetAttr(AttributeType.atDamageEnhance)
                - target.GetAttr(AttributeType.atDamageReduction), 1) * args.a + args.b;
            if (hittype == DamageTypes.CRIT) {
                damage = damage * (2 + Math.max((caster.GetAttr(AttributeType.atCritEnhance) - target.GetAttr(AttributeType.atCritReduction)) / 10000, -1));
            }
        }
        damage = Math.floor(damage || 0);
        damage = Math.max(damage, 1);
        var tmpData = new BattleDamageBaseData;
        tmpData.target = target.handle;
        tmpData.type = hittype;
        tmpData.value = -damage;
        targetUnit.Hit(hittype, -damage, this.mUnit);
        if (targetUnit.IsDead()) {
            tmpData.Push(new BDeadAction);
        }
        return tmpData;
    };
    return SUnitSkill;
}());
__reflect(SUnitSkill.prototype, "SUnitSkill");
//# sourceMappingURL=SUnitSkill.js.map