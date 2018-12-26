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
var UserRide = (function (_super) {
    __extends(UserRide, _super);
    // public mRideSkills: number[] = []
    function UserRide() {
        var _this = _super.call(this, UserTemplate.TYPE_RIDE) || this;
        _this.mMsgDefUpdateExp = MessageDef.ROLE_RIDE_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.ROLE_RIDE_UPDATE_DRUG;
        _this.mMsgDefInit = MessageDef.ROLE_RIDE_INIT;
        _this.mMsgDefUpdate = MessageDef.ROLE_RIDE_UPDATE;
        _this.mMsgDefUpdateEquip = MessageDef.ROLE_RIDE_UPDATE_EQUIP;
        // public mMsgDefEquipRedPoint = MessageDef.RP_BAG_RIDE_EQUIP_UP
        _this.mMaxLevel = 10;
        _this.mRedPoint = new UserRideRedPoint(_this);
        return _this;
    }
    UserRide.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.RideBaseConfig;
        this.LvproConfig = GameGlobal.Config.RideLvproConfig;
        this.SkillConfig = GameGlobal.Config.RideSkillConfig;
        this.AttrsConfig = GameGlobal.Config.RideAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.RideProgressConfig;
        this.SkinConfig = GameGlobal.Config.RideSkinConfig;
        _super.prototype.Init.call(this);
    };
    return UserRide;
}(UserTemplate));
__reflect(UserRide.prototype, "UserRide");
var UserRideRedPoint = (function (_super) {
    __extends(UserRideRedPoint, _super);
    function UserRideRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_RIDE_EQUIP_UP
        _this.mEquipType = ItemType.RIDE;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.ROLE_RIDE_INIT, MessageDef.ROLE_RIDE_UPDATE_EQUIP]
        // }
    }
    return UserRideRedPoint;
}(UserTemplateRedPoint));
__reflect(UserRideRedPoint.prototype, "UserRideRedPoint");
//# sourceMappingURL=UserRide.js.map