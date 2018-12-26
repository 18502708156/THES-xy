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
var HavingHuanModel = (function (_super) {
    __extends(HavingHuanModel, _super);
    function HavingHuanModel() {
        var _this = _super.call(this, UserTemplate.TYPE_HAVING_HUAN) || this;
        _this.mMsgDefUpdateExp = MessageDef.HAVING_HUAN_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.HAVING_HUAN_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.HAVING_HUAN_UPDATE;
        _this.mMsgDefInit = MessageDef.HAVING_HUAN_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.HAVING_HUAN_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_HAVING_HUAN_EQUIP_UP;
        _this.mRedPoint = new HavingHuanRedPoint(_this);
        return _this;
    }
    HavingHuanModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.FlowerBaseConfig;
        this.LvproConfig = GameGlobal.Config.FlowerLvproConfig;
        this.SkillConfig = GameGlobal.Config.FlowerSkillConfig;
        this.AttrsConfig = GameGlobal.Config.FlowerAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.FlowerProgressConfig;
        this.SkinConfig = GameGlobal.Config.FlowerSkinConfig;
        _super.prototype.Init.call(this);
    };
    HavingHuanModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRoleTiannvHua(this.mDressId);
    };
    return HavingHuanModel;
}(UserTemplate));
__reflect(HavingHuanModel.prototype, "HavingHuanModel");
var HavingHuanRedPoint = (function (_super) {
    __extends(HavingHuanRedPoint, _super);
    function HavingHuanRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mEquipType = ItemType.HUA;
        return _this;
    }
    return HavingHuanRedPoint;
}(UserTemplateRedPoint));
__reflect(HavingHuanRedPoint.prototype, "HavingHuanRedPoint");
//# sourceMappingURL=HavingHuanModel.js.map