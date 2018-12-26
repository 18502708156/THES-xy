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
var YingYuanXianHuaPanel = (function (_super) {
    __extends(YingYuanXianHuaPanel, _super);
    function YingYuanXianHuaPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.num = 1;
        _this.autoBuy = 0;
        _this.freeMaxNum = 0;
        _this.buyMaxNum = 0;
        _this.skinName = "YingYuanXianHuaSkin";
        _this.list1.itemRenderer = YingyuanXianHuaItem;
        return _this;
    }
    YingYuanXianHuaPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "赠送鲜花";
        this._AddClick(this.sub1Btn, this.click);
        this._AddClick(this.add1Btn, this.click);
        this._AddClick(this.add10Btn, this.click);
        this._AddClick(this.sub10Btn, this.click);
        this._AddClick(this.buyBtn, this.click);
        this._AddClick(this.freeBuy, this.click);
        this.list1.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._OnClick, this);
        this.list1.selectedIndex = this.index;
        this.updateContent();
    };
    YingYuanXianHuaPanel.prototype.click = function (e) {
        switch (e.target) {
            case this.sub1Btn:
                this.numChange(-1, true);
                break;
            case this.add1Btn:
                this.numChange(1, true);
                break;
            case this.add10Btn:
                var num = this.freeBuy.selected ? this.freeMaxNum + this.buyMaxNum : this.freeMaxNum;
                this.numChange(num, false);
                break;
            case this.sub10Btn:
                this.numChange(1, false);
                break;
            case this.buyBtn:
                GameGlobal.YingYuanModel.marryFlower(this.index + 1, this.num, this.autoBuy);
                break;
            case this.freeBuy:
                this.autoBuy = this.freeBuy.selected ? 2 : 0;
                var n = Math.min(this.num, this.freeMaxNum);
                this.numChange(n, false);
                break;
        }
    };
    YingYuanXianHuaPanel.prototype.numChange = function (num, deltaFlag) {
        if (deltaFlag)
            num = this.num + num;
        var maxNum = this.freeBuy.selected ? this.freeMaxNum + this.buyMaxNum : this.freeMaxNum;
        this.num = Math.min(Math.max(num, 1), maxNum);
        this.upText();
    };
    YingYuanXianHuaPanel.prototype.upText = function () {
        this.numLabel.text = this.num + "";
        this.numLabel.touchChildren = false;
        this.numLabel.touchEnabled = false;
        var Config = GameGlobal.Config.FlowersConfig;
        var price = Config[this.index + 1].price;
        var priceCout = 0;
        if (this.freeBuy.selected) {
            priceCout = price.count * Math.max(this.num - this.freeMaxNum, 0);
        }
        this.totalPrice.setType(price.id);
        this.totalPrice.setPrice(priceCout);
    };
    YingYuanXianHuaPanel.prototype.updateContent = function () {
        var Config = GameGlobal.Config.FlowersConfig;
        var data = [];
        for (var num in Config) {
            data.push(Number(num));
        }
        this.otherName.text = GameGlobal.YingYuanModel.getOtherData().name;
        this.list1.dataProvider = new eui.ArrayCollection(data);
        var flowerConfig = Config[this.index + 1];
        this.item.data = flowerConfig.ID;
        this.item.setItemCount(false);
        this.item.nameTxt.text = this.item.nameTxt.text + "*" + this.getNum(flowerConfig.ID);
        this.freeMaxNum = GameGlobal.UserBag.GetCount(flowerConfig.ID);
        var curNum = GameGlobal.actorModel.GetNum(flowerConfig.price.id);
        this.buyMaxNum = Math.floor(curNum / flowerConfig.price.count);
        this.num = this.freeMaxNum;
        this.upText();
    };
    YingYuanXianHuaPanel.prototype.getNum = function (id) {
        var data = GameGlobal.UserBag.getBagItemById(id);
        if (!data) {
            return 0;
        }
        return data.count;
    };
    YingYuanXianHuaPanel.prototype._OnClick = function (e) {
        this.index = this.list1.selectedIndex;
        this.updateContent();
    };
    YingYuanXianHuaPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    YingYuanXianHuaPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return YingYuanXianHuaPanel;
}(BaseEuiView));
__reflect(YingYuanXianHuaPanel.prototype, "YingYuanXianHuaPanel", ["ICommonWindow"]);
var YingyuanXianHuaItem = (function (_super) {
    __extends(YingyuanXianHuaItem, _super);
    function YingyuanXianHuaItem() {
        return _super.call(this) || this;
    }
    YingyuanXianHuaItem.prototype.childrenCreated = function () {
    };
    YingyuanXianHuaItem.prototype.dataChanged = function () {
        var data = this.data;
        var Config = GameGlobal.Config.FlowersConfig;
        this.item1.touchEnabled = false;
        this.item1.touchChildren = false;
        this.item1.setDataByConfig(GlobalConfig.ins().ItemConfig[Config[data].ID]);
        this.item1.setItemCount(false);
        this.num.text = "数量：" + this.getNum(Config[data].ID);
        this.num.textColor = this.item1.getTextColor();
    };
    YingyuanXianHuaItem.prototype.getNum = function (id) {
        var data = GameGlobal.UserBag.getBagItemById(id);
        if (!data) {
            return 0;
        }
        return data.count;
    };
    return YingyuanXianHuaItem;
}(eui.ItemRenderer));
__reflect(YingyuanXianHuaItem.prototype, "YingyuanXianHuaItem");
//# sourceMappingURL=YingYuanXianHuaPanel.js.map