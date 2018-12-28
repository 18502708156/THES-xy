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
        return _super.call(this) || this;
    }
    LingtongAttrRedPoint.prototype.OnChange = function (index) {
        GameGlobal.MessageCenter.dispatch(MessageDef.RP_LINGTONG);
    };
    LingtongAttrRedPoint.prototype.GetMessageDef = function () {
        var list = [
            MessageDef.LINGTONG_UPDATE_INFO,
            MessageDef.LINGTONG_ACT_ITEM,
            MessageDef.LINGTONG_RANK_ITEM,
            MessageDef.LINGTONG_SKILL_ITEM,
            MessageDef.DESTINY_CHANGE,
        ];
        return list;
    };
    LingtongAttrRedPoint.prototype.GetCheckFuncList = function () {
        var dict = (_a = {},
            _a[LingtongAttrRedPoint.INDEX_ACTIVE] = this.GetIndexAct,
            _a[LingtongAttrRedPoint.INDEX_RANK] = this.GetIndexRank,
            _a[LingtongAttrRedPoint.INDEX_SKILL] = this.GetIndexSkill,
            _a);
        return dict;
        var _a;
    };
    // UserTemplateRedPoint.INDEX_EQUIP
    LingtongAttrRedPoint.prototype.GetIndexAct = function () {
        if (GameGlobal.LingtongAttrModel.IsActive()) {
            return false;
        }
        var material = GameGlobal.Config.BabyBasisConfig.material;
        var count = this.GetActCount();
        return count >= material.num;
    };
    LingtongAttrRedPoint.prototype.GetActCount = function () {
        var datas = GameGlobal.DestinyController.getUseDestinyData();
        var count = 0;
        var material = GameGlobal.Config.BabyBasisConfig.material;
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            if (data && data.id && data.level) {
                var config = GameGlobal.Config.ItemConfig[data.id];
                if (config && config.quality >= material.quality) {
                    ++count;
                }
            }
        }
        return count;
    };
    LingtongAttrRedPoint.prototype.GetIndexRank = function () {
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return false;
        }
        if (GameGlobal.LingtongAttrModel.giftlv >= GameGlobal.LingtongAttrModel.MAX_GIFT_LEVEL) {
            return false;
        }
        var config = GameGlobal.Config.BabyTalentConfig[GameGlobal.LingtongAttrModel.mSex][GameGlobal.LingtongAttrModel.giftlv - 1];
        if (!config) {
            return false;
        }
        return GameGlobal.UserBag.GetCount(config.cost[0].id) >= config.cost[0].count;
    };
    LingtongAttrRedPoint.prototype.GetIndexSkill = function () {
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
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
    LingtongAttrRedPoint.INDEX_ACTIVE = 0;
    LingtongAttrRedPoint.INDEX_RANK = 1;
    LingtongAttrRedPoint.INDEX_SKILL = 2;
    return LingtongAttrRedPoint;
}(IRedPoint));
__reflect(LingtongAttrRedPoint.prototype, "LingtongAttrRedPoint");
//# sourceMappingURL=LingtongAttrRedPoint.js.map