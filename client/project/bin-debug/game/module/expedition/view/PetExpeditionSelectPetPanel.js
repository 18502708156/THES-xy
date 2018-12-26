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
var PetExpeditionSelectPetPanel = (function (_super) {
    __extends(PetExpeditionSelectPetPanel, _super);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function PetExpeditionSelectPetPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionSelectPetSkin";
        return _this;
    }
    PetExpeditionSelectPetPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.list.itemRenderer = PetExpeditionSelectPetitem;
    };
    PetExpeditionSelectPetPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "选择灵童";
        var list = GameGlobal.ExpeditionModel.GetFreeList();
        this.list.dataProvider = new eui.ArrayCollection(list);
    };
    PetExpeditionSelectPetPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    PetExpeditionSelectPetPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetExpeditionSelectPetPanel;
}(BaseEuiView));
__reflect(PetExpeditionSelectPetPanel.prototype, "PetExpeditionSelectPetPanel");
var PetExpeditionSelectPetitem = (function (_super) {
    __extends(PetExpeditionSelectPetitem, _super);
    function PetExpeditionSelectPetitem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PetExpeditionSelectPetitem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClick, this);
    };
    PetExpeditionSelectPetitem.prototype._onClick = function () {
        GameGlobal.ExpeditionModel.recordIds.splice(PetExpeditionSelectPetPanel.taskOtherSite, 1, this.data.getId());
        GameGlobal.MessageCenter.dispatch(MessageDef.PET_ADVENTURE_SELECT_PET);
        ViewManager.ins().close(PetExpeditionSelectPetPanel);
    };
    PetExpeditionSelectPetitem.prototype.dataChanged = function () {
        var petInfo = this.data;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[PetExpeditionDetailsPanel.taskId];
        this.icon0.data = petInfo.mId;
        this.power_txt.text = "" + petInfo.getPower();
        this.name_txt.text = GameGlobal.Config.BabyActivationConfig[petInfo.mId].name;
        var petHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0];
        this.desc_txt.text = petHunSuitObj.desc;
        this.desc_txt.textColor = petInfo.mHunShit >= petHunSuitObj.level ? 0x017094 : Color.Gray;
        if (petInfo.mLevel < taskConfig.levellimit) {
            this.Lv_txt.text = "\u7075\u7AE5\u7B49\u7EA7\u9700\u8981" + taskConfig.levellimit + "\u7EA7";
            this.Lv_txt.visible = true;
        }
        else {
            this.Lv_txt.visible = false;
        }
        this.result_img.visible = !this.Lv_txt.visible;
        if (this.result_img.visible)
            this.result_img.source = ExpeditionConst.GetFightResultImgForSelect(petInfo.getPower(), PetExpeditionDetailsPanel.taskId, PetExpeditionSelectPetPanel.taskOtherSite);
        this.btn.visible = !this.Lv_txt.visible;
    };
    return PetExpeditionSelectPetitem;
}(eui.ItemRenderer));
__reflect(PetExpeditionSelectPetitem.prototype, "PetExpeditionSelectPetitem");
//# sourceMappingURL=PetExpeditionSelectPetPanel.js.map