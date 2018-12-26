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
var FuliLvGiftBagPanel = (function (_super) {
    __extends(FuliLvGiftBagPanel, _super);
    function FuliLvGiftBagPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliLvGiftBagSkin";
        _this.list.itemRenderer = FuliliLvGiftBagItem;
        return _this;
    }
    FuliLvGiftBagPanel.CheckRedPoint = function () {
        return GameGlobal.FuliModel.mRedPoint.lvShowRedPoint();
    };
    FuliLvGiftBagPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.UpdateContent);
        this.observe(MessageDef.LEVEL_CHANGE, this.UpdateList);
        this.UpdateContent();
        var config = GameGlobal.Config.LvRewardConfig;
        for (var _a = 0, config_1 = config; _a < config_1.length; _a++) {
            var val = config_1[_a];
            if (GameGlobal.actorModel.level < val.level) {
                this.giftLv = val.level;
                break;
            }
        }
    };
    FuliLvGiftBagPanel.prototype.UpdateContent = function () {
        var tail = [];
        var head = [];
        for (var key in GameGlobal.Config.LvRewardConfig) {
            var itemData = {};
            itemData = GameGlobal.Config.LvRewardConfig[key];
            itemData["tips"] = GameGlobal.Config.LvRewardConfig[key].level + "\u7EA7\u793C\u5305";
            if (BitUtil.Has(GameGlobal.FuliModel.FuliData.lvMark, itemData["id"]))
                tail.push(itemData);
            else
                head.push(itemData);
        }
        SortTools.sortMap(tail, "level", false);
        SortTools.sortMap(head, "level");
        this.list.dataProvider = new eui.ArrayCollection(head.concat(tail));
        this.UpdateList();
    };
    FuliLvGiftBagPanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    return FuliLvGiftBagPanel;
}(BaseView));
__reflect(FuliLvGiftBagPanel.prototype, "FuliLvGiftBagPanel");
var FuliliLvGiftBagItem = (function (_super) {
    __extends(FuliliLvGiftBagItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FuliliLvGiftBagItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliSignBoardItemSkin";
        return _this;
    }
    FuliliLvGiftBagItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    FuliliLvGiftBagItem.prototype.dataChanged = function () {
        this.tipsTxt.text = this.data.tips;
        this.list.dataProvider = new eui.ArrayCollection(this.data.reward);
        this.getGiftSucceed();
    };
    FuliliLvGiftBagItem.prototype.getGiftSucceed = function () {
        this.currentState = GameGlobal.actorModel.level >= this.data.level ? (GameGlobal.FuliModel.FuliData.lvMark & 1 << this.data.id) < 1 ? "normal" : "get" : "maylv";
        this.maylvTxt.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.actorModel.level + "\u7EA7 / |C: " + Color.l_brown_2 + "&T:" + this.data.level + "\u7EA7");
    };
    FuliliLvGiftBagItem.prototype.onClick = function () {
        GameGlobal.FuliModel.sendLvGiftBag(this.data.id);
    };
    return FuliliLvGiftBagItem;
}(eui.ItemRenderer));
__reflect(FuliliLvGiftBagItem.prototype, "FuliliLvGiftBagItem");
//# sourceMappingURL=FuliLvGiftBagPanel.js.map