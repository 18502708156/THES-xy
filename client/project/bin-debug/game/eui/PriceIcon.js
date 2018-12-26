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
var PriceIcon = (function (_super) {
    __extends(PriceIcon, _super);
    function PriceIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PriceIcon.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this._labelColor) {
            this.priceLabel.textColor = this._labelColor;
        }
        this.iconImg.addEventListener(egret.Event.COMPLETE, this._Complete, this);
    };
    PriceIcon.prototype._Complete = function () {
        UIHelper.SetRatio(this.iconImg, 44, 44);
    };
    /**
     * 价格
     */
    PriceIcon.prototype.getPrice = function () {
        return this._price;
    };
    Object.defineProperty(PriceIcon.prototype, "price", {
        get: function () {
            return this._price;
        },
        set: function (value) {
            this.setPrice(value);
        },
        enumerable: true,
        configurable: true
    });
    PriceIcon.prototype.setPrice = function (value, style) {
        if (style === void 0) { style = 0; }
        // if (value == this._price)
        // 	return;
        this._price = value;
        // egret.callLater(this.setText,this,this.getTxtStr(style))
        this.setText(this.getTxtStr(style));
    };
    ;
    PriceIcon.prototype.setColor = function (color) {
        this.priceLabel.textColor = color;
    };
    PriceIcon.prototype.setPriceData = function (type, value) {
        this.setType(type);
        this.setPrice(value, 3);
    };
    PriceIcon.prototype.setMyCount = function (value) {
        if (value == this._myCount)
            return;
        this._myCount = value;
        // egret.callLater(this.setText,this,this.getTxtStr())
        this.setText(this.getTxtStr());
    };
    ;
    PriceIcon.prototype.setEnoughCount = function (value) {
        if (value == this._myCount)
            return;
        this._myCount = value;
        this.setText(this.getTextEnough());
    };
    PriceIcon.prototype.getTxtStr = function (style) {
        if (style === void 0) { style = 0; }
        if (this._myCount != undefined) {
            if (this._myCount >= this._price) {
                return "|C:0x019704&T:" + this._myCount + "|/" + this._price;
            }
            else {
                return "|C:0xff0000&T:" + this._myCount + "|/" + this._price;
            }
        }
        else {
            if (style == 1)
                return "|C:0xff00&T:" + this._price + "|";
            else if (style == 2)
                return this._price > 1000000 ? "|C:0xff00&T:" + this._price / 10000 + '万' + "|" : "|C:0xff00&T:" + this._price + "|";
            else if (style == 3) {
                var curNum = void 0;
                if (GameGlobal.actorModel.IsCurrency(this._type))
                    curNum = GameGlobal.actorModel.GetNum(this._type);
                else
                    curNum = GameGlobal.UserBag.GetCount(this._type);
                return curNum >= this._price ? "|C:0x019704&T:" + curNum + "|/" + this._price : "|C:0xfd0000&T:" + curNum + "|/" + this._price;
            }
            else
                return "" + this._price;
        }
    };
    PriceIcon.prototype.getTextEnough = function (style) {
        if (style === void 0) { style = 0; }
        if (this._myCount != undefined) {
            if (this._myCount >= this._price) {
                return "|C:0x019704&T:" + this._price + "|";
            }
            else {
                return "|C:0xff0000&T:" + this._price + "|";
            }
        }
        else {
            return style > 0 ? "|C:0xff00&T:" + this._price + "|" : "";
        }
    };
    PriceIcon.prototype.isEnough = function () {
        if (this._myCount && this._myCount >= this._price) {
            return true;
        }
        return false;
    };
    Object.defineProperty(PriceIcon.prototype, "text", {
        set: function (str) {
            this.setText(str);
        },
        enumerable: true,
        configurable: true
    });
    PriceIcon.prototype.setText = function (str) {
        str += "";
        this.priceLabel.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    PriceIcon.prototype.setData = function (data) {
        var id;
        if (egret.is(data, "RewardData")) {
            var awards = data;
            this._type = awards.id;
            this.setPrice(awards.count);
            this.setMyCount(awards.myCount);
        }
        else if (data) {
            var itemData = data;
            this._type = itemData.itemConfig.id;
            this.setPrice(itemData.count);
        }
        this.iconImg.source = RewardData.GetCurrencyMiniRes(this._type);
    };
    ;
    PriceIcon.prototype.setConfigData = function (data) {
        if (data && data.id && data.count) {
            this.setType(data.id);
            this.setPrice(data.count);
        }
    };
    Object.defineProperty(PriceIcon.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this.setType(value);
        },
        enumerable: true,
        configurable: true
    });
    PriceIcon.prototype.getType = function () {
        return this._type;
    };
    ;
    PriceIcon.prototype.setType = function (value) {
        if (this._type == value)
            return;
        this._type = value;
        var str = PriceIcon.GetResIcon(this._type);
        this.iconImg.source = str;
    };
    ;
    Object.defineProperty(PriceIcon.prototype, "labelColor", {
        get: function () {
            return this._labelColor;
        },
        set: function (value) {
            if (this._labelColor != value) {
                this._labelColor = value;
                if (this.priceLabel)
                    this.priceLabel.textColor = this._labelColor;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PriceIcon.prototype, "typeName", {
        get: function () {
            return MoneyConstToName[this._type] || "";
        },
        enumerable: true,
        configurable: true
    });
    PriceIcon.GetResIcon = function (_type) {
        return RewardData.GetCurrencyMiniRes(_type);
    };
    PriceIcon.ICON_INTEGRATION = "mall_res_002";
    return PriceIcon;
}(BaseView));
__reflect(PriceIcon.prototype, "PriceIcon");
//# sourceMappingURL=PriceIcon.js.map