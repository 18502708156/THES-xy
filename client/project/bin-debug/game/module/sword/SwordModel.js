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
var SwordModel = (function (_super) {
    __extends(SwordModel, _super);
    function SwordModel() {
        var _this = _super.call(this, UserTemplate.TYPE_SHENGB) || this;
        _this.mMsgDefUpdateExp = MessageDef.ROLE_SWORD_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.ROLE_SWORD_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.ROLE_SWORD_UPDATE;
        _this.mMsgDefInit = MessageDef.ROLE_SWORD_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.ROLE_SWORD_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_SWORD_EQUIP_UP;
        _this.mRedPoint = new SwordModelRedPoint(_this);
        return _this;
    }
    SwordModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.WeaponBaseConfig;
        this.LvproConfig = GameGlobal.Config.WeaponLvproConfig;
        this.SkillConfig = GameGlobal.Config.WeaponSkillConfig;
        this.AttrsConfig = GameGlobal.Config.WeaponAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.WeaponProgressConfig;
        this.SkinConfig = GameGlobal.Config.WeaponSkinConfig;
        _super.prototype.Init.call(this);
    };
    return SwordModel;
}(UserTemplate));
__reflect(SwordModel.prototype, "SwordModel");
var SwordModelRedPoint = (function (_super) {
    __extends(SwordModelRedPoint, _super);
    function SwordModelRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_SWORD_EQUIP_UP
        _this.mEquipType = ItemType.SHENGB;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_SWORD_EQUIP_UP, MessageDef.ROLE_SWORD_INIT, MessageDef.ROLE_SWORD_UPDATE_EQUIP]
        // }
    }
    return SwordModelRedPoint;
}(UserTemplateRedPoint));
__reflect(SwordModelRedPoint.prototype, "SwordModelRedPoint");
//# sourceMappingURL=SwordModel.js.map