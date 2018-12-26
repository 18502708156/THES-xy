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
var BagAddItemWarn = (function (_super) {
    __extends(BagAddItemWarn, _super);
    function BagAddItemWarn() {
        var _this = _super.call(this) || this;
        _this.onTap = function (e) {
            switch (e.currentTarget) {
                case this.decBtn:
                    this.setCount(Number(this.count.text) - 5);
                    break;
                case this.addBtn:
                    this.setCount(Number(this.count.text) + 5);
                    break;
                case this.sureBtn:
                    if (GameLogic.ins().actorModel.yb < this.price.price) {
                        UserTips.ins().showTips("|C:0xff0000&T:元宝不足|");
                        break;
                    }
                    UserBag.ins().sendAddBagGrid(Number(this.count.text) / 5);
                case this.cancelBtn:
                    // case this.closeBtn:
                    ViewManager.ins().close(BagAddItemWarn);
            }
        };
        return _this;
    }
    BagAddItemWarn.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.skinName = "OpenCellSkin";
        this.price.setType(MoneyConst.yuanbao);
    };
    BagAddItemWarn.prototype.OnOpen = function () {
        this.AddClick(this.decBtn, this.onTap);
        this.AddClick(this.addBtn, this.onTap);
        this.AddClick(this.sureBtn, this.onTap);
        this.AddClick(this.cancelBtn, this.onTap);
        // this.addTouchEvent(this, this.onTap, this.closeBtn);
        this.commonDialog.OnAdded(this);
        this.commonDialog.setBgVisible(true);
        this.setCount(5);
    };
    BagAddItemWarn.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeEvents();
    };
    BagAddItemWarn.prototype.setCount = function (addNum) {
        var bagBaseConfig = GlobalConfig.ins().BagBaseConfig;
        var bagExpandConfig = GlobalConfig.ins().BagExpandConfig;
        var configLength = CommonUtils.getObjectLength(bagExpandConfig);
        var size = (UserBag.ins().bagNum - bagBaseConfig.baseSize) / bagBaseConfig.rowSize;
        var n = (configLength - size) * bagBaseConfig.rowSize;
        if (5 > addNum) {
            (addNum = 5, UserTips.ins().showTips("|C:0xff0000&T:已经是最小扩张数|"));
        }
        else if (addNum > n) {
            addNum = n;
            UserTips.ins().showTips("|C:0xff0000&T:已经是最大扩张数|");
        }
        this.count.text = "" + addNum;
        for (var s = 0, a = addNum / bagBaseConfig.rowSize, l = 1; a >= l; l++)
            s += bagExpandConfig[size + l].cost;
        this.price.setPrice(s);
    };
    return BagAddItemWarn;
}(BaseEuiView));
__reflect(BagAddItemWarn.prototype, "BagAddItemWarn");
BagAddItemWarn.LAYER_LEVEL = LayerManager.UI_Popup;
//# sourceMappingURL=BagAddItemWarn.js.map