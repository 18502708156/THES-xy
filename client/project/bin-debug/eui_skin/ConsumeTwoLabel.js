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
var ConsumeTwoLabel = (function (_super) {
    __extends(ConsumeTwoLabel, _super);
    function ConsumeTwoLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    ConsumeTwoLabel.prototype.Set = function (datas) {
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            this.Data(data);
        }
    };
    ConsumeTwoLabel.prototype.childrenCreated = function () {
        this.typeImg.addEventListener(egret.Event.COMPLETE, this._Complete, this);
    };
    ConsumeTwoLabel.prototype._Complete = function () {
        UIHelper.SetRatio(this.typeImg, 44, 44);
    };
    ConsumeTwoLabel.prototype.Data = function (data) {
        if (data.type == 1) {
            this.typeImg.source = RewardData.GetCurrencyMiniRes(data.id);
            this.priceLabel.textFlow = ConsumeLabel.GetValueColor(GameGlobal.UserBag.GetCount(data.id), data.count);
        }
        else {
            this.priceicon.type = data.id;
            this.priceicon.price = data.count;
        }
    };
    return ConsumeTwoLabel;
}(eui.Component));
__reflect(ConsumeTwoLabel.prototype, "ConsumeTwoLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ConsumeTwoLabel.js.map