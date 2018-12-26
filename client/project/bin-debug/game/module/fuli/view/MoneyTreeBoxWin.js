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
var MoneyTreeBoxWin = (function (_super) {
    __extends(MoneyTreeBoxWin, _super);
    function MoneyTreeBoxWin() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        return _this;
    }
    MoneyTreeBoxWin.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "MoneyTreeBoxSkin";
        this.list.itemRenderer = ItemBase;
    };
    MoneyTreeBoxWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.AddClick(this.sure, this.onTap);
        this.index = param[0];
        var data = MoneyTreeModel.ins().getBoxInfoByIndex(this.index);
        this.desc.text = "今日使用聚宝盆" + data.time + "次，可额外获得：";
        this.creatRewardList(data.box);
        this.list.dataProvider = new eui.ArrayCollection(this.dataList);
        this.sure.label = "领取";
        this.sure.enabled = false;
        if (MoneyTreeModel.ins().playNum >= data.time) {
            if (MoneyTreeModel.ins().getOrderByIndex(this.index - 1) == 0) {
                this.sure.enabled = true;
            }
            else {
                this.sure.label = "已领取";
            }
        }
    };
    MoneyTreeBoxWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    MoneyTreeBoxWin.prototype.creatRewardList = function (e) {
        for (var t, i = 0; 3 > i; i++)
            this.dataList[i] ? t = this.dataList[i] : (t = new RewardData, t.type = 0, t.id = 1, this.dataList.push(t)), t.count = e[i];
    };
    MoneyTreeBoxWin.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.sure:
                MoneyTreeModel.ins().sendGetCaseReward(this.index);
                ViewManager.ins().close(MoneyTreeBoxWin);
        }
    };
    MoneyTreeBoxWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return MoneyTreeBoxWin;
}(BaseEuiView));
__reflect(MoneyTreeBoxWin.prototype, "MoneyTreeBoxWin");
//# sourceMappingURL=MoneyTreeBoxWin.js.map