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
var XianlvXwModel = (function (_super) {
    __extends(XianlvXwModel, _super);
    function XianlvXwModel() {
        var _this = _super.call(this, UserTemplate.TYPE_XIANLV_XW) || this;
        _this.mMsgDefUpdateExp = MessageDef.XIANLV_XW_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.XIANLV_XW_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.XIANLV_XW_UPDATE;
        _this.mMsgDefInit = MessageDef.XIANLV_XW_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.XIANLV_XW_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_XIANLV_XW_EQUIP_UP;
        _this.mRedPoint = new XianlvXwRedPoint(_this);
        return _this;
    }
    XianlvXwModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.PositionBaseConfig;
        this.LvproConfig = GameGlobal.Config.PositionLvproConfig;
        this.SkillConfig = GameGlobal.Config.PositionSkillConfig;
        this.AttrsConfig = GameGlobal.Config.PositionAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.PositionProgressConfig;
        this.SkinConfig = GameGlobal.Config.PositionSkinConfig;
        _super.prototype.Init.call(this);
    };
    XianlvXwModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRoleXianlvXw(this.mDressId);
    };
    return XianlvXwModel;
}(UserTemplate));
__reflect(XianlvXwModel.prototype, "XianlvXwModel");
var XianlvXwRedPoint = (function (_super) {
    __extends(XianlvXwRedPoint, _super);
    function XianlvXwRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_XIANLV_XW_EQUIP_UP
        _this.mEquipType = ItemType.XIAN_XW;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_XIANLV_XW_EQUIP_UP, MessageDef.XIANLV_XW_INIT, MessageDef.XIANLV_XW_UPDATE_EQUIP]
        // }
    }
    XianlvXwRedPoint.prototype.IsRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_18, true)) {
            return false;
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    return XianlvXwRedPoint;
}(UserTemplateRedPoint));
__reflect(XianlvXwRedPoint.prototype, "XianlvXwRedPoint");
//# sourceMappingURL=XianlvXwModel.js.map