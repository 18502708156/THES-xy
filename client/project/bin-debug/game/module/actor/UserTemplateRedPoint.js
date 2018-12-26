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
var UserTemplateRedPoint = (function (_super) {
    __extends(UserTemplateRedPoint, _super);
    function UserTemplateRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.mEquip = [];
        _this.mSkill = [];
        _this.mSkin = {};
        _this.mModel = model;
        return _this;
    }
    UserTemplateRedPoint.prototype.IsRedPoint = function () {
        if (this.mModel.BaseConfig && this.mModel.BaseConfig.open) {
            if (!Deblocking.IsDeblocking(this.mModel.BaseConfig.open)) {
                return false;
            }
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    UserTemplateRedPoint.prototype.OnChange = function (index) {
        if (index == UserTemplateRedPoint.INDEX_EQUIP) {
            GameGlobal.MessageCenter.dispatch(this.mModel.GetItemEquipRpUpdateMsg());
        }
        else {
            GameGlobal.MessageCenter.dispatch(this.mModel.GetItemRpUpdateMsg());
        }
    };
    UserTemplateRedPoint.prototype.CanCheck = function () {
        return this.mModel.mLevel ? true : false;
    };
    UserTemplateRedPoint.prototype.Get = function (index) {
        if (!this.CanCheck()) {
            return false;
        }
        return _super.prototype.Get.call(this, index);
    };
    UserTemplateRedPoint.prototype.OnMessage = function (type) {
        if (!this.CanCheck()) {
            return false;
        }
        var bool = false;
        if (type == this.mModel.GetItemEquipUpdateMsg() || type == this.mModel.GetRankUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_EQUIP);
            bool = true;
        }
        if (type == this.mModel.GetItemSkillUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_SKILL);
            bool = true;
        }
        if (type == this.mModel.GetItemSkinUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_SKIN);
            bool = true;
        }
        if (type == this.mModel.GetItemAttrItemUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_ATTR_ITEM);
            bool = true;
        }
        if (type == this.mModel.GetRankRewardUpdateMsg() || type == this.mModel.GetRankUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_REWARD);
            bool = true;
        }
        if (type == this.mModel.GetItemRankItemUpdateMsg()) {
            this.ClearFlag(UserTemplateRedPoint.INDEX_RANK);
            bool = true;
        }
        if (!bool) {
            _super.prototype.OnMessage.call(this, type);
        }
        return true;
    };
    UserTemplateRedPoint.prototype.GetMessageDef = function () {
        var list = [
            this.mModel.GetItemEquipUpdateMsg(),
            this.mModel.GetItemSkillUpdateMsg(),
            this.mModel.GetItemSkinUpdateMsg(),
            this.mModel.GetItemAttrItemUpdateMsg(),
            this.mModel.GetItemRankItemUpdateMsg(),
            this.mModel.GetRankRewardUpdateMsg(),
            this.mModel.GetRankUpdateMsg(),
            this.mModel.GetUpLevelItemUpdateMsg(),
            this.mModel.mMsgDefInit,
            this.mModel.mMsgDefUpdateEquip,
        ];
        return list;
    };
    UserTemplateRedPoint.prototype.GetCheckFuncList = function () {
        var dict = (_a = {},
            _a[UserTemplateRedPoint.INDEX_EQUIP] = this.GetIndexEquip,
            _a[UserTemplateRedPoint.INDEX_RANK] = this.GetIndexRank,
            _a[UserTemplateRedPoint.INDEX_SKILL] = this.GetIndexSkill,
            _a[UserTemplateRedPoint.INDEX_REWARD] = this.GetIndexReward,
            _a[UserTemplateRedPoint.INDEX_SKIN] = this.GetIndexSkin,
            _a[UserTemplateRedPoint.INDEX_ATTR_ITEM] = this.GetIndexAttrItem,
            _a[UserTemplateRedPoint.INDEX_UP_LEVEL_ITEM] = this.GetIndexUpLevelItem,
            _a);
        return dict;
        var _a;
    };
    // UserTemplateRedPoint.INDEX_EQUIP
    UserTemplateRedPoint.prototype.GetIndexEquip = function () {
        this.DoUpdateEquip();
        for (var _i = 0, _a = this.mEquip; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data) {
                return true;
            }
        }
        return false;
    };
    // UserTemplateRedPoint.INDEX_RANK
    UserTemplateRedPoint.prototype.GetIndexRank = function () {
        if (this.mModel.mLevel < this.mModel.mMaxLevel && this.mModel.LvproConfig) {
            var config = this.mModel.LvproConfig[this.mModel.mLevel];
            if (config) {
                // let upnum = Math.floor(config.proexp / config.exp)
                // upnum = upnum - this.mModel.mUpNum
                var upnum = 1;
                var enough = true;
                for (var _i = 0, _a = config.cost; _i < _a.length; _i++) {
                    var data = _a[_i];
                    if (!Checker.Data({ type: data.type, id: data.id, count: data.count * upnum }, false)) {
                        enough = false;
                        break;
                    }
                }
                if (enough) {
                    return true;
                }
            }
        }
        return false;
    };
    // UserTemplateRedPoint.INDEX_SKILL
    UserTemplateRedPoint.prototype.GetIndexSkill = function () {
        var skillList = this.mModel.BaseConfig.skilllist;
        if (!skillList) {
            return;
        }
        if (!this.mModel.mSkills) {
            return;
        }
        this.mSkill = [];
        for (var i = 0; i < 4; i++) {
            var can = false;
            if (this.mModel.IsOpen(i)) {
                var skillId = skillList[i];
                var level = this.mModel.mSkills[i];
                if (level && this.mModel.SkillConfig[skillId][level]) {
                    if (Checker.Data(this.mModel.SkillConfig[skillId][level - 1].cost, false)) {
                        can = true;
                    }
                }
            }
            this.mSkill[i] = can;
        }
        for (var _i = 0, _a = this.mSkill; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data) {
                return true;
            }
        }
        return false;
    };
    // UserTemplateRedPoint.INDEX_REWARD
    UserTemplateRedPoint.prototype.GetIndexReward = function () {
        var config = GameGlobal.Config.ProgressRewardConfig[this.mModel.mTemplateType];
        if (!config) {
            return false;
        }
        for (var key in config) {
            if (this.mModel.GetRewardState(Number(key)) == RewardState.CanGet) {
                return true;
            }
        }
        return false;
    };
    // UserTemplateRedPoint.INDEX_SKIN
    UserTemplateRedPoint.prototype.GetIndexSkin = function () {
        this.mSkin = {};
        var skinConfig = this.mModel.SkinConfig;
        if (skinConfig) {
            var dict = this.mModel.GetDressDict().mDict;
            for (var k in skinConfig) {
                var id = Number(k);
                if (id >= 1000 && !dict[id]) {
                    if (Checker.Data(skinConfig[k].itemid, false)) {
                        this.mSkin[id] = true;
                    }
                }
            }
        }
        for (var k in this.mSkin) {
            return true;
        }
        return false;
    };
    // UserTemplateRedPoint.INDEX_ATTR_ITEM
    UserTemplateRedPoint.prototype.GetIndexAttrItem = function () {
        if (this.mModel.BaseConfig.attreitemid) {
            return GameGlobal.UserBag.GetCount(this.mModel.BaseConfig.attreitemid) > 0;
        }
        return false;
    };
    UserTemplateRedPoint.prototype.GetIndexUpLevelItem = function () {
        var openday = GameServer.serverOpenDay;
        if (openday <= 8) {
            if (this.mModel.mLevel < this.mModel.mMaxLevel) {
                return GameGlobal.UserBag.GetCount(this.mModel.GetShootUpDrugID()) > 0;
            }
        }
        return false;
    };
    UserTemplateRedPoint.prototype.GetCanEquipList = function () {
        var lv = this.mModel.mLevel;
        //背包装备
        var equipItems = UserBag.ins().getBagEquipByType(this.mEquipType);
        if (!equipItems) {
            return {};
        }
        var subEquipItems = {};
        for (var j = 0; j < equipItems.length; j++) {
            var item = equipItems[j];
            if (lv < item.itemConfig.level) {
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
    UserTemplateRedPoint.prototype.DoUpdateEquip = function () {
        if (!this.mEquipType) {
            return;
        }
        var subEquipItems = this.GetCanEquipList();
        if (!subEquipItems)
            return;
        var tempEquips = [];
        var checkFunc2 = function (item) {
            //已经装备的就跳过
            if (tempEquips.indexOf(item) >= 0) {
                return false;
            }
            return true;
        };
        var modelEquipData = this.mModel.mEquip;
        var equipCount = modelEquipData.length;
        for (var i = 0; i < equipCount; i++) {
            var equip = modelEquipData[i];
            //有装备跳过
            if (equip.handle != 0)
                continue;
            var subList = subEquipItems[i];
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
        for (var i = 0; i < equipCount; i++) {
            var equip = modelEquipData[i];
            //无装备跳过
            if (equip.handle == 0)
                continue;
            var subList = subEquipItems[i];
            if (subList) {
                for (var _a = 0, subList_2 = subList; _a < subList_2.length; _a++) {
                    var item = subList_2[_a];
                    if (!checkFunc2(item)) {
                        continue;
                    }
                    tempEquips[i] = UserEquip.contrastEquip(tempEquips[i] ? tempEquips[i] : equip, item);
                }
            }
        }
        var equipRedPoint = this.mEquip;
        for (var i = 0, len = UserTemplate.EQUIP_COUNT; i < len; i++) {
            var equip = modelEquipData[i];
            equipRedPoint[i] = tempEquips[i] && equip.handle != tempEquips[i].handle ? tempEquips[i].handle : 0;
        }
    };
    UserTemplateRedPoint.prototype.IsRedEquip = function (index) {
        return this.mEquip[index];
    };
    UserTemplateRedPoint.prototype.IsRedSkill = function (index) {
        return this.mSkill[index] ? true : false;
    };
    UserTemplateRedPoint.prototype.IsRedSkin = function (skinId) {
        return this.mSkin[skinId] ? true : false;
    };
    // 装备
    UserTemplateRedPoint.INDEX_EQUIP = 0;
    // 升阶
    UserTemplateRedPoint.INDEX_RANK = 1;
    // 技能
    UserTemplateRedPoint.INDEX_SKILL = 2;
    // 进阶巨礼
    UserTemplateRedPoint.INDEX_REWARD = 3;
    // 皮肤
    UserTemplateRedPoint.INDEX_SKIN = 4;
    // 属性丹
    UserTemplateRedPoint.INDEX_ATTR_ITEM = 5;
    UserTemplateRedPoint.INDEX_UP_LEVEL_ITEM = 6;
    return UserTemplateRedPoint;
}(IRedPoint));
__reflect(UserTemplateRedPoint.prototype, "UserTemplateRedPoint");
//# sourceMappingURL=UserTemplateRedPoint.js.map