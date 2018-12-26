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
var ElfDetailsPanel = (function (_super) {
    __extends(ElfDetailsPanel, _super);
    function ElfDetailsPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._skillId = [];
        _this._Lingtongid = 0;
        _this.skinName = "ElfDetailsSkin";
        return _this;
    }
    ElfDetailsPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.skillGroup.itemRenderer = LinglongSkillItem;
        var config = GameGlobal.Config.CallbaseConfig.rewardView;
        this.commonDlg.title = "灵童详情";
        UIHelper.SetLinkStyleLabel(this.gotoTxt);
    };
    ElfDetailsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDlg.OnAdded(this);
        if (!param[0])
            return;
        this._Lingtongid = param[0];
        this.mainSkillId = GameGlobal.Config.BabyActivationConfig[this._Lingtongid].skill[0];
        if (param[1]) {
            var config = GameGlobal.Config.BabyProgressConfig[this._Lingtongid];
            var configData = config[param[1] - 1];
            this.attr1Val = configData.attrpower;
            this.attr2Val = configData.specialattr;
        }
        else {
            var config = GameGlobal.Config.BabyProgressConfig[this._Lingtongid];
            var configData = config[0];
            this.attr1Val = configData.attrpower;
            this.attr2Val = configData.specialattr;
        }
        if (param[2]) {
            this._skillId = param[2];
        }
        else {
            var buffskill = GameGlobal.Config.BabyActivationConfig[this._Lingtongid].buffskill;
            var list = [];
            for (var _a = 0, buffskill_1 = buffskill; _a < buffskill_1.length; _a++) {
                var id = buffskill_1[_a];
                list.push(id.id);
            }
            this._skillId = list;
        }
        if (param[3]) {
            this.lingtongName = param[3];
        }
        else {
            this.lingtongName = GameGlobal.Config.BabyActivationConfig[this._Lingtongid].name;
        }
        this._AddClick(this.gotoTxt, this._onTap);
        this._AddClick(this.mainSkill, this._onTap);
        this._AddItemClick(this.skillGroup, this._OnItemClick);
        this.updateCnetent();
    };
    ElfDetailsPanel.prototype._onTap = function (e) {
        switch (e.currentTarget) {
            case this.gotoTxt:
                this.CloseSelf();
                ViewManager.ins().open(ElfCallPanel);
                break;
            case this.mainSkill:
                ViewManager.ins().open(PetSkillTipPanel, 0, this.mainSkillId);
                break;
            default:
                break;
        }
    };
    ElfDetailsPanel.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        var skillId = this._skillId[index];
        if (!skillId) {
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    ElfDetailsPanel.prototype.updateCnetent = function () {
        this.skillGroup.dataProvider = new eui.ArrayCollection(this._skillId);
        LingtongUpLevelItem.SetAttr(this.attr1Val, this.attr2Val, this.attr1);
        LingtongViewHelper.SetRole(this.showPanel, this._Lingtongid);
        this.powerTxt.text = ItemConfig.CalcAttrScoreValue(this.attr1Val);
        PetSkillIconItem.SetContent(this.mainSkill, this.mainSkillId, 0);
        this.nameTxt.text = this.lingtongName;
    };
    ElfDetailsPanel.prototype.showRusult = function (req) {
        if (!ViewManager.ins().isShow(ElfResultPanel))
            ViewManager.ins().open(ElfResultPanel, req);
    };
    ElfDetailsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return ElfDetailsPanel;
}(BaseEuiView));
__reflect(ElfDetailsPanel.prototype, "ElfDetailsPanel");
//# sourceMappingURL=ElfDetailsPanel.js.map