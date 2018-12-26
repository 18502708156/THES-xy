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
var LingtongXilianPanel = (function (_super) {
    __extends(LingtongXilianPanel, _super);
    function LingtongXilianPanel() {
        var _this = _super.call(this) || this;
        _this.commonWindowBg.SetTitle("灵童");
        return _this;
    }
    LingtongXilianPanel.prototype.GetMsgDef = function () {
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
    };
    LingtongXilianPanel.prototype.GetBuffSkill = function () {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPetId);
        return info.mBuffs;
    };
    LingtongXilianPanel.prototype.GetXilianSkill = function (i) {
        var info = GameGlobal.LingtongPetModel.GetInfo(this.mPetId);
        return info.mXilianSkills[i];
    };
    LingtongXilianPanel.prototype.SendSkillXilian = function () {
        GameGlobal.LingtongAttrModel.SendSetSkill(this.mPetId);
    };
    LingtongXilianPanel.prototype.SendSendXilian = function (list, type) {
        GameGlobal.LingtongAttrModel.SendRefreshSkill(this.mPetId, list, type, this.checkBox.selected);
    };
    LingtongXilianPanel.prototype.GetBaseConfig = function () {
        return GameGlobal.Config.BabyBasisConfig;
    };
    return LingtongXilianPanel;
}(PetXilianPanel));
__reflect(LingtongXilianPanel.prototype, "LingtongXilianPanel");
//# sourceMappingURL=LingtongXilianPanel.js.map