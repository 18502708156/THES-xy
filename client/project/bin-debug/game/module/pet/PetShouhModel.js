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
var PetShouhModel = (function (_super) {
    __extends(PetShouhModel, _super);
    function PetShouhModel() {
        var _this = _super.call(this, UserTemplate.TYPE_PET_SHOUH) || this;
        _this.mMsgDefUpdateExp = MessageDef.PET_SHOUH_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.PET_SHOUH_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.PET_SHOUH_UPDATE;
        _this.mMsgDefInit = MessageDef.PET_SHOUH_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.PET_SHOUH_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_PET_SHOUH_EQUIP_UP;
        _this.mRedPoint = new PetShohRedPoint(_this);
        return _this;
    }
    PetShouhModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.SoulBaseConfig;
        this.LvproConfig = GameGlobal.Config.SoulLvproConfig;
        this.SkillConfig = GameGlobal.Config.SoulSkillConfig;
        this.AttrsConfig = GameGlobal.Config.SoulAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.SoulProgressConfig;
        this.SkinConfig = GameGlobal.Config.SoulSkinConfig;
        _super.prototype.Init.call(this);
    };
    PetShouhModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRolePetShouh(this.mDressId);
    };
    return PetShouhModel;
}(UserTemplate));
__reflect(PetShouhModel.prototype, "PetShouhModel");
var PetShohRedPoint = (function (_super) {
    __extends(PetShohRedPoint, _super);
    function PetShohRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_PET_SHOUH_EQUIP_UP
        _this.mEquipType = ItemType.PET_SH;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_PET_SHOUH_EQUIP_UP, MessageDef.PET_SHOUH_INIT, MessageDef.PET_SHOUH_UPDATE_EQUIP]
        // }
    }
    return PetShohRedPoint;
}(UserTemplateRedPoint));
__reflect(PetShohRedPoint.prototype, "PetShohRedPoint");
//# sourceMappingURL=PetShouhModel.js.map