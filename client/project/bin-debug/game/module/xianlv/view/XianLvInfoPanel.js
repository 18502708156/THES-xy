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
var XianLvInfoPanel = (function (_super) {
    __extends(XianLvInfoPanel, _super);
    function XianLvInfoPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "XianLvInfoSkin";
        return _this;
    }
    XianLvInfoPanel.prototype.childrenCreated = function () {
        this._AddClick(this.skillIcon, this._OnClick);
        this.commonDialog.title = "详细属性";
    };
    XianLvInfoPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        if (args.length == 0)
            return;
        this.xianLvinfo = args[0];
        this.UpdateContent();
    };
    XianLvInfoPanel.prototype.UpdateContent = function () {
        var model = GameGlobal.XianlvModel;
        var selectConfig = this.xianLvinfo;
        this.xianlvId = selectConfig.id;
        this.img.source = PetConst.XUXING_IMG[selectConfig.fiveele];
        var petInfo = new PetInfo();
        petInfo.mPetId = selectConfig.id;
        petInfo.mName = selectConfig.name;
        this.name_label.textColor = ItemBase.GetColorByQuality(selectConfig.quality);
        this.name_label.text = selectConfig.name;
        //PetConst.SetName(this.lbName as PetNameComp, petInfo)
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(selectConfig.attrs);
        this.petShowPanel.SetBody(PetConst.GetSkin(selectConfig.id));
        this.skillDesc.text = XianlvConst.GetSkillDesc(selectConfig.id, 1);
        PetSkillIconItem.SetContent(this.skillIcon, XianlvConst.GetSkillId(selectConfig.id, 1), 0); //主动技能
        this.attr0Txt.text = AttributeData.getAttStr(selectConfig.attrs, 0, 0, ":", false, "#ffffff", "            ");
        this.starNum.text = selectConfig.star || 1;
    };
    XianLvInfoPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.skillIcon:
                var xianlvInfo = GameGlobal.XianlvModel.GetXianlvInfo(this.xianlvId);
                var skillId = XianlvConst.GetSkillId(this.xianlvId, 1);
                var nextSkillId = XianlvConst.GetSkillId(this.xianlvId, 2);
                ViewManager.ins().open(XianlvSkillTipPanel, skillId, nextSkillId, 1);
                break;
        }
    };
    XianLvInfoPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return XianLvInfoPanel;
}(BaseEuiView));
__reflect(XianLvInfoPanel.prototype, "XianLvInfoPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=XianLvInfoPanel.js.map