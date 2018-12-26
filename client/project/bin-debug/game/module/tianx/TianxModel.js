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
var TianxModel = (function (_super) {
    __extends(TianxModel, _super);
    function TianxModel() {
        var _this = _super.call(this, UserTemplate.TYPE_TIANX) || this;
        _this.mMsgDefUpdateExp = MessageDef.ROLE_TIANX_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.ROLE_TIANX_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.ROLE_TIANX_UPDATE;
        _this.mMsgDefInit = MessageDef.ROLE_TIANX_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.ROLE_TIANX_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_TIANX_EQUIP_UP;
        _this.mRedPoint = new TianxModelRedPoint(_this);
        return _this;
    }
    TianxModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.FairyBaseConfig;
        this.LvproConfig = GameGlobal.Config.FairyLvproConfig;
        this.SkillConfig = GameGlobal.Config.FairySkillConfig;
        this.AttrsConfig = GameGlobal.Config.FairyAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.FairyProgressConfig;
        this.SkinConfig = GameGlobal.Config.FairySkinConfig;
        _super.prototype.Init.call(this);
    };
    return TianxModel;
}(UserTemplate));
__reflect(TianxModel.prototype, "TianxModel");
var TianxModelRedPoint = (function (_super) {
    __extends(TianxModelRedPoint, _super);
    function TianxModelRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_TIANX_EQUIP_UP
        _this.mEquipType = ItemType.TIANXIAN;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_TIANX_EQUIP_UP, MessageDef.ROLE_TIANX_INIT, MessageDef.ROLE_TIANX_UPDATE_EQUIP]
        // }
    }
    return TianxModelRedPoint;
}(UserTemplateRedPoint));
__reflect(TianxModelRedPoint.prototype, "TianxModelRedPoint");
//# sourceMappingURL=TianxModel.js.map