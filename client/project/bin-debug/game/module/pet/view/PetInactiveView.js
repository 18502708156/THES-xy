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
var PetInactiveView = (function (_super) {
    __extends(PetInactiveView, _super);
    function PetInactiveView() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetInactiveSkin";
        _this._AddClick(_this.getwayLabel, _this._OnClick);
        _this._AddClick(_this.btnSC, _this._OnClick);
        _this._AddClick(_this.btnYuanfen, _this._OnClick);
        _this._AddClick(_this.actBtn, _this._OnClick);
        _this.skillList.itemRenderer = PetSkillIconItem;
        _this._AddItemClick(_this.skillList, _this._OnItemClick);
        return _this;
    }
    PetInactiveView.prototype.OnOpen = function () {
        this.btnSC.visible = GameGlobal.actorModel.level > GameGlobal.Config.petbaseConfig.openlv;
        this.btnYuanfen.visible = Deblocking.Check(GameGlobal.Config.FateBaseConfig.openlv, true);
        UIHelper.ShowRedPoint(this.btnYuanfen, GameGlobal.YuanfenModel.IsRedPoint());
    };
    PetInactiveView.prototype.OnClose = function () {
    };
    PetInactiveView.prototype.UpdateContent = function (id) {
        this.m_PetId = id;
        var model = GameGlobal.PetModel;
        var config = GameGlobal.Config.petBiographyConfig[id];
        PetConst.SetNameById(this.lbName, id);
        this.imgShen.visible = config.type == 2;
        this.wuxingImg.source = PetConst.XUXING_IMG[config.fiveele];
        UIHelper.SetLabelText(this.lbPower, "宠物总战力：", model.GetAllPower() + "");
        UIHelper.SetLabelText(this.lbActive, "已激活：", model.GetActiveCount() + "");
        var material = config.material;
        // let itemConfig = GameGlobal.Config.ItemConfig[material.id]
        // this.item.setData(itemConfig)
        // UIHelper.SetLabelText(this.matLabel, itemConfig.name, "*" + material.count)
        // this.useCountLabel.text = "拥有：" + GameGlobal.UserBag.GetCount(material.id)
        this.needItemView.SetItemId(material.id, material.count);
        this.startGroup.visible = config.star > 1;
        this.startLabel.text = "洗练初始星级   " + config.star;
        var canActive = GameGlobal.UserBag.GetCount(material.id) >= material.count;
        this.actBtn.visible = canActive;
        if (this.getwayLabel.visible = !canActive) {
            // this.getwayLabel.textFlow = (new egret.HtmlTextParser).parser("<font>获取：</font><a href=\"event:\"><font color='#019704'><u>" + "宠物商店" + "</u></font></a>");
            this.getwayLabel.SetId(material.id);
        }
        this.skillList.dataProvider = new eui.ArrayCollection(config.skill.concat(config.buffskill));
        this.petShowPanel.SetBody(PetConst.GetSkin(id));
        this.powerLabel.text = PetConst.GetPower(id);
    };
    PetInactiveView.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        if (index == 0) {
            ViewManager.ins().open(PetSkillTipPanel, 0, e.itemRenderer.data);
        }
        else {
            ViewManager.ins().open(PetSkillTipPanel, 2, e.itemRenderer.data.id);
        }
    };
    PetInactiveView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.getwayLabel:
                // let config = GameGlobal.Config.petBiographyConfig[this.m_PetId]
                // UserWarn.ins().setBuyGoodsWarn(config.material.id)
                break;
            case this.actBtn:
                GameGlobal.PetModel.SendActive(this.m_PetId);
                break;
            case this.btnSC:
                ViewManager.ins().open(PetTuJianMainPanel);
                break;
            case this.btnYuanfen:
                ViewManager.ins().open(YuanfenMainWin);
                break;
        }
    };
    return PetInactiveView;
}(BaseView));
__reflect(PetInactiveView.prototype, "PetInactiveView");
var PetSkillIconItem = (function (_super) {
    __extends(PetSkillIconItem, _super);
    function PetSkillIconItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    PetSkillIconItem.prototype.dataChanged = function () {
        if (this.itemIndex == 0) {
            PetSkillIconItem.SetContent(this, this.data, 0);
        }
        else {
            PetSkillIconItem.SetContent(this, this.data.id, 2);
        }
    };
    PetSkillIconItem.SetContent = function (comp, skillId, state, isSpecial) {
        if (isSpecial === void 0) { isSpecial = false; }
        var strLv = "";
        // if(GameGlobal.LingtongAttrModel&&GameGlobal.LingtongAttrModel.giftlv)
        // {
        // 	strLv = " Lv." + GameGlobal.LingtongAttrModel.giftlv 
        // }
        if (2 == state) {
            if (comp["iconType"])
                comp.iconType.source = 'ui_tn_bm_bei';
            if (isSpecial) {
                var path = PetConst.GetSkillIcon(skillId);
                comp.iconImg.source = PetConst.GetSkillIcon(skillId);
                var quality = PetConst.GetSkillQuality(skillId);
                comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
                if (comp["skillName"]) {
                    comp["skillName"].text = PetConst.GetSkillName(skillId) + strLv;
                    comp["skillName"].textColor = ItemBase.GetColorByQuality(quality);
                }
            }
            else {
                comp.iconImg.source = PetConst.GetPassSkillIcon(skillId);
                var quality = PetConst.GetPassSkillQuality(skillId);
                comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
                if (comp["skillName"]) {
                    comp["skillName"].text = PetConst.GetPassSkillName(skillId) + strLv;
                    comp["skillName"].textColor = ItemBase.GetColorByQuality(quality);
                }
            }
        }
        else {
            // if (comp["iconType"]) comp.iconType.source = 0 == state ? 'ui_bm_zhu' : 'ui_tn_bm_he';
            if (comp["iconType"])
                comp.iconType.source = 'ui_bm_zhu';
            var path = PetConst.GetSkillIcon(skillId);
            comp.iconImg.source = PetConst.GetSkillIcon(skillId);
            var quality = PetConst.GetSkillQuality(skillId);
            comp.iconBg.source = PetConst.QUALITY_SKILL_BG[quality];
            if (comp["skillName"]) {
                comp["skillName"].text = PetConst.GetSkillName(skillId) + strLv;
                comp["skillName"].textColor = ItemBase.GetColorByQuality(quality);
            }
        }
    };
    return PetSkillIconItem;
}(eui.ItemRenderer));
__reflect(PetSkillIconItem.prototype, "PetSkillIconItem");
//# sourceMappingURL=PetInactiveView.js.map