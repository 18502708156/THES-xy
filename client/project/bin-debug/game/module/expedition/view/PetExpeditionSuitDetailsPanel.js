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
var PetExpeditionSuitDetailsPanel = (function (_super) {
    __extends(PetExpeditionSuitDetailsPanel, _super);
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function PetExpeditionSuitDetailsPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionSuitDetailsSkin";
        return _this;
    }
    PetExpeditionSuitDetailsPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.list.itemRenderer = PetExpeditionSuitDetailsItem;
    };
    PetExpeditionSuitDetailsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.title = "套装详情";
        this.updateContent();
    };
    PetExpeditionSuitDetailsPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    PetExpeditionSuitDetailsPanel.prototype.updateContent = function () {
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.ExpeditionModel.recordIds);
        this.desc_txt.text = PetExpeditionDetailsPanel.getdescStr(PetExpeditionDetailsPanel.taskId, GameGlobal.ExpeditionModel.recordIds);
    };
    PetExpeditionSuitDetailsPanel.getdescStr = function (taskId, pets) {
        var str;
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        var i;
        var len = taskConfig.pet.length;
        var rate = 0;
        for (i = 0; i < len; i++) {
            var r = 0;
            var petInfo = GameGlobal.LingtongPetModel.GetInfo(pets[i]);
            ;
            if (petInfo) {
                var petHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0];
                if (petHunSuitObj)
                    r += petHunSuitObj.attrs;
            }
            rate += r;
        }
        str = ExpeditionConst.GetTaskTypeName(taskConfig.type) + "类型任务探险成功率+" + rate + "%";
        return str;
    };
    PetExpeditionSuitDetailsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetExpeditionSuitDetailsPanel;
}(BaseEuiView));
__reflect(PetExpeditionSuitDetailsPanel.prototype, "PetExpeditionSuitDetailsPanel");
var PetExpeditionSuitDetailsItem = (function (_super) {
    __extends(PetExpeditionSuitDetailsItem, _super);
    function PetExpeditionSuitDetailsItem() {
        return _super.call(this) || this;
    }
    PetExpeditionSuitDetailsItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    PetExpeditionSuitDetailsItem.prototype.dataChanged = function () {
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[PetExpeditionDetailsPanel.taskId];
        var petInfo = GameGlobal.LingtongPetModel.GetInfo(this.data);
        this.icon0.data = this.data;
        if (petInfo) {
            var currentPetHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0];
            if (petInfo.getSuitId() > 0) {
                this.name_txt.text = "Lv." + currentPetHunSuitObj.level + " " + LingtongConst.GetSuitName(petInfo.suitConfigId);
                this.desc_txt.text = "" + currentPetHunSuitObj.desc;
            }
            // else
            // {
            // 	let nextPetHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId()?petInfo.getSuitId():0]
            // 	this.desc_txt.text = "" + nextPetHunSuitObj.desc
            // 	this.name_txt.text = "Lv." + currentPetHunSuitObj.level +" "+ PetConst.GetSuitName(petInfo.suitConfigId) + "（"+petInfo.getActiveHunCount(nextPetHunSuitObj.level) +"/"+""+PetModel.MAX_HUN_NUM + "）"
            // }
            this.desc_txt.textColor = petInfo.mHunShit >= currentPetHunSuitObj.level ? 0x017094 : Color.Gray;
        }
    };
    return PetExpeditionSuitDetailsItem;
}(eui.ItemRenderer));
__reflect(PetExpeditionSuitDetailsItem.prototype, "PetExpeditionSuitDetailsItem");
//# sourceMappingURL=PetExpeditionSuitDetailsPanel.js.map