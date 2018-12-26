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
var ActorName = (function (_super) {
    __extends(ActorName, _super);
    function ActorName() {
        var _this = _super.call(this) || this;
        // 尊
        _this.m_IsMonth01 = false;
        // 月
        _this.m_IsMonth02 = false;
        _this.m_VipLv = 0;
        _this.m_Name = "";
        _this.m_Align = false;
        return _this;
    }
    Object.defineProperty(ActorName.prototype, "actorName", {
        set: function (name) {
            this.m_Name = name;
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorName.prototype, "month", {
        set: function (isMonty) {
            this.m_IsMonth02 = Boolean(isMonty);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorName.prototype, "zun", {
        set: function (isZun) {
            this.m_IsMonth01 = Boolean(isZun);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorName.prototype, "vipLv", {
        set: function (vipLv) {
            this.m_VipLv = Number(vipLv);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActorName.prototype, "align", {
        set: function (value) {
            this.m_Align = Boolean(value);
            this._UpdateContent();
        },
        enumerable: true,
        configurable: true
    });
    ActorName.prototype.Set = function (name, vipLv, isMonty, isZun) {
        this.m_Name = name;
        this.m_VipLv = vipLv;
        this.m_IsMonth02 = isMonty ? true : false;
        this.m_IsMonth01 = isZun ? true : false;
        this._UpdateContent();
    };
    ActorName.prototype.Set2 = function (name, vipLv, isMonty, isZun, lv, zsLv) {
        this.m_Name = name;
        this.m_VipLv = vipLv;
        this.m_IsMonth02 = isMonty ? true : false;
        this.m_IsMonth01 = isZun ? true : false;
        this.m_Lv = lv;
        this.m_ZsLv = zsLv;
        this._UpdateContent();
    };
    ActorName.prototype._UpdateContent = function () {
        if (!this.$stage) {
            return;
        }
        var text = "";
        if (this.m_IsMonth01)
            text += "尊";
        if (this.m_IsMonth02)
            text += "月";
        if (this.m_VipLv > 0)
            text += "V" + this.m_VipLv;
        if (text == "") {
            this.lv.visible = false;
            this.lv.includeInLayout = false;
        }
        else {
            this.lv.text = text;
            this.lv.visible = true;
            this.lv.includeInLayout = true;
        }
        if (this.label) {
            if (this.m_Name == null) {
                this.label.text = "";
            }
            else if (typeof (this.m_Name) == "string") {
                this.label.text = this.m_Name;
            }
            else {
                this.label.textFlow = this.m_Name;
            }
        }
        if (this["levelLabel"]) {
            if (this.m_Lv != null) {
                this["levelLabel"].text = "   " + GameString.GetLvName(this.m_ZsLv, this.m_Lv);
            }
            else {
                this["levelLabel"].text = "";
            }
        }
    };
    return ActorName;
}(eui.Component));
__reflect(ActorName.prototype, "ActorName", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ActorName.js.map