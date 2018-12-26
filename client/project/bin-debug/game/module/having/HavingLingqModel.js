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
var HavingLingqModel = (function (_super) {
    __extends(HavingLingqModel, _super);
    function HavingLingqModel() {
        var _this = _super.call(this, UserTemplate.TYPE_HAVING_LINGQ) || this;
        _this.mMsgDefUpdateExp = MessageDef.HAVING_LINGQ_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.HAVING_LINGQ_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.HAVING_LINGQ_UPDATE;
        _this.mMsgDefInit = MessageDef.HAVING_LINGQ_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.HAVING_LINGQ_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_HAVING_LINGQ_EQUIP_UP;
        _this.mRedPoint = new HavingLingqRedPoint(_this);
        return _this;
    }
    HavingLingqModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.NimbusBaseConfig;
        this.LvproConfig = GameGlobal.Config.NimbusLvproConfig;
        this.SkillConfig = GameGlobal.Config.NimbusSkillConfig;
        this.AttrsConfig = GameGlobal.Config.NimbusAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.NimbusProgressConfig;
        this.SkinConfig = GameGlobal.Config.NimbusSkinConfig;
        _super.prototype.Init.call(this);
    };
    HavingLingqModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRoleTiannvLq(this.mDressId);
    };
    return HavingLingqModel;
}(UserTemplate));
__reflect(HavingLingqModel.prototype, "HavingLingqModel");
var HavingLingqRedPoint = (function (_super) {
    __extends(HavingLingqRedPoint, _super);
    function HavingLingqRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mEquipType = ItemType.LINGQI;
        return _this;
    }
    return HavingLingqRedPoint;
}(UserTemplateRedPoint));
__reflect(HavingLingqRedPoint.prototype, "HavingLingqRedPoint");
//# sourceMappingURL=HavingLingqModel.js.map