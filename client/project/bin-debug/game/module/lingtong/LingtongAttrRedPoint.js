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
var LingtongAttrRedPoint = (function (_super) {
    __extends(LingtongAttrRedPoint, _super);
    function LingtongAttrRedPoint() {
        var _this = _super.call(this) || this;
        _this.mActIds = {};
        _this.mRankIds = {};
        _this.mLevelIds = {};
        _this.mYulIds = {};
        _this.mYuHIds = {};
        _this.mSuitIds = {};
        return _this;
    }
    LingtongAttrRedPoint.prototype.OnChange = function (index) {
        this.DispatchMsg();
    };
    LingtongAttrRedPoint.prototype.DispatchMsg = function () {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_LINGTONG);
    };
    LingtongAttrRedPoint.prototype.CheckAll = function () {
        if (!LingtongPetModel.INIT_INFO) {
            return;
        }
        _super.prototype.CheckAll.call(this);
    };
    LingtongAttrRedPoint.prototype.GetMessageDef = function () {
        var list = [
            MessageDef.LINGTONG_UPDATE_INFO,
            MessageDef.LINGTONG_ACT_ITEM,
            MessageDef.LINGTONG_RANK_ITEM,
            MessageDef.LINGTONG_SKILL_ITEM,
            MessageDef.LINGTONG_INIT_LIST_INFO,
            MessageDef.LINGTONG_ACTIVE,
            MessageDef.LINGTONG_LEVEL_ITEM,
            MessageDef.LINGTONG_YU_HUN_ITEM,
            MessageDef.LINGTONG_YU_UPDATE_INFO,
            MessageDef.LINGTONG_BATTLE,
        ];
        return list;
    };
    LingtongAttrRedPoint.prototype.GetCheckFuncList = function () {
        var dict = (_a = {},
            _a[LingtongAttrRedPoint.INDEX_ACTIVE] = this.GetIndexAct,
            _a[LingtongAttrRedPoint.INDEX_RANK] = this.GetIndexRank,
            _a[LingtongAttrRedPoint.INDEX_SKILL] = this.GetIndexSkill,
            _a[LingtongAttrRedPoint.INDEX_LEVEL] = this.GetIndexLevel,
            _a[LingtongAttrRedPoint.INDEX_YUL] = this.GetIndexYul,
            _a[LingtongAttrRedPoint.INDEX_YUH] = this.GetIndexYuH,
            _a[LingtongAttrRedPoint.INDEX_SUIT] = this.GetIndexSuit,
            _a[LingtongAttrRedPoint.INDEX_COMPOSITION] = this.GetIndexComposition,
            _a[LingtongAttrRedPoint.INDEX_BATTLE] = this.GetIndexBattle,
            _a);
        return dict;
        var _a;
    };
    // UserTemplateRedPoint.INDEX_EQUIP
    LingtongAttrRedPoint.prototype.GetIndexAct = function () {
        var oldData = this.mActIds;
        this.mActIds = {};
        var config = GameGlobal.Config.BabyActivationConfig;
        for (var key in config) {
            if (GameGlobal.LingtongPetModel.IsActive(Number(key))) {
                continue;
            }
            var data = config[key].material;
            this.mActIds[Number(key)] = GameGlobal.UserBag.GetCount(data.id) >= data.count;
        }
        if (!this.CheckArrayData(this.mActIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mActIds) {
            if (this.mActIds[key]) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexRank = function () {
        var oldData = this.mRankIds;
        this.mRankIds = {};
        for (var key in GameGlobal.LingtongPetModel.mInfo) {
            var info = GameGlobal.LingtongPetModel.mInfo[key];
            if (!info || !info.mLevel) {
                continue;
            }
            if (info.mGiftLevel >= GameGlobal.LingtongPetModel.MAX_GIFT_LEVEL) {
                continue;
            }
            var config = GameGlobal.Config.BabyTalentConfig[info.mId][info.mGiftLevel - 1];
            if (!config) {
                continue;
            }
            this.mRankIds[info.mId] = GameGlobal.UserBag.GetCount(config.cost[0].id) >= config.cost[0].count;
        }
        if (!this.CheckArrayData(this.mRankIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mRankIds) {
            if (this.mRankIds[key]) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexSkill = function () {
        if (!GameGlobal.LingtongPetModel.HasActive()) {
            return false;
        }
        for (var _i = 0, _a = GameGlobal.Config.BabyBasisConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexLevel = function () {
        var oldData = this.mLevelIds;
        this.mLevelIds = {};
        for (var key in GameGlobal.LingtongPetModel.mInfo) {
            var info = GameGlobal.LingtongPetModel.mInfo[key];
            if (!info || !info.mLevel) {
                continue;
            }
            if (info.mLevel >= LingtongPetModel.MAX_LEVEL) {
                continue;
            }
            var config = GameGlobal.Config.BabyLvproConfig[info.mLevel];
            if (!config) {
                continue;
            }
            this.mLevelIds[info.mId] = GameGlobal.UserBag.GetCount(config.cost[0].id) >= config.cost[0].count;
        }
        if (!this.CheckArrayData(this.mLevelIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mLevelIds) {
            if (this.mLevelIds[key]) {
                return true;
            }
        }
    };
    LingtongAttrRedPoint.prototype.GetIndexYul = function () {
        var oldData = this.mYulIds;
        this.mYulIds = {};
        for (var key in GameGlobal.LingtongPetModel.mInfo) {
            var info = GameGlobal.LingtongPetModel.mInfo[key];
            if (!info || !info.mLevel) {
                continue;
            }
            var ids = {};
            for (var i = 0; i < 5; i++) {
                var lv = info.mLing[i];
                if (lv >= LingtongPetModel.MAX_Ling_LEVEL) {
                    ids[i] = false;
                    continue;
                }
                ids[i] = GameGlobal.LingtongPetModel.canUpgradeLingByIndex(info.mId, i + 1);
            }
            this.mYulIds[info.mId] = ids;
        }
        if (!this.CheckArrayData(this.mYulIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mYulIds) {
            for (var key2 in this.mYulIds[key]) {
                if (this.mYulIds[key][key2]) {
                    return true;
                }
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexYuH = function () {
        var oldData = this.mYulIds;
        this.mYuHIds = {};
        for (var key in GameGlobal.LingtongPetModel.mInfo) {
            var info = GameGlobal.LingtongPetModel.mInfo[key];
            if (!info || !info.mLevel) {
                continue;
            }
            var ids = {};
            for (var i = 0; i < 6; i++) {
                var lv = info.mHun[i];
                if (lv >= LingtongPetModel.MAX_HUN_LEVEL) {
                    ids[i] = false;
                    continue;
                }
                ids[i] = GameGlobal.LingtongPetModel.canUpgradeHunByIndex(info.mId, i + 1);
            }
            this.mYuHIds[info.mId] = ids;
        }
        if (!this.CheckArrayData(this.mYuHIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mYuHIds) {
            for (var key2 in this.mYuHIds[key]) {
                if (this.mYuHIds[key][key2]) {
                    return true;
                }
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexSuit = function () {
        var oldData = this.mSuitIds;
        this.mSuitIds = {};
        for (var key in GameGlobal.LingtongPetModel.mInfo) {
            var info = GameGlobal.LingtongPetModel.mInfo[key];
            if (!info || !info.mLevel) {
                continue;
            }
            this.mSuitIds[info.mId] = GameGlobal.LingtongPetModel.IsRedPointSuit(info);
        }
        if (!this.CheckArrayData(this.mSuitIds, oldData)) {
            this.DispatchMsg();
        }
        for (var key in this.mSuitIds) {
            if (this.mSuitIds[key]) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexComposition = function () {
        var config = GameGlobal.Config.BabyActivationConfig;
        for (var key in config) {
            var data = config[key].compose;
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.GetIndexBattle = function () {
        var emptyCount = 0;
        for (var _i = 0, _a = GameGlobal.LingtongPetModel.mBattleList; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!data) {
                emptyCount++;
            }
        }
        if (!emptyCount) {
            return false;
        }
        var list = GameGlobal.LingtongPetModel.mInfo;
        for (var k in list) {
            var info = list[k];
            if (info.mLevel > 0 && !GameGlobal.LingtongPetModel.HasBattle(info.mId)) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.IsAct = function (petId) {
        return this.mActIds[petId] ? true : false;
    };
    LingtongAttrRedPoint.prototype.IsRank = function (petId) {
        return this.mRankIds[petId] ? true : false;
    };
    LingtongAttrRedPoint.prototype.IsLevel = function (petId) {
        return this.mLevelIds[petId] ? true : false;
    };
    LingtongAttrRedPoint.prototype.IsYul = function (petId) {
        var ids = this.mYulIds[petId];
        if (!ids) {
            return false;
        }
        for (var key in ids) {
            if (ids[key]) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.IsYuH = function (petId) {
        var ids = this.mYuHIds[petId];
        if (!ids) {
            return false;
        }
        for (var key in ids) {
            if (ids[key]) {
                return true;
            }
        }
        return false;
    };
    LingtongAttrRedPoint.prototype.IsSuit = function (petId) {
        return this.mSuitIds[petId] ? true : false;
    };
    LingtongAttrRedPoint.prototype.IsRedLingtong = function (petId) {
        if (this.IsAct(petId)) {
            return true;
        }
        if (this.IsRank(petId)) {
            return true;
        }
        if (this.IsLevel(petId)) {
            return true;
        }
        if (this.IsYul(petId)) {
            return true;
        }
        if (this.IsYuH(petId)) {
            return true;
        }
        if (this.IsSuit(petId)) {
            return true;
        }
        if (GameGlobal.LingtongPetModel.IsActive(petId) && !GameGlobal.LingtongPetModel.HasBattle(petId) && this.Get(PetModelRedPoint.INDEX_BATTLE)) {
            return true;
        }
        return false;
    };
    LingtongAttrRedPoint.INDEX_ACTIVE = 0;
    LingtongAttrRedPoint.INDEX_RANK = 1;
    LingtongAttrRedPoint.INDEX_SKILL = 2;
    LingtongAttrRedPoint.INDEX_LEVEL = 3;
    LingtongAttrRedPoint.INDEX_YUL = 4;
    LingtongAttrRedPoint.INDEX_YUH = 5;
    LingtongAttrRedPoint.INDEX_SUIT = 6;
    LingtongAttrRedPoint.INDEX_COMPOSITION = 7;
    LingtongAttrRedPoint.INDEX_BATTLE = 8;
    return LingtongAttrRedPoint;
}(IRedPoint));
__reflect(LingtongAttrRedPoint.prototype, "LingtongAttrRedPoint");
//# sourceMappingURL=LingtongAttrRedPoint.js.map