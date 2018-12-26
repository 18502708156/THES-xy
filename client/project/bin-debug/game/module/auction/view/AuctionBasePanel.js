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
var AuctionBasePanel = (function (_super) {
    __extends(AuctionBasePanel, _super);
    function AuctionBasePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        /**显示品质拍卖品 */
        _this.quality = 0;
        _this.curPage = 1;
        _this.skinName = 'AuctionPanelSkin';
        return _this;
    }
    AuctionBasePanel.prototype.childrenCreated = function () {
        UIHelper.SetLinkStyleLabel(this.recordTxt, '成交记录');
        this.auctionList.itemRenderer = AuctionItem;
        this.dataProvider = new eui.ArrayCollection([]);
        this.auctionList.dataProvider = this.dataProvider;
        this.qualityGroup.visible = false;
        this.pageBtn.setPage(1);
        this.recoverTouchPos();
    };
    AuctionBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.helpBtn, this.onClick);
        this.AddClick(this.selectGroup, this.onClick);
        this.AddClick(this.qualityGroup, this.onClick);
        this.AddClick(this.recordTxt, this.onClick);
        this.AddClick(this.ratioTxt, this.onClick);
        this.scroller.addEventListener(egret.Event.CHANGE, this.OnRefresh, this);
        this.observe(MessageDef.PAGE_BUTTON_UPDATE, this.pageChangeFun);
        this.observe(MessageDef.AUCTION_LIST_UPDATE, this.updateQuality);
        GameGlobal.AuctionModel.sendAuctionList(AuctionBasePanel.aucType);
    };
    /**回调当前页码 */
    AuctionBasePanel.prototype.pageChangeFun = function (page) {
        this.curPage = page;
        this.SetPos((page - 1) * (this.scroller.height - 20));
    };
    AuctionBasePanel.prototype.SetPos = function (pos) {
        var touch = this.scroller.$Scroller[9];
        touch.maxScrollPos = this.auctionList.contentHeight;
        touch.throwTo(pos);
    };
    AuctionBasePanel.prototype.recoverTouchPos = function () {
        var touch = this.scroller.$Scroller[9];
        touch.maxScrollPos = this.auctionList.contentHeight;
        touch.currentScrollPos = 0;
    };
    AuctionBasePanel.prototype.OnRefresh = function () {
        var sv = this.auctionList.scrollV;
        this.pageBtn.setPage(Math.ceil(1 + sv / this.scroller.height));
    };
    AuctionBasePanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.quality0Txt:
            case this.quality2Txt:
            case this.quality3Txt:
            case this.quality4Txt:
            case this.quality5Txt:
            case this.quality6Txt:
                this.qualityGroup.visible = false;
                //更新排序
                this.quality = parseInt(e.target.name);
                this.updateQuality();
                break;
        }
        switch (e.currentTarget) {
            case this.selectGroup:
                this.qualityGroup.visible = !this.qualityGroup.visible;
                break;
            case this.qualityGroup:
                this.qualityGroup.visible = false;
                break;
            case this.recordTxt:
                ViewManager.ins().open(AuctionRecordPanel, AuctionBasePanel.aucType);
                break;
            case this.helpBtn:
                ViewManager.ins().open(ActivityDescPanel, 29, '拍卖说明');
                break;
            case this.ratioTxt:
                GameGlobal.AuctionModel.showRatioPanel();
                break;
        }
    };
    AuctionBasePanel.prototype.updateQuality = function () {
        this.ratioTxt.textFlow = (new egret.HtmlTextParser).parser('<a href=\"event:\"><u>我的拍卖额度：' + GameGlobal.AuctionModel.getRemainRatio() + '</u></a>');
        this.selectTxt.text = this['quality' + this.quality + 'Txt'].text;
        this.selectTxt.textColor = this['quality' + this.quality + 'Txt'].textColor;
        var list = GameGlobal.AuctionModel.auctionLists[AuctionBasePanel.aucType];
        var infos = [];
        if (list) {
            infos = list.slice();
        }
        var lists = 0 == this.quality ? infos : [];
        if (0 != this.quality) {
            if (6 == this.quality) {
                for (var i = 0; i < infos.length; i++) {
                    if (infos[i].offername == GameGlobal.actorModel.name) {
                        lists.push(infos[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < infos.length; i++) {
                    var config = GameGlobal.Config.ItemConfig[infos[i].itemid];
                    if (config && config.quality == this.quality) {
                        lists.push(infos[i]);
                    }
                }
            }
        }
        var len = lists.length;
        this.tipTxt.visible = len == 0;
        this.conGroup.visible = len > 0;
        var maxPage = Math.ceil(len / 4) >> 0;
        this.pageBtn.setMax(maxPage);
        if (this.curPage > maxPage) {
            this.pageChangeFun(maxPage);
        }
        this.dataProvider.replaceAll(lists);
        this.auctionList.dataProvider = this.dataProvider;
        if (len > 0 && !TimerManager.ins().isExists(this.updateTime, this)) {
            this.AddTimer(1000, 0, this.updateTime);
        }
    };
    AuctionBasePanel.prototype.updateTime = function () {
        var parma = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            parma[_i] = arguments[_i];
        }
        var i = 0;
        var len = this.auctionList.numChildren;
        var item;
        for (i = 0; i < len; i++) {
            item = this.auctionList.getChildAt(i);
            item.updateTime();
        }
    };
    AuctionBasePanel.prototype.UpdateContent = function () { };
    AuctionBasePanel.prototype.OnClose = function () {
        TimerManager.ins().remove(this.updateTime, this);
    };
    /**0全服， 1帮会 */
    AuctionBasePanel.aucType = 0;
    return AuctionBasePanel;
}(BaseView));
__reflect(AuctionBasePanel.prototype, "AuctionBasePanel", ["ICommonWindowTitle"]);
var AuctionItem = (function (_super) {
    __extends(AuctionItem, _super);
    function AuctionItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /////////////////////////////////////////////////////////////////////////////
        /**一口价 */
        _this._price = 0;
        /**竞价 */
        _this._offerprice = 0;
        /**数量 */
        _this._count = 1;
        _this.isMySelf = false;
        _this.isPost = false;
        return _this;
    }
    AuctionItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.selfImg.visible = false;
        this.linkTxt.visible = false;
        UIHelper.SetLinkStyleLabel(this.linkTxt, '可激活');
        this.priceBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.offerBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.linkTxt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    };
    AuctionItem.prototype.onClick = function (e) {
        var _this = this;
        if (e.target == this.priceBtn) {
            if (GameGlobal.AuctionModel.getRemainRatio() - this._price <= 0) {
                GameGlobal.AuctionModel.showAlert();
                return;
            }
            WarnWin.show('是否花费 ' + this._price + '元宝 立即拍下物品', function () {
                GameGlobal.AuctionModel.sendAuctionBuy(_this.data.id, AuctionBasePanel.aucType);
            }, this);
        }
        else if (e.target == this.offerBtn) {
            if (this.isMySelf) {
                GameGlobal.UserTips.showTips('您已出价，不需要重复出价');
                return;
            }
            if (GameGlobal.AuctionModel.getRemainRatio() - this._offerprice <= 0) {
                GameGlobal.AuctionModel.showAlert();
                return;
            }
            WarnWin.show('是否花费 ' + this._offerprice + '元宝 参与竞价', function () {
                GameGlobal.AuctionModel.sendAuctionOffer(_this.data.id, AuctionBasePanel.aucType);
            }, this);
        }
        else {
        }
    };
    AuctionItem.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (!this.data)
            return;
        this.isPost = false;
        var info = this.data;
        this.selfImg.visible = GameGlobal.actorModel.name == info.playername;
        this.itemIcon.num = info.count;
        this.itemIcon.data = info.itemid;
        this._count = info.count;
        this.isMySelf = GameGlobal.actorModel.name == info.offername;
        this.playNameTxt.text = this.isMySelf ? '我的竞价' : info.offername;
        var hasOffer = info.HasOffer();
        this.priceicon.type = MoneyConst.yuanbao;
        this.priceicon.price = info.price * this._count;
        this.priceicon0.type = info.numerictype;
        this.priceicon0.price = info.dealprice * this._count;
        this._price = info.dealprice * this._count;
        this.priceicon1.type = info.numerictype;
        if (hasOffer) {
            this._offerprice = (info.addprice + info.price) * this._count;
        }
        else {
            this._offerprice = (info.price) * this._count;
        }
        this.priceicon1.price = this._offerprice;
        this.descTxt.textFlow = TextFlowMaker.generateTextFlow(GameGlobal.AuctionModel.getDescByStatus(info.status));
        this.updateTime();
    };
    AuctionItem.prototype.updateTime = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var cd = GameServer.serverTime - this.data.createtime;
        this.timeTxt.textFlow = TextFlowMaker.generateTextFlow(this.getTimeByStatus(this.data.status, cd));
    };
    /**1公示 2竞拍 3抢拍 4成交 5流拍 */
    AuctionItem.prototype.getTimeByStatus = function (status, cd) {
        var str = '已结束';
        var time = 0;
        var color = Color.Blue;
        switch (status) {
            case 1:
                time = GameGlobal.AuctionModel.getBaseConfig().showtime;
                color = Color.Blue;
                break;
            case 2:
                time = GameGlobal.AuctionModel.getBaseConfig().showtime + GameGlobal.AuctionModel.getBaseConfig().auctiontime;
                color = 0x019704;
                break;
            case 3:
                time = GameGlobal.AuctionModel.getBaseConfig().showtime + GameGlobal.AuctionModel.getBaseConfig().auctiontime + GameGlobal.AuctionModel.getBaseConfig().robtime;
                color = Color.Red;
                break;
        }
        if (status <= 3) {
            str = '|C:' + color + '&T:' + DateUtils.format_1((time - cd) * 1000) + '后结束|';
            if (time - cd <= 0) {
                if (!this.isPost) {
                    GameGlobal.AuctionModel.sendAuctionUpdate(this.data.id, AuctionBasePanel.aucType);
                    this.isPost = true;
                }
            }
        }
        return str;
    };
    return AuctionItem;
}(eui.ItemRenderer));
__reflect(AuctionItem.prototype, "AuctionItem");
//# sourceMappingURL=AuctionBasePanel.js.map