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
var CaiLiaoFbPanel = (function (_super) {
    __extends(CaiLiaoFbPanel, _super);
    function CaiLiaoFbPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "CaiLiaoFBSkin";
        //this.itemScroller.viewport = this.itemList;
        _this.itemList.itemRenderer = CaiLiaoFBItem;
        _this.itemList.dataProvider = new eui.ArrayCollection([]);
        return _this;
    }
    // 引导对象
    CaiLiaoFbPanel.prototype.GetGuideTarget = function () {
        this.itemList.validateNow();
        return _a = {},
            _a[1] = this.itemList.getElementAt(0) ? this.itemList.getElementAt(0).saodangBtn : null,
            _a;
        var _a;
    };
    CaiLiaoFbPanel.prototype.UpdateContent = function () {
        var fbObj = GameGlobal.UserFb.fbModel;
        var fbArr = [];
        for (var obj in fbObj) {
            fbArr.push(fbObj[obj]);
            var config = GlobalConfig.ins().DailyFubenConfig;
            if (GameLogic.ins().actorModel.level < config[fbObj[obj].fbID].levelLimit) {
                break;
            }
        }
        ;
        this.itemList.dataProvider.replaceAll(fbArr);
    };
    CaiLiaoFbPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FB_INFO_UPDATE, this.UpdateContent);
        this.UpdateContent();
        this.AddClick(this.cailiaoShop, this.onTap);
    };
    CaiLiaoFbPanel.prototype.OnClose = function () {
        this.removeObserve();
        this.removeEvents();
    };
    CaiLiaoFbPanel.prototype.onTap = function () {
        ViewManager.ins().open(ShopLayer, [ShopController.EN_SHOP_CAILIAO]);
    };
    CaiLiaoFbPanel.NAME = "材料副本";
    return CaiLiaoFbPanel;
}(BaseView));
__reflect(CaiLiaoFbPanel.prototype, "CaiLiaoFbPanel", ["ICommonWindowTitle"]);
var CaiLiaoFBItem = (function (_super) {
    __extends(CaiLiaoFBItem, _super);
    function CaiLiaoFBItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "CaiLiaoItemSkin";
        _this.itemList.itemRenderer = ItemBaseNotName;
        _this.saodangBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTap, _this);
        return _this;
    }
    CaiLiaoFBItem.prototype.onTap = function (e) {
        if (!UserFb.FinishAndCheckFighting()) {
        }
        else {
            var config = GlobalConfig.ins().DailyFubenConfig[this.data.fbID];
            var maxExSwap = config.vipBuyCount[GameLogic.ins().actorModel.vipLv];
            //可以直接挑战的时候
            if (this.data.useCount < config.freeCount) {
                GameGlobal.UserFb.sendfbJoin(1, this.data.fbID);
                return;
            }
            if (this.data.vipBuyCount < maxExSwap) {
                if (GameLogic.ins().actorModel.yb >= config.buyPrice[maxExSwap]) {
                    GameGlobal.UserFb.sendfbJoin(1, this.data.fbID);
                }
                else {
                    UserTips.ins().showTips("元宝不足");
                }
            }
            else {
                var nNextVip = CommonUtils.getObjectLength(config.vipBuyCount) - 1 + "";
                var nNextTime = 0;
                //下级vip以及级次数
                for (var item in config.vipBuyCount) {
                    var time = config.vipBuyCount[item];
                    if (time > (this.data.useCount - config.freeCount)) {
                        nNextVip = item;
                        nNextTime = time - this.data.useCount + config.freeCount;
                        break;
                    }
                }
                UserTips.ins().showTips("VIP" + nNextVip + "可再扫荡" + nNextTime + "次");
            }
        }
    };
    CaiLiaoFBItem.prototype.dataChanged = function () {
        var data = this.data;
        var config = GlobalConfig.ins().DailyFubenConfig;
        this.titleName.text = config[data.fbID].uititle;
        this.itemList.dataProvider = new eui.ArrayCollection(config[data.fbID].showItem);
        if (GameLogic.ins().actorModel.level < config[data.fbID].levelLimit) {
            this.group1.visible = false;
            this.tipsTxt2.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T: \u89D2\u8272\u7B49\u7EA7|C:0x4fcd4c&T:" + config[data.fbID].levelLimit + "|C:0x6E330B&T:\u7EA7\u5F00\u542F|");
            this.tipsTxt2.visible = true;
        }
        else {
            this.group1.visible = true;
            this.tipsTxt2.visible = false;
            var nNextVip = CommonUtils.getObjectLength(config[data.fbID].vipBuyCount) - 1 + "";
            var nNextTime = 0;
            //下级vip以及级次数
            for (var item in config[data.fbID].vipBuyCount) {
                var time = config[data.fbID].vipBuyCount[item];
                if (time > (data.useCount - config[data.fbID].freeCount)) {
                    nNextVip = item;
                    nNextTime = time - data.useCount + config[data.fbID].freeCount;
                    break;
                }
            }
            if (config[data.fbID].needsuccess > data.totalCount) {
                if (data.useCount >= config[data.fbID].freeCount) {
                    this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T: VIP|C:0x6E330B&T:" + nNextVip + "|C:0x6E330B&T: \u53EF\u518D\u626B\u8361|C:0x4fcd4c&T:" + nNextTime + "|C:0x6E330B&T: \u6B21|");
                    this.saodangBtn.labelDisplay.text = "扫荡";
                    this.redPoint.visible = false;
                    this.moneyTxt.visible = true;
                    this.moneyTxt.text = config[data.fbID].buyPrice[data.vipBuyCount];
                }
                else {
                    this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T: \u4ECA\u65E5\u53EF\u6311\u6218\u6B21\u6570\uFF1A|C:0x4fcd4c&T:" + (config[data.fbID].freeCount) + "|");
                    this.saodangBtn.labelDisplay.text = "挑战";
                    this.redPoint.visible = true;
                    this.moneyTxt.visible = false;
                }
            }
            else {
                if (data.useCount >= config[data.fbID].freeCount) {
                    this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T: VIP|C:0x6E330B&T:" + nNextVip + "|C:0x6E330B&T: \u53EF\u518D\u626B\u8361|C:0x4fcd4c&T:" + nNextTime + "|C:0x6E330B&T: \u6B21|");
                    this.saodangBtn.labelDisplay.text = "扫荡";
                    this.redPoint.visible = false;
                    this.moneyTxt.visible = true;
                    this.moneyTxt.text = config[data.fbID].buyPrice[data.vipBuyCount];
                }
                else {
                    this.tipstxt1.textFlow = TextFlowMaker.generateTextFlow("|C:0x6E330B&T:\u4ECA\u65E5\u53EF\u626B\u8361\u6B21\u6570\uFF1A|C:0x4fcd4c&T:" + config[data.fbID].freeCount + "|");
                    this.saodangBtn.labelDisplay.text = "免费扫荡";
                    this.redPoint.visible = true;
                    this.moneyTxt.visible = false;
                }
            }
            if (!this.bGray()) {
                this.saodangBtn.filters = Color.GetFilter(); //变灰
            }
            else {
                this.saodangBtn.filters = null;
            }
        }
    };
    CaiLiaoFBItem.prototype.bGray = function () {
        var bCan = false;
        var config = GlobalConfig.ins().DailyFubenConfig[this.data.fbID];
        var maxExSwap = config.vipBuyCount[GameLogic.ins().actorModel.vipLv];
        if (this.data.vipBuyCount < maxExSwap) {
            bCan = true;
        }
        return bCan;
    };
    return CaiLiaoFBItem;
}(eui.ItemRenderer));
__reflect(CaiLiaoFBItem.prototype, "CaiLiaoFBItem");
//# sourceMappingURL=CaiLiaoFbPanel.js.map