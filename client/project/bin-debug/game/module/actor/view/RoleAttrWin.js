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
var RoleAttrWin = (function (_super) {
    __extends(RoleAttrWin, _super);
    function RoleAttrWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mShowList = [
            AttributeType.atMaxHp,
            AttributeType.atSpeed,
            AttributeType.atAttack,
            AttributeType.atDef,
            AttributeType.atHitRate,
            AttributeType.atEvade,
            AttributeType.atCrit,
            AttributeType.atTough,
            AttributeType.atDefy,
            AttributeType.atDefyReduction,
            AttributeType.atDamageEnhance,
            AttributeType.atDamageReduction,
            AttributeType.atDamageEnhancePerc,
            AttributeType.atDamageReductionPerc,
            AttributeType.atCritEnhance,
            AttributeType.atCritReduction,
            AttributeType.atPVPEnhance,
            AttributeType.atPVPReduction,
            AttributeType.atPVEEnhance,
            AttributeType.atPVEReduction,
        ];
        return _this;
    }
    RoleAttrWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "RoleAttrSkin";
        this._AddClick(this.closeBtn, this.CloseSelf);
    };
    ;
    RoleAttrWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.setRoleAttr();
    };
    ;
    RoleAttrWin.prototype.setRoleAttr = function () {
        var role = GameGlobal.SubRoles.GetRoleData();
        var i = 0;
        for (var j = 0; j < this.mShowList.length; j++) {
            var str = "";
            var type = this.mShowList[j];
            var attName = AttributeData.getAttrStrByType(type);
            var value = role.getAtt(type);
            if (type == AttributeType.atAttack) {
                // let atAtkEx = role.getAtt(AttributeType.atAtkEx)
                // if (atAtkEx > 0) {
                // 	value = Math.floor(value * (10000 + atAtkEx) * 0.0001)
                // }
            }
            if (attName.length < 3) {
                attName = AttributeData.inserteBlank(attName, 4);
            }
            if (type >= AttributeType.atDamageEnhancePerc) {
                str += attName + "：" + (value / 100) + "%";
            }
            else {
                str += attName + "：" + value;
            }
            var label = new eui.Label;
            label.size = 24;
            label.text = str;
            this.attr.addChild(label);
        }
    };
    RoleAttrWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return RoleAttrWin;
}(BaseEuiView));
__reflect(RoleAttrWin.prototype, "RoleAttrWin");
//# sourceMappingURL=RoleAttrWin.js.map