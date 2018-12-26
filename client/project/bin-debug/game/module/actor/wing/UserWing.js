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
var UserWing = (function (_super) {
    __extends(UserWing, _super);
    function UserWing() {
        var _this = _super.call(this, UserTemplate.TYPE_WING) || this;
        _this.mMsgDefUpdateExp = MessageDef.ROLE_WING_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.ROLE_WING_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.ROLE_WING_UPDATE;
        _this.mMsgDefInit = MessageDef.ROLE_WING_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.ROLE_WING_UPDATE_EQUIP;
        _this.mRedPoint = new UserWingRedPoint(_this);
        return _this;
    }
    UserWing.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.WingBaseConfig;
        this.LvproConfig = GameGlobal.Config.WingLvproConfig;
        this.SkillConfig = GameGlobal.Config.WingSkillConfig;
        this.AttrsConfig = GameGlobal.Config.WingAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.WingProgressConfig;
        this.SkinConfig = GameGlobal.Config.WingSkinConfig;
        _super.prototype.Init.call(this);
    };
    return UserWing;
}(UserTemplate));
__reflect(UserWing.prototype, "UserWing");
var UserWingRedPoint = (function (_super) {
    __extends(UserWingRedPoint, _super);
    function UserWingRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_WING_EQUIP_UP
        _this.mEquipType = ItemType.WING;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_WING_EQUIP_UP, MessageDef.ROLE_WING_INIT, MessageDef.ROLE_WING_UPDATE_EQUIP]
        // }
    }
    return UserWingRedPoint;
}(UserTemplateRedPoint));
__reflect(UserWingRedPoint.prototype, "UserWingRedPoint");
//# sourceMappingURL=UserWing.js.map