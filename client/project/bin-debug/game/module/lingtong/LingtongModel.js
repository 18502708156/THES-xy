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
var LingtongModel = (function (_super) {
    __extends(LingtongModel, _super);
    function LingtongModel() {
        var _this = _super.call(this, UserTemplate.TYPE_LINGTONG) || this;
        _this.mMsgDefUpdateExp = MessageDef.ROLE_LINGTONG_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.ROLE_LINGTONG_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.ROLE_LINGTONG_UPDATE;
        _this.mMsgDefInit = MessageDef.ROLE_LINGTONG_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.ROLE_LINGTONG_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_LINGTONG_EQUIP_UP;
        _this.mRedPoint = new LingtongModelRedPoint(_this);
        return _this;
    }
    LingtongModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.BabyBasisConfig;
        this.LvproConfig = GameGlobal.Config.BabyLvproConfig;
        this.AttrsConfig = GameGlobal.Config.BabyAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.BabyProgressConfig;
        this.SkinConfig = GameGlobal.Config.BabySkinConfig;
        _super.prototype.Init.call(this);
    };
    LingtongModel.prototype.GetDescPower = function () {
        var power = _super.prototype.GetDescPower.call(this);
        power += ItemConfig.CalcAttrScoreValue(GameGlobal.LingtongAttrModel.getTianFuAllAttr());
        return power;
    };
    // 装备属性为空
    LingtongModel.prototype.GetCurEquipAttr = function () {
        return [];
    };
    return LingtongModel;
}(UserTemplate));
__reflect(LingtongModel.prototype, "LingtongModel");
var LingtongModelRedPoint = (function (_super) {
    __extends(LingtongModelRedPoint, _super);
    function LingtongModelRedPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LingtongModelRedPoint;
}(UserTemplateRedPoint));
__reflect(LingtongModelRedPoint.prototype, "LingtongModelRedPoint");
//# sourceMappingURL=LingtongModel.js.map