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
/**
 *
 */
var BriberyBasePanel = (function (_super) {
    __extends(BriberyBasePanel, _super);
    function BriberyBasePanel() {
        var _this = _super.call(this) || this;
        _this.count = 0;
        // private itemArr = [];
        _this.itemDic = {};
        _this.key = 0;
        _this.is = true;
        _this.dic = {};
        _this.skinName = "briberyBaseSkin";
        return _this;
    }
    BriberyBasePanel.prototype.childrenCreated = function () {
        this.data = GameGlobal.FuliModel.FuliData;
        this.bonusBaseConfigTab = GameGlobal.Config.BonusBaseConfig;
    };
    BriberyBasePanel.prototype.showItem = function () {
        this.key = this.data.briberyID;
        this.itemDic[this.key] = this.data.endtime;
        this.item();
    };
    BriberyBasePanel.prototype.item = function () {
        var _this = this;
        this.is = false;
        var b = false;
        // if(this.count<5)
        // {
        var img = new BriberyItem;
        img.y = -149;
        img.x = Math.floor(Math.random() * 585);
        this.addChild(img);
        img.visible = true;
        img.itemDic = this.itemDic;
        img.key = this.key;
        this.dic[img.key] = img;
        img.x = Math.floor(Math.random() * 585);
        img.y = -149;
        var item = img;
        var lostTime = item.itemDic[img.key] - GameServer.serverTime - this.bonusBaseConfigTab.falltime;
        egret.Tween.get(item).to({ x: Math.floor(Math.random() * 585), y: 1131 }, this.bonusBaseConfigTab.falltime * 1000, egret.Ease.sineOut).
            wait(lostTime * 1000).call(function () {
            if (item.itemDic[img.key] - GameServer.serverTime < 2) {
                if (_this.dic[img.key] != undefined) {
                    _this.dic[img.key].visible = false;
                }
            }
            if (item.parent != null)
                item.parent.removeChild(item);
            for (var key in _this.dic) {
                if (_this.dic[key].visible)
                    b = true;
                else
                    b = false;
            }
            if (b == false)
                ViewManager.ins().close(BriberyBasePanel);
        }, this);
        // }
        // if(this.count<this.bonusBaseConfigTab.maxlimit)
        // this.count++;
        // else
        // 	this.count=0;
    };
    BriberyBasePanel.prototype.Fun = function () {
    };
    BriberyBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.FULI_GET_HAVEBRIBERY, this.showItem);
        // let count = this.bonusBaseConfigTab.maxlimit;
        // for (let i = 0; i < 10; i++) {
        // 	let img = new BriberyItem;
        // 	this.itemArr.push(img);
        // 	//this.itemArr[i].source = "ui_hb_bm_hongbao0";
        // 	this.itemArr[i].y = -149;
        // 	this.itemArr[i].x = Math.floor(Math.random() * 585);
        // 	this.addChild(this.itemArr[i]);
        // }
        if (this.is == false)
            this.showItem();
    };
    BriberyBasePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return BriberyBasePanel;
}(BaseEuiView));
__reflect(BriberyBasePanel.prototype, "BriberyBasePanel");
var BriberyItem = (function (_super) {
    __extends(BriberyItem, _super);
    function BriberyItem() {
        var _this = _super.call(this) || this;
        _this.itemDic = {};
        _this.key = 0;
        _this.skinName = "briberyItem";
        return _this;
    }
    BriberyItem.prototype.childrenCreated = function () {
        this.img.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.itemDic = {};
        this.key = 0;
    };
    BriberyItem.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.img:
                ViewManager.ins().open(BriberyPanel, this.itemDic, this.key, this);
                break;
        }
        ;
    };
    return BriberyItem;
}(eui.Component));
__reflect(BriberyItem.prototype, "BriberyItem");
//# sourceMappingURL=BriberyBasePanel.js.map