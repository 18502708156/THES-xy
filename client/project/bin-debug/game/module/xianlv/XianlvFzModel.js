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
var XianlvFzModel = (function (_super) {
    __extends(XianlvFzModel, _super);
    function XianlvFzModel() {
        var _this = _super.call(this, UserTemplate.TYPE_XIANLV_FZ) || this;
        _this.mMsgDefUpdateExp = MessageDef.XIANLV_FZ_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.XIANLV_FZ_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.XIANLV_FZ_UPDATE;
        _this.mMsgDefInit = MessageDef.XIANLV_FZ_INIT;
        _this.mMsgDefUpdateEquip = MessageDef.XIANLV_FZ_UPDATE_EQUIP;
        _this.mMsgDefEquipRedPoint = MessageDef.RP_BAG_XIANLV_FZ_EQUIP_UP;
        _this.mRedPoint = new XianlvFzRedPoint(_this);
        return _this;
    }
    XianlvFzModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.CircleBaseConfig;
        this.LvproConfig = GameGlobal.Config.CircleLvproConfig;
        this.SkillConfig = GameGlobal.Config.CircleSkillConfig;
        this.AttrsConfig = GameGlobal.Config.CircleAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.CircleProgressConfig;
        this.SkinConfig = GameGlobal.Config.CircleSkinConfig;
        _super.prototype.Init.call(this);
    };
    XianlvFzModel.prototype.UpdateDress = function () {
        _super.prototype.UpdateDress.call(this);
        GameGlobal.RaidMgr.UpdateRoleXianlvFz(this.mDressId);
    };
    return XianlvFzModel;
}(UserTemplate));
__reflect(XianlvFzModel.prototype, "XianlvFzModel");
var XianlvFzRedPoint = (function (_super) {
    __extends(XianlvFzRedPoint, _super);
    function XianlvFzRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // protected mDispMsg: string = MessageDef.RP_BAG_XIANLV_FZ_EQUIP_UP
        _this.mEquipType = ItemType.XIAN_FZ;
        return _this;
        // public GetMessageDef(): string[] {
        // 	return [MessageDef.BAG_XIANLV_FZ_EQUIP_UP, MessageDef.XIANLV_FZ_INIT, MessageDef.XIANLV_FZ_UPDATE_EQUIP]
        // }
    }
    XianlvFzRedPoint.prototype.IsRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_17, true)) {
            return false;
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    return XianlvFzRedPoint;
}(UserTemplateRedPoint));
__reflect(XianlvFzRedPoint.prototype, "XianlvFzRedPoint");
//# sourceMappingURL=XianlvFzModel.js.map