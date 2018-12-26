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
var LingtongHunUpgradePanel = (function (_super) {
    __extends(LingtongHunUpgradePanel, _super);
    function LingtongHunUpgradePanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongHunUpgradeSkin";
        return _this;
    }
    LingtongHunUpgradePanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        UIHelper.SetLinkStyleLabel(this.getwayLabel);
        this.item.visible = false;
    };
    LingtongHunUpgradePanel.prototype.OnOpen = function () {
        var par = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            par[_i] = arguments[_i];
        }
        this.petId = par[0];
        this.index = par[1];
        this.commonDialog.OnAdded(this);
        this.observe(MessageDef.LINGTONG_YU_UPDATE_INFO, this._UpdateInfo);
        this.item.visible = true;
        this.item.currentState = "icon1"; //+ this.index
        var petInfo = GameGlobal.LingtongPetModel.GetInfo(this.petId);
        this.AddClick(this.getwayLabel, this._OnClick);
        this.AddClick(this.activeBtn, this._OnClick);
        // this.observe(MessageDef.PET_UPDATE_HUNS, this.UpdateContent)
        this.UpdateContent();
        if (!this.mc) {
            this.mc = new MovieBaseObject;
        }
        this.effGroup.addChild(this.mc);
        this.mc.LoadByUrl(ResDataPath.GetUIEffePath("ui_eff_yuhun_00" + this.index));
    };
    LingtongHunUpgradePanel.prototype._UpdateInfo = function () {
        this.UpdateContent();
    };
    LingtongHunUpgradePanel.prototype.UpdateContent = function () {
        var petId = this.petId;
        var petModel = GameGlobal.LingtongPetModel;
        var petInfo = petModel.GetInfo(petId);
        var hunLv = petInfo.getHunByIndex(this.index);
        var id;
        var count;
        var needCount;
        var itemcfg;
        var petHunActObj = GameGlobal.Config.BabyHunActConfig[petInfo.suitConfigId][this.index - 1];
        if (hunLv == 0) {
            id = petHunActObj.hunAct.id;
            count = UserBag.ins().getBagGoodsCountById(0, id);
            needCount = petHunActObj.hunAct.count;
        }
        else {
            var petHunLvObj = GameGlobal.Config.BabyHunLvConfig[petInfo.suitConfigId][hunLv - 1];
            if (petHunLvObj.promotepiece) {
                needCount = petHunLvObj.promotepiece.count;
                id = petHunLvObj.promotepiece.id;
                count = UserBag.ins().getBagGoodsCountById(0, id);
            }
        }
        if (id) {
            itemcfg = GameGlobal.Config.ItemConfig[id];
            // this.name_txt.text = "Lv." + hunLv + " " + itemcfg.name;
            var c = count >= needCount ? 'ff00' : 'ff0000';
            this.need_txt.mConsumeColor = ItemBase.QUALITY_COLOR[itemcfg.quality];
            this.need_txt.SetItem(id, needCount, count);
            this.canUpGrade = count >= needCount && hunLv < LingtongPetModel.MAX_HUN_LEVEL;
        }
        // else {
        // 	this.name_txt.text = "Lv." + hunLv + " " + GameGlobal.Config.ItemConfig[GameGlobal.Config.BabyHunLvConfig[petInfo.suitConfigId][0].promotepiece.id].name;
        // }
        this.name_txt.text = "Lv." + hunLv + " " + petHunActObj.name;
        var currentAttrList = petModel.getHunAttrByIndex(petId, this.index);
        if (currentAttrList == null) {
            currentAttrList = petModel.getHunNextAttrByIndex(petId, this.index);
        }
        var nextAttrList;
        if (hunLv == 0) {
            nextAttrList = petModel.getHunTopAttrByIndex(petId, this.index);
            this.activeBtn.label = "激活";
            this.curAttrZi.text = "激活属性";
            this.nextAttrZi.text = "极品属性";
        }
        else {
            nextAttrList = petModel.getHunNextAttrByIndex(petId, this.index);
            this.activeBtn.label = "升级";
            this.curAttrZi.text = "当前属性";
            this.nextAttrZi.text = "下级属性";
        }
        this.quality_txt1.text = "Lv." + (hunLv || 1);
        this.attr_txt1.text = "战斗力+" + ItemConfig.CalcAttrScoreValue(currentAttrList);
        this.attr_txt10.text = AttributeData.getAttStrByType(currentAttrList[0], 0, "+", false, "#ffffff");
        if (nextAttrList) {
            this.topLv_txt.visible = false;
            if (this.nextGroup.parent == null) {
                this.attrGroup.addChild(this.nextGroup);
            }
            this.quality_txt2.text = "Lv." + (hunLv == 0 ? LingtongPetModel.MAX_HUN_LEVEL : hunLv + 1);
            this.attr_txt2.text = "战斗力+" + ItemConfig.CalcAttrScoreValue(nextAttrList);
            this.attr_txt20.text = AttributeData.getAttStrByType(nextAttrList[0], 0, "+", false, "#ffffff");
        }
        else {
            DisplayUtils.removeFromParent(this.nextGroup);
            this.topLv_txt.visible = true;
        }
        this.activeBtn.visible = this.getwayLabel.visible = this.need_txt.visible = !this.topLv_txt.visible;
        this.arrow.visible = this.nextGroup.parent ? true : false;
    };
    LingtongHunUpgradePanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
        this.removeObserve();
    };
    LingtongHunUpgradePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.activeBtn:
                if (this.arrow.visible == false) {
                    UserTips.InfoTip("已经升到满级");
                    return;
                }
                if (!this.canUpGrade) {
                    UserTips.InfoTip("材料不足");
                    return;
                }
                var petModel = GameGlobal.LingtongPetModel;
                var petInfo = petModel.GetInfo(this.petId);
                if (petInfo.getHunByIndex(this.index) != 0) {
                    GameGlobal.LingtongPetModel.SendHunUpgrade(this.petId, this.index);
                }
                else {
                    GameGlobal.LingtongPetModel.SendHunActive(this.petId, this.index);
                }
                break;
            case this.getwayLabel:
                UserWarn.ins().setBuyGoodsWarn(2007301, 1);
                this.CloseSelf();
                break;
        }
    };
    LingtongHunUpgradePanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return LingtongHunUpgradePanel;
}(BaseEuiView));
__reflect(LingtongHunUpgradePanel.prototype, "LingtongHunUpgradePanel");
//# sourceMappingURL=LingtongHunUpgradePanel.js.map