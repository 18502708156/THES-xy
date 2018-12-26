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
var UserBag = (function (_super) {
    __extends(UserBag, _super);
    function UserBag() {
        var _this = _super.call(this) || this;
        _this.bagNum = 0;
        /** 背包数据 <BR>
         * 0其他装备，1装备，2寻宝相关。参考UserBag枚举定义
         * */
        _this.bagModel = {};
        /** 使用物品的返回
         * 0, -- 使用成功
         * 1, -- 背包满了
         * 3, -- 不能被使用
         * 4, -- 级别不足
         * 5, -- 数量不足够
         */
        _this.promptList = ["", "背包满了", "不能使用", "不能被使用", "级别不足", "数量不足够", "物品已过期", "元宝不足"];
        _this.m_ListenerItems = {};
        _this._useItemFunc = {};
        _this.m_BagItems = [];
        _this.mIsTip = true;
        _this.m_BagItems.push(new SpeEquipItemEvent);
        _this.bagModel[UserBag.BAG_TYPE_OTHTER] = new UserBagData02;
        _this.bagModel[UserBag.BAG_TYPE_EQUIP] = new UserBagData;
        _this.bagModel[UserBag.BAG_TYPE_TREASUREHUNT] = new UserBagData;
        _this.bagModel[UserBag.BAG_TYPE_ASTROLABE] = new UserBagData02;
        _this.regNetMsg(S2cProtocol.sc_bag_init_data, _this.doBagData);
        _this.regNetMsg(S2cProtocol.sc_bag_deal_delete_item, _this.doDeleteItem);
        _this.regNetMsg(S2cProtocol.sc_bag_deal_add_item, _this.doAddItem);
        _this.regNetMsg(S2cProtocol.sc_bag_update_item_data, _this.doUpDataItem);
        _this.regNetMsg(S2cProtocol.sc_bag_deal_valumn_add, _this.doBagValumnAdd);
        _this.regNetMsg(S2cProtocol.sc_bag_user_item_back, _this.doUserItemBack);
        return _this;
    }
    UserBag.ins = function () {
        return _super.ins.call(this);
    };
    UserBag.prototype.Init = function () {
    };
    UserBag.prototype.AddListenerItem = function (itemId, msg) {
        if (!msg || !itemId) {
            return;
        }
        if (this.m_ListenerItems[itemId]) {
            if (true) {
                console.warn("重复 itemId msg => ", itemId, msg);
            }
            var oldmsg = this.m_ListenerItems[itemId];
            if (typeof (oldmsg) == "string") {
                this.m_ListenerItems[itemId] = [oldmsg];
            }
            this.m_ListenerItems[itemId].push(msg);
        }
        else {
            this.m_ListenerItems[itemId] = msg;
        }
    };
    UserBag.prototype.NotifyItem = function (itemId) {
        var msg = this.m_ListenerItems[itemId];
        if (msg) {
            if (typeof (msg) == "string") {
                GameGlobal.MessageCenter.dispatch(msg);
            }
            else {
                for (var _i = 0, msg_1 = msg; _i < msg_1.length; _i++) {
                    var data = msg_1[_i];
                    GameGlobal.MessageCenter.dispatch(data);
                }
            }
            return true;
        }
        for (var _a = 0, _b = this.m_BagItems; _a < _b.length; _a++) {
            var data = _b[_a];
            var msg_2 = data.Handle(itemId);
            if (msg_2) {
                GameGlobal.MessageCenter.dispatch(msg_2);
                return true;
            }
        }
        return false;
    };
    UserBag.prototype.sendAddBagGrid = function (num) {
        var cs_bag_add_grid = new Sproto.cs_bag_add_grid_request();
        cs_bag_add_grid.bagNum = num;
        GameSocket.ins().Rpc(C2sProtocol.cs_bag_add_grid, cs_bag_add_grid);
    };
    ;
    /**
     * 使用道具
     */
    UserBag.prototype.sendUseItem = function (id, count) {
        var cs_bag_use_item = new Sproto.cs_bag_use_item_request();
        cs_bag_use_item.id = id;
        cs_bag_use_item.count = count;
        GameSocket.ins().Rpc(C2sProtocol.cs_bag_use_item, cs_bag_use_item);
        return true;
    };
    ;
    UserBag.prototype.sendUserGoods = function (id, count) {
    };
    ;
    /**
     * 处理背包数据初始化
     */
    UserBag.prototype.doBagData = function (rsp) {
        var code = rsp.code;
        //背包类型 0是其他物品 1是装备
        var type = rsp.type;
        //0是清空数据，其他视为追加数据
        if (code == 0) {
            this.bagModel[type].Clear();
        }
        var len = rsp.datas.length;
        var itemModel;
        for (var i = 0; i < len; i++) {
            itemModel = new ItemData();
            itemModel.parser(rsp.datas[i]);
            this.bagModel[type].Add(itemModel);
            this.NotifyItem(itemModel.configID);
        }
        GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE);
        if (type == UserBag.BAG_TYPE_EQUIP) {
            this.doBagVolChange(true);
        }
        else if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE);
        }
        else if (type == UserBag.BAG_TYPE_OTHTER) {
            // UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
        }
    };
    /**
     * 背包容量提示
     */
    UserBag.prototype.doBagVolChange = function (isFirst) {
        if (isFirst === void 0) { isFirst = false; }
        //道具数量变更
        TimerManager.ins().remove(this.isAutoRonglian, this);
        TimerManager.ins().doTimer(1000, 1, this.isAutoRonglian, this);
        var isTip = this.getBagItemNum() / this.getMaxBagRoom() >= (GlobalConfig.ins().BagBaseConfig.exceed / 100); //|| this.getWingZhuEquip().length >= 10;
        MessageCenter.ins().dispatch(MessageDef.BAG_ITEM_COUNT_CHANGE, isTip);
        isTip = this.getSurplusCount() < this.getMaxBagRoom() * 0.05;
        MessageCenter.ins().dispatch(MessageDef.BAG_WILL_FULL, isTip, isFirst);
    };
    UserBag.prototype.isAutoRonglian = function () {
        var isrong = this.bFullBag();
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_BAG_RONG_LIAN) && isrong) {
            this.ronglian();
        }
    };
    UserBag.prototype.bFullBag = function () {
        return this.getBagItemNum() / this.getMaxBagRoom() * 100 >= GlobalConfig.ins().BagBaseConfig.exceed;
    };
    UserBag.prototype.ronglian = function () {
        var data = this.getOutEquips();
        if (data.length > 0) {
            if (this.mIsTip) {
                this.mIsTip = false;
                UserTips.InfoTip("自动熔炼");
            }
            UserEquip.ins().sendSmeltEquip(data);
            TimerManager.ins().doTimer(1000, 1, this.ronglian, this);
        }
        else {
            this.mIsTip = true;
            TimerManager.ins().remove(this.ronglian, this);
        }
    };
    UserBag.prototype.doUserItemBack = function (rsp) {
        var index = rsp.tipIndex;
        if (index > 0) {
            UserTips.ins().showTips(this.promptList[index]);
        }
        else if (index == 0) {
            GameGlobal.MessageCenter.dispatch(MessageDef.postUseItemSuccess);
        }
    };
    /**
     * 处理添加背包格子数
     */
    UserBag.prototype.doBagValumnAdd = function (rsp) {
        var BagBaseConfig = GlobalConfig.ins().BagBaseConfig;
        this.bagNum = rsp.bagNum * BagBaseConfig.rowSize + BagBaseConfig.baseSize;
        GameGlobal.MessageCenter.dispatch(MessageDef.BAG_VOL_ADD);
    };
    /**
     * 处理删除背包数据
     */
    UserBag.prototype.doDeleteItem = function (rsp) {
        //背包类型 0是其他物品 1是装备
        var type = rsp.type;
        var handle = rsp.handle;
        var isLegend = false;
        var bagList = this.bagModel[type];
        var itemData = this.bagModel[type].Delete(handle);
        if (itemData) {
            this.NotifyItem(itemData.configID);
        }
        if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE);
        }
        else {
            GameGlobal.MessageCenter.dispatch(MessageDef.DELETE_ITEM);
            this.doBagVolChange();
            GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE);
            if (type == UserBag.BAG_TYPE_OTHTER) {
                GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_OTHER_COUNT_CHANGE);
            }
        }
        // UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
    };
    ;
    /**
     * 处理添加背包数据
     */
    UserBag.prototype.doAddItem = function (rsp) {
        //背包类型 0是其他物品 1是装备
        var type = rsp.type;
        var itemModel = new ItemData();
        itemModel.parser(rsp.data);
        this.bagModel[type].Add(itemModel);
        this.NotifyItem(itemModel.configID);
        var showTip = rsp.showTip;
        if (showTip) {
            if (itemModel.itemConfig.quality >= 4 && type == UserBag.BAG_TYPE_EQUIP) {
                UserTips.ins().showGoodEquipTips(itemModel);
            }
            else {
                if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
                    UserBag.ShowItemTips(itemModel.configID, itemModel.count);
                }
            }
        }
        if (type == UserBag.BAG_TYPE_TREASUREHUNT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.BAG_HUNT_STORE_CHANGE);
        }
        else {
            this.doBagVolChange();
            GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE);
        }
        // UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
    };
    UserBag.ShowItemTips = function (itemId, count) {
        var itemConfig = GameGlobal.Config.ItemConfig[itemId];
        if (!itemConfig) {
            return;
        }
        var quality = ItemBase.QUALITY_COLOR[itemConfig.quality];
        var str = "获得|C:" + quality + "&T:" + itemConfig.name + " x " + count + "|";
        var img = ResDataPath.GetItemFullPath(itemConfig.icon);
        UserTips.ins().showContTips(str, img);
    };
    /**
     * 处理物品更新
     */
    UserBag.prototype.doUpDataItem = function (rsp) {
        //背包类型 0是其他物品 1是装备
        var type = rsp.type;
        var handle = rsp.handle;
        var addNum = this.bagModel[type].Update(handle, rsp.num, UserBag.TEMP_DATA);
        var element = UserBag.TEMP_DATA.itemData;
        UserBag.TEMP_DATA.itemData = null;
        if (addNum != null) {
            this.NotifyItem(element.configID);
        }
        var showTip = rsp.showTip;
        if (showTip) {
            if (addNum > 0) {
                if (type != 2) {
                    var quality = ItemBase.QUALITY_COLOR[element.itemConfig.quality];
                    var str = "获得|C:" + quality + "&T:" + element.itemConfig.name + " x " + addNum + "|";
                    var img = ResDataPath.GetItemFullPath(element.itemConfig.icon);
                    UserTips.ins().showContTips(str, img);
                }
            }
        }
        if (type != UserBag.BAG_TYPE_TREASUREHUNT) {
            this.doBagVolChange();
            MessageCenter.ins().dispatch(MessageDef.CHANGE_ITEM);
            GameGlobal.MessageCenter.dispatch(MessageDef.ITEM_COUNT_CHANGE);
        }
        // UserBag._DispatchHasItemCanUse(this.getIsExitUsedItem());
    };
    ;
    /**
     * 发送取出宝物
     */
    UserBag.prototype.sendGetGoodsByStore = function (uuid) {
        //去除单件装备 && 背包空间不足的情况下
        if (uuid != 0 && this.getSurplusCount() < 1) {
            // var strTips = GlobalConfig.ins().ServerTips[2].tips;
            UserTips.ins().showTips("strTips");
            return;
        }
        var cs_bag_get_goods_by_store = new Sproto.cs_bag_get_goods_by_store_request();
        cs_bag_get_goods_by_store.uuid = uuid;
        GameSocket.ins().Rpc(C2sProtocol.cs_bag_get_goods_by_store, cs_bag_get_goods_by_store);
    };
    ///////////////////////////////////////////////////派发消息/////////////////////////////////////////////////////
    /**
     * 注册使用道具的回调方法
     * 用于一些道具特殊处理的情况
     */
    UserBag.prototype.registerUseItemFunc = function (itemID, useFunc) {
        this._useItemFunc[itemID] = useFunc;
    };
    ;
    /*派发删除道具*/
    /**派发是否有可用道具提示*/
    // private static _DispatchHasItemCanUse(hasItemCanUse) {
    // 	MessageCenter.ins().dispatch(MessageDef.BAG_HAS_ITEM_CAN_USE, hasItemCanUse)
    // }
    ///////////////////////////////////////////////////////////////各种查询方法///////////////////////////////////////////////////////////////
    /**
     * 通过id获取背包物品
     * @param type 类型
     * @param id
     */
    UserBag.prototype.getBagItemById = function (id) {
        return this.bagModel[UserBag.BAG_TYPE_OTHTER].GetById(id);
    };
    ;
    /**根据道具类型和id获取道具*/
    UserBag.prototype.getBagGoodsByTypeAndId = function (type, id) {
        return this.bagModel[type].GetById(id);
    };
    ;
    /**
     * 获取背包了某种类型的装备
     * @param type 类型
     */
    UserBag.prototype.getBagEquipByType = function (type, subType) {
        var itemData = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems;
        var itemData1 = [];
        for (var a in itemData) {
            if (itemData[a].itemConfig.type == type) {
                if (subType) {
                    if (itemData[a].itemConfig.subType == subType) {
                        itemData1.push(itemData[a]);
                    }
                }
                else {
                    itemData1.push(itemData[a]);
                }
            }
        }
        return itemData1;
    };
    ;
    /**
     * 获取背包了某种类型的道具
     * @param type 类型
     */
    UserBag.prototype.getBagGoodsByTypeAndSubType = function (type, subType) {
        var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER];
        var itemData1 = [];
        for (var a in itemData) {
            if (itemData[a].itemConfig.type == type) {
                if (itemData[a].itemConfig.subType == subType) {
                    itemData1.push(itemData[a]);
                }
            }
        }
        return itemData1;
    };
    ;
    /**
     * 通过id获取背包物品的数量
     * @param type 类型
     * @param id
     */
    UserBag.prototype.getBagGoodsCountById = function (type, id) {
        var itemData = this.bagModel[type].GetById(id);
        if (itemData) {
            return itemData.count;
        }
        return 0;
    };
    UserBag.prototype.GetCount = function (id) {
        return this.getBagGoodsCountById(UserBag.BAG_TYPE_OTHTER, id);
    };
    UserBag.prototype.getGoodsAllCountByid = function (type, id) {
        var list = this.bagModel[type].GetByIds(id);
        var count = 0;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data = list_1[_i];
            count += data.count;
        }
        return count;
    };
    /**
     * 获取背包道具数量
     * @param type	0是其他物品 1是装备
     */
    UserBag.prototype.getBagItemNum = function (type) {
        if (type === void 0) { type = 1; }
        return this.bagModel[type].GetLength();
    };
    ;
    /**
     * 获取背包剩余空间
     * 只有装备背包才有空间概念
     */
    UserBag.prototype.getSurplusCount = function () {
        return this.getMaxBagRoom() - this.getBagItemNum();
    };
    ;
    /**
     * 获取背包总空间
     */
    UserBag.prototype.getMaxBagRoom = function () {
        var count = 0;
        if (GameGlobal.FuliModel.FuliData.month > 0) {
            count = GameGlobal.Config.WelfareBaseConfig.moncardbag;
        }
        if (GameGlobal.FuliModel.FuliData.foreverFlag) {
            count += GameGlobal.Config.WelfareBaseConfig.forevercardbag;
        }
        // return this.bagNum + GlobalConfig.ins().VipGridConfig[UserVip.ins().lv].grid + Recharge.ins().getAddBagGrid() + count;
        return this.bagNum + GlobalConfig.ins().VipGridConfig[UserVip.ins().lv].grid + count;
    };
    ;
    UserBag.prototype.sort1 = function (a, b) {
        var s1 = ItemConfig.calculateBagItemScore(a);
        var s2 = ItemConfig.calculateBagItemScore(b);
        if (s1 > s2)
            return -1;
        else if (s1 < s2)
            return 1;
        else
            return 0;
    };
    ;
    UserBag.prototype.sort2 = function (a, b) {
        var s1 = ItemConfig.calculateBagItemScore(a);
        var s2 = ItemConfig.calculateBagItemScore(b);
        if (s1 < s2)
            return -1;
        else if (s1 > s2)
            return 1;
        else
            return 0;
    };
    ;
    /**
     * 获取背包排列过的某种品质的装备 默认全部品质 可以多种品质 可以单一品质
     * @param quality  品质
     * @param sole   是否单一品质   0：返回多种  1：返回单一
     * @param sort 0:评分从小到大 1：评分从大到小
     * @param filter 过滤方法
     */
    UserBag.prototype.getBagSortQualityEquips = function (quality, sole, sort, filter) {
        if (quality === void 0) { quality = 5; }
        if (sole === void 0) { sole = 0; }
        if (sort === void 0) { sort = 0; }
        if (filter === void 0) { filter = null; }
        var list = this.bagModel[UserBag.BAG_TYPE_EQUIP];
        var returnList = [];
        for (var key in list.mItems) {
            var itemData = list.mItems[key];
            if (quality != 5 && (itemData.itemConfig.quality > quality || (sole && itemData.itemConfig.quality < quality)))
                continue;
            if (filter != null && !filter(itemData))
                continue;
            returnList[returnList.length] = itemData;
        }
        return returnList;
    };
    ;
    // 删选熔炼的装备
    UserBag.prototype.SmeltEquip = function (dataList) {
        if (!dataList) {
            return;
        }
        var slotList = {};
        for (var _i = 0, dataList_1 = dataList; _i < dataList_1.length; _i++) {
            var data = dataList_1[_i];
            var itemConfig = data.itemConfig;
            if (itemConfig.quality >= 4) {
                continue;
            }
            var tmp = slotList[itemConfig.subType];
            if (!tmp) {
                tmp = slotList[itemConfig.subType] = [];
            }
            tmp.push(data);
        }
        var lv = GameGlobal.actorModel.level;
        var job = GameGlobal.actorModel.job;
        var role = SubRoles.ins().GetRoleData();
        if (!role) {
            return;
        }
        var equipLen = role.getEquipLen();
        var outItemList = [];
        for (var i = 0; i < equipLen; i++) {
            var slotItemList = slotList[i];
            if (!slotItemList) {
                continue;
            }
            var levelList = {};
            var goods = role.getEquipByIndex(i);
            var equipScore = 0;
            if (goods.item.itemConfig) {
                equipScore = goods.item.GetScore();
            }
            for (var _a = 0, slotItemList_1 = slotItemList; _a < slotItemList_1.length; _a++) {
                var item = slotItemList_1[_a];
                var itemConfig = item.itemConfig;
                if (itemConfig.job != 0 && itemConfig.job != job) {
                    outItemList.push(item);
                    continue;
                }
                var itemScore = item.GetScore();
                // 装备评分大
                if (equipScore >= itemScore) {
                    outItemList.push(item);
                }
                else {
                    // 装备评分小
                    var itemLevel = itemConfig.level;
                    if (!levelList[itemLevel]) {
                        // 占位
                        levelList[itemLevel] = item;
                    }
                    else {
                        // 占位评分小
                        if (levelList[itemLevel].GetScore() < itemScore) {
                            // 更换占位物品
                            outItemList.push(levelList[itemLevel]);
                            levelList[itemLevel] = item;
                        }
                        else {
                            outItemList.push(item);
                        }
                    }
                }
            }
        }
        return outItemList;
    };
    // 删选熔炼的装备
    UserBag.prototype.SmeltTemplateEquip = function (templateType, dataList) {
        var roleTempData = GameGlobal.SubRoles.mTemplate[templateType];
        if (!roleTempData || !dataList) {
            return;
        }
        var slotList = {};
        for (var _i = 0, dataList_2 = dataList; _i < dataList_2.length; _i++) {
            var data = dataList_2[_i];
            var tmp = slotList[data.itemConfig.subType];
            if (!tmp) {
                tmp = slotList[data.itemConfig.subType] = [];
            }
            tmp.push(data);
        }
        var lv = roleTempData.mLevel;
        var outItemList = [];
        for (var i = 0; i < UserTemplate.EQUIP_COUNT; i++) {
            var slotItemList = slotList[i];
            if (!slotItemList) {
                continue;
            }
            var levelList = {};
            var goods = roleTempData.mEquip[i];
            var equipScore = 0;
            if (goods.itemConfig) {
                equipScore = goods.GetScore();
            }
            for (var _a = 0, slotItemList_2 = slotItemList; _a < slotItemList_2.length; _a++) {
                var item = slotItemList_2[_a];
                var itemConfig = item.itemConfig;
                var itemScore = item.GetScore();
                // 装备评分大
                if (equipScore >= itemScore) {
                    outItemList.push(item);
                }
                else {
                    // 装备评分小
                    var itemLevel = itemConfig.level;
                    if (!levelList[itemLevel]) {
                        // 占位
                        levelList[itemLevel] = item;
                    }
                    else {
                        // 占位评分小
                        if (levelList[itemLevel].GetScore() < itemScore) {
                            // 更换占位物品
                            outItemList.push(levelList[itemLevel]);
                            levelList[itemLevel] = item;
                        }
                        else {
                            outItemList.push(item);
                        }
                    }
                }
            }
        }
        return outItemList;
    };
    /**
     * 获取背包内用于熔炼的装备（用于熔炼）
     */
    UserBag.prototype.getOutEquips = function () {
        var list = this.getBagSortQualityEquips(5, 0, 1); //取得背包内所有的装备
        var dataList = {};
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var data = list_2[_i];
            if (!data.itemConfig) {
                continue;
            }
            var type = data.itemConfig.type;
            if (!dataList[type]) {
                dataList[type] = [];
            }
            dataList[type].push(data);
        }
        var outList = [];
        var equipList = this.SmeltEquip(dataList[0]);
        if (equipList) {
            outList = outList.concat(equipList);
        }
        for (var key in dataList) {
            var type = Number(key);
            if (!type) {
                continue;
            }
            var templateType = UserTemplate.GetTemplateTypeByItemType(type);
            if (!templateType) {
                continue;
            }
            var equipList_1 = this.SmeltTemplateEquip(templateType, dataList[key]);
            if (equipList_1) {
                outList = outList.concat(equipList_1);
            }
        }
        return outList;
    };
    /**
     * 获取背包物品排序
     */
    UserBag.prototype.getBagGoodsBySort = function () {
        var datas = this.bagModel[UserBag.BAG_TYPE_OTHTER].mItems;
        var list = [];
        for (var key in datas) {
            list.push(datas[key]);
        }
        var goodsList = list.sort(function (n1, n2) {
            if (n1.configID > n2.configID) {
                return 1;
            }
            if (n1.configID < n2.configID) {
                return -1;
            }
            return 0;
        });
        return goodsList;
    };
    ;
    UserBag.SortById = function (lhs, rhs) {
        return lhs.configID - rhs.configID;
    };
    UserBag.prototype.GetBagStarBySort = function () {
        var datas = this.bagModel[UserBag.BAG_TYPE_ASTROLABE].mItems;
        var list = [];
        for (var key in datas) {
            list.push(datas[key]);
        }
        var goodsList = list.sort(UserBag.SortById);
        return goodsList;
    };
    UserBag.prototype.GetBagStarList = function () {
        return this.bagModel[UserBag.BAG_TYPE_ASTROLABE].mItems;
    };
    /**
     * 获取背包了某种类型的物品
     * @param type 类型
     */
    UserBag.prototype.getBagGoodsByType = function (type, subType) {
        var itemData = this.bagModel[UserBag.BAG_TYPE_OTHTER].mItems;
        var itemData1 = [];
        for (var a in itemData) {
            if (subType) {
                if (itemData[a].itemConfig.type == type && itemData[a].itemConfig.subType == subType) {
                    itemData1.push(itemData[a]);
                }
            }
            else {
                if (itemData[a].itemConfig.type == type) {
                    itemData1.push(itemData[a]);
                }
            }
        }
        return itemData1;
    };
    ;
    /**
     * 获取背包某种品质装备的id排序，小到大
     */
    UserBag.prototype.getBagEquipBySort = function (quality) {
        var ret = [];
        var datas = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems;
        var list = [];
        for (var key in datas) {
            list.push(datas[key]);
        }
        var equipsList = list.sort(function (n1, n2) {
            if (n1.configID > n2.configID) {
                return 1;
            }
            if (n1.configID < n2.configID) {
                return -1;
            }
            return 0;
        });
        for (var k in equipsList) {
            if (GlobalConfig.ins().ItemConfig[equipsList[k].configID].quality == quality) {
                ret.push(equipsList[k]);
            }
        }
        return ret;
    };
    ;
    /**
    * 获取背包某种品质装备的id(战力要比装备身上的要少)
    */
    UserBag.prototype.getBagEquipByLevelSort = function (quality) {
        var ret = [];
        var config = GlobalConfig.ins().ItemConfig;
        if (this.bagModel[UserBag.BAG_TYPE_EQUIP]) {
            var equipsList = this.bagModel[UserBag.BAG_TYPE_EQUIP].mItems;
            var itemData = null;
            var itemConfig = null;
            for (var k in equipsList) {
                itemData = equipsList[k];
                itemConfig = config[itemData.configID];
                if (itemConfig.quality == quality && itemConfig.type == 0) {
                    ret.push(itemData);
                    //策划需要把比自己战力大的金装装备 也加入分解列表中 (突然又喜欢加上限制的时候把注释打开就好) by 6.27
                    // let itemPower = ItemConfig.CalculateScore(itemData.configID)
                    // let role = SubRoles.ins().GetRoleData()
                    // let eq = role.getEquipByIndex(itemConfig.subType)
                    // let eqPower  = 0
                    // if(eq)
                    // {
                    // 	eqPower = ItemConfig.CalculateScore(eq.item.configID) 
                    // }
                    // if(itemPower<=eqPower)
                    // {
                    // 	ret.push(itemData);
                    // }
                }
            }
        }
        return ret;
    };
    ;
    /**
     * 通过handle获取背包物品
     * @param type 类型
     * @param handle
     */
    UserBag.prototype.getBagGoodsByHandle = function (type, handle) {
        return this.bagModel[type].GetByHandle(handle);
    };
    ;
    /**
     * 获取是否有可用道具
     */
    UserBag.prototype.getIsExitUsedItem = function () {
        var arr = this.bagModel[UserBag.BAG_TYPE_OTHTER];
        for (var key in arr.mItems) {
            if (arr.mItems[key].getCanbeUsed()) {
                return true;
            }
        }
        return false;
    };
    ;
    UserBag.prototype.getBagGoodsById = function (type, id) {
        return this.bagModel[type].GetById(id);
    };
    //------------------------------------------------特殊道具回调函数------------------------------------------------
    UserBag.prototype.useRenameItem = function (id, count) {
        // ViewManager.ins().open(RenameWin);
    };
    ;
    UserBag.prototype.UseCallBoss = function (id, count) {
    };
    //是否有橙色装备
    UserBag.prototype.HasOrangeEquip = function () {
        var equipList = this.getBagEquipByLevelSort(ITEM_QUALITY.ORANGE_QUALITY);
        return equipList.length > 0;
    };
    /**
 * 换算属性组的战斗力
 */
    UserBag.getAttrPower = function (attr) {
        var powerConfig = GlobalConfig.ins().AttrPowerConfig;
        var allPower = 0;
        for (var i = 0; i < attr.length; i++) {
            var pConfig = powerConfig[attr[i].type];
            if (pConfig) {
                allPower += (attr[i].value == undefined ? 0 : attr[i].value) * pConfig.power;
            }
        }
        return Math.floor(allPower / 100);
    };
    ;
    UserBag.CheckEnough = function (itemId, value) {
        var curNum = UserBag.ins().getBagGoodsCountById(0, itemId);
        if (curNum < value) {
            var config = GameGlobal.Config.ItemConfig[itemId];
            if (config) {
                UserTips.ins().showTips(config.name + "数量不足");
            }
            return false;
        }
        return true;
    };
    UserBag.EMPTY_TABLE = [];
    UserBag.TEMP_DATA = {};
    /**背包物品类型-其他物品*/
    UserBag.BAG_TYPE_OTHTER = 0;
    /**背包物品类型-装备 */
    UserBag.BAG_TYPE_EQUIP = 1;
    /**寻宝相关 */
    UserBag.BAG_TYPE_TREASUREHUNT = 2;
    /** 命格 */
    UserBag.BAG_TYPE_ASTROLABE = 3;
    UserBag.BAG_ENOUGH = 20;
    return UserBag;
}(BaseSystem));
__reflect(UserBag.prototype, "UserBag");
//# sourceMappingURL=UserBag.js.map