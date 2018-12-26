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
var SubRoles = (function (_super) {
    __extends(SubRoles, _super);
    function SubRoles() {
        var _this = _super.call(this) || this;
        _this.mTemplate = {};
        _this.regNetMsg(S2cProtocol.sub_roles, _this.doSubRole);
        _this.regNetMsg(S2cProtocol.sc_template_init_data, _this._DoInitData);
        _this.regNetMsg(S2cProtocol.sc_template_update_data, _this._DoUpdateData);
        return _this;
    }
    SubRoles.GetDefaultSex = function (job) {
        if (job == 3) {
            return 1;
        }
        return 0;
    };
    SubRoles.ins = function () {
        return _super.ins.call(this);
    };
    SubRoles.prototype.Init = function () {
        var config = GameGlobal.Config.FashionSkinConfig;
        for (var k in config) {
            var data = config[k][0];
            GameGlobal.UserBag.AddListenerItem(data.itemid.id, MessageDef.BAG_USER_SKIN_COUNT_UPDATE);
        }
        config = GameGlobal.Config.TitleConf;
        for (var k in config) {
            GameGlobal.UserBag.AddListenerItem(config[k].itemid ? config[k].itemid.id : 0, MessageDef.BAG_USER_TITLE_COUNT_UPDATE);
        }
        GameGlobal.UserBag.AddListenerItem(SHOP_MONEY.jinzhuang, MessageDef.BAG_USER_ORANGE_COUNT_UPDATE);
    };
    SubRoles.prototype.GetRoleData = function () {
        return this.rolesModel;
    };
    SubRoles.prototype._DoInitData = function (rsp) {
        var data = this.mTemplate[rsp.templateType];
        if (data) {
            data._DoInitData(rsp);
        }
        else {
            console.error("not impl type => " + rsp.templateType);
        }
    };
    SubRoles.prototype._DoUpdateData = function (rsp) {
        var data = this.mTemplate[rsp.templateType];
        if (data) {
            data._DoUpdateData(rsp);
        }
        else {
            console.error("not impl type => " + rsp.templateType);
        }
    };
    /**
     * 子角色列表
     */
    SubRoles.prototype.doSubRole = function (data) {
        if (!this.rolesModel) {
            this.rolesModel = new Role;
        }
        this.rolesModel.parser(data.roleList);
        this.rolesModel.job = GameGlobal.actorModel.job;
        this.rolesModel.sex = GameGlobal.actorModel.sex;
        this.rolesModel.entityName = GameGlobal.actorModel.name;
        this.UpdatePower();
        GameGlobal.MessageCenter.dispatch(MessageDef.SUB_ROLE_CHANGE);
        SubRoles.ROLE_INIT = true;
    };
    ;
    /**
     * 处理属性变化
     */
    SubRoles.prototype.doSubRoleAtt = function (rsp) {
        var roleID = rsp.roleID;
        var model = this.rolesModel;
        model.parserAtt(rsp.attributeData);
        model.power = rsp.power;
        this.UpdatePower();
        GameLogic.ins().actorModel.SetPower(model.power, false);
    };
    ;
    SubRoles.prototype.UpdatePower = function (notTip) {
        if (notTip === void 0) { notTip = false; }
        // let power = 0
        // var len = this.rolesModel.length;
        // for (var i = 0; i < len; i++) {
        // 	power += this.getSubRoleByIndex(i).power;
        // }
        // power += HeroModel.ins().mPower
        // power += GameGlobal.PetModel.mPower;
        // GameLogic.ins().actorModel.SetPower(power, notTip)
    };
    SubRoles.MAX_COUNT = 1;
    SubRoles.ROLE_INIT = false;
    return SubRoles;
}(BaseSystem));
__reflect(SubRoles.prototype, "SubRoles");
//# sourceMappingURL=SubRoles.js.map