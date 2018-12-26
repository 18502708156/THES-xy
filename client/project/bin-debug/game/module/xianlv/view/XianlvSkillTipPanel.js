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
var XianlvSkillTipPanel = (function (_super) {
    __extends(XianlvSkillTipPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function XianlvSkillTipPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianlvSkillTipSkin";
        _this._AddClick(_this, _this.CloseSelf);
        return _this;
    }
    XianlvSkillTipPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var skillId = param[0];
        var nextSkillId = param[1];
        var starCount = Math.max(param[2], 1);
        PetSkillIconItem.SetContent(this.skillIcon, skillId, 0);
        this.skillName.text = PetConst.GetSkillName(skillId);
        this.skillDesc.text = PetConst.GetSkillDesc(skillId);
        this.starNum.text = starCount.toString();
        if (starCount >= GameGlobal.XianlvModel.MAX_STAR) {
            this.nextGroup.visible = false;
            this.bgImg.$setHeight(280);
            this.curGroup.$setY(132);
            this.mainGroup.$setY(360);
            return;
        }
        this.nextSkillDesc.text = PetConst.GetSkillDesc(nextSkillId);
        var str = "仙侣星级达到|C:0x2ECA22&T:" + (starCount + 1) + "|星";
        this.condiDesc.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    XianlvSkillTipPanel.prototype.OnClose = function () {
    };
    XianlvSkillTipPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianlvSkillTipPanel;
}(BaseEuiView));
__reflect(XianlvSkillTipPanel.prototype, "XianlvSkillTipPanel");
//# sourceMappingURL=XianlvSkillTipPanel.js.map