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
var XianlvQyPanel = (function (_super) {
    __extends(XianlvQyPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XianlvQyPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvQySkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    XianlvQyPanel.prototype.OnOpen = function () {
        var model = GameGlobal.XianlvModel;
        var allLevel = model.GetAllLevel();
        var config = GameGlobal.Config.partnerFreshSkillConfig;
        var level = 0;
        for (var i = 1; i < 99; i++) {
            var configData_1 = config[i];
            if (!configData_1) {
                break;
            }
            if (allLevel < configData_1.lv) {
                break;
            }
            level = i;
        }
        if (level < 1) {
            UIHelper.SetVisible(this.curGroup, false);
        }
        else if (level >= model.MAX_QY_LEVEL) {
            UIHelper.SetVisible(this.nextGroup, false);
        }
        else {
        }
        var configData = config[level];
        if (configData) {
            this.levelLabel.textFlow = TextFlowMaker.generateTextFlow("等级|C:0x019704:&T:" + configData.lv + "|");
            this.curValue.text = AttributeData.getAttStr(configData.attrs, 1);
        }
        else {
            this.levelLabel.textFlow = TextFlowMaker.generateTextFlow("|C:0x019704:&T:未激活|");
        }
        var nextConfigData = config[level + 1];
        if (nextConfigData) {
            this.nextValue.text = AttributeData.getAttStr(nextConfigData.attrs, 1);
            this.conLabel.textFlow = TextFlowMaker.generateTextFlow("仙侣总等阶达到|C:0x019704:&T:" + nextConfigData.lv + "阶|可激活");
            this.curAllLevel.text = "当前总等阶段：" + allLevel;
        }
    };
    XianlvQyPanel.prototype.OnClose = function () {
    };
    XianlvQyPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianlvQyPanel;
}(BaseEuiView));
__reflect(XianlvQyPanel.prototype, "XianlvQyPanel");
//# sourceMappingURL=XianlvQyPanel.js.map