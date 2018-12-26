var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BUnitAtkAction = (function (_super) {
    __extends(BUnitAtkAction, _super);
    function BUnitAtkAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_Triggers = [];
        _this.m_TriggerIndex = 0;
        return _this;
    }
    BUnitAtkAction.Create = function (raid, src, skillId, event) {
        var action = new BUnitAtkAction;
        action.mRaid = raid;
        action.mSelf = src;
        action.skillId = skillId;
        action.event = event;
        action.m_SkillEffConfig = SkillsConfig.GetSkillEffConfig(skillId);
        return action;
    };
    BUnitAtkAction.prototype.OnEnter = function () {
        this.InitTriggerList();
        _super.prototype.OnEnter.call(this);
    };
    BUnitAtkAction.prototype.OnExit = function () {
        _super.prototype.OnExit.call(this);
        if (this.mSelf) {
            this.mSelf.UpdateAction(EntityClipType.STAND, false);
        }
        this.event = [[]];
        this.m_Triggers = [];
    };
    BUnitAtkAction.prototype.OnUpdate = function (delta) {
        var triggerData = this.m_Triggers[this.m_TriggerIndex];
        if (triggerData) {
            if (triggerData.time >= 0) {
                if ((triggerData.time -= delta) > 0) {
                    return AIUnitReturn.CONTINUE;
                }
            }
            if (triggerData.event) {
                // true 继续执行
                if (triggerData.event.call(this, delta, triggerData.data)) {
                    return AIUnitReturn.CONTINUE;
                }
            }
            if (++this.m_TriggerIndex >= this.m_Triggers.length) {
                return AIUnitReturn.NEXT;
            }
            return AIUnitReturn.CONTINUE;
        }
        return AIUnitReturn.NEXT;
    };
    BUnitAtkAction.prototype.ExeAction = function (val) {
        if (val.mType == BattleTurnDataParse.TYPE_ACTIONHP) {
            this.DamageFunc(val);
        }
        else {
            val.Execute(this.mRaid);
            if (val.mType == BattleTurnDataParse.TYPE_REMOVEBUFF) {
            }
            else if (val.mType == BattleTurnDataParse.TYPE_ACTIONBUFF) {
            }
            else if (val.mType == BattleTurnDataParse.TYPE_BUFFSTATUSHP) {
            }
            else {
                console.error("not impl DamageFunc type => " + val.mType);
            }
        }
    };
    BUnitAtkAction.prototype.ExecuteFunc = function (delta, data) {
        if (!data) {
            return;
        }
        var raid = this.mRaid;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var val = data_1[_i];
            this.ExeAction(val);
        }
    };
    BUnitAtkAction.prototype.DelayExecuteFunc = function (delta, data) {
        if (data.index >= data.data.length) {
            return false;
        }
        if (data.time < 125) {
            data.time += delta;
            return true;
        }
        data.time = 0;
        this.ExeAction(data.data[data.index++]);
        if (data.index >= data.data.length) {
            return false;
        }
        return true;
    };
    BUnitAtkAction.prototype.PreExecuteFunc = function (data) {
        if (!data) {
            return;
        }
        var pos = this.m_SkillEffConfig ? this.m_SkillEffConfig.becastPos : SkillsConfig.BECAST_TYPE.TYPE_0;
        if (pos != SkillsConfig.BECAST_TYPE.TYPE_1) {
            return;
        }
        var raid = this.mRaid;
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var val = data_2[_i];
            var d = val;
            var target = this.mRaid.GetEntity(d.target);
            if (!target) {
                continue;
            }
            GameGlobal.EntityEffMgr.PlayEffByPos(this.m_SkillEffConfig, target.x, target.y);
        }
    };
    BUnitAtkAction.prototype.DamageFunc = function (d) {
        var target = this.mRaid.GetEntity(d.target);
        if (!target) {
            return;
        }
        var data = DamageData.Set(target.GetInfo().team, target.x, target.y, d.type, d.value, this.skillId);
        if (d.type == DamageTypes.Evade) {
            target.mAI.Evade(data);
        }
        else {
            target.mAI.Hit(data, d.HasDead());
            var info = target.GetInfo();
            if (info) {
                if (this.m_SkillEffConfig && this.m_SkillEffConfig.becastPos != SkillsConfig.BECAST_TYPE.TYPE_1) {
                    GameGlobal.EntityEffMgr.PlayBecastEff(this.m_SkillEffConfig, d.target, info.x, info.y, target.GetDir());
                }
                this.mRaid.OnEventDamage(info.handle);
            }
        }
    };
    BUnitAtkAction.prototype.InitTriggerList = function () {
        this.m_Triggers = [];
        this.m_TriggerIndex = 0;
        var list = [];
        if (this.event.length > 0) {
            list[0] = { time: 0, event: this.PlayFunc, data: null };
            var gap = 30;
            var t = -gap;
            for (var _i = 0, _a = this.event; _i < _a.length; _i++) {
                var data = _a[_i];
                t += gap;
                var animId = this.m_SkillEffConfig.animId;
                if (animId == 100) {
                    var funcData = new BUnitAtkDelayExeData;
                    funcData.data = data || [];
                    funcData.index = 0;
                    funcData.time = 0;
                    list.push({ time: gap, event: this.DelayExecuteFunc, data: funcData });
                }
                else {
                    list.push({ time: gap, event: this.ExecuteFunc, data: data });
                }
            }
            list[1].time = AIConfig.HIT_TIME;
            list.push({ time: Math.max(AIConfig.HIT_RESET_TIME - t, 0), event: null, data: null });
        }
        this.m_Triggers = list;
    };
    BUnitAtkAction.prototype.PlayFunc = function () {
        var skillEffConfig = this.m_SkillEffConfig;
        if (!skillEffConfig) {
            console.warn("not skilleff config => " + this.skillId);
            return;
        }
        this.mSelf.mAI.ClearOtherAnim();
        this.mSelf.ReplayAction(EntityClipType.ATTACK, true);
        if (this.event && this.event[0]) {
            this.PreExecuteFunc(this.event[0]);
        }
        GameGlobal.EntityEffMgr.PlayCastSkillEff(skillEffConfig, this.mSelf);
    };
    return BUnitAtkAction;
}(BUnitAction));
__reflect(BUnitAtkAction.prototype, "BUnitAtkAction");
var BUnitAtkDelayExeData = (function () {
    function BUnitAtkDelayExeData() {
    }
    return BUnitAtkDelayExeData;
}());
__reflect(BUnitAtkDelayExeData.prototype, "BUnitAtkDelayExeData");
//# sourceMappingURL=BUnitAtkAction.js.map