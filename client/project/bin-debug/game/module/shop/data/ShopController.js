/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/8 14:15
 * @meaning: 商店控制类
 *
 **/
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
//货币类型
var SHOP_MONEY;
(function (SHOP_MONEY) {
    SHOP_MONEY[SHOP_MONEY["yuanbao"] = 2] = "yuanbao";
    SHOP_MONEY[SHOP_MONEY["bangyuan"] = 3] = "bangyuan";
    SHOP_MONEY[SHOP_MONEY["yinbi"] = 1] = "yinbi";
    SHOP_MONEY[SHOP_MONEY["banggong"] = 5] = "banggong";
    SHOP_MONEY[SHOP_MONEY["gongxun"] = 2000031] = "gongxun";
    SHOP_MONEY[SHOP_MONEY["pingfu"] = 2000028] = "pingfu";
    SHOP_MONEY[SHOP_MONEY["huanshou"] = 2000026] = "huanshou";
    SHOP_MONEY[SHOP_MONEY["xianlv"] = 2000027] = "xianlv";
    SHOP_MONEY[SHOP_MONEY["jinzhuang"] = 2000025] = "jinzhuang";
    SHOP_MONEY[SHOP_MONEY["youqing"] = 2000029] = "youqing";
    SHOP_MONEY[SHOP_MONEY["weiwang"] = 2000030] = "weiwang";
    SHOP_MONEY[SHOP_MONEY["treasurePoint"] = 2000043] = "treasurePoint";
})(SHOP_MONEY || (SHOP_MONEY = {}));
;
var ShopController = (function (_super) {
    __extends(ShopController, _super);
    function ShopController() {
        var _this = _super.call(this) || this;
        _this.mEquipCurrencyCount = {};
        _this.tAllShopData = {}; //所有商店数据
        return _this;
    }
    //单例
    ShopController.ins = function () {
        return _super.ins.call(this);
    };
    ShopController.prototype.Init = function () {
        //初始化本地数据        
        this.tShopMappingData = GlobalConfig.ins().DuiYingStore || {};
        this.tShopInitData = GlobalConfig.ins().StoreBaseConfig || {};
        if (this.tShopMappingData && this.tShopInitData) {
            this.initByLocal();
        }
        var ZhuangBeiStore = GameGlobal.Config.ZhuangBeiStore;
        var list = {};
        for (var key in ZhuangBeiStore) {
            var tabnum = ZhuangBeiStore[key].tabnum;
            if (list[tabnum]) {
                continue;
            }
            list[tabnum] = ZhuangBeiStore[key].currency.count;
        }
        this.mEquipCurrencyCount = list;
    };
    ShopController.prototype.getCurTipsNum = function (id) {
        var str = "";
        switch (id) {
            case ShopController.EN_SHOP_DAYAN:
                str = GameGlobal.UserFb.lltModel.layer + "";
                break;
            case ShopController.EN_SHOP_CAILIAO:
                str = GameGlobal.ShopManage.pShopController.getShopLockByType(10) + "";
                break;
            case ShopController.EN_SHOP_JINGJI:
            case ShopController.EN_SHOP_ARENA:
                str = "" + (GameGlobal.ShopManage.pShopController.getShopLockByType(4) || 5000); //竞技场排名
                break;
            case ShopController.EN_SHOP_QUJING:
                str = GameGlobal.ShopManage.pShopController.getShopLockByType(5) + "";
                break;
            case ShopController.EN_SHOP_DATI:
                str = GameGlobal.ShopManage.pShopController.getShopLockByType(6) + "";
                break;
        }
        return str;
    };
    //初始化商店数据
    ShopController.prototype.initByLocal = function () {
        if (!this.tShopMappingData)
            return;
        for (var key in this.tShopMappingData) {
            if (!this.tShopMappingData[key])
                continue;
            var pShopData = this.tShopMappingData[key];
            var pShopData; //单个商店数据
            var nType = this.tShopMappingData[key].type;
            switch (nType) {
                case 1:
                    pShopData = this.initShopDataByType(pShopData, nType);
                    break; //普通商店类型
                case 2:
                    pShopData = this.initShopDataByType(pShopData, nType);
                    break; //装备商店
                case 3:
                    pShopData = this.initShopDataByType(pShopData, nType);
                    break; //黑市
            }
            if (pShopData) {
                this.tAllShopData[pShopData.index] = pShopData;
            }
        }
    };
    //更新服务端数据
    ShopController.prototype.updataByServer = function (_data) {
        if (!_data)
            return;
        // for (let index in this.tAllShopData) {
        //     var ShopData = this.tAllShopData[index];
        for (var key in _data.shopdatas) {
            var data = _data.shopdatas[key];
            var shopData = this.tAllShopData[data.type];
            if (shopData) {
                for (var j in shopData.shop) {
                    var data2 = shopData.shop[j];
                    var itemIndex = data2.index - 1; //!!!后端处理的时候,索引减1了,因此需要减1来处理
                    data2.buyTime = data.datas[itemIndex]; //添加购买次数
                    data2.limittime = data.limittime ? data.limittime[itemIndex] : 0;
                }
            }
        }
        // }
    };
    //商店解锁条件
    ShopController.prototype.shopUnlockData = function (_data) {
        if (!_data)
            return;
        this.tShopLockList = _data.records;
    };
    //根据类型,获得对应玩法的解锁条件
    ShopController.prototype.getShopLockByType = function (_type) {
        var value = 0;
        if (_type) {
            for (var item in this.tShopLockList) {
                var pData = this.tShopLockList[item];
                if (pData.type == _type) {
                    value = pData.value;
                    break;
                }
            }
        }
        return value;
    };
    //更新服务端数据(购买刷新)
    ShopController.prototype.updateByAddShop = function (_data) {
        var shopData = this.tAllShopData[_data.shopType];
        if (shopData) {
            for (var i in shopData.shop) {
                if (shopData.shop[i].index === _data.index) {
                    shopData.shop[i].buyTime = _data.count;
                    GameGlobal.MessageCenter.dispatch(MessageDef.GOLD_CHANGE); //垢面变化
                }
            }
        }
    };
    //_data 商店索引数据 商店类型 _type
    ShopController.prototype.initShopDataByType = function (_data, _type) {
        if (!_data)
            return {};
        if (_data.shop)
            return _data; //已经初始化过了也不再获取本地数据
        var pLocalData = {};
        var pShopData = [];
        pLocalData = this.getShopLocakData(_data.index); //
        for (var i in pLocalData) {
            var pShopNormal;
            switch (_type) {
                case 1:
                    pShopNormal = new ShopNormalData();
                    break;
                case 2:
                    pShopNormal = new ShopEquipData();
                    break;
                case 3:
                    pShopNormal = new ShopBlackData();
                    break;
            }
            if (pShopNormal.initLocalData) {
                pShopNormal.initLocalData(pLocalData[i], _data.index);
                pShopData.push(pShopNormal);
            }
        }
        _data.shop = pShopData; //添加商店数据
        return _data || {};
    };
    ShopController.prototype.getShopLocakData = function (_index) {
        var tShopData = {};
        switch (_index) {
            case ShopController.EN_SHOP_DAYAN:
                tShopData = GlobalConfig.ins().DaYanStore;
                break; //大雁
            case ShopController.EN_SHOP_EQUIP:
                tShopData = GlobalConfig.ins().ZhuangBeiStore;
                break; //装备
            case ShopController.EN_SHOP_BLACK:
                tShopData = GlobalConfig.ins().GangStore;
                break; //帮会
            case ShopController.EN_SHOP_YUANBAO:
                tShopData = GlobalConfig.ins().YuanBaoStore;
                break; //元宝
            case ShopController.EN_SHOP_BANGYUAN:
                tShopData = GlobalConfig.ins().BangYuanStore;
                break; //绑元
            case ShopController.EN_SHOP_CAILIAO:
                tShopData = GlobalConfig.ins().MaterialStore;
                break; //材料
            case ShopController.EN_SHOP_ARENA:
                tShopData = GlobalConfig.ins().ArenaStore;
                break; //竞技场
            case ShopController.EN_SHOP_XIANDU:
                tShopData = GlobalConfig.ins().XianDuStore;
                break; //仙道
            case ShopController.EN_SHOP_WEIWANG:
                tShopData = GlobalConfig.ins().PrestigeShopConfig;
                break; //威望商店
            case ShopController.EN_SHOP_BASHI:
                tShopData = GlobalConfig.ins().DisasterShopConfig;
                break; //八十一难商店
            case ShopController.EN_SHOP_CHONGWU:
                tShopData = GlobalConfig.ins().PetStoreConfig;
                break; //宠物商店
            case ShopController.EN_SHOP_XIANLV:
                tShopData = GlobalConfig.ins().XianlvStoreConfig;
                break; //仙侣商店
            case ShopController.EN_SHOP_BANGPAI:
                tShopData = GlobalConfig.ins().GuildWelfareConfig;
                break; //帮派福利
            case ShopController.EN_SHOP_ZHUANGBAN:
                tShopData = GlobalConfig.ins().DressUpStoreConfig;
                break; //装扮商店
            case ShopController.EN_SHOP_PIFU:
                tShopData = GlobalConfig.ins().SkinStoreConfig;
                break; //皮肤商店
            case ShopController.EN_SHOP_YOUQING:
                tShopData = GlobalConfig.ins().FriendStoreConfig;
                break; //友情商店
            case ShopController.EN_SHOP_JINGJI:
                tShopData = GlobalConfig.ins().ArenaWelfareConfig;
                break; //竞技福利
            case ShopController.EN_SHOP_QUJING:
                tShopData = GlobalConfig.ins().EscortStoreConfig;
                break; //取经商店
            case ShopController.EN_SHOP_DATI:
                tShopData = GlobalConfig.ins().AnswerStoreConfig;
                break; //答题商店
            case ShopController.EN_SHOP_TREASURE_HUNT:
                tShopData = GlobalConfig.ins().XunBaoStoreConfig;
                break; //答题商店
            case ShopController.EN_SHOP_INTEGRAL:
                tShopData = GlobalConfig.ins().ScoreShop;
                break; //神秘商店            
            case ShopController.EN_SHOP_MIJING:
                tShopData = GlobalConfig.ins().MythStoreConfig;
                break;
            case ShopController.EN_SHOP_MIJING_SCORE:
                tShopData = GlobalConfig.ins().MythPointStoreConfig;
                break;
        }
        // this.limitShopItem(tShopData)
        return tShopData;
    };
    //_pData商店数据 ,_returnType 默认1 返回的是是否限制扣买 ,2返回限购条件. 3,不显示提示
    ShopController.prototype.enoughBuy = function (_pData, _returnType) {
        if (_returnType === void 0) { _returnType = 1; }
        var canBuy = true;
        var strLimit = "";
        if (_pData && _pData.unlocktype) {
            var tLimit = _pData.unlocktype;
            var nOne = _pData.unlocktype[0] || 0;
            var nTwo = _pData.unlocktype[1] || 0;
            switch (nOne) {
                case 1://等级
                    if (GameGlobal.actorModel.level < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("等级不足");
                        strLimit = "角色" + nTwo + "级解锁";
                    }
                    break;
                case 2://大雁塔通关层级
                    var lv = 0;
                    if (GameGlobal.UserFb.lltModel && GameGlobal.UserFb.lltModel.layer) {
                        lv = GameGlobal.UserFb.lltModel.layer;
                    }
                    if (lv < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("玲珑宝塔通关层级不足");
                        strLimit = "通关" + nTwo + "关解锁";
                    }
                    break;
                case 3://帮会等级
                    if (GameGlobal.GangModel.getGangLv() < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("帮会等级不足");
                        strLimit = "帮会" + nTwo + "级解锁";
                    }
                    break;
                case 4://竞技场最高历史排名
                    if (GameGlobal.Arena.getMaxRank() > nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("竞技场排名不足");
                        strLimit = "排名" + nTwo + "名解锁";
                    }
                    break;
                case 5://西游护送次数
                    if (this.getShopLockByType(5) < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("取经次数不足");
                        strLimit = "取经" + nTwo + "次解锁";
                    }
                    break;
                case 6://答题次数
                    if (this.getShopLockByType(6) < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("答题次数不足");
                        strLimit = "答题" + nTwo + "次解锁";
                    }
                    break;
                case 7://个人Boss次数
                    if (this.getShopLockByType(7) < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("个人Boss次数不足");
                        strLimit = "个人Boss" + nTwo + "次解锁";
                    }
                    break;
                case 8://全民Boss次数
                    if (this.getShopLockByType(8) < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("全民Boss次数不足");
                        strLimit = "全民Boss" + nTwo + "次解锁";
                    }
                    break;
                case 9://八十一難等級
                    if (GameGlobal.TsumKoBaseModel.info_clear < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("81难副本通关总次数不足");
                        strLimit = "通关" + nTwo + "关解锁";
                    }
                    break;
                case 10://材料副本通关总次数
                    var list = GameGlobal.UserFb.fbModel;
                    var num = 0; //总通关次数
                    if (list) {
                        for (var item in list) {
                            var n = list[item].totalCount || 0;
                            num = num + n;
                        }
                    }
                    if (num < nTwo) {
                        canBuy = false;
                        if (_returnType == 1)
                            UserTips.ins().showTips("材料副本通关总次数不足");
                        strLimit = "通关" + nTwo + "次解锁";
                    }
                    break;
                case 12:
                    if (_pData.limittime && GameServer.serverTime >= _pData.limittime) {
                        if (_returnType == 1)
                            UserTips.ins().showTips("已结束");
                        strLimit = "已结束";
                    }
                    break;
                default:
                    break;
            }
        }
        if (_returnType === 1 || _returnType === 3) {
            return canBuy;
        }
        else {
            return strLimit;
        }
    };
    //获取商店数据by 索引_index
    ShopController.prototype.getShopDataByIndex = function (_index) {
        var tDayanData = this.tAllShopData[_index];
        var bSort = false;
        for (var item in tDayanData.shop) {
            if (tDayanData.shop[item].daycount) {
                bSort = true;
                break;
            }
        }
        if (_index === ShopController.EN_SHOP_EQUIP) {
            bSort = false;
        }
        if (bSort) {
            this.sortLimitTime(tDayanData.shop);
        }
        return tDayanData;
    };
    //对限购进行处理
    ShopController.prototype.sortLimitTime = function (_tList) {
        if (_tList && _tList.length) {
            var getLimit_1 = function (shop) {
                if (shop && shop.daycount && shop.buyTime) {
                    if (shop.buyTime >= shop.daycount) {
                        return shop.index + 10000;
                    }
                }
                return shop.index;
            };
            _tList.sort(function (a, b) {
                return getLimit_1(a) - getLimit_1(b);
            });
        }
        return _tList;
    };
    //获取用于购买物品数量
    ShopController.prototype.getBuyItemNums = function (_id) {
        var nItemNums = 0;
        if (_id < 8) {
            switch (_id) {
                case 1:
                    nItemNums = GameLogic.ins().actorModel.gold;
                    break;
                case 2:
                    nItemNums = GameLogic.ins().actorModel.yb;
                    break;
                case 3:
                    nItemNums = GameLogic.ins().actorModel.byb;
                    break;
                case 5:
                    nItemNums = GameLogic.ins().actorModel.contrib;
                    break; //帮贡
            }
        }
        else {
            //获取背包对应道具
            nItemNums = UserBag.ins().GetCount(_id);
        }
        return nItemNums;
    };
    ShopController.prototype.getMysteryShopData = function () {
        var items = [];
        if (this.mysteryData.datas) {
            for (var _i = 0, _a = this.mysteryData.datas; _i < _a.length; _i++) {
                var val = _a[_i];
                var data = {};
                data["item"] = GameGlobal.Config.MysticalShop[val.id];
                data["buyCount"] = val.buycount;
                data["isBuy"] = val.buycount >= GameGlobal.Config.MysticalShop[val.id].daycount;
                items.push(data);
            }
            var dispose_1 = function (a) {
                if (a.buyCount >= a.item.daycount)
                    return -1;
                else
                    return 1;
            };
            items.sort(function (a, b) {
                return dispose_1(b) - dispose_1(a);
            });
        }
        return items;
    };
    // private tShopDayan;//大雁
    // private tShopEquip;//装备
    // private tShopBang;//帮会
    //商店枚举
    ShopController.EN_SHOP_DAYAN = 0; //大雁商店/玲珑商店
    ShopController.EN_SHOP_EQUIP = 1; //装备商店
    ShopController.EN_SHOP_BLACK = 2; //帮会商店
    ShopController.EN_SHOP_YUANBAO = 3; //元宝商店
    ShopController.EN_SHOP_BANGYUAN = 4; //绑元商店
    ShopController.EN_SHOP_CAILIAO = 5; //材料商店
    ShopController.EN_SHOP_ARENA = 6; //竞技场商店
    ShopController.EN_SHOP_XIANDU = 7; //仙道商店
    ShopController.EN_SHOP_WEIWANG = 8; //威望商店
    ShopController.EN_SHOP_BASHI = 9; //八十一难商店
    ShopController.EN_SHOP_CHONGWU = 10; //宠物商店
    ShopController.EN_SHOP_XIANLV = 11; //仙侣商店
    ShopController.EN_SHOP_BANGPAI = 12; //帮派福利
    ShopController.EN_SHOP_ZHUANGBAN = 13; //装扮商店
    ShopController.EN_SHOP_PIFU = 14; //皮肤商店
    ShopController.EN_SHOP_YOUQING = 15; //友情商店
    ShopController.EN_SHOP_JINGJI = 16; //竞技福利
    ShopController.EN_SHOP_QUJING = 17; //取经商店
    ShopController.EN_SHOP_DATI = 18; //答题商店
    ShopController.EN_SHOP_MYSTERY = 19; //神秘商店
    ShopController.EN_SHOP_INTEGRAL = 20; //积分商店
    ShopController.EN_SHOP_TREASURE_HUNT = 21; //寻宝商店
    ShopController.EN_SHOP_MIJING = 22; // 秘境商店
    ShopController.EN_SHOP_MIJING_SCORE = 23; // 秘境积分商店
    return ShopController;
}(BaseClass));
__reflect(ShopController.prototype, "ShopController");
//# sourceMappingURL=ShopController.js.map