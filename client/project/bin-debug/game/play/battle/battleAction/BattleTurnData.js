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
var BUseSkillAction = (function (_super) {
    __extends(BUseSkillAction, _super);
    function BUseSkillAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_USESKILL;
        _this.actions = [];
        return _this;
    }
    BUseSkillAction.prototype.Init = function (context) {
        _super.prototype.Init.call(this, context);
        this.mList = this.actions;
        var srcEntity = context.GetEntity(this.src);
        if (!srcEntity) {
            console.log("not found entity => " + this.src);
            return;
        }
        var entityData = srcEntity.GetInfo();
        this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.STAND, false));
        this.mList.push(BUnitJumpAction.Create(entityData.x, entityData.y, srcEntity));
        this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.STAND, false));
    };
    return BUseSkillAction;
}(BUnitListAction));
__reflect(BUseSkillAction.prototype, "BUseSkillAction");
var CatchSkillAction = (function (_super) {
    __extends(CatchSkillAction, _super);
    function CatchSkillAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_USESKILL;
        _this.actions = [];
        return _this;
    }
    CatchSkillAction.prototype.Init = function (context) {
        _super.prototype.Init.call(this, context);
        this.mList = this.actions;
        var srcEntity = context.mEntityList[this.src];
        var entityData = srcEntity.GetInfo();
        var tage = context.mEntityList[this.targets[0]];
        this.mList.push(BUnitPlayAction.Create(srcEntity, EntityClipType.ATTACK, false)); /*施法 */
        var list = new BUnitParallelAction;
        list.mList.push(BUnitJumpAction.Create(entityData.x, entityData.y, srcEntity));
        list.mList.push(BUnitJumpAction.CreateByTarget(srcEntity, tage));
        this.mList.push(list);
        if (!GameGlobal.CatchPetModel.result) {
            this.mList.push(BUnitJumpAction.Create(tage.GetInfo().x, tage.GetInfo().y, tage));
        }
    };
    return CatchSkillAction;
}(BUnitListAction));
__reflect(CatchSkillAction.prototype, "CatchSkillAction");
var BTurnStartAction = (function (_super) {
    __extends(BTurnStartAction, _super);
    function BTurnStartAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_ROUND;
        return _this;
    }
    return BTurnStartAction;
}(BUnitAction));
__reflect(BTurnStartAction.prototype, "BTurnStartAction");
var BDeadAction = (function (_super) {
    __extends(BDeadAction, _super);
    function BDeadAction() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mType = BattleTurnDataParse.TYPE_DEAD;
        return _this;
    }
    return BDeadAction;
}(BUnitAction));
__reflect(BDeadAction.prototype, "BDeadAction");
var BattleAction = (function () {
    function BattleAction() {
    }
    BattleAction.prototype.Excute = function (context) {
    };
    return BattleAction;
}());
__reflect(BattleAction.prototype, "BattleAction");
var BattleAttackEventProtect = (function () {
    function BattleAttackEventProtect(handle, beHandle) {
        this.type = "protect";
        this.handle = handle;
        this.beHandle = beHandle;
    }
    BattleAttackEventProtect.prototype.Create = function () {
        return AIUnitTriggerProtectAction.CreateByData(this.handle, this.beHandle);
    };
    return BattleAttackEventProtect;
}());
__reflect(BattleAttackEventProtect.prototype, "BattleAttackEventProtect", ["IBattleAttackEvent"]);
var BattleAttackEventBlock = (function () {
    function BattleAttackEventBlock(handle, beHandle) {
        this.type = "block";
        this.handle = handle;
        this.beHandle = beHandle;
    }
    BattleAttackEventBlock.prototype.Create = function () {
        return AIUnitTriggerBlockAction.CreateByData(this.handle, this.beHandle);
    };
    return BattleAttackEventBlock;
}());
__reflect(BattleAttackEventBlock.prototype, "BattleAttackEventBlock", ["IBattleAttackEvent"]);
//# sourceMappingURL=BattleTurnData.js.map