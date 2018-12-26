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
var BUseSkillAtkAction = (function (_super) {
    __extends(BUseSkillAtkAction, _super);
    function BUseSkillAtkAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_USEACTION;
        // public damages: BattleDamageBaseData[] = []
        // public buff: BAddBuffAction = null
        _this.event = [];
        return _this;
    }
    BUseSkillAtkAction.Create = function (data) {
        var atkAction = new BUseSkillAtkAction;
        atkAction.actionId = data.id;
        atkAction.src = data.src;
        atkAction.targets = data.targets;
        for (var _i = 0, _a = BattleTurnDataParse.ParseDatas(data.actions); _i < _a.length; _i++) {
            var item = _a[_i];
            atkAction.event.push(item);
        }
        return atkAction;
    };
    BUseSkillAtkAction.prototype.Init = function (context) {
        _super.prototype.Init.call(this, context);
        var srcentity = context.GetEntity(this.src);
        if (!this.targets.length) {
            if (true) {
                console.warn("not target list !!!");
            }
            return;
        }
        var target = this.targets[0];
        var entity = context.GetEntity(target);
        if (!entity) {
            console.error("not entity => ");
            return;
        }
        var exeConfig = GameGlobal.Config.SkillsExeConfig[this.actionId];
        if (!exeConfig) {
            console.error("not exeConfig => " + this.actionId);
            return;
        }
        var exeConfigType = exeConfig[GameGlobal.Config.SkillsExeConfig_keys.type];
        if (exeConfigType == 1) {
            var list = [];
            var config = GameGlobal.Config.SkillEffConfig[GameGlobal.Config.SkillsConfig[this.skill.skillId][GameGlobal.Config.SkillsConfig_keys.effectId]];
            if (config) {
                if (config.wordEff) {
                    list.push(BUnitPlayWordAction.Create(srcentity, config.wordEff)); //技能名显示
                }
                var animType = config.animType;
                if (animType == 1) {
                    list.push(BUnitJumpAction.CreateByTarget(entity, srcentity));
                }
                else if (animType == 3) {
                    list.push(BUnitJumpAction.Create(BattleCtrl.POS_CENTER.x, BattleCtrl.POS_CENTER.y, srcentity));
                }
                else if (animType == 2) {
                    // 不需要移动
                }
                else {
                    console.error("not impl anim type => " + animType);
                }
            }
            else {
                list.push(BUnitJumpAction.CreateByTarget(entity, srcentity));
            }
            var type10List = null;
            if (this.event) {
                for (var i = this.event.length - 1; i >= 0; --i) {
                    var data = this.event[i];
                    if (data.mType == BattleTurnDataParse.TYPE_BUFFSTATUSHP && (data.IsLianji() || data.IsFanji())) {
                        if (!type10List) {
                            type10List = [];
                        }
                        type10List.push(data);
                        this.event.splice(i, 1);
                    }
                }
            }
            list.push(BUnitAtkAction.Create(context, srcentity, this.skill.skillId, [this.event]));
            if (type10List) {
                type10List.reverse();
                for (var _i = 0, type10List_1 = type10List; _i < type10List_1.length; _i++) {
                    var data = type10List_1[_i];
                    if (data.IsLianji()) {
                        var tmpData = new BattleDamageBaseData;
                        tmpData.target = data.target;
                        tmpData.type = DamageTypes.BUFF_TYPE_10;
                        tmpData.value = data.args[1];
                        if (data.HasDead()) {
                            tmpData.Push(new BDeadAction);
                        }
                        list.push(BUnitAtkAction.Create(context, srcentity, this.skill.skillId, [[tmpData]]));
                    }
                    else if (data.IsFanji()) {
                        var tmpData = new BattleDamageBaseData;
                        tmpData.target = data.target;
                        tmpData.type = DamageTypes.BUFF_TYPE_5;
                        tmpData.value = data.args[1];
                        if (data.HasDead()) {
                            tmpData.Push(new BDeadAction);
                        }
                        var entity_1 = context.GetEntity(data.src);
                        if (entity_1) {
                            list.push(BDelayAction.Create(100));
                            list.push(BUnitAtkAction.Create(context, context.GetEntity(data.src), EntityData.default_skill_ids[0], [[tmpData]]));
                        }
                    }
                    else {
                        console.warn("not impl type => ", data);
                    }
                }
            }
            this.mList = list;
        }
        else if (exeConfigType == 2) {
            // 直接执行结果
            this.mList = this.event;
        }
        else {
            console.warn("not impl exeConfigType => " + exeConfigType);
        }
    };
    return BUseSkillAtkAction;
}(BUnitListAction));
__reflect(BUseSkillAtkAction.prototype, "BUseSkillAtkAction");
//# sourceMappingURL=BUseSkillAtkAction.js.map