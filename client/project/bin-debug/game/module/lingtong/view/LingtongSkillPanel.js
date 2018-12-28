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
var LingtongSkillPanel = (function (_super) {
    __extends(LingtongSkillPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LingtongSkillPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongSkillSkin";
        return _this;
    }
    LingtongSkillPanel.prototype.childrenCreated = function () {
        this._AddClick(this.goBtn, this._OnClick);
        this._AddClick(this.btnInfo, this._OnClick);
        this._AddClick(this.skillIcon, this._OnClick);
        this._AddClick(this.starGroup, this._OnClick);
        this.skillGroup.itemRenderer = LinglongSkillItem;
        this._AddItemClick(this.skillGroup, this._OnItemClick);
    };
    LingtongSkillPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.lbName.text = GameGlobal.LingtongAttrModel.mName;
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    LingtongSkillPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.goBtn, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL));
    };
    LingtongSkillPanel.prototype.UpdateContent = function () {
        if (!GameGlobal.LingtongAttrModel.IsActive()) {
            return;
        }
        var model = GameGlobal.LingtongAttrModel;
        this.group.visible = true;
        var list = [];
        for (var _i = 0, _a = GameGlobal.LingtongAttrModel.mBuffSkill; _i < _a.length; _i++) {
            var id = _a[_i];
            list.push(id);
        }
        for (var i = list.length; i < PetModel.SKILL_COUNT; i++) {
            list.push(null);
        }
        this.skillGroup.dataProvider = new eui.ArrayCollection(list);
        var xilianStar = this.GetXilianStar();
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = xilianStar > i ? "ui_bm_star022" : "ui_bm_star021";
        }
        LingtongViewHelper.SetRole(this.petShowPanel);
        var skillId = GameGlobal.LingtongAttrModel.GetSkillId();
        var skillConfig = GameGlobal.Config.EffectsConfig[skillId];
        // this.skillDesc.text = PetConst.GetSkillDesc(skillId)
        this.skillDesc.text = "提升灵童的天赋可提升主动技能等级";
        PetSkillIconItem.SetContent(this.skillIcon, GameGlobal.LingtongAttrModel.GetSkillId(), 0);
    };
    LingtongSkillPanel.prototype.GetXilianStar = function () {
        var config = GameGlobal.Config.BabyBasisConfig.polishStar;
        var star = config.length;
        var xilian = GameGlobal.LingtongAttrModel.mXilian;
        for (var i = 0; i < config.length; i++) {
            var val = config[i];
            if (xilian <= val) {
                star = i + 1;
                break;
            }
        }
        return star;
    };
    LingtongSkillPanel.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        var skillId = GameGlobal.LingtongAttrModel.mBuffSkill[index];
        if (!skillId) {
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    LingtongSkillPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goBtn:
                ViewManager.ins().open(LingtongXilianPanel);
                break;
            case this.btnInfo:
                this.pressInfo();
                break;
            case this.skillIcon:
                ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId());
                break;
            case this.starGroup:
                this.pressInfo();
                break;
        }
    };
    LingtongSkillPanel.prototype.pressInfo = function () {
        var desc = '灵童技能已累计刷新：';
        var count = GameGlobal.LingtongAttrModel.mXilian + "次";
        var c = 0xffffff;
        c = ItemBase.GetColorByQuality(1);
        ViewManager.ins().open(PetXilianTipPanel, GameGlobal.LingtongAttrModel.mName, desc, count, c, GameGlobal.Config.BabyBasisConfig.freshitemid);
    };
    LingtongSkillPanel.RedPointCheck = function () {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL);
    };
    LingtongSkillPanel.NAME = "技能";
    return LingtongSkillPanel;
}(BaseView));
__reflect(LingtongSkillPanel.prototype, "LingtongSkillPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LingtongSkillPanel.js.map