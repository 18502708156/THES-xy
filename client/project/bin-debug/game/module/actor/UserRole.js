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
var UserRole = (function (_super) {
    __extends(UserRole, _super);
    function UserRole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mSkin = {};
        _this.mTitle = {};
        _this.canChangeEquips = [];
        _this.m_CheckHaveCanTimer = null;
        _this.m_CheckTimer = 0;
        _this.mOrangeCount = {};
        return _this;
    }
    UserRole.prototype.OnChange = function (index) {
        if (index == UserRole.INDEX_EQUIP) {
            MessageCenter.ins().dispatch(MessageDef.ROLE_HINT);
        }
        else {
            MessageCenter.ins().dispatch(MessageDef.RP_ROLE_HINT);
        }
    };
    UserRole.prototype.OnMessage = function (type) {
        var ret = true;
        if (type == MessageDef.BAG_USER_ORANGE_COUNT_UPDATE || type == MessageDef.BAG_USER_EQUIP_COUNT_UPDATE || type == MessageDef.LEVEL_CHANGE || type == MessageDef.CHANGE_EQUIP) {
            this.ClearFlag(UserRole.INDEX_ORANGE);
            ret = false;
        }
        if (type == MessageDef.BAG_USER_SKIN_COUNT_UPDATE || type == MessageDef.ROLE_SKIN_UPDATE) {
            this.ClearFlag(UserRole.INDEX_SKIN);
        }
        else if (type == MessageDef.BAG_USER_TITLE_COUNT_UPDATE || type == MessageDef.ROLE_TITLE_UPDATE) {
            this.ClearFlag(UserRole.INDEX_TITLE);
        }
        else if (type == MessageDef.EXP_CHANGE) {
            this.ClearFlag(UserRole.INDEX_UP_LEVEL);
            // } else if (type == MessageDef.TREASURE_CHANGE) { //法宝
            // 	this.ClearFlag(UserRole.INDEX_TREASURE)
        }
        else if (type == MessageDef.JINGMAI_DATA_UPDATE) {
            this.ClearFlag(UserRole.INDEX_JINGAMI);
        }
        else if (type == MessageDef.ROLE_ELIXIR_UPDATE) {
            this.ClearFlag(UserRole.INDEX_ELIXIR);
        }
        else {
            return _super.prototype.OnMessage.call(this, type);
        }
        return ret;
    };
    UserRole.prototype.GetMessageDef = function () {
        var list = [
            MessageDef.BAG_USER_EQUIP_COUNT_UPDATE, MessageDef.LEVEL_CHANGE, MessageDef.CHANGE_EQUIP,
            MessageDef.BAG_USER_SKIN_COUNT_UPDATE, MessageDef.ROLE_SKIN_UPDATE,
            MessageDef.BAG_USER_TITLE_COUNT_UPDATE, MessageDef.ROLE_TITLE_UPDATE,
            MessageDef.EXP_CHANGE,
            MessageDef.CHANGE_ITEM,
            // MessageDef.TREASURE_CHANGE, //法宝
            MessageDef.JINGMAI_DATA_UPDATE,
            MessageDef.ROLE_ELIXIR_UPDATE,
            MessageDef.BAG_USER_ORANGE_COUNT_UPDATE
        ];
        return list;
    };
    UserRole.prototype.GetCheckFuncList = function () {
        var dict = (_a = {},
            _a[UserRole.INDEX_EQUIP] = this.GetIndexEquip,
            _a[UserRole.INDEX_SKIN] = this.GetIndexSkin,
            _a[UserRole.INDEX_TITLE] = this.GetIndexTitle,
            _a[UserRole.INDEX_UP_LEVEL] = this.GetIndexUpLevel,
            // [UserRole.INDEX_TREASURE]: this.GetIndexTreasure,
            _a[UserRole.INDEX_JINGAMI] = this.GetIndexJingmai,
            _a[UserRole.INDEX_ELIXIR] = this.GetIndexElixir,
            _a[UserRole.INDEX_ORANGE] = this.GetIndexOrange,
            _a);
        return dict;
        var _a;
    };
    UserRole.prototype.GetIndexSkin = function () {
        this.mSkin = {};
        var config = GameGlobal.Config.FashionSkinConfig;
        var sex = GameGlobal.actorModel.sex;
        for (var key in config) {
            var data = config[key][sex];
            if (data) {
                if (!GameGlobal.UserSkin.HasDress(data.skinid)) {
                    if (Checker.Data(data.itemid, false)) {
                        this.mSkin[data.skinid] = true;
                    }
                }
            }
        }
        for (var k in this.mSkin) {
            return true;
        }
        return false;
    };
    UserRole.prototype.GetIndexUpLevel = function () {
        var level = GameGlobal.actorModel.level;
        var exp = GameGlobal.actorModel.exp;
        var config = GameGlobal.Config.ExpConfig[level];
        var canUp = false;
        if (GameGlobal.Config.ExpConfig[level + 1]) {
            canUp = exp >= config.exp;
        }
        return canUp;
    };
    // private GetIndexTreasure(): boolean {
    // 	let canUp =false
    // 	if(Deblocking.Check(DeblockingType.TYPE_31, true))
    // 	{
    // 		canUp = GameGlobal.TreasureController.mRedPoint.IsRedPoint()
    // 	}
    // 	return canUp
    // }
    UserRole.prototype.GetIndexTitle = function () {
        this.mTitle = {};
        var config = GameGlobal.Config.TitleConf;
        for (var key in config) {
            var data = config[key];
            if (!GameGlobal.UserTitle.HasDress(data.skinid)) {
                if (Checker.Data(data.itemid, false)) {
                    this.mTitle[data.skinid] = true;
                }
            }
        }
        for (var k in this.mTitle) {
            return true;
        }
        return false;
    };
    UserRole.prototype.GetIndexEquip = function () {
        this.checkHaveCan();
        for (var j = 0; j < this.canChangeEquips.length; j++) {
            if (this.canChangeEquips[j]) {
                return true;
            }
        }
        return false;
    };
    UserRole.prototype._ContinueCheck = function () {
        this.checkHaveCan();
    };
    // 获取该职业所以可以装备的物品
    UserRole.prototype.GetCanEquipList = function (job) {
        var lv = GameGlobal.actorModel.level;
        //背包装备
        var equipItems = UserBag.ins().getBagEquipByType(0);
        if (!equipItems) {
            return;
        }
        var checkFunc = function (item) {
            if (!item.itemConfig)
                return false;
            if ((item.itemConfig.job != 0 //是通用职业装备
                && item.itemConfig.job != job) //职业不符合的跳过
                || lv < item.itemConfig.level //等级不足的跳过
            )
                return false;
            return true;
        };
        var subEquipItems = {};
        for (var j = 0; j < equipItems.length; j++) {
            var item = equipItems[j];
            if (!checkFunc(item)) {
                continue;
            }
            var itemSubType = item.itemConfig.subType;
            var list = subEquipItems[itemSubType];
            if (!list) {
                list = subEquipItems[itemSubType] = [];
            }
            list.push(item);
        }
        return subEquipItems;
    };
    UserRole.prototype.SendEquip = function () {
        this.checkHaveCan(true);
    };
    /**
     * 检测是否有装备可以穿
     * @param isWear 是否要穿可以穿的装备
     * @param roleIndex 传装备的角色索引
     */
    UserRole.prototype.checkHaveCan = function (isWear) {
        if (isWear === void 0) { isWear = false; }
        if (!isWear && this.m_CheckTimer > egret.getTimer()) {
            // 如果在检查时间内
            if (this.m_CheckHaveCanTimer == null) {
                this.m_CheckHaveCanTimer = egret.setTimeout(this._ContinueCheck, this, 1000);
            }
            return;
        }
        this.m_CheckTimer = egret.getTimer() + 800;
        if (this.m_CheckHaveCanTimer) {
            egret.clearTimeout(this.m_CheckHaveCanTimer);
            this.m_CheckHaveCanTimer = null;
        }
        //记录处理的装备
        var tempEquips = [];
        //角色身上装备
        var role = SubRoles.ins().GetRoleData();
        if (!role)
            return;
        //背包装备
        var subEquipItems = this.GetCanEquipList(role.job);
        var checkFunc2 = function (item) {
            //已经装备的就跳过
            if (tempEquips.indexOf(item) >= 0) {
                return false;
            }
            return true;
        };
        var equipLen = role.getEquipLen();
        //优先处理没有装备的位置
        for (var i = 0; i < equipLen; i++) {
            var equip = role.getEquipByIndex(i);
            //有装备跳过
            if (equip.item.handle != 0) {
                continue;
            }
            var subList = subEquipItems[ForgeConst.EQUIP_POS_TO_SUB[i]];
            if (subList) {
                for (var _i = 0, subList_1 = subList; _i < subList_1.length; _i++) {
                    var item = subList_1[_i];
                    if (!checkFunc2(item)) {
                        continue;
                    }
                    tempEquips[i] = UserEquip.contrastEquip(item, tempEquips[i]);
                }
            }
        }
        //对比有装备的
        for (var i = 0; i < equipLen; i++) {
            var equip = role.getEquipByIndex(i);
            //无装备跳过
            if (equip.item.handle == 0) {
                continue;
            }
            var subList = subEquipItems[equip.item.itemConfig.subType];
            if (subList) {
                for (var _a = 0, subList_2 = subList; _a < subList_2.length; _a++) {
                    var item = subList_2[_a];
                    if (!checkFunc2(item)) {
                        continue;
                    }
                    tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip.item, item);
                }
            }
        }
        for (var i = 0; i < equipLen; i++) {
            var equip = role.getEquipByIndex(i);
            this.canChangeEquips[i] = 0;
            if (tempEquips[i] && equip.item.handle != tempEquips[i].handle) {
                if (isWear) {
                    UserEquip.ins().sendWearEquipment(tempEquips[i].handle, i);
                    this.canChangeEquips[i] = 0;
                }
                else {
                    this.canChangeEquips[i] = tempEquips[i].configID;
                }
            }
        }
        var has = false;
        for (var _b = 0, _c = this.canChangeEquips; _b < _c.length; _b++) {
            var id = _c[_b];
            if (id) {
                has = true;
                break;
            }
        }
        if (!has) {
            this.canChangeEquips.length = 0;
        }
        MessageCenter.ins().dispatch(MessageDef.ROLE_HINT);
    };
    UserRole.prototype.IsRedEquip = function () {
        for (var j = 0; j < this.canChangeEquips.length; j++) {
            if (this.canChangeEquips[j]) {
                return true;
            }
        }
        return false;
    };
    UserRole.prototype.IsRedSkin = function (skinId) {
        return this.mSkin[skinId] ? true : false;
    };
    UserRole.prototype.GetIndexJingmai = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_30, true)) {
            return false;
        }
        var config = GameGlobal.Config.JingMaiLevelConfig;
        var configData = config[0 == GameGlobal.JingMaiData.level ? 1 : GameGlobal.JingMaiData.level];
        if (!configData) {
            return false;
        }
        var item = configData.itemid;
        if (!item) {
            return false;
        }
        return item.count <= GameGlobal.UserBag.GetCount(item.id);
    };
    UserRole.prototype.GetIndexElixir = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_29, true)) {
            return false;
        }
        var config = GameGlobal.UserElixir.getElixirData();
        for (var key in config) {
            var item = config[key].itemid;
            if (item.count <= GameGlobal.UserBag.GetCount(item.id)) {
                return true;
            }
        }
        return false;
    };
    UserRole.prototype.GetIndexOrange = function () {
        this.mOrangeCount = {};
        var count = GameGlobal.UserBag.GetCount(SHOP_MONEY.jinzhuang);
        var role = GameGlobal.SubRoles.GetRoleData();
        if (!role) {
            return;
        }
        var minLevel = 40;
        var actLevel = GameGlobal.actorModel.level;
        if (actLevel < minLevel) {
            return;
        }
        var level = Math.max(Math.floor(actLevel / 20) * 20, minLevel);
        var pos = 0;
        for (var _i = 0, _a = role.equipsData; _i < _a.length; _i++) {
            var data = _a[_i];
            var curLevel = 0;
            // 有橙装
            if (data.item && data.item.itemConfig) {
                var quality = data.item.itemConfig.quality;
                if (quality == 4) {
                    curLevel = data.item.itemConfig.level;
                }
                else if (quality > 4) {
                    curLevel = 99999;
                }
            }
            for (var cLevel = level; cLevel >= minLevel; cLevel -= 20) {
                var itemLevel = pos * 2 + cLevel;
                if (itemLevel > actLevel) {
                    continue;
                }
                if (itemLevel <= curLevel) {
                    continue;
                }
                var needCount = GameGlobal.ShopController.mEquipCurrencyCount[cLevel];
                if (count >= needCount) {
                    this.mOrangeCount[pos] = cLevel;
                    break;
                }
            }
            ++pos;
        }
    };
    UserRole.prototype.IsOrange = function (pos) {
        return this.mOrangeCount[pos] || 0;
    };
    // 装备
    UserRole.INDEX_EQUIP = 0;
    // 时装
    UserRole.INDEX_SKIN = 1;
    // 称号
    UserRole.INDEX_TITLE = 2;
    // 升级
    UserRole.INDEX_UP_LEVEL = 3;
    // //法宝
    // public static readonly INDEX_TREASURE = 4
    //经脉
    UserRole.INDEX_JINGAMI = 5;
    //丹药
    UserRole.INDEX_ELIXIR = 6;
    UserRole.INDEX_ORANGE = 7;
    return UserRole;
}(IRedPoint));
__reflect(UserRole.prototype, "UserRole");
//# sourceMappingURL=UserRole.js.map