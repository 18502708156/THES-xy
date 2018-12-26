var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var AIUnit = (function () {
    function AIUnit() {
        this.mStateList = {};
        this.mBuffIds = {};
        // 已经死亡
        this.mIsDead = false;
        // public static GetBornState(unit: AIUnit): AIUnitState {
        // 	let state = new AIUnitState()
        // 	state.mType = AIUnitStateType.BORN
        // 	state.Init(unit)
        // 	return state
        // }
    }
    AIUnit.prototype.GetRaid = function () {
        return this.mEntity.mRaid;
    };
    AIUnit.prototype.Init = function (entity) {
        this.mEntity = entity;
        this.mCurState = this.mStateList[AIUnitStateType.STAND];
        this.mNextState = null;
        this.mIsDead = false;
        this.mBuffIds = {};
    };
    AIUnit.prototype.IsDead = function () {
        return this.mIsDead;
    };
    AIUnit.prototype.IsTarget = function () {
        return !this.IsDead();
    };
    // 添加buff
    AIUnit.prototype.AddBuff = function (buffId) {
        if (!buffId) {
            return;
        }
        var data = new AIUnitBuff;
        data.mBuffId = buffId;
        this.mBuffIds[buffId] = data;
        var Config = data.GetEff();
        for (var data_1 in Config) {
            var effConfig = Config[data_1];
            if (effConfig) {
                if (effConfig.effType == 2) {
                    if (effConfig.type == 0) {
                        GameGlobal.EntityEffMgr.PlayBecastBuff(effConfig, this.mEntity.GetHandle());
                    }
                    else {
                        this.creatEff(buffId, effConfig.targetEff);
                    }
                }
                else if (effConfig.effType == 3) {
                    GameMap.GetBattleView().bloodLayer.ShowBuffEffText(this.mEntity.x, this.mEntity.y, effConfig.targetEff, effConfig.args);
                }
                else {
                    console.warn("not impl buff effType => " + buffId, effConfig.effType);
                }
            }
            else {
                if (true) {
                    console.log("not buff effConfig => " + buffId);
                }
            }
            if (true) {
                // console.log("add buff => " + buffId)
            }
        }
    };
    AIUnit.prototype.creatEff = function (effId, effName) {
        var mc = new MovieClip;
        mc.loadUrl(ResDataPath.GetSkillPath(effName), true, -1);
        mc.name = effId + "";
        this.mEntity.addBattleBuff(mc);
    };
    AIUnit.prototype.Relive = function () {
        var info = this.mEntity.GetInfo();
        info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atMaxHp));
        this.UpdateBlood();
    };
    /**
     *  移除buff
     *  @param isclear 是否是净化
     */
    AIUnit.prototype.RemoveBuff = function (buffId, isclear) {
        if (isclear === void 0) { isclear = false; }
        if (isclear && this.mBuffIds[buffId]) {
            GameMap.GetBattleView().bloodLayer.ShowWord(this.mEntity.x, this.mEntity.y, 0);
        }
        var name = buffId + "";
        this.mEntity.removeBattleBuff(name);
        delete this.mBuffIds[buffId];
    };
    AIUnit.prototype.BuffAct = function (type, value, isDie) {
        GameMap.GetBattleView().bloodLayer.ShowBuffAct(this.mEntity.x, this.mEntity.y, type, value);
        if (isDie) {
            this.Die(500);
        }
    };
    AIUnit.prototype.ChangeHp = function (type, value, isDie) {
        var info = this.mEntity.GetInfo();
        info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atHp) + value);
        this.UpdateBlood();
        GameMap.GetBattleView().bloodLayer.ShowBuffHp(this.mEntity.x, this.mEntity.y, type, value);
        if (isDie) {
            this.Die(500);
        }
    };
    AIUnit.prototype.ClearOtherAnim = function () {
        this.mCurState.ClearOtherAnim();
    };
    // 闪避动画
    AIUnit.prototype.Evade = function (damageData) {
        this.mCurState.PlayEvade();
        GameMap.EntityHpChange(damageData);
    };
    AIUnit.prototype.Hit = function (damageData, isDie) {
        var info = this.mEntity.GetInfo();
        info.setAtt(AttributeType.atHp, info.getAtt(AttributeType.atHp) + damageData.value);
        var shake;
        if (damageData.type == DamageTypes.CRIT) {
            shake = GameMap.CRIT_SHAKE;
        }
        GameMap.EntityHpChange(damageData, shake);
        var hitRemain = this.mCurState.PlayHit();
        this.UpdateBlood();
        if (isDie) {
            this.Die(hitRemain);
        }
    };
    AIUnit.prototype.Die = function (delay) {
        this.mIsDead = true;
        if (delay) {
            this.mDelayAction = {
                mType: AIUnitStateType.Die,
                mDelay: delay
            };
        }
        else {
            this.SetNextState(AIUnitStateType.Die);
        }
    };
    AIUnit.prototype.UpdateBlood = function () {
        var info = this.mEntity.GetInfo();
        if (!info) {
            return;
        }
        var max = info.getAtt(AttributeType.atMaxHp);
        var cur = info.getAtt(AttributeType.atHp);
        this.mEntity.SetBarValue(cur, max);
    };
    AIUnit.prototype.GetStateArgs = function (type) {
        if (this.GetCurType() == type) {
            return this.GetState(type).mAIUnitArgs;
        }
        return AIUnit.TEMP_ARGS;
    };
    AIUnit.prototype.GetState = function (type) {
        return this.mStateList[type];
    };
    AIUnit.prototype.GetCurType = function () {
        return this.mCurState.mType;
    };
    AIUnit.prototype.Update = function (delta) {
        if (!this.mCurState) {
            return;
        }
        if (this.mNextState != null) {
            this.mCurState.mIsEnter = false;
            this.mCurState.OnExit();
            this.mCurState = this.mStateList[this.mNextState];
            this.mNextState = null;
        }
        if (!this.mCurState.mIsEnter) {
            this.mCurState.mIsEnter = true;
            this.mCurState.OnEnter();
        }
        this.mCurState.OnUpdate(delta);
        if (this.mDelayAction) {
            if ((this.mDelayAction.mDelay -= delta) <= 0) {
                this.SetNextState(this.mDelayAction.mType);
                this.mDelayAction = null;
            }
        }
    };
    AIUnit.prototype.StateEndEvent = function (type) {
        if (type == AIUnitStateType.Die) {
            return;
        }
        this.SetNextState(AIUnitStateType.STAND);
        // this.mEntity.mRaid.StateEndEvent(this.mEntity.GetInfo().handle, type)
    };
    AIUnit.prototype.SetNextState = function (aiType) {
        if (this.GetCurType() == aiType) {
            return;
        }
        this.mNextState = aiType;
    };
    AIUnit.prototype.StandPos = function (x, y) {
        this.mEntity.SetPos(x, y);
        this.SetNextState(AIUnitStateType.STAND);
    };
    AIUnit.prototype.MoveTo = function (x, y) {
        var ai = this.mStateList[AIUnitStateType.RUN];
        ai.mAIUnitArgs.SetMovePos(x, y);
        this.SetNextState(AIUnitStateType.RUN);
    };
    AIUnit.prototype.Protect = function (src, beSrc) {
        var ai = this.mStateList[AIUnitStateType.PROTECT];
        ai.mAIUnitArgs.Protect(src, beSrc);
        this.SetNextState(AIUnitStateType.PROTECT);
    };
    AIUnit.GetStandState = function (unit) {
        var state = new AIUnitStandState;
        state.Init(unit);
        return state;
    };
    AIUnit.TEMP_ARGS = new IAIUnitArgs;
    return AIUnit;
}());
__reflect(AIUnit.prototype, "AIUnit");
//# sourceMappingURL=AIUnit.js.map