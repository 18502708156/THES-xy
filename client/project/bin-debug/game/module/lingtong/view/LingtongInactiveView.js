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
var LingtongInactiveView = (function (_super) {
    __extends(LingtongInactiveView, _super);
    /////////////////////////////////////////////////////////////////////////////
    function LingtongInactiveView() {
        var _this = _super.call(this) || this;
        _this.skinName = "LingtongInactiveSkin";
        _this.check0.selected = true;
        _this.check1.selected = false;
        _this.powerLabel.visible = false;
        _this.skillList.itemRenderer = PetSkillIconItem;
        UIHelper.SetLinkStyleLabel(_this.goLabel);
        _this._AddChange(_this.check0, _this._OnChange);
        _this._AddChange(_this.check1, _this._OnChange);
        _this._AddClick(_this.actBtn, _this._OnActClick);
        _this._AddClick(_this.goLabel, _this._OnClick);
        _this._AddItemClick(_this.skillList, _this._OnItemClick);
        return _this;
    }
    LingtongInactiveView.prototype._OnItemClick = function (e) {
        var index = e.itemIndex;
        if (index == 0) {
            ViewManager.ins().open(PetSkillTipPanel, 0, e.itemRenderer.data);
        }
        else {
            ViewManager.ins().open(PetSkillTipPanel, 2, e.itemRenderer.data.id);
        }
    };
    LingtongInactiveView.prototype.OnOpen = function () {
        // this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(GameGlobal.LingtongModel.SkinConfig[1].pid))
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.LINGTONG_ACT_ITEM, this._OnSelect);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateInfoLabel);
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateEquip);
        this._OnSelect();
        this.UpdateInfoLabel();
    };
    LingtongInactiveView.prototype._OnClick = function () {
        // ViewManager.ins().open(DestinyNiWin)
        // ViewManager.ins().openIndex(LingtongMainPanel, 3)
        ViewManager.ins().openIndex(DestinyUpWin, 1);
    };
    LingtongInactiveView.prototype._OnActClick = function () {
        var index = this.check0.selected ? 1 : 2;
        var str = index == 1 ? "男童" : "女童";
        WarnWin.show("\u662F\u5426\u786E\u5B9A\u9009\u62E9|C:" + Color.GetStr(Color.l_green_1) + "&T:\u3010" + str + "\u3011|\uFF0C\u9009\u62E9\u6FC0\u6D3B\u540E\u65E0\u6CD5\u53D8\u66F4\u6027\u522B", function () {
            GameGlobal.LingtongAttrModel.SendActive(index);
        }, this);
    };
    LingtongInactiveView.prototype.UpdateInfoLabel = function () {
        var datas = GameGlobal.DestinyController.getUseDestinyData();
        this.info2Label.text = "\u9700\u8981\u4F69\u6234" + GameGlobal.Config.BabyBasisConfig.material.num + "\u4E2A" + ItemBase.QUALITY_NAME_STR[GameGlobal.Config.BabyBasisConfig.material.quality] + "\u54C1\u8D28\u7684\u547D\u683C\u624D\u80FD\u6FC0\u6D3B\u7075\u7AE5";
        var act = GameGlobal.LingtongAttrModel.mRedPoint.GetIndexAct();
        if (act) {
            this.actBtn.visible = true;
            this.goLabel.visible = false;
        }
        else {
            this.actBtn.visible = false;
            this.goLabel.visible = true;
        }
        this.UpdateEquip();
    };
    LingtongInactiveView.prototype.UpdateEquip = function () {
        var datas = GameGlobal.DestinyController.getUseDestinyData();
        var i = 0;
        for (var i_1 = 0; i_1 < 6; i_1++) {
            var data = datas[i_1];
            var item = this.itemGroup.getChildAt(i_1);
            if (item) {
                item.onUpdate(i_1, data);
            }
        }
        this.infoLabel.textFlow = ConsumeLabel.GetValueColor(GameGlobal.LingtongAttrModel.mRedPoint.GetActCount(), GameGlobal.Config.BabyBasisConfig.material.num);
    };
    LingtongInactiveView.prototype.UpdateContent = function () {
        this.UpdateInfoLabel();
    };
    LingtongInactiveView.prototype._OnChange = function (e) {
        if (e.currentTarget == this.check0) {
            this.check1.selected = false;
        }
        else {
            this.check0.selected = false;
        }
        this._OnSelect();
    };
    LingtongInactiveView.prototype._OnSelect = function () {
        var index = this.check0.selected ? 1 : 2;
        LingtongViewHelper.SetRole(this.petShowPanel, index, 1);
        var config = GameGlobal.Config.BabyActivationConfig[index];
        this.skillList.dataProvider = new eui.ArrayCollection(config.skill.concat(config.buffskill));
        // this.needItemView.SetItemId(config.material.id, config.material.count)
        // this.actBtn.visible = GameGlobal.UserBag.GetCount(config.material.id) >= config.material.count
        // this.getwayLabel.SetId(config.material.id)
    };
    return LingtongInactiveView;
}(BaseView));
__reflect(LingtongInactiveView.prototype, "LingtongInactiveView");
//# sourceMappingURL=LingtongInactiveView.js.map