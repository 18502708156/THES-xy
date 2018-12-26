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
 * 福利_給十万元宝
 */
var FuliGiveGoldMainPanel = (function (_super) {
    __extends(FuliGiveGoldMainPanel, _super);
    function FuliGiveGoldMainPanel() {
        var _this = _super.call(this) || this;
        //BG
        // commonWindowBg:CommonWindowBg;
        //labArr
        _this.labArr = [];
        _this.skinName = "FuliGiveGoldMainSkin";
        return _this;
    }
    FuliGiveGoldMainPanel.CheckRedPoint = function () {
        return GameGlobal.FuliModel.mRedPoint.GoldShowRedPoint();
    };
    FuliGiveGoldMainPanel.prototype.childrenCreated = function () {
        this.tab = GameGlobal.Config.PresentGoldConfig;
        // this.commonWindowBg.SetTitle("送十万元宝");
        this.observe(MessageDef.FULI_GIVEGOLD_INFO, this.UpdateItemList);
        // this._AddClick(this.buyBtn,this._OnClick);
    };
    FuliGiveGoldMainPanel.prototype.OnOpen = function () {
        // this.commonWindowBg.OnAdded(this);
        this.itemList.itemRenderer = GiveGoldListItem;
        this.UpdateItemList();
    };
    FuliGiveGoldMainPanel.prototype.UpdateItemList = function () {
        var list = CommonUtils.GetArray(this.tab, "id");
        var getWeight = function (config) {
            var confId = config.id;
            if (GameGlobal.FuliModel.isReceiveGold(confId)) {
                return confId + 100000;
            }
            return confId;
        };
        list.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(list);
    };
    FuliGiveGoldMainPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
        }
    };
    FuliGiveGoldMainPanel.prototype.OnClose = function () {
        this.removeObserve();
        // this.commonWindowBg.OnRemoved();
    };
    //skinName
    //FuliGiveGoldMainSkin.exml
    FuliGiveGoldMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return FuliGiveGoldMainPanel;
}(BaseEuiView));
__reflect(FuliGiveGoldMainPanel.prototype, "FuliGiveGoldMainPanel");
var GiveGoldListItem = (function (_super) {
    __extends(GiveGoldListItem, _super);
    function GiveGoldListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GiveGoldListItem.prototype.childrenCreated = function () {
        this.receiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.msg = GameGlobal.FuliModel.FuliData;
    };
    GiveGoldListItem.prototype.dataChanged = function () {
        //登陸的天數
        var nowDay = this.msg.addDayCount;
        var data = this.data;
        this.addDayLaberl.text = "累计登陆" + data.days + "天";
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(data.item);
        //this.dayLabel.text=1+"天/"+data.days+"天";
        this.dayLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0xFE0203>" + nowDay + "天/</a>" + data.days + "天");
        data.id;
        if (nowDay >= data.days) {
            this.dayLabel.visible = false;
            //是否領取了
            //if(data.id==this.msg.recordEdIndex)//以领取
            //if(this.msg.recordEdIndex>=data.id)
            if (GameGlobal.FuliModel.isReceiveGold(data.id) == true) {
                this.receiveBtn.visible = false;
                this.itemGetImg.visible = true;
            }
            else {
                this.receiveBtn.visible = true;
                this.itemGetImg.visible = false;
            }
        }
        else {
            this.dayLabel.visible = true;
            this.receiveBtn.visible = false;
            this.itemGetImg.visible = false;
        }
    };
    GiveGoldListItem.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.receiveBtn:
                this.receiveBtn.visible = false;
                this.itemGetImg.visible = true;
                GameGlobal.FuliModel.GiveGold(this.data.id);
                break;
        }
    };
    return GiveGoldListItem;
}(eui.ItemRenderer));
__reflect(GiveGoldListItem.prototype, "GiveGoldListItem");
//# sourceMappingURL=FuliGiveGoldMainPanel.js.map