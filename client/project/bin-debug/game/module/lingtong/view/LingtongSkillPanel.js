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
    function LingtongSkillPanel() {
        var _this = _super.call(this) || this;
        _this.skillId = [];
        _this.skinName = "LingtongUpSkillItemSkin";
        return _this;
    }
    LingtongSkillPanel.prototype.childrenCreated = function () {
        this._AddClick(this.goBtn, this._OnClick);
        this._AddClick(this.btnInfo, this._OnClick);
        this._AddClick(this.starGroup, this._OnClick);
        this.skillGroup.itemRenderer = LinglongSkillItem;
        this._AddItemClick(this.skillGroup, this._OnItemClick);
    };
    LingtongSkillPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateRedPoint();
    };
    LingtongSkillPanel.prototype.UpdateSelId = function (selId) {
        this.mSelId = selId;
        this.mLingtongInfo = GameGlobal.LingtongPetModel.GetInfo(selId);
        this.UpdateContent();
    };
    LingtongSkillPanel.prototype.UpdateRedPoint = function () {
        UIHelper.ShowRedPoint(this.goBtn, GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL));
    };
    LingtongSkillPanel.prototype.UpdateContent = function () {
        if (this.mLingtongInfo) {
            var list = [];
            for (var _i = 0, _a = this.mLingtongInfo.mBuffs; _i < _a.length; _i++) {
                var id = _a[_i];
                list.push(id);
            }
            for (var i = list.length; i < PetModel.SKILL_COUNT; i++) {
                list.push(null);
            }
            this.skillId = list;
            this.skillGroup.dataProvider = new eui.ArrayCollection(list);
            var xilianStar = this.GetXilianStar();
            for (var i = 0; i < this.starGroup.numChildren; i++) {
                var item = this.starGroup.getChildAt(i);
                item.source = xilianStar > i ? "ui_bm_star022" : "ui_bm_star021";
            }
            // LingtongViewHelper.SetRole(this.petShowPanel)
            // let skillId = GameGlobal.LingtongAttrModel.GetSkillId()
            // let skillConfig = GameGlobal.Config.EffectsConfig[skillId]
            // this.skillDesc.text = PetConst.GetSkillDesc(skillId)
            // this.skillDesc.text = "提升灵童的天赋可提升主动技能等级"
            // PetSkillIconItem.SetContent(this.skillIcon as any, GameGlobal.LingtongAttrModel.GetSkillId(), 0)
            this.infoGroup.visible = true;
            this.skillGroup.y = 2;
        }
        else {
            this.infoGroup.visible = false;
            this.skillGroup.y = 52;
            var config = GameGlobal.Config.BabyActivationConfig[this.mSelId];
            var list = [];
            for (var _b = 0, _c = config.buffskill; _b < _c.length; _b++) {
                var data = _c[_b];
                list.push(data.id);
            }
            this.skillId = list;
            this.skillGroup.dataProvider = new eui.ArrayCollection(list);
        }
    };
    LingtongSkillPanel.prototype.GetXilianStar = function () {
        var config = GameGlobal.Config.BabyBasisConfig.polishStar;
        var star = config.length;
        var xilian = this.mLingtongInfo.mXilian;
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
        var skillId = this.skillId[index];
        if (!skillId) {
            return;
        }
        ViewManager.ins().open(PetSkillTipPanel, 2, skillId);
    };
    LingtongSkillPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goBtn:
                ViewManager.ins().open(LingtongXilianPanel, this.mSelId);
                break;
            case this.btnInfo:
                this.pressInfo();
                break;
            // case this.skillIcon:
            // 	ViewManager.ins().open(PetSkillTipPanel, 0, GameGlobal.LingtongAttrModel.GetSkillId())
            // 	break
            case this.starGroup:
                this.pressInfo();
                break;
        }
    };
    LingtongSkillPanel.prototype.pressInfo = function () {
        var desc = '灵童技能已累计刷新：';
        var count = this.mLingtongInfo.mXilian + "次";
        var c = 0xffffff;
        c = ItemBase.GetColorByQuality(1);
        ViewManager.ins().open(PetXilianTipPanel, this.mLingtongInfo.mName, desc, count, c, GameGlobal.Config.BabyBasisConfig.freshitemid);
    };
    LingtongSkillPanel.RedPointCheck = function () {
        return GameGlobal.LingtongAttrModel.mRedPoint.Get(LingtongAttrRedPoint.INDEX_SKILL);
    };
    LingtongSkillPanel.NAME = "技能";
    return LingtongSkillPanel;
}(BaseView));
__reflect(LingtongSkillPanel.prototype, "LingtongSkillPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=LingtongSkillPanel.js.map