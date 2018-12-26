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
var AttrLabel = (function (_super) {
    __extends(AttrLabel, _super);
    function AttrLabel() {
        return _super.call(this) || this;
    }
    Object.defineProperty(AttrLabel.prototype, "labelColorL", {
        set: function (value) {
            this._labelColorL = value;
            if (this.attrLabel)
                this.attrLabel.textColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrLabel.prototype, "hideBg", {
        set: function (value) {
            this.m_HideBg = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrLabel.prototype, "gap", {
        set: function (gap) {
            this.m_Gap = parseInt(gap);
            if (this.attrGroup)
                this.attrGroup.layout.gap = this.m_Gap;
            // this._UpdateGap()
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttrLabel.prototype, "text", {
        set: function (value) {
            this.m_Text = value;
            this._UpdateText();
        },
        enumerable: true,
        configurable: true
    });
    AttrLabel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    AttrLabel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        if (this.m_HideBg) {
            if (this.attrBg)
                this.attrBg.visible = false;
        }
        if (this.m_Gap != null) {
            this.attrGroup.layout.gap = this.m_Gap;
            // this._UpdateGap()
        }
        if (this.m_Text != null) {
            this._UpdateText();
        }
        if (this._labelColorL) {
            this.attrLabel.textColor = this._labelColorL;
        }
    };
    // private _UpdateGap(): void {
    // 	if (!this.$stage) {
    // 		return
    // 	}
    // let gap = (this.m_Gap || AttrLabel.GAP) + AttrLabel.ARROW_WIDTH
    // if (this.nextAttrLabel.visible) {
    // 	this.nextAttrLabel.x = AttrLabel.MIDDLE_POS + gap
    // 	this.attrLabel.x = AttrLabel.MIDDLE_POS - gap - this.attrLabel.width
    // } else {
    // 	this.attrLabel.x = AttrLabel.MIDDLE_POS - this.attrLabel.width * 0.5
    // }
    // }
    AttrLabel.prototype._UpdateText = function () {
        if (!this.$stage || this.m_Text == null) {
            return;
        }
        this.attrLabel.text = this.m_Text;
        this.arrows.visible = false;
        this.nextAttrLabel.visible = false;
    };
    AttrLabel.prototype.SetCurAttr = function (attr) {
        this.attrLabel.text = attr;
        this.arrows.visible = false;
        this.nextAttrLabel.visible = false;
        // this._UpdateGap()		
    };
    AttrLabel.prototype.SetNextAttr = function (attr) {
        this.nextAttrLabel.text = attr;
        this.arrows.visible = true;
        this.nextAttrLabel.visible = true;
        // this._UpdateGap()
    };
    AttrLabel.prototype.SetCurAttrByAddType = function (curConfig, addConfig) {
        var attr = AttributeData.getAttStr(AttributeData.AttrAddition(curConfig.attr, addConfig.attr), 1);
        this.SetCurAttr(attr);
    };
    AttrLabel.prototype.SetNextAttrByAddType = function (nextConfig, nextAddConfig) {
        var attr = AttributeData.getAttStr(AttributeData.AttrAddition(nextConfig.attr, nextAddConfig.attr), 1);
        this.SetNextAttr(attr);
    };
    AttrLabel.prototype.moveAttr = function () {
        var t = egret.Tween.get(this.attrLabel);
        var x1 = this.attrLabel.x;
        var x2 = this.nextAttrLabel.x;
        t.to({ "x": x1 + 200, "alpha": 0 }, 100).to({ "x": x1 - 200 }, 100).to({ "x": x1, "alpha": 1 }, 100);
        var t1 = egret.Tween.get(this.nextAttrLabel);
        t1.to({ "x": x2 + 200, "alpha": 0 }, 100).to({ "x": x2 - 200 }, 100).to({ "x": x2, "alpha": 1 }, 100);
    };
    AttrLabel.prototype.GetAttrLabel = function () {
        return this.attrLabel;
    };
    AttrLabel.prototype.GetNextAttrLabel = function () {
        return this.nextAttrLabel;
    };
    return AttrLabel;
}(eui.Component));
__reflect(AttrLabel.prototype, "AttrLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=AttrLabel.js.map