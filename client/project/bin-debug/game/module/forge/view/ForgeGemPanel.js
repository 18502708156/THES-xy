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
var ForgeGemPanel = (function (_super) {
    __extends(ForgeGemPanel, _super);
    function ForgeGemPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.m_GemLabel = [];
        _this.mForgeType = ForgeType.GEM;
        _this.skinName = "ForgeGemSkin";
        for (var i = 0; i < _this.attGroup.numChildren; i++) {
            _this.m_GemLabel[i] = _this.attGroup.getChildAt(i);
        }
        return _this;
    }
    ForgeGemPanel.GetImg = function (type, level) {
        return "resource/assets/image/item_single/2000003.png";
    };
    ForgeGemPanel.GetLen = function (att) {
        var len = 0;
        for (var _i = 0, att_1 = att; _i < att_1.length; _i++) {
            var data = att_1[_i];
            if (data.value) {
                ++len;
            }
        }
        return len;
    };
    ForgeGemPanel.prototype.OnOpen = function () {
        _super.prototype.OnOpen.call(this);
        this.equipComp.onKeyBtn.label = "一键镶嵌";
        this.equipComp.masterBtn.masterBtn.icon = "ui_bt_bsds";
    };
    ForgeGemPanel.prototype.GetForgeValue = function (data) {
        return data.gem;
    };
    ForgeGemPanel.prototype.GetConsumeTypeId = function () {
        return 200002;
    };
    ForgeGemPanel.prototype.SetAttrData = function (config, nextConfig) {
        var attrName = "";
        var lv = this.lv;
        if (config) {
            var attr = AttributeData.getAttrStrAdd(config.attr, 15);
            attrName = AttributeData.getAttrStrByType(config.attr[0].type);
            for (var i = 1; i <= this.m_GemLabel.length; ++i) {
                var item = this.m_GemLabel[i - 1];
                var len = ForgeGemPanel.GetLen(config.attr);
                if (len < i) {
                    this.SetGemLabel(item, "", attrName, null);
                }
                else {
                    var showLv = lv;
                    if (len > i) {
                        showLv = 10;
                        lv -= 10;
                    }
                    var icon = ForgeGemPanel.GetImg(config.attr[0].type, showLv);
                    this.SetGemLabel(item, icon, attrName, attr[i - 1].value);
                }
            }
        }
        else {
            attrName = AttributeData.getAttrStrByType(nextConfig.attr[0].type);
            for (var i = 0; i < this.m_GemLabel.length; ++i) {
                var item = this.m_GemLabel[i];
                this.SetGemLabel(item, "", attrName, null);
            }
        }
    };
    ForgeGemPanel.prototype.SetGemLabel = function (label, icon, attr, value) {
        label.img.source = icon || "";
        if (value) {
            label.attName.text = attr;
            label.attName.textColor = Color.l_brown_2;
            label.attValue.text = "+" + value;
            label.attValue.textColor = Color.l_green_1;
        }
        else {
            label.attName.text = attr + "宝石";
            label.attValue.text = "未激活";
        }
    };
    ForgeGemPanel.RedPointCheck = function () {
        return GameGlobal.ForgeModel.mRedPoint.Get(ForgeModelRedPoint.INDEX_GEM);
    };
    ForgeGemPanel.NAME = "宝石";
    return ForgeGemPanel;
}(ForgePanel));
__reflect(ForgeGemPanel.prototype, "ForgeGemPanel");
//# sourceMappingURL=ForgeGemPanel.js.map