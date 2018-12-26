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
var FuliSignBoardPnael = (function (_super) {
    __extends(FuliSignBoardPnael, _super);
    function FuliSignBoardPnael() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliSignBoardSkin";
        return _this;
    }
    FuliSignBoardPnael.prototype.childrenCreated = function () {
        this.list.itemRenderer = FuliSignBoardItem;
        this.dataPrvidre = new eui.ArrayCollection;
        var dailyId = GameGlobal.FuliModel.FuliData.dailyId;
        var itemData = {};
        itemData["type"] = 1;
        itemData["tips"] = "每日登录可领取";
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['dailyreward'];
        this.dataPrvidre.addItem(itemData);
        itemData = {};
        itemData["type"] = 2;
        itemData["tips"] = "vip" + GameGlobal.Config.WelfareBaseConfig.viplv + "\u53EF\u9886\u53D6";
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['vipreward'];
        this.dataPrvidre.addItem(itemData);
        itemData = {};
        itemData["type"] = 3;
        itemData["tips"] = '充值任意金额可领取';
        itemData["item"] = GameGlobal.Config.SignInConfig[dailyId]['rechargereward'];
        this.dataPrvidre.addItem(itemData);
    };
    FuliSignBoardPnael.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.btn, this.onClick);
        this.observe(MessageDef.FULI_GET_GIFT_SUCCEED, this.getGiftSucceed);
        this.UpdateContent();
    };
    FuliSignBoardPnael.prototype.UpdateContent = function () {
        this.list.dataProvider = this.dataPrvidre;
        this.signDayTxt.textFlow = TextFlowMaker.generateTextFlow("\u7D2F\u8BA1\u767B\u5F55|C:" + Color.Green + "&T:" + GameGlobal.FuliModel.FuliData.accDay + "|C:" + Color.White + "&T:\u5929");
        this.awardTxt.textFlow = TextFlowMaker.generateTextFlow("\u7D2F\u8BA1\u767B\u5F55|C:" + Color.Green + "&T:" + GameGlobal.FuliModel.FuliData.accDay + "|C:" + Color.White + "&T:\u5929\u5956\u52B1");
        CommonUtils.addLableStrokeColor(this.awardTxt, Color.Black, 1);
        CommonUtils.addLableStrokeColor(this.signDayTxt, Color.Black, 1);
        this.getGiftSucceed();
    };
    FuliSignBoardPnael.prototype.onClick = function () {
        GameGlobal.FuliModel.sendSignIn(4);
    };
    FuliSignBoardPnael.prototype.getGiftSucceed = function () {
        var config = GameGlobal.Config.AccSignInConfig;
        var accDay = GameGlobal.FuliModel.FuliData.accDay;
        var maxDay = 30;
        for (var key in config)
            maxDay = config[key].day;
        this.btn.touchEnabled = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << 3)) < 1;
        this.awardIcon.data = config[accDay > maxDay ? maxDay : accDay].reward[0];
        if (!this.btn.touchEnabled) {
            this.awardIcon.data = config[accDay >= maxDay ? maxDay : accDay + 1].reward[0];
            this.awardTxt.textFlow = TextFlowMaker.generateTextFlow("\u7D2F\u8BA1\u767B\u5F55|C:" + Color.Green + "&T:" + GameGlobal.FuliModel.FuliData.nextGiftDay + "|C:" + Color.White + "&T:\u5929\u5956\u52B1");
        }
        this.btn.filters = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << 3)) < 1 ? null : Color.GetFilter();
        UIHelper.ListRefresh(this.list);
    };
    FuliSignBoardPnael.CheckRedPoint = function () {
        return GameGlobal.FuliModel.mRedPoint.signShowRedPoint();
    };
    return FuliSignBoardPnael;
}(BaseView));
__reflect(FuliSignBoardPnael.prototype, "FuliSignBoardPnael");
var FuliSignBoardItem = (function (_super) {
    __extends(FuliSignBoardItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FuliSignBoardItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliSignBoardItemSkin";
        return _this;
    }
    FuliSignBoardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    FuliSignBoardItem.prototype.dataChanged = function () {
        this.tipsTxt.text = this.data.tips;
        this.list.dataProvider = new eui.ArrayCollection(this.data.item);
        this.getGiftSucceed();
    };
    FuliSignBoardItem.prototype.getGiftSucceed = function () {
        this.btn.touchEnabled = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << this.data.type - 1)) < 1;
        this.currentState = (GameGlobal.FuliModel.FuliData.rewardMark & (1 << this.data.type - 1)) < 1 ? "normal" : "get";
    };
    FuliSignBoardItem.prototype.onClick = function () {
        GameGlobal.FuliModel.sendSignIn(this.data.type);
    };
    return FuliSignBoardItem;
}(eui.ItemRenderer));
__reflect(FuliSignBoardItem.prototype, "FuliSignBoardItem");
//# sourceMappingURL=FuliSignBoardPnael.js.map