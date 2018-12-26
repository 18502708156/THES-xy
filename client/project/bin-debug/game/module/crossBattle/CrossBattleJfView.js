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
var CrossBattleJfView = (function (_super) {
    __extends(CrossBattleJfView, _super);
    function CrossBattleJfView() {
        var _this = _super.call(this) || this;
        _this.windowTitleIconName = "争霸奖励";
        _this.skinName = "CrossBattleJfViewSkin";
        _this.list.itemRenderer = CrossBattleJfItem;
        return _this;
    }
    CrossBattleJfView.prototype.childrenCreated = function () {
    };
    CrossBattleJfView.prototype.OnOpen = function () {
        GameGlobal.CrossBattleModel.getJfModel(); //请求数据
        this.observe(MessageDef.JF_UPDATE_INFO, this.UpdateContent);
    };
    /*		let weight = (config) => {
            let skinid = config.skinid
            if (this.mModel.HasDress(skinid)) {
                return -100000 - skinid
            }
            let cur = GameGlobal.UserBag.GetCount(config.itemid.id)
            let need = config.itemid.count
            if (cur >= need) {
                return -10000 - skinid
            }
            return skinid
        }
        this.mList.sort((lhs, rhs) => {
            return weight(lhs) - weight(rhs)
        })
     */
    CrossBattleJfView.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.KingPointsRewardConfig;
        var configData = [];
        for (var data in config) {
            configData.push(data);
        }
        var weight = function (num) {
            var skinid = Number(num);
            if (GameGlobal.CrossBattleModel.commonpoint > config[skinid].partnerpoints && GameGlobal.CrossBattleModel.commonreward.indexOf(skinid) == -1) {
                return -100000 + skinid;
            }
            if (GameGlobal.CrossBattleModel.commonreward.indexOf(skinid) > -1) {
                return -1000 + skinid;
            }
            if (GameGlobal.CrossBattleModel.commonpoint < config[skinid].partnerpoints) {
                return -10000 + skinid;
            }
        };
        configData.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(configData);
    };
    CrossBattleJfView.NAME = "个人贡献";
    return CrossBattleJfView;
}(BaseView));
__reflect(CrossBattleJfView.prototype, "CrossBattleJfView", ["ICommonWindowTitle"]);
var CrossBattleJfItem = (function (_super) {
    __extends(CrossBattleJfItem, _super);
    function CrossBattleJfItem() {
        return _super.call(this) || this;
    }
    CrossBattleJfItem.prototype.dataChanged = function () {
        var data = Number(this.data);
        var config = GameGlobal.Config.KingPointsRewardConfig;
        this.text.text = "【贡献奖励】(个人贡献达" + config[data].partnerpoints + ")";
        this.list.dataProvider = new eui.ArrayCollection(config[data].showItem);
        this.num.text = GameGlobal.CrossBattleModel.commonpoint + "/" + config[data].partnerpoints;
        this.wdc.visible = false;
        this.ylq.visible = false;
        this.bnt.visible = false;
        if (GameGlobal.CrossBattleModel.commonpoint < config[data].partnerpoints) {
            this.wdc.visible = true;
        }
        else {
            if (GameGlobal.CrossBattleModel.commonreward.indexOf(data) != -1) {
                this.ylq.visible = true;
            }
            else {
                this.bnt.visible = true;
            }
        }
    };
    CrossBattleJfItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBase;
        this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    CrossBattleJfItem.prototype._OnClick = function () {
        var data = Number(this.data);
        GameGlobal.CrossBattleModel.huoQuJiangLi(2, data);
    };
    return CrossBattleJfItem;
}(eui.ItemRenderer));
__reflect(CrossBattleJfItem.prototype, "CrossBattleJfItem");
var CrossBattleMJfView = (function (_super) {
    __extends(CrossBattleMJfView, _super);
    function CrossBattleMJfView() {
        var _this = _super.call(this) || this;
        _this.windowTitleIconName = "争霸奖励";
        _this.skinName = "CrossBattleJfViewSkin";
        _this.list.itemRenderer = CrossBattleMJfItem;
        return _this;
    }
    CrossBattleMJfView.prototype.childrenCreated = function () {
    };
    CrossBattleMJfView.prototype.OnOpen = function () {
        GameGlobal.CrossBattleModel.getJfModel(); //请求数据
        this.observe(MessageDef.JF_UPDATE_INFO, this.UpdateContent);
    };
    CrossBattleMJfView.prototype.UpdateContent = function () {
        var config = GameGlobal.Config.KingWPointsRewardConfig;
        var configData = [];
        for (var data in config) {
            configData.push(data);
        }
        var weight = function (num) {
            var skinid = Number(num);
            if (GameGlobal.CrossBattleModel.citypoint > config[skinid].citypoints && GameGlobal.CrossBattleModel.cityreward.indexOf(skinid) == -1) {
                return -100000 + skinid;
            }
            if (GameGlobal.CrossBattleModel.cityreward.indexOf(skinid) > -1) {
                return -1000 + skinid;
            }
            if (GameGlobal.CrossBattleModel.citypoint < config[skinid].citypoints) {
                return -10000 + skinid;
            }
        };
        configData.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(configData);
    };
    CrossBattleMJfView.NAME = "王城积分";
    return CrossBattleMJfView;
}(BaseView));
__reflect(CrossBattleMJfView.prototype, "CrossBattleMJfView", ["ICommonWindowTitle"]);
var CrossBattleMJfItem = (function (_super) {
    __extends(CrossBattleMJfItem, _super);
    function CrossBattleMJfItem() {
        return _super.call(this) || this;
    }
    CrossBattleMJfItem.prototype.dataChanged = function () {
        var data = Number(this.data);
        var config = GameGlobal.Config.KingWPointsRewardConfig;
        this.text.text = "【王城奖励】(王城积分达到" + config[data].citypoints + ")";
        this.list.dataProvider = new eui.ArrayCollection(config[data].showItem);
        this.num.text = GameGlobal.CrossBattleModel.citypoint + "/" + config[data].citypoints;
        this.wdc.visible = false;
        this.ylq.visible = false;
        this.bnt.visible = false;
        if (GameGlobal.CrossBattleModel.citypoint < config[data].citypoints) {
            this.wdc.visible = true;
        }
        else {
            if (GameGlobal.CrossBattleModel.cityreward.indexOf(data) != -1) {
                this.ylq.visible = true;
            }
            else {
                this.bnt.visible = true;
            }
        }
    };
    CrossBattleMJfItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBase;
        this.bnt.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    CrossBattleMJfItem.prototype._OnClick = function () {
        var data = Number(this.data);
        GameGlobal.CrossBattleModel.huoQuJiangLi(1, data);
    };
    return CrossBattleMJfItem;
}(eui.ItemRenderer));
__reflect(CrossBattleMJfItem.prototype, "CrossBattleMJfItem");
//# sourceMappingURL=CrossBattleJfView.js.map