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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/4 11:15
 * @meaning: 法宝控制类
 *
 **/
var TreasureModel = (function (_super) {
    __extends(TreasureModel, _super);
    function TreasureModel() {
        var _this = _super.call(this) || this;
        //
        _this.tUseSpellsData = []; //装备的
        _this.tSpellsListData = []; //持有的
        _this.nNum = 0; //数量,持有上限300
        _this.nPerfectNum = 0; //integer #完美打造次数
        _this.mRedPoint = new TreasureRedPoint;
        _this.regNetMsg(S2cProtocol.sc_spellsRes_info, _this.doSpellsRes);
        return _this;
    }
    TreasureModel.prototype.Init = function () {
        _super.prototype.Init.call(this);
        for (var key in GameGlobal.Config.SpellsResLvproConfig) {
            GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.SpellsResLvproConfig[key][0].cost.id, MessageDef.TREASURE_ITEM_CHANGE);
            break;
        }
        for (var key in GameGlobal.Config.SpellsResMakeConfig) {
            var data = GameGlobal.Config.SpellsResMakeConfig[key];
            for (var _i = 0, _a = data.cost; _i < _a.length; _i++) {
                var costData = _a[_i];
                GameGlobal.UserBag.AddListenerItem(costData.id, MessageDef.TREASURE_ITEM_CHANGE);
            }
        }
    };
    //打造
    // 	makeType		0 : integer #洗练类型,1普通,2完美,普通不用带自动购买
    // autoBuy			1 : integer #0不自动购买道具1使用绑元宝2使用绑元宝和元宝
    TreasureModel.prototype.sendSpellsResMake = function (makeType, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_spellsRes_make_request;
        req.makeType = makeType;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_spellsRes_make, req, function (rsp) {
            var rspData = rsp;
            //处理打造逻辑
            if (rspData.ret) {
                _this.spellsResMake(rspData);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_UPDATE_MAKE);
            }
            else {
                UserTips.ins().showTips("打造失败");
            }
        });
    };
    ;
    //装备
    // pos				0 : integer #位置
    // spellsId		1 : integer #法宝id
    TreasureModel.prototype.sendSpellsResUse = function (pos, spellsId) {
        var _this = this;
        var req = new Sproto.cs_spellsRes_use_request;
        req.pos = pos;
        req.spellsId = spellsId;
        this.Rpc(C2sProtocol.cs_spellsRes_use, req, function (rsp) {
            var rspData = rsp;
            //处理装备逻辑
            if (rspData.ret) {
                _this.spellsResUse(rspData);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
            }
        });
    };
    ;
    //上锁
    // spellsId		1 : integer #法宝id
    // lock			0 : integer #0没锁,上锁
    TreasureModel.prototype.sendSpellsResLock = function (lock, spellsId) {
        var _this = this;
        var req = new Sproto.cs_spellsRes_lock_request;
        req.lock = lock;
        req.spellsId = spellsId;
        this.Rpc(C2sProtocol.cs_spellsRes_lock, req, function (rsp) {
            var rspData = rsp;
            //处理上锁逻辑
            if (rspData.ret) {
                _this.spellsResLock(rspData);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_LOCK);
            }
        });
    };
    ;
    //升级
    // pos				0 : integer #位置
    // autoBuy			1 : integer #
    TreasureModel.prototype.sendSpellsResUpLv = function (pos, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_spellsRes_up_lv_request;
        req.pos = pos;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_spellsRes_up_lv, req, function (rsp) {
            var rspData = rsp;
            //处理升级逻辑
            if (rspData.ret) {
                _this.spellsResUpLv(rspData);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
                MessageCenter.ins().dispatch(MessageDef.TREASURE_UPDATE_LV); //自动购买
            }
        });
    };
    ;
    //分解
    // spellsIdList		0 : *integer #id列表
    TreasureModel.prototype.sendSpellsResSmelt = function (spellsIdList) {
        var _this = this;
        var req = new Sproto.cs_spellsRes_smelt_request;
        req.spellsIdList = spellsIdList;
        this.Rpc(C2sProtocol.cs_spellsRes_smelt, req, function (rsp) {
            var rspData = rsp;
            //处理分解逻辑
            _this.spellsResSmelt(rspData);
            MessageCenter.ins().dispatch(MessageDef.TREASURE_CHANGE);
        });
    };
    ;
    //法宝内容刷新
    TreasureModel.prototype.doSpellsRes = function (rsp) {
        this.updateTreasure(rsp);
        //法宝变化更新
        GameGlobal.MessageCenter.dispatch(MessageDef.TREASURE_CHANGE);
    };
    //获取完美打造次数
    TreasureModel.prototype.getPerFectTime = function () {
        return this.nPerfectNum;
    };
    //获取持有列表
    TreasureModel.prototype.getHaveList = function () {
        var tList;
        tList = this.deepCopy(this.tSpellsListData);
        return tList.reverse();
    };
    //获取装备列表
    TreasureModel.prototype.getUseList = function () {
        return this.tUseSpellsData;
    };
    //实现深拷贝
    TreasureModel.prototype.deepCopy = function (target) {
        if (typeof target !== 'object')
            return;
        //判断目标类型，来创建返回值
        var newObj = target instanceof Array ? [] : {};
        for (var item in target) {
            //只复制元素自身的属性，不复制原型链上的
            if (target.hasOwnProperty(item)) {
                newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item]; //判断属性值类型
            }
        }
        return newObj;
    };
    //更新法宝内容
    TreasureModel.prototype.updateTreasure = function (_data) {
        if (!_data)
            return;
        this.nNum = _data.num || 0;
        this.nPerfectNum = _data.perfectNum || 0;
        //装备的
        if (_data.useSpells) {
            for (var index in _data.useSpells) {
                if (!_data.useSpells[index].spellsNo) {
                    this.tUseSpellsData[index] = {}; //初始化
                }
                else {
                    if (!this.tUseSpellsData[index]) {
                        var pData = new TreasureData();
                        pData.updateByuseSpells(_data.useSpells[index]);
                        this.tUseSpellsData[index] = pData;
                    }
                    else {
                        this.tUseSpellsData[index].updateByuseSpells(_data.useSpells[index]);
                    }
                }
            }
        }
        //拥有的
        if (_data.spellsList) {
            for (var index in _data.spellsList) {
                var bFind = false;
                for (var index2 in this.tSpellsListData) {
                    if (this.tSpellsListData[index2].spellsId === _data.spellsList[index].spellsId) {
                        this.tSpellsListData[index2].spellsList(_data.spellsList[index]); //刷新
                        bFind = true;
                    }
                }
                if (!bFind) {
                    var pData = new TreasureData();
                    pData.spellsList(_data.spellsList[index]);
                    if (pData) {
                        this.tSpellsListData.push(pData); //添加
                    }
                }
            }
        }
    };
    //打造内容
    TreasureModel.prototype.spellsResMake = function (_data) {
        this.nNum = _data.num || 0;
        this.nPerfectNum = _data.perfectNum || 0; //#完美打造次数
        if (_data.spellsId && _data.spellsNo) {
            var pData = new TreasureData();
            pData.spellsList({
                spellsId: _data.spellsId,
                spellsNo: _data.spellsNo,
                lock: 0,
                skillList: _data.skillList,
            });
            if (pData) {
                this.tSpellsListData.push(pData); //无顺序
            }
        }
    };
    //装备
    TreasureModel.prototype.spellsResUse = function (_data) {
        // pos				1 : integer #位置
        // useSpellsNo		2 : integer #使用的法宝编号
        // spellsId		3 : integer #法宝id
        // spellsNo		4 : integer #上面法宝id替换编号，如果这个是0就把这个id的法宝删除
        // lock			5 : integer #上面法宝id替换锁状态
        this.nNum = _data.num || 0;
        //装备后的装备 
        var pUseData = this.tUseSpellsData[_data.pos - 1]; //_data.pos 返回的位置需要减1
        if (pUseData) {
            if (pUseData instanceof TreasureData) {
                var pData = {
                    lv: pUseData.level || 1,
                    spellsNo: _data.useSpellsNo,
                    skillList: _data.useSkillList || []
                };
                pUseData.updateByuseSpells(pData);
            }
            else {
                var pData = new TreasureData();
                var copeData = {
                    lv: 1,
                    spellsNo: _data.useSpellsNo,
                    skillList: _data.useSkillList || []
                };
                pData.updateByuseSpells(copeData);
                this.tUseSpellsData[_data.pos - 1] = pData; //插入
            }
        }
        //对身上的有未装备的法宝
        for (var item = 0; item < this.tSpellsListData.length; item++) {
            var pData = this.tSpellsListData[item];
            if (pData.spellsId === _data.spellsId) {
                if (_data.spellsNo === 0) {
                    this.tSpellsListData.splice(item, 1); //删除之后退出
                    break;
                }
                else {
                    pData.replace(_data); //刷新内容
                }
            }
        }
    };
    //上锁
    TreasureModel.prototype.spellsResLock = function (_data) {
        // spellsId		1 : integer #法宝id
        // lock			2 : integer #0没锁,上锁
        for (var item in this.tSpellsListData) {
            var pData = this.tSpellsListData[item];
            if (pData.spellsId === _data.spellsId) {
                pData.lock = _data.lock;
            }
        }
    };
    //升级
    TreasureModel.prototype.spellsResUpLv = function (_data) {
        // pos				1 : integer #位置
        // lv				2 : integer #等级
        var nPos = _data.pos - 1; // 前后端下标差异
        if (this.tUseSpellsData[nPos]) {
            this.tUseSpellsData[nPos].updateUpuseSpells(_data); //刷新技能等级内容
        }
    };
    //分解
    TreasureModel.prototype.spellsResSmelt = function (_data) {
        for (var i = this.tSpellsListData.length - 1; i >= 0; i--) {
            for (var item in _data.spellsIdList) {
                if (this.tSpellsListData[i] && (this.tSpellsListData[i].spellsId === _data.spellsIdList[item])) {
                    this.tSpellsListData.splice(i, 1); //倒叙删除
                }
            }
        }
    };
    //获取图鉴内容 type 1传说, 2完美 3,其它
    TreasureModel.prototype.getShowConByType = function (type) {
        if (!type)
            return [];
        var tList = [];
        var tTreasure = GlobalConfig.ins().SpellsResListConfig;
        for (var item in tTreasure) {
            var pData = new TreasureData();
            switch (type) {
                case 1:
                    if (tTreasure[item].quality === ITEM_QUALITY.RED_QUALITY) {
                        pData.initData(tTreasure[item].id, 1, []);
                        tList.push(pData);
                    }
                    break;
                case 2:
                    if (tTreasure[item].quality === ITEM_QUALITY.ORANGE_QUALITY) {
                        pData.initData(tTreasure[item].id, 1, []);
                        tList.push(pData);
                    }
                    break;
                case 3:
                    if (tTreasure[item].quality === ITEM_QUALITY.RED_QUALITY) {
                    }
                    else if (tTreasure[item].quality === ITEM_QUALITY.ORANGE_QUALITY) {
                    }
                    else {
                        pData.initData(tTreasure[item].id, 1, []);
                        tList.push(pData);
                    }
                    break;
            }
        }
        return tList;
    };
    TreasureModel.prototype.canEquip = function (type, nPos) {
        for (var item in this.tUseSpellsData) {
            if (nPos != parseInt(item)) {
                if (this.tUseSpellsData[item].type == type) {
                    return false;
                }
            }
        }
        return true;
    };
    return TreasureModel;
}(BaseSystem));
__reflect(TreasureModel.prototype, "TreasureModel");
var TreasureRedPoint = (function (_super) {
    __extends(TreasureRedPoint, _super);
    function TreasureRedPoint() {
        var _this = _super.call(this) || this;
        console.log("--------------------------------");
        return _this;
    }
    TreasureRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[TreasureRedPoint.INDEX_UP_TREASURE] = this.GetIndexUpTreasure,
            _a[TreasureRedPoint.INDEX_MAKE_TREASURE] = this.GetIndexMakeTreasure,
            _a[TreasureRedPoint.INDEX_RESOLVE_TREASURE] = this.GetIndexResolveTreasure,
            _a;
        var _a;
    };
    TreasureRedPoint.prototype.GetMessageDef = function () {
        return [
            MessageDef.TREASURE_CHANGE,
            MessageDef.TREASURE_LOCK,
            MessageDef.TREASURE_ITEM_CHANGE,
        ];
    };
    /**
     * 当前是否有红点状态
     */
    TreasureRedPoint.prototype.IsRedPoint = function () {
        if (!Deblocking.IsDeblocking(DeblockingType.TYPE_31)) {
            return false;
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    TreasureRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_TREASURE);
    };
    TreasureRedPoint.prototype.GetIndexUpTreasure = function () {
        var bHave = false;
        var tList = GameGlobal.TreasureModel.getUseList();
        for (var item in tList) {
            var data = tList[item];
            if (data.level && (data.level < 100)) {
                if (GameGlobal.UserBag.GetCount(data.cost.id) >= data.cost.count) {
                    bHave = true;
                    break;
                }
            }
        }
        return bHave;
    };
    TreasureRedPoint.prototype.GetIndexMakeTreasure = function () {
        var tList = GlobalConfig.ins().SpellsResMakeConfig;
        for (var item in tList) {
            var pConfig = tList[item];
            if (Checker.CheckDatas(pConfig.cost, false, false)) {
                return true;
            }
        }
        return false;
    };
    TreasureRedPoint.prototype.GetIndexResolveTreasure = function () {
        var list = GameGlobal.TreasureModel.getHaveList();
        return list.length;
    };
    TreasureRedPoint.INDEX_UP_TREASURE = 0;
    TreasureRedPoint.INDEX_MAKE_TREASURE = 1;
    TreasureRedPoint.INDEX_RESOLVE_TREASURE = 2;
    return TreasureRedPoint;
}(IRedPoint));
__reflect(TreasureRedPoint.prototype, "TreasureRedPoint");
//# sourceMappingURL=TreasureModel.js.map