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
var ForgeModel = (function (_super) {
    __extends(ForgeModel, _super);
    function ForgeModel() {
        var _this = _super.call(this) || this;
        _this.TYPE_TO_NAME = (_a = {},
            _a[ForgeType.BOOST] = "强化",
            _a[ForgeType.REFINE] = "精炼",
            _a[ForgeType.EXERCISE] = "锻炼",
            _a[ForgeType.GEM] = "镶嵌",
            _a);
        _this.mRedPoint = new ForgeModelRedPoint;
        _this.regNetMsg(S2cProtocol.sc_equip_forge, _this.doForgeUpdata);
        return _this;
        var _a;
    }
    ForgeModel.prototype.Init = function () {
        _super.prototype.Init.call(this);
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.RefineCostConfig[1].cost.id, MessageDef.FORGE_ITEM_01_UPDATE);
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.AnnealCostConfig[1].cost.id, MessageDef.FORGE_ITEM_02_UPDATE);
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.GemCostConfig[1].cost.id, MessageDef.FORGE_ITEM_03_UPDATE);
    };
    ForgeModel.prototype.doForgeUpdata = function (rsp) {
        SubRoles.ins().GetRoleData().parseForgeChange(rsp, rsp.forgeType);
        GameGlobal.MessageCenter.dispatch(MessageDef.FORGE_UPDATE, rsp.forgeType);
    };
    ForgeModel.prototype.SendUpGrade = function (type) {
        var rsp = new Sproto.cs_equip_forge_request();
        rsp.forgeType = type;
        GameSocket.ins().Rpc(C2sProtocol.cs_equip_forge, rsp);
    };
    /**
     * 通过部位等级 获取锻造相关配置  0 强化配置 1 宝石配置 2注灵配置 3 突破配置
     * @param pos 部位
     * @param lv  等级
     * @param configType 配置类型
     */
    ForgeModel.prototype.GetForgeConfigByPos = function (pos, lv, configType) {
        var list = this.GetConfig(configType);
        var config;
        for (var key in list) {
            config = list[key];
            if (config.posId == pos) {
                if (config.level == lv)
                    return config;
            }
        }
        return null;
    };
    ForgeModel.prototype.GetConfig = function (configType) {
        var list;
        switch (configType) {
            case ForgeType.BOOST:
                list = GlobalConfig.ins().EnhanceAttrConfig;
                break;
            case ForgeType.REFINE:
                list = GlobalConfig.ins().RefineAttrConfig;
                break;
            case ForgeType.EXERCISE:
                list = GlobalConfig.ins().AnnealAttrConfig;
                break;
            case ForgeType.GEM:
                list = GlobalConfig.ins().GemAttrConfig;
                break;
        }
        return list;
    };
    ForgeModel.prototype.GetCostConfig = function (configType) {
        var list;
        switch (configType) {
            case ForgeType.BOOST:
                list = GlobalConfig.ins().EnhanceCostConfig;
                break;
            case ForgeType.REFINE:
                list = GlobalConfig.ins().RefineCostConfig;
                break;
            case ForgeType.EXERCISE:
                list = GlobalConfig.ins().AnnealCostConfig;
                break;
            case ForgeType.GEM:
                list = GlobalConfig.ins().GemCostConfig;
                break;
        }
        return list;
    };
    ForgeModel.prototype.GetMasterConfig = function (configType) {
        var list;
        switch (configType) {
            case ForgeType.BOOST:
                list = GlobalConfig.ins().EnhanceSuitConfig;
                break;
            case ForgeType.REFINE:
                list = GlobalConfig.ins().RefineSuitConfig;
                break;
            case ForgeType.EXERCISE:
                list = GlobalConfig.ins().AnnealSuitConfig;
                break;
            case ForgeType.GEM:
                list = GlobalConfig.ins().GemSuitConfig;
                break;
        }
        return list;
    };
    ForgeModel.prototype.GetConfigCostData = function (configType, level) {
        var list = this.GetCostConfig(configType);
        var index;
        for (index in list) {
            var config = list[index];
            if (config.level == level)
                return config;
        }
        return null;
    };
    ForgeModel.prototype.GetForgeMasterLevel = function (forgeType) {
        var config = GameGlobal.ForgeModel.GetMasterConfig(forgeType);
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return null;
        }
        var _a = role.GetMinEquipIndexAndLevel(forgeType), index = _a[0], min = _a[1];
        var curKey;
        for (var k in config) {
            if (min >= config[k].level) {
                curKey = k;
            }
        }
        var configData;
        if (curKey) {
            return config[curKey];
        }
        return null;
    };
    return ForgeModel;
}(BaseSystem));
__reflect(ForgeModel.prototype, "ForgeModel");
var ForgeModelRedPoint = (function (_super) {
    __extends(ForgeModelRedPoint, _super);
    function ForgeModelRedPoint() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForgeModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[ForgeModelRedPoint.INDEX_BOOST] = this.GetIndexBoost,
            _a[ForgeModelRedPoint.INDEX_REFINE] = this.GetIndexRefine,
            _a[ForgeModelRedPoint.INDEX_EXERCISE] = this.GetIndexExercise,
            _a[ForgeModelRedPoint.INDEX_GEM] = this.GetIndexGem,
            _a;
        var _a;
    };
    /**
     * 事件定义，根据事件类型更新状态
     */
    ForgeModelRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.FORGE_UPDATE,
            MessageDef.GOLD_CHANGE,
            MessageDef.FORGE_ITEM_01_UPDATE,
            MessageDef.FORGE_ITEM_02_UPDATE,
            MessageDef.FORGE_ITEM_03_UPDATE,
        ];
    };
    ForgeModelRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_FORGE);
    };
    ForgeModelRedPoint.prototype.OnMessage = function (type) {
        if (type == MessageDef.GOLD_CHANGE) {
            this.ClearFlag(ForgeModelRedPoint.INDEX_BOOST);
        }
        else if (type == MessageDef.FORGE_ITEM_01_UPDATE) {
            this.ClearFlag(ForgeModelRedPoint.INDEX_REFINE);
        }
        else if (type == MessageDef.FORGE_ITEM_02_UPDATE) {
            this.ClearFlag(ForgeModelRedPoint.INDEX_EXERCISE);
        }
        else if (type == MessageDef.FORGE_ITEM_03_UPDATE) {
            this.ClearFlag(ForgeModelRedPoint.INDEX_GEM);
        }
        else {
            return _super.prototype.OnMessage.call(this, type);
        }
        return true;
    };
    ForgeModelRedPoint.prototype.GetCost = function (forgetType) {
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return null;
        }
        var _a = role.GetMinEquipIndexAndLevel(forgetType), index = _a[0], lv = _a[1];
        var costConfig = GameGlobal.ForgeModel.GetConfigCostData(forgetType, lv + 1);
        var cost = null;
        if (costConfig) {
            cost = costConfig.cost;
        }
        if (cost) {
            return Checker.Data(cost, false);
        }
        return null;
    };
    ForgeModelRedPoint.prototype.GetIndexBoost = function () {
        return this.GetCost(ForgeType.BOOST);
    };
    ForgeModelRedPoint.prototype.GetIndexRefine = function () {
        return this.GetCost(ForgeType.REFINE);
    };
    ForgeModelRedPoint.prototype.GetIndexExercise = function () {
        return this.GetCost(ForgeType.EXERCISE);
    };
    ForgeModelRedPoint.prototype.GetIndexGem = function () {
        return this.GetCost(ForgeType.GEM);
    };
    ForgeModelRedPoint.INDEX_BOOST = 0;
    ForgeModelRedPoint.INDEX_REFINE = 1;
    ForgeModelRedPoint.INDEX_EXERCISE = 2;
    ForgeModelRedPoint.INDEX_GEM = 3;
    return ForgeModelRedPoint;
}(IRedPoint));
__reflect(ForgeModelRedPoint.prototype, "ForgeModelRedPoint");
//# sourceMappingURL=ForgeModel.js.map