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
var PetModelRedPoint = (function (_super) {
    __extends(PetModelRedPoint, _super);
    function PetModelRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.m_ActiveList = {};
        _this.m_LevelList = {};
        _this.m_ZizhiList = {};
        _this.m_Model = model;
        return _this;
    }
    PetModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[PetModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a[PetModelRedPoint.INDEX_LEVEL] = this.GetIndexLevel,
            _a[PetModelRedPoint.INDEX_SKILL] = this.GetIndexSkill,
            _a[PetModelRedPoint.INDEX_BATTLE] = this.GetIndexBattle,
            _a[PetModelRedPoint.INDEX_ZIZHI] = this.GetIndexZizhi,
            _a;
        var _a;
    };
    PetModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.BAG_PET_ACT_ITEM, MessageDef.PET_ACTIVE, MessageDef.PET_INIT_INFO,
            MessageDef.BAG_PET_LEVEL_ITEM,
            MessageDef.BAG_PET_SKILL_ITEM,
            MessageDef.PET_BATTLE,
        ];
    };
    PetModelRedPoint.prototype.OnChange = function (index) {
        if (index == PetModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_PET_ACT_ITEM);
        }
        else {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_PET);
        }
    };
    PetModelRedPoint.prototype.GetIndexLevel = function () {
        this.m_LevelList = {};
        var list = this.m_Model.mPetList;
        for (var k in list) {
            var petInfo = list[k];
            if (petInfo.mLevel > 0 && petInfo.mLevel < this.m_Model.MAX_LEVEL) {
                var config = petInfo.GetLevelConfig();
                var upnum = Math.floor(config.proexp / config.exp);
                upnum = upnum - petInfo.mExp;
                var enough = true;
                for (var _i = 0, _a = config.cost; _i < _a.length; _i++) {
                    var data = _a[_i];
                    if (!Checker.Data({ type: data.type, id: data.id, count: data.count * upnum }, false)) {
                        enough = false;
                        break;
                    }
                }
                if (enough) {
                    this.m_LevelList[petInfo.mPetId] = true;
                }
            }
        }
        for (var k in this.m_LevelList) {
            return true;
        }
        return false;
    };
    PetModelRedPoint.prototype.GetIndexZizhi = function () {
        this.m_ZizhiList = {};
        var list = this.m_Model.mPetList;
        for (var k in list) {
            var petInfo = list[k];
            if (petInfo.mLevel > 0 && petInfo.mZizhiLevel < this.m_Model.MAX_ZIZHI_LEVEL) {
                var config = GameGlobal.Config.petGiftproConfig[petInfo.mPetId][(petInfo.mZizhiLevel || 1) - 1];
                // let upnum = Math.floor(config.proexp / config.exp)
                // upnum = upnum - petInfo.mZizhiExp
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
                    this.m_ZizhiList[petInfo.mPetId] = true;
                }
            }
        }
        for (var k in this.m_ZizhiList) {
            return true;
        }
        return false;
    };
    PetModelRedPoint.prototype.GetIndexBattle = function () {
        var emptyCount = 0;
        for (var _i = 0, _a = this.m_Model.mBattleList; _i < _a.length; _i++) {
            var data = _a[_i];
            if (!data) {
                emptyCount++;
            }
        }
        if (!emptyCount) {
            return false;
        }
        var list = this.m_Model.mPetList;
        for (var k in list) {
            var xianlvInfo = list[k];
            if (xianlvInfo.mLevel > 0 && !this.m_Model.HasBattle(xianlvInfo.mPetId)) {
                return true;
            }
        }
        return false;
    };
    PetModelRedPoint.prototype.GetIndexSkill = function () {
        for (var _i = 0, _a = GameGlobal.Config.petbaseConfig.freshitemid; _i < _a.length; _i++) {
            var data = _a[_i];
            if (GameGlobal.UserBag.GetCount(data.itemId) > 0) {
                return true;
            }
        }
        return false;
    };
    PetModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.m_ActiveList) {
            if (key) {
                return true;
            }
        }
        return false;
    };
    PetModelRedPoint.prototype.DoActive = function () {
        this.m_ActiveList = {};
        var config = GameGlobal.Config.petBiographyConfig;
        for (var k in config) {
            if (this.m_Model.HasPet(parseInt(k))) {
                continue;
            }
            var data = config[k].material;
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                this.m_ActiveList[k] = true;
            }
        }
    };
    PetModelRedPoint.prototype.IsRedAct = function (petId) {
        this.Get(PetModelRedPoint.INDEX_ACT);
        return this.m_ActiveList[petId];
    };
    PetModelRedPoint.prototype.IsRedZizhi = function (petId) {
        return this.m_ZizhiList[petId] ? true : false;
    };
    PetModelRedPoint.prototype.IsRedLevel = function (petId) {
        return this.m_LevelList[petId] ? true : false;
    };
    PetModelRedPoint.INDEX_ACT = 0;
    PetModelRedPoint.INDEX_LEVEL = 1;
    PetModelRedPoint.INDEX_SKILL = 2;
    PetModelRedPoint.INDEX_BATTLE = 3;
    PetModelRedPoint.INDEX_ZIZHI = 4;
    return PetModelRedPoint;
}(IRedPoint));
__reflect(PetModelRedPoint.prototype, "PetModelRedPoint");
//# sourceMappingURL=PetModelRedPoint.js.map