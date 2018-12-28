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
var ConsumeLabel = (function (_super) {
    __extends(ConsumeLabel, _super);
    function ConsumeLabel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mIsImg = false;
        _this.m_IsMaxTip = null;
        _this.m_overLengthFlag = false;
        return _this;
    }
    ConsumeLabel.prototype._Complete = function () {
        UIHelper.SetRatio(this.typeImg, 44, 44);
    };
    Object.defineProperty(ConsumeLabel.prototype, "consumeItemId", {
        get: function () {
            return this.m_ConsumeItemId;
        },
        set: function (value) {
            var id = Number(value);
            var config = GameGlobal.Config.ItemConfig[id];
            if (config) {
                this.consumeType = config.name;
            }
            else {
                this.consumeType = "";
            }
            this.m_ConsumeItemId = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsumeLabel.prototype, "consumeType", {
        get: function () {
            return this.m_ConsumeType;
        },
        set: function (value) {
            this.m_ConsumeType = value;
            this.m_ConsumeItemId = null;
        },
        enumerable: true,
        configurable: true
    });
    ConsumeLabel.prototype.SetData = function (type, needValue, curValue) {
        if (needValue === void 0) { needValue = null; }
        if (curValue === void 0) { curValue = null; }
        this.consumeType = type;
        if (curValue != null) {
            this.m_CurValue = curValue;
        }
        else {
            this.m_CurValue = null;
        }
        if (needValue != null) {
            this.m_ConsumeValue = needValue;
        }
        else {
            this.m_ConsumeValue = null;
        }
        this._UpdateContent();
    };
    ConsumeLabel.prototype.SetItem = function (itemId, needValue, curValue) {
        if (needValue === void 0) { needValue = null; }
        if (curValue === void 0) { curValue = null; }
        this.consumeItemId = itemId;
        if (curValue != null) {
            this.m_CurValue = curValue;
        }
        if (needValue != null) {
            this.m_ConsumeValue = needValue;
        }
        this._UpdateContent();
    };
    Object.defineProperty(ConsumeLabel.prototype, "overLengthFlag", {
        set: function (flag) {
            this.m_overLengthFlag = flag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsumeLabel.prototype, "textColor", {
        set: function (value) {
            this._textColor = value;
            if (this.label)
                this.label.textColor = this._textColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsumeLabel.prototype, "maxTip", {
        set: function (value) {
            this.m_IsMaxTip = value;
            if (!this.$stage) {
                return;
            }
            this._UpdateMaxTip();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsumeLabel.prototype, "consumeValue", {
        get: function () {
            return this.m_ConsumeValue;
        },
        set: function (value) {
            this.m_ConsumeValue = parseInt(value);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConsumeLabel.prototype, "curValue", {
        get: function () {
            return this.m_CurValue;
        },
        set: function (value) {
            this.m_CurValue = parseInt(value);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    ConsumeLabel.prototype._UpdateMaxTip = function () {
        if (StringUtils.IsNullOrEmpty(this.m_IsMaxTip)) {
            return false;
        }
        this.label.visible = true;
        this.label.text = this.m_IsMaxTip;
        return true;
    };
    ConsumeLabel.prototype._UpdateContent = function () {
        if (!this.$stage) {
            return;
        }
        if (this._UpdateMaxTip()) {
            return;
        }
        if (this._textColor) {
            this.label.textColor = this._textColor;
        }
        this.label.visible = true;
        var str = "";
        if (this.mIsImg) {
            UIHelper.SetVisible(this.imgGroup, true);
            this.typeImg.source = RewardData.GetCurrencyMiniRes(this.m_ConsumeItemId);
        }
        else {
            UIHelper.SetVisible(this.imgGroup, false);
            if (this.m_ConsumeType) {
                str += this.m_ConsumeType;
            }
            str += "：";
        }
        if (this.m_CurValue != null && !isNaN(this.m_CurValue)) {
            var curValueText = this.m_overLengthFlag ? CommonUtils.overLength(this.m_CurValue) : this.m_CurValue;
            if (this.m_ConsumeValue != null)
                str += (this.m_CurValue < this.m_ConsumeValue ? "|C:0xff0000&T:" : "|C:0x019704&T:") + curValueText + "|/";
            else
                str += this.m_CurValue + "/";
        }
        if (this.m_ConsumeValue != null) {
            str += this.m_ConsumeValue;
        }
        else {
            str += 0;
        }
        this.label.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    ConsumeLabel.GetValueColor = function (value, needValue) {
        value = value || 0;
        return TextFlowMaker.generateTextFlow(StringUtils.addColor(value, value >= needValue ? 0x019704 : Color.Red) + "/" + needValue);
    };
    ConsumeLabel.GetValue = function (value, needValue) {
        if (value >= needValue) {
            return true;
        }
        return false;
    };
    ConsumeLabel.GetValueColor2 = function (value, needValue, color) {
        if (color === void 0) { color = null; }
        value = value || 0;
        color = color || 0x019704;
        return TextFlowMaker.generateTextFlow(StringUtils.addColor(value, value >= needValue ? color : Color.Red) + "/" + needValue);
    };
    ConsumeLabel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    ConsumeLabel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this._textColor) {
            if (this.label)
                this.label.textColor = this._textColor;
        }
        this.imgGroup.includeInLayout = false;
        this.typeImg.addEventListener(egret.Event.COMPLETE, this._Complete, this);
        this._UpdateContent();
    };
    ConsumeLabel.prototype.ShowMaxTip = function (value) {
        if (!value) {
            return;
        }
        this.m_CacheValue = this.label.text;
        this.label.text = value;
    };
    return ConsumeLabel;
}(eui.Component));
__reflect(ConsumeLabel.prototype, "ConsumeLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ConsumeLabel.js.map