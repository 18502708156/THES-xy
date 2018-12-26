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
var PetTonglModel = (function (_super) {
    __extends(PetTonglModel, _super);
    function PetTonglModel() {
        var _this = _super.call(this, UserTemplate.TYPE_PET_TONGL) || this;
        _this.mMsgDefUpdateExp = MessageDef.PET_TONGL_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.PET_TONGL_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.PET_TONGL_UPDATE;
        _this.mMsgDefInit = MessageDef.PET_TONGL_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.PET_TONGL_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_PET_TONGL_EQUIP_UP;
        _this.mRedPoint = new PetTonglRedPoint(_this);
        return _this;
    }
    PetTonglModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.PsychicBaseConfig;
        this.LvproConfig = GameGlobal.Config.PsychicLvproConfig;
        this.SkillConfig = GameGlobal.Config.PsychicSkillConfig;
        this.AttrsConfig = GameGlobal.Config.PsychicAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.PsychicProgressConfig;
        this.SkinConfig = GameGlobal.Config.PsychicSkinConfig;
        _super.prototype.Init.call(this);
    };
    PetTonglModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRolePetTongl(this.mDressId);
    };
    return PetTonglModel;
}(UserTemplate));
__reflect(PetTonglModel.prototype, "PetTonglModel");
var PetTonglRedPoint = (function (_super) {
    __extends(PetTonglRedPoint, _super);
    function PetTonglRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_PET_TONGL_EQUIP_UP
        _this.mEquipType = ItemType.PET_TL;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_PET_TONGL_EQUIP_UP, MessageDef.PET_TONGL_INIT, MessageDef.PET_TONGL_UPDATE_EQUIP]
        // }
    }
    return PetTonglRedPoint;
}(UserTemplateRedPoint));
__reflect(PetTonglRedPoint.prototype, "PetTonglRedPoint");
//# sourceMappingURL=PetTonglModel.js.map