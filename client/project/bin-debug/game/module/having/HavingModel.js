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
var HavingModel = (function (_super) {
    __extends(HavingModel, _super);
    function HavingModel() {
        var _this = _super.call(this, UserTemplate.TYPE_HAVING_HAVING) || this;
        _this.mMsgDefUpdateExp = MessageDef.HAVING_UPDATE_EXP;
        _this.mMsgDefUpdateDrug = MessageDef.HAVING_UPDATE_DRUG;
        _this.mMsgDefUpdate = MessageDef.HAVING_UPDATE;
        _this.mMsgDefInit = MessageDef.HAVING_INIT;
        _this.mRedPoint = new HavingModelRedPoint(_this);
        return _this;
    }
    HavingModel.prototype.IsDeblocking = function () {
        return Deblocking.Check(DeblockingType.TYPE_19, true);
    };
    HavingModel.prototype.Init = function () {
        this.BaseConfig = GameGlobal.Config.FemaleDevaBaseConfig;
        this.LvproConfig = GameGlobal.Config.FemaleDevaLvproConfig;
        // this.SkillConfig = GameGlobal.Config.FemaleDevaSkillAttrsConfig 没有通用技能
        this.AttrsConfig = GameGlobal.Config.FemaleDevaAttrsConfig;
        this.ProgressConfig = GameGlobal.Config.FemaleDevaProgressConfig;
        this.SkinConfig = GameGlobal.Config.FemaleDevaSkinConfig;
        for (var _i = 0, _a = GameGlobal.Config.FemaleDevaBaseConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            GameGlobal.UserBag.AddListenerItem(data.itemId, MessageDef.HAVING_SKILL_ITEM_UPDATE);
        }
        _super.prototype.Init.call(this);
    };
    // public GetTotalAttr() {
    // 	let list = []
    // 	let attr = this.GetCurAttr()	
    // 	list = AttributeData.AttrAddition(list, attr)
    // 	let magicList = []
    // 	let data = GameGlobal.HavingMagicModel.skillData && GameGlobal.HavingMagicModel.skillData[0]
    // 	if (data) {
    // 		for (let item of data.attrData) {
    // 			if (item.type == 1) {
    // 				let attrdata = GameGlobal.HavingMagicModel.getAttrsConfigById(item.attrs);
    // 				if (attrdata && attrdata.attrs) {
    // 					magicList.push(attrdata.attrs)
    // 				}
    // 			}
    // 		}
    // 	}
    // 	list = AttributeData.AttrAddition(list, magicList)
    // 	list = AttributeData.AttrAddition(list, GameGlobal.HavingHuanModel.GetCurAttr())
    // 	list = AttributeData.AttrAddition(list, GameGlobal.HavingLingqModel.GetCurAttr())
    // 	return list
    // }
    HavingModel.prototype.OnActive = function () {
        GameGlobal.RaidMgr.UpdateRoleTiannv();
    };
    //获取玄女消耗配置表
    HavingModel.prototype.getLevelConfig = function (level) {
        return GameGlobal.Config.FemaleDevaLvproConfig[level];
    };
    //获取玄女基本配置表
    HavingModel.prototype.getBaseConfig = function () {
        return GameGlobal.Config.FemaleDevaBaseConfig;
    };
    HavingModel.prototype.GetSkillIds = function () {
        var skillIds = [];
        var baseConfig = GameGlobal.Config.FemaleDevaBaseConfig;
        skillIds.push(baseConfig.skill);
        for (var i = 0; i < GameGlobal.HavingMagicModel.skillData.length; i++) {
            var data = GameGlobal.HavingMagicModel.skillData[i];
            if (data && data.attrData && data.attrData.length == 4) {
                skillIds[i + 1] = data.attrData[3].skillNo;
            }
        }
        return skillIds;
    };
    return HavingModel;
}(UserTemplate));
__reflect(HavingModel.prototype, "HavingModel");
var HavingModelRedPoint = (function (_super) {
    __extends(HavingModelRedPoint, _super);
    function HavingModelRedPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 玄女没有装备
        _this.mEquipType = null;
        return _this;
    }
    HavingModelRedPoint.prototype.GetMessageDef = function () {
        var list = _super.prototype.GetMessageDef.call(this);
        list.push(MessageDef.HAVING_SKILL_ITEM_UPDATE);
        return list;
    };
    HavingModelRedPoint.prototype.GetCheckFuncList = function () {
        var dict = _super.prototype.GetCheckFuncList.call(this);
        dict[HavingModelRedPoint.INDEX_SKILL_ITEM] = this.GetIndexSkillItem;
        return dict;
    };
    HavingModelRedPoint.prototype.OnMessage = function (type) {
        if (type == MessageDef.HAVING_SKILL_ITEM_UPDATE) {
            this.ClearFlag(HavingModelRedPoint.INDEX_SKILL_ITEM);
        }
        else {
            return _super.prototype.OnMessage.call(this, type);
        }
        return true;
    };
    HavingModelRedPoint.prototype.GetIndexSkillItem = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_20)) {
            return false;
        }
        for (var _i = 0, _a = GameGlobal.Config.FemaleDevaBaseConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
                return true;
            }
        }
        return false;
    };
    HavingModelRedPoint.INDEX_SKILL_ITEM = 20;
    return HavingModelRedPoint;
}(UserTemplateRedPoint));
__reflect(HavingModelRedPoint.prototype, "HavingModelRedPoint");
//# sourceMappingURL=HavingModel.js.map