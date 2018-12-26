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
var XianlvModelRedPoint = (function (_super) {
    __extends(XianlvModelRedPoint, _super);
    function XianlvModelRedPoint(model) {
        var _this = _super.call(this) || this;
        _this.m_ActiveList = {};
        _this.m_RankList = {};
        _this.m_StarList = {};
        _this.m_Model = model;
        return _this;
    }
    XianlvModelRedPoint.prototype.IsRedPoint = function () {
        if (!Deblocking.Check(DeblockingType.TYPE_15, true)) {
            return false;
        }
        return _super.prototype.IsRedPoint.call(this);
    };
    XianlvModelRedPoint.prototype.GetCheckFuncList = function () {
        return _a = {},
            _a[XianlvModelRedPoint.INDEX_ACT] = this.GetIndexAct,
            _a[XianlvModelRedPoint.INDEX_RANK] = this.GetIndexRank,
            _a[XianlvModelRedPoint.INDEX_STAR] = this.GetIndexStar,
            _a[XianlvModelRedPoint.INDEX_BATTLE] = this.GetIndexBattle,
            _a;
        var _a;
    };
    XianlvModelRedPoint.prototype.OnMessage = function (type) {
        if (type == MessageDef.BAG_XIANLV_RANK_ITEM) {
            this.ClearFlag(XianlvModelRedPoint.INDEX_RANK);
        }
        else {
            _super.prototype.OnMessage.call(this, type);
        }
        return true;
    };
    XianlvModelRedPoint.prototype.OnChange = function (index) {
        if (index == XianlvModelRedPoint.INDEX_ACT) {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_BAG_XIANLV_ACT_ITEM);
        }
        else {
            GameGlobal.MessageCenter.dispatch(MessageDef.RP_XIANLV);
        }
    };
    XianlvModelRedPoint.prototype.GetMessageDef = function () {
        return [MessageDef.BAG_XIANLV_ACT_ITEM, MessageDef.XIANLV_ACTIVE, MessageDef.XIANLV_INIT_INFO,
            MessageDef.BAG_XIANLV_RANK_ITEM,
            MessageDef.BAG_XIANLV_STAR_ITEM,
            MessageDef.XIANLV_UPATE_BATTLE,
        ];
    };
    XianlvModelRedPoint.prototype.GetIndexRank = function () {
        this.m_RankList = {};
        var list = this.m_Model.mXianlvList;
        for (var k in list) {
            var xianlvInfo = list[k];
            if (xianlvInfo.mLevel > 0 && xianlvInfo.mLevel < this.m_Model.MAX_LEVEL) {
                var config = xianlvInfo.GetLevelConfig();
                // let upnum = Math.floor(config.proexp / config.exp)
                // upnum = upnum - xianlvInfo.mExp
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
                    this.m_RankList[xianlvInfo.mXianlvId] = true;
                }
            }
        }
        for (var k in this.m_RankList) {
            return true;
        }
        return false;
    };
    XianlvModelRedPoint.prototype.GetIndexStar = function () {
        this.m_StarList = {};
        var list = this.m_Model.mXianlvList;
        for (var k in list) {
            var xianlvInfo = list[k];
            if (xianlvInfo.mLevel > 0 && xianlvInfo.mStar < this.m_Model.MAX_STAR) {
                var config = GameGlobal.Config.partnerAttrsConfig[xianlvInfo.mXianlvId][(xianlvInfo.mStar || 1) - 1];
                if (Checker.Datas(config.cost, false)) {
                    this.m_StarList[xianlvInfo.mXianlvId] = true;
                }
            }
        }
        for (var k in this.m_StarList) {
            return true;
        }
        return false;
    };
    XianlvModelRedPoint.prototype.GetIndexBattle = function () {
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
        var list = this.m_Model.mXianlvList;
        for (var k in list) {
            var xianlvInfo = list[k];
            if (xianlvInfo.mLevel > 0 && !this.m_Model.HasBattle(xianlvInfo.mXianlvId)) {
                return true;
            }
        }
        return false;
    };
    XianlvModelRedPoint.prototype.GetIndexAct = function () {
        this.DoActive();
        for (var key in this.m_ActiveList) {
            if (key) {
                return true;
            }
        }
        return false;
    };
    XianlvModelRedPoint.prototype.DoActive = function () {
        this.m_ActiveList = {};
        var config = GameGlobal.Config.partnerBiographyConfig;
        for (var k in config) {
            if (this.m_Model.HasXianlv(parseInt(k))) {
                continue;
            }
            var data = config[k].material;
            if (GameGlobal.UserBag.GetCount(data.id) >= data.count) {
                this.m_ActiveList[k] = true;
            }
        }
    };
    XianlvModelRedPoint.prototype.IsRedAct = function (xianlvId) {
        this.Get(XianlvModelRedPoint.INDEX_ACT);
        return this.m_ActiveList[xianlvId];
    };
    XianlvModelRedPoint.prototype.IsRedRank = function (xianlvId) {
        return this.m_RankList[xianlvId] ? true : false;
    };
    XianlvModelRedPoint.prototype.IsRedStar = function (xianlvId) {
        return this.m_StarList[xianlvId] ? true : false;
    };
    XianlvModelRedPoint.INDEX_ACT = 0;
    XianlvModelRedPoint.INDEX_RANK = 1;
    XianlvModelRedPoint.INDEX_STAR = 2;
    XianlvModelRedPoint.INDEX_BATTLE = 3;
    return XianlvModelRedPoint;
}(IRedPoint));
__reflect(XianlvModelRedPoint.prototype, "XianlvModelRedPoint");
//# sourceMappingURL=XianlvModelRedPoint.js.map