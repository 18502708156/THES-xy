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
var GetwayLabel = (function (_super) {
    __extends(GetwayLabel, _super);
    function GetwayLabel() {
        return _super.call(this) || this;
    }
    Object.defineProperty(GetwayLabel.prototype, "text", {
        get: function () {
            return this.m_Text;
        },
        set: function (value) {
            this.m_Text = value;
            this._Update();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetwayLabel.prototype, "textColor", {
        set: function (value) {
            this.m_TextColor = value;
            this._Update();
        },
        enumerable: true,
        configurable: true
    });
    GetwayLabel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GetwayLabel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._Update();
        if (this.m_TextColor) {
            this.label.textColor = this.m_TextColor;
        }
    };
    GetwayLabel.prototype._Update = function () {
        if (this.$stage) {
            // this.label.textFlow = (new egret.HtmlTextParser).parser("<a href=\"event:\"><u>" + this.m_Text + "</u></a>");
            if (this.m_TextColor) {
                this.label.textColor = this.m_TextColor;
            }
            UIHelper.SetLinkStyleLabel(this.label, this.m_Text);
        }
    };
    GetwayLabel.prototype.SetUnLabel = function (text) {
        this.label.text = text;
        this.label.textColor = 0xff0000;
    };
    GetwayLabel.prototype.SetDefault = function () {
        this.textColor = 0x2ECA22;
        // this.label.textColor = 
        // this._Update()
    };
    GetwayLabel.prototype.PlayEff = function (state) {
        if (!state) {
            if (this.m_Eff) {
                this.m_Eff.visible = false;
            }
            return;
        }
        var eff = this.m_Eff;
        if (!eff) {
            eff = this.m_Eff = new MovieClip;
            eff.touchEnabled = false;
            if (this.m_Text.length > 4) {
                eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_wzlj_002"), true, -1);
                eff.scaleX = this.label.width / 100;
            }
            else
                eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_wzlj_001"), true, -1);
            this.addChild(eff);
        }
        // eff.scaleX = eff.scaleY = 0.8
        // eff.x = (this.label.width - 132 * 0.8) * 0.5
        // eff.y = (this.label.height - 39 * 0.8) * 0.5
        if (this.m_Text.length > 4) {
            eff.x = this.label.width >> 1;
            eff.y = 8;
        }
        else {
            eff.x = 32;
            eff.y = 8;
        }
        eff.visible = true;
    };
    GetwayLabel.GainItemLabel = function (itemId) {
        var gainConfig = GameGlobal.Config.GainItemConfig[itemId];
        if (gainConfig) {
            return gainConfig.gainWay[0][0];
        }
        return null;
    };
    GetwayLabel.GainItemWay = function (itemId) {
        var gainConfig = GameGlobal.Config.GainItemConfig[itemId];
        if (gainConfig) {
            return gainConfig.gainWay[0][1][0];
        }
        return null;
    };
    return GetwayLabel;
}(eui.Component));
__reflect(GetwayLabel.prototype, "GetwayLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=GetwayLabel.js.map