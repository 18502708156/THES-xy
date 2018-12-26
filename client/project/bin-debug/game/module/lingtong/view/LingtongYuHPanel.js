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
var LingtongYuHPanel = (function (_super) {
    __extends(LingtongYuHPanel, _super);
    function LingtongYuHPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.itemArr = [];
        _this.select_yu_hun_index = 1;
        _this.skinName = "LingtongYuHSkin";
        UIHelper.SetLinkStyleLabel(_this.allAttrLabel);
        UIHelper.SetLinkStyleLabel(_this.getwayLabel);
        return _this;
    }
    LingtongYuHPanel.prototype.childrenCreated = function () {
        this.itemArr = this.itemGroup.$children;
        var i = 0;
        for (var _i = 0, _a = this.itemArr; _i < _a.length; _i++) {
            var item = _a[_i];
            this._AddClick(item, this._onIconClick);
            item.selImg.visible = i == 0;
            ++i;
        }
        this._AddClick(this.smeltBtn, this._OnClick);
        this._AddClick(this.activeBtn, this._OnClick);
        this._AddClick(this.allAttrLabel, this._OnClick);
        this._AddClick(this.getwayLabel, this._OnClick);
    };
    LingtongYuHPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this._UpdateInfo);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
    };
    LingtongYuHPanel.prototype.OnClose = function () {
    };
    LingtongYuHPanel.prototype.UpdateRedPoint = function () {
        var petId = this.m_petId;
        var petModel = GameGlobal.LingtongPetModel;
        var petInfo = petModel.GetInfo(petId);
        if (!petInfo) {
            return;
        }
        var i;
        var len = this.itemArr.length;
        for (i = 0; i < len; i++) {
            var hunLv = petInfo.getHunByIndex(i + 1);
            this.itemArr[i].redPoint.visible = petModel.IsRedPointUpHuns(petModel.GetInfo(petId), i + 1);
        }
        UIHelper.ShowRedPoint(this.activeBtn, petModel.IsRedPointSuit(petInfo));
    };
    LingtongYuHPanel.prototype._UpdateInfo = function () {
        this.UpdateContent();
    };
    LingtongYuHPanel.prototype._onIconClick = function (e) {
        var index = this.itemArr.indexOf(e.currentTarget) + 1;
        this.select_yu_hun_index = index;
        var i;
        var len = this.itemArr.length;
        for (i = 0; i < len; i++) {
            this.itemArr[i].selImg.visible = (index == i + 1);
        }
        ViewManager.ins().open(LingtongHunUpgradePanel, this.m_petId, index);
    };
    LingtongYuHPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.smeltBtn:
                // SmeltEquipTotalWin.open(SmeltEquipTotalWin.PET)
                break;
            case this.activeBtn:
                if (GameGlobal.LingtongPetModel.IsRedPointSuit(GameGlobal.LingtongPetModel.GetInfo(this.m_petId)) == false) {
                    UserTips.InfoTip("当前御魂不足");
                    return;
                }
                GameGlobal.LingtongPetModel.SendSuitUpgrade(this.m_petId);
                break;
            case this.allAttrLabel:
                // ViewManager.ins().open(PetHunSuitPreviewPanel)
                break;
            case this.getwayLabel:
                UserWarn.ins().setBuyGoodsWarn(2007301, 1);
                break;
        }
    };
    LingtongYuHPanel.prototype.UpdateSelId = function (selId) {
        this.m_petId = selId;
        this.UpdateContent();
    };
    LingtongYuHPanel.prototype.UpdateContent = function () {
        var petId = this.m_petId;
        var petModel = GameGlobal.LingtongPetModel;
        var petInfo = petModel.GetInfo(petId);
        this.powerLabel.text = petInfo.GetYuhPower();
        var i;
        var len = this.itemArr.length;
        for (i = 0; i < len; i++) {
            var hunLv = petInfo.getHunByIndex(i + 1);
            LingtongConst.SetPetHunIcon(this.itemArr[i], petInfo.suitConfigId, i + 1, hunLv);
            this.itemArr[i].redPoint.visible = petModel.IsRedPointUpHuns(petModel.GetInfo(petId), i + 1);
        }
        // this.skillIconImg.source = PetConst.GetSuitSkillIcon(petInfo.suitConfigId);
        var petHunCfg = GameGlobal.Config.BabyHunLvConfig;
        var petHunSuitConfig = GameGlobal.Config.BabyHunSuitConfig;
        // let j:number = 0;
        // let petHunCfgObj = petHunCfg[petInfo.suitConfigId][petInfo.getHunByIndex[i] || 1];
        var allHunAttrs = petModel.getCurrentHunAllAttr(this.m_petId);
        len = allHunAttrs.length;
        for (i = 0; i < len; i++) {
            this.attrGroup.getChildAt(i).text = AttributeData.getAttStrByType(allHunAttrs[i], 0, "：", false, 1);
            // j ++;
        }
        var currentPetHunSuitObj = petHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0];
        var nextPetHunSuitObj = petHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() : 0];
        this.name_txt.text = "Lv." + currentPetHunSuitObj.level + " " + LingtongConst.GetSuitName(petInfo.suitConfigId);
        var desc = petHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0].desc;
        if (!petInfo.getSuitId()) {
            desc += "(未激活)";
        }
        this.desc_txt.text = "套装效果：" + desc;
        if (nextPetHunSuitObj) {
            var c = petInfo.getActiveHunCount(nextPetHunSuitObj.level) >= LingtongPetModel.MAX_SUIT_LEVEL_ID ? Color.GetStr(Color.l_green_1) : Color.GetStr(Color.Red);
            this.need_txt.textFlow = TextFlowMaker.generateTextFlow("Lv." + nextPetHunSuitObj.level + " " + LingtongConst.GetSuitName(petInfo.suitConfigId) + "（|C:" + c + "&T:" + petInfo.getActiveHunCount(nextPetHunSuitObj.level) + "|/" + "" + LingtongPetModel.MAX_HUN_NUM + "）");
            this.fullTip.visible = false;
        }
        else {
            this.fullTip.visible = true;
        }
        this.getwayLabel.visible = this.activeBtn.visible = this.need_txt.visible = !this.fullTip.visible;
        this.activeBtn.label = petInfo.getSuitId() ? "升级套装" : "激活套装";
        UIHelper.ShowRedPoint(this.activeBtn, petModel.IsRedPointSuit(petInfo));
        UIHelper.ShowRedPoint(this.smeltBtn, petModel.IsRedPointSmelt());
    };
    Object.defineProperty(LingtongYuHPanel.prototype, "selectId", {
        set: function (value) {
            this.m_petId = value;
        },
        enumerable: true,
        configurable: true
    });
    LingtongYuHPanel.NAME = "御魂";
    return LingtongYuHPanel;
}(BaseView));
__reflect(LingtongYuHPanel.prototype, "LingtongYuHPanel");
//# sourceMappingURL=LingtongYuHPanel.js.map