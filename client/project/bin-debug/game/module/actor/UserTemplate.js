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
var UserTemplate = (function (_super) {
    __extends(UserTemplate, _super);
    function UserTemplate(type) {
        var _this = _super.call(this) || this;
        _this.mReward = 0;
        _this.mLevel = 0;
        _this.mUpNum = 0;
        _this.mDrugNum = 0;
        _this.mSkills = [];
        _this.mEquip = [];
        _this.mEquipIcon = [];
        _this.mDressId = 0;
        _this.mDressList = [];
        _this.mMaxLevel = 10;
        _this.mRideSkills = [];
        _this.LOCK_SKILLS = [];
        _this.mTemplateType = type;
        GameGlobal.SubRoles.mTemplate[type] = _this;
        return _this;
    }
    UserTemplate.GetTemplateTypeByItemType = function (itemType) {
        if (!UserTemplate.ITEMTYPE_TO_TEMPTYPE) {
            var data = UserTemplate.ITEMTYPE_TO_TEMPTYPE = {};
            for (var k in UserTemplate.TEMPTYPE_TO_ITEMTYPE) {
                data[UserTemplate.TEMPTYPE_TO_ITEMTYPE[k]] = k;
            }
        }
        return UserTemplate.ITEMTYPE_TO_TEMPTYPE[itemType];
    };
    UserTemplate.prototype.IsShowShootUpDrugID = function () {
        var openday = GameServer.serverOpenDay;
        return openday <= 8;
    };
    /**获取直升丹ID */
    UserTemplate.prototype.GetShootUpDrugID = function () {
        var config = GameGlobal.Config.AdvanceItemConfig;
        var drugId = 0;
        for (var key in config) {
            if (config[key].type == this.mTemplateType) {
                drugId = config[key].item;
                break;
            }
        }
        return drugId;
    };
    // 进阶奖励
    UserTemplate.prototype.GetRankUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_RANK_UP_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 进阶奖励
    UserTemplate.prototype.GetRankRewardUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 装备物品更新的消息
    UserTemplate.prototype.GetItemEquipUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_EQUIP_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 技能物品更新的消息
    UserTemplate.prototype.GetItemSkillUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_SKILL_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 皮肤物品更新的消息
    UserTemplate.prototype.GetItemSkinUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_SKIN_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 属性丹更新的消息
    UserTemplate.prototype.GetItemAttrItemUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_ATTR_ITEM_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 直升丹更新的消息
    UserTemplate.prototype.GetUpLevelItemUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_UP_LEVEL_ITEM_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 升阶丹更新的消息
    UserTemplate.prototype.GetItemRankItemUpdateMsg = function () {
        return MessageDef.USER_TEMPLATE_RANK_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 装备物品更新红点消息
    UserTemplate.prototype.GetItemEquipRpUpdateMsg = function () {
        return MessageDef.RP_USER_TEMPLATE_EQUIP_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    // 其它更新的红点消息
    UserTemplate.prototype.GetItemRpUpdateMsg = function () {
        return MessageDef.RP_USER_TEMPLATE_UPDATE_ + UserTemplate.TEMPTYPE_TO_ITEMTYPE[this.mTemplateType];
    };
    UserTemplate.prototype.GetTemplateType = function () {
        return this.mTemplateType;
    };
    UserTemplate.prototype.Init = function () {
        this.LOCK_SKILLS = [];
        for (var key in this.BaseConfig.openskilllv) {
            this.LOCK_SKILLS.push(parseInt(key));
        }
        this.LOCK_SKILLS.sort(function (lhs, rhs) {
            return lhs - rhs;
        });
        this.mRideSkills = this.BaseConfig.skilllist;
        for (var k in this.mRideSkills) {
            this.mSkills.push(0);
        }
        var equipIcon = this.BaseConfig.equip;
        for (var i = 0; i < 4; i++) {
            this.mEquip.push(new ItemBaseData);
            this.mEquipIcon.push(equipIcon ? (equipIcon[i] || "") : "");
        }
        if (this.SkillConfig) {
            // 绑定技能道具消息
            var skillMsg = this.GetItemSkillUpdateMsg();
            for (var key in this.SkillConfig) {
                var data = this.SkillConfig[key];
                GameGlobal.UserBag.AddListenerItem(data[1].cost.id, skillMsg);
            }
        }
        // 绑定皮肤道具消息
        if (this.SkinConfig) {
            var skinMsg = this.GetItemSkinUpdateMsg();
            for (var key in this.SkinConfig) {
                var data = this.SkinConfig[key];
                var item = data.itemid;
                if (item) {
                    GameGlobal.UserBag.AddListenerItem(item.id, skinMsg);
                }
            }
        }
        if (this.LvproConfig) {
            for (var key in this.LvproConfig) {
                var cost = this.LvproConfig[key].cost;
                if (!cost || !cost[1]) {
                    continue;
                }
                GameGlobal.UserBag.AddListenerItem(cost[1].id, this.GetItemRankItemUpdateMsg());
                break;
            }
        }
        GameGlobal.UserBag.AddListenerItem(this.BaseConfig.attreitemid, this.GetItemAttrItemUpdateMsg());
        this.mMaxLevel = CommonUtils.getObjectLength(this.AttrsConfig);
        var id = this.GetShootUpDrugID();
        if (id) {
            GameGlobal.UserBag.AddListenerItem(id, this.GetUpLevelItemUpdateMsg());
        }
    };
    UserTemplate.prototype.IsOpen = function (index) {
        var openLevel = this.GetOpenLevel(index);
        return this.mLevel >= openLevel;
    };
    UserTemplate.prototype.GetOpenLevel = function (index) {
        return this.LOCK_SKILLS[index];
    };
    UserTemplate.prototype.OnActive = function () {
    };
    UserTemplate.prototype._DoInitData = function (rsp) {
        this.mLevel = rsp.lv;
        this.mUpNum = rsp.upNum;
        this.mDressId = rsp.useClothes;
        this.mDressList = rsp.clothesList || [];
        this.mTmpDressList = null;
        this.mSkills = rsp.skillList;
        this.mDrugNum = rsp.drugNum || 0;
        this.mReward = rsp.reward || 0;
        this.UpdateDress();
        for (var i = 0; i < rsp.equipList.length; i++) {
            var data = rsp.equipList[i];
            if (data.id)
                this.mEquip[i].ParserByEquipData(data);
        }
        GameGlobal.MessageCenter.dispatch(this.mMsgDefInit);
        GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdate);
        this.OnActive();
    };
    UserTemplate.prototype._DoUpdateData = function (rsp) {
        if (rsp.reward != null) {
            this.mReward = rsp.reward || 0;
            GameGlobal.MessageCenter.dispatch(this.GetRankRewardUpdateMsg());
            GameGlobal.MessageCenter.dispatch(MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ALL___);
        }
        if (rsp.lv) {
            this.mLevel = rsp.lv;
            GameGlobal.MessageCenter.dispatch(this.GetRankUpdateMsg());
            GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateExp, true);
        }
        if (rsp.upNum != null) {
            this.mUpNum = rsp.upNum;
            GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateExp, false);
        }
        if (rsp.drugNum) {
            this.mDrugNum = rsp.drugNum;
            GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateDrug);
        }
        if (rsp.clothesList) {
            this.mDressList = rsp.clothesList || [];
            this.mTmpDressList = null;
        }
        if (rsp.useClothes) {
            this.mDressId = rsp.useClothes;
            this.UpdateDress();
        }
        if (rsp.skillList) {
            this.mSkills = rsp.skillList;
        }
        if (rsp.equipList) {
            var change = false;
            for (var i = 0; i < rsp.equipList.length; i++) {
                var data = rsp.equipList[i];
                if (data.id) {
                    this.mEquip[i].ParserByEquipData(data);
                    change = true;
                }
            }
            if (change) {
                GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdateEquip);
            }
        }
        GameGlobal.MessageCenter.dispatch(this.mMsgDefUpdate);
    };
    UserTemplate.prototype.UpdateDress = function () {
        var role = SubRoles.ins().GetRoleData();
        if (role) {
            role.UpdateTemplateData(this.mTemplateType, this.mDressId, this.mDressList);
        }
    };
    UserTemplate.prototype.SendBoost = function (useyb) {
        var rsp = new Sproto.cs_template_up_level_request();
        rsp.autoBuy = useyb;
        rsp.templateType = this.mTemplateType;
        this.Rpc(C2sProtocol.cs_template_up_level, rsp);
    };
    UserTemplate.prototype.SendUpSkill = function (skillIndex) {
        var rsp = new Sproto.cs_template_up_skill_request;
        rsp.skillNo = skillIndex + 1;
        rsp.templateType = this.mTemplateType;
        this.Rpc(C2sProtocol.cs_template_up_skill, rsp);
    };
    UserTemplate.prototype.SendDress = function (id) {
        var rsp = new Sproto.cs_template_clothes_request;
        rsp.clothesNo = id;
        rsp.templateType = this.mTemplateType;
        this.Rpc(C2sProtocol.cs_template_clothes, rsp);
    };
    UserTemplate.prototype.SendEquip = function (itemhandle) {
        var rsp = new Sproto.cs_template_equip_request();
        rsp.itemNo = itemhandle;
        rsp.templateType = this.mTemplateType;
        this.Rpc(C2sProtocol.cs_template_equip, rsp);
    };
    UserTemplate.prototype.SendGetReward = function (id) {
        var rsp = new Sproto.cs_template_reward_request;
        rsp.templateType = this.mTemplateType;
        rsp.no = id;
        this.Rpc(C2sProtocol.cs_template_reward, rsp);
    };
    UserTemplate.prototype.SendActiveDress = function (id) {
        var req = new Sproto.cs_template_buy_clothes_request;
        req.templateType = this.mTemplateType;
        req.clothesNo = id;
        this.Rpc(C2sProtocol.cs_template_buy_clothes, req);
    };
    UserTemplate.prototype.SendDrug = function (count) {
        var rsp = new Sproto.cs_template_drug_request();
        rsp.drugNum = count;
        rsp.templateType = this.mTemplateType;
        this.Rpc(C2sProtocol.cs_template_drug, rsp);
    };
    /**使用直升丹 */
    UserTemplate.prototype.SendShootUpDrug = function (drugId) {
        var rsp = new Sproto.cs_template_up_stage_request;
        rsp.drugId = drugId;
        this.Rpc(C2sProtocol.cs_template_up_stage, rsp);
    };
    UserTemplate.prototype.GetNextAddPower = function (level) {
        return ItemConfig.CalcAttrScoreValue(this.GetAttrByLv(this.mLevel + 1)) - ItemConfig.CalcAttrScoreValue(this.GetCurAttr());
    };
    UserTemplate.prototype.GetAppaId = function () {
        if (this.SkinConfig) {
            var data = this.SkinConfig[this.mDressId];
            if (data) {
                return data.pid;
            }
        }
        else {
            console.error("not GetAppaId skinconfig => " + egret.getQualifiedClassName(this));
        }
        return 0;
    };
    UserTemplate.GetAppaId = function (config, dressId) {
        if (config) {
            var data = config[dressId];
            if (data) {
                return data.pid || 0;
            }
        }
        return 0;
    };
    UserTemplate.prototype.GetPower = function () {
        var power = 0;
        power += ItemConfig.CalcAttrScoreValue(this.GetCurAttr());
        power += ItemConfig.CalcAttrScoreValue(this.GetCurEquipAttr());
        return power;
    };
    UserTemplate.prototype.GetDescPower = function () {
        var attr1 = this.GetCurAttr();
        var attr2 = this.GetCurEquipAttr();
        var attr3 = this.GetCurDressAttr();
        var attr4 = this.GetCurDrugAttr();
        var attr5 = this.GetCurSkillAttr();
        var power = 0;
        power += ItemConfig.CalcAttrScoreValue(attr1);
        power += ItemConfig.CalcAttrScoreValue(attr2);
        power += ItemConfig.CalcAttrScoreValue(attr3);
        power += ItemConfig.CalcAttrScoreValue(attr4);
        power += ItemConfig.CalcAttrScoreValue(attr5);
        return power;
    };
    UserTemplate.prototype.GetCurAttr = function () {
        return this.GetAttrByLv(this.mLevel);
    };
    //public GetCurAttr() {
    UserTemplate.prototype.GetAttrByLv = function (level) {
        var config = this.ProgressConfig[level]; //this.mLevel]
        if (!config) {
            return [];
        }
        var cfg = this.AttrsConfig[this.mLevel];
        if (!cfg) {
            return [];
        }
        var upConfig = cfg.attrpower;
        var attr = [];
        var configAttr = config.attrpower;
        for (var k in configAttr) {
            var data = configAttr[k];
            for (var k2 in upConfig) {
                if (upConfig[k2].type == data.type) {
                    attr.push({ type: data.type, value: data.value + upConfig[k2].value * this.mUpNum });
                    break;
                }
            }
        }
        return attr;
    };
    UserTemplate.prototype.GetCurEquipAttr = function () {
        var allAttr = {};
        for (var _i = 0, _a = this.mEquip; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.configID) {
                AttributeData.AttrAddTo(allAttr, GameGlobal.Config.EquipConfig[data.configID].attrs);
                AttributeData.AttrAddTo(allAttr, data.att);
            }
        }
        var list = [];
        for (var k in allAttr) {
            list.push({ type: k, value: allAttr[k] });
        }
        if (!list.length) {
            return [
                { type: AttributeType.atMaxHp, value: 0 },
                { type: AttributeType.atAttack, value: 0 },
                { type: AttributeType.atDef, value: 0 },
            ];
        }
        return list;
    };
    UserTemplate.prototype.GetCurDressAttr = function () {
        var allAttr = {};
        for (var _i = 0, _a = this.GetDressDict().mList; _i < _a.length; _i++) {
            var id = _a[_i];
            AttributeData.AttrAddTo(allAttr, this.SkinConfig[id].attrpower);
        }
        var list = [];
        for (var k in allAttr) {
            list.push({ type: k, value: allAttr[k] });
        }
        if (!list.length) {
            var cfg = this.SkinConfig[1000];
            if (cfg) {
                var list_1 = CommonUtils.copyDataHandler(cfg.attrpower);
                for (var _b = 0, list_2 = list_1; _b < list_2.length; _b++) {
                    var data = list_2[_b];
                    data.value = 0;
                }
                return list_1;
            }
        }
        return list;
    };
    UserTemplate.prototype.GetCurSkillAttr = function () {
        this.SkillConfig;
        var i = 0;
        var list = [];
        if (!this.BaseConfig.skilllist) {
            return null;
        }
        for (var _i = 0, _a = this.BaseConfig.skilllist; _i < _a.length; _i++) {
            var id = _a[_i];
            var config = this.SkillConfig[id];
            if (config && this.mSkills[i]) {
                var configData = config[this.mSkills[i] - 1];
                if (configData) {
                    list = AttributeData.AttrAddition(list, configData.attrpower);
                }
            }
            ++i;
        }
        if (!list.length) {
            return [
                { type: AttributeType.atMaxHp, value: 0 },
                { type: AttributeType.atAttack, value: 0 },
                { type: AttributeType.atDef, value: 0 },
            ];
        }
        return list;
    };
    UserTemplate.prototype.GetCurDrugAttr = function () {
        var attr = CommonUtils.copyDataHandler(this.BaseConfig.attredata);
        var drugNum = this.mDrugNum;
        for (var k in attr) {
            attr[k].value *= drugNum;
        }
        return attr;
    };
    UserTemplate.prototype.GetSkinConfig = function () {
        var config = this.SkinConfig;
        var list = [];
        for (var k in config) {
            if (parseInt(k) >= 1000) {
                list.push(config[k]);
            }
        }
        list.sort(function (lhs, rhs) {
            return lhs.skinid - rhs.skinid;
        });
        return list;
        // CommonUtils.GetArray(this.SkinConfig, "skinid")
    };
    UserTemplate.prototype.GetDressPower = function () {
        var power = 0;
        for (var _i = 0, _a = this.GetDressDict().mList; _i < _a.length; _i++) {
            var data = _a[_i];
            power += ItemConfig.CalcAttrScoreValue(this.SkinConfig[data].attrpower);
        }
        return power;
    };
    UserTemplate.prototype.GetActiveDressCount = function () {
        return this.GetDressDict().mList.length;
    };
    UserTemplate.prototype.GetLevelSkin = function (level) {
        var id = this.BaseConfig.pictureid ? this.BaseConfig.pictureid[level - 1] : 1;
        var config = this.SkinConfig[id];
        if (config) {
            return config.pid;
        }
        return 0;
    };
    UserTemplate.prototype.HasDress = function (id) {
        return this.GetDressDict().mDict[id] ? true : false;
    };
    UserTemplate.prototype.GetDressDict = function () {
        if (!this.mTmpDressList) {
            var list = [];
            var dict = {};
            for (var _i = 0, _a = this.mDressList; _i < _a.length; _i++) {
                var data = _a[_i];
                if (data >= 1000) {
                    list.push(data);
                    dict[data] = true;
                }
            }
            list.sort(function (lhs, rhs) {
                return lhs - rhs;
            });
            this.mTmpDressList = {
                mList: list,
                mDict: dict,
            };
        }
        return this.mTmpDressList;
    };
    UserTemplate.prototype.GetRewardState = function (id) {
        var config = GameGlobal.Config.ProgressRewardConfig[this.mTemplateType];
        if (!config) {
            return RewardState.NotReached;
        }
        var data = config[id];
        if (!data) {
            return RewardState.NotReached;
        }
        if (this.mLevel >= data.progress) {
            if (BitUtil.Has(this.mReward, data.id)) {
                return RewardState.Gotten;
            }
            return RewardState.CanGet;
        }
        return RewardState.NotReached;
    };
    UserTemplate.EQUIP_COUNT = 4;
    UserTemplate.TYPE_RIDE = 1; // 坐骑
    UserTemplate.TYPE_WING = 2; // 翅膀
    UserTemplate.TYPE_TIANX = 3; // 守护
    UserTemplate.TYPE_SHENGB = 4; // 神兵
    UserTemplate.TYPE_PET_SHOUH = 5; // 兽魂
    UserTemplate.TYPE_PET_TONGL = 6; // 通灵
    UserTemplate.TYPE_XIANLV_XW = 7; // 仙侣仙位
    UserTemplate.TYPE_XIANLV_FZ = 8; // 仙侣法阵
    UserTemplate.TYPE_HAVING_HAVING = 9; //玄女
    UserTemplate.TYPE_HAVING_LINGQ = 10; //灵气
    UserTemplate.TYPE_HAVING_HUAN = 11; //花辇
    UserTemplate.TYPE_LINGTONG = 12; // 灵童
    UserTemplate.TYPE_DRESS_FATION = 100; //时装
    UserTemplate.TYPE_TITLE = 101; //称号
    UserTemplate.TEMPTYPE_TO_ITEMTYPE = (_a = {},
        _a[UserTemplate.TYPE_RIDE] = ItemType.RIDE,
        _a[UserTemplate.TYPE_WING] = ItemType.WING,
        _a[UserTemplate.TYPE_TIANX] = ItemType.TIANXIAN,
        _a[UserTemplate.TYPE_SHENGB] = ItemType.SHENGB,
        _a[UserTemplate.TYPE_PET_SHOUH] = ItemType.PET_SH,
        _a[UserTemplate.TYPE_PET_TONGL] = ItemType.PET_TL,
        _a[UserTemplate.TYPE_XIANLV_XW] = ItemType.XIAN_XW,
        _a[UserTemplate.TYPE_XIANLV_FZ] = ItemType.XIAN_FZ,
        _a[UserTemplate.TYPE_HAVING_LINGQ] = ItemType.LINGQI,
        _a[UserTemplate.TYPE_HAVING_HUAN] = ItemType.HUA,
        _a[UserTemplate.TYPE_HAVING_HAVING] = ItemType.TIANNV,
        _a);
    UserTemplate.ITEMTYPE_TO_TEMPTYPE = null;
    return UserTemplate;
}(BaseSystem));
__reflect(UserTemplate.prototype, "UserTemplate");
var _a;
//# sourceMappingURL=UserTemplate.js.map