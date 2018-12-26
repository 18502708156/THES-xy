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
var PetExpeditionDetailsPanel = (function (_super) {
    __extends(PetExpeditionDetailsPanel, _super);
    function PetExpeditionDetailsPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "PetExpeditionDetailsSkin";
        _this.commonWindowBg.SetTitle("任务详情");
        return _this;
    }
    PetExpeditionDetailsPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = PetExpeditionDetailsItem;
    };
    PetExpeditionDetailsPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        PetExpeditionDetailsPanel.taskId = param[0];
        this.commonWindowBg.OnAdded(this);
        this._AddClick(this.btn1, this.onTap);
        this._AddClick(this.btn2, this.onTap);
        this._AddClick(this.detail_txt, this.onTap);
        UIHelper.SetLinkStyleLabel(this.detail_txt);
        this.observe(MessageDef.PET_ADVENTURE_SELECT_PET, this.updateContent);
        this.updateContent();
    };
    PetExpeditionDetailsPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        GameGlobal.ExpeditionModel.recordIds = [];
    };
    PetExpeditionDetailsPanel.prototype.updateContent = function () {
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[PetExpeditionDetailsPanel.taskId];
        this.name_txt.text = taskConfig.name;
        this.type_txt.text = ExpeditionConst.GetTaskTypeName(taskConfig.type);
        this.imgType.source = ExpeditionConst.GetTaskTypeSource(taskConfig.type);
        this.item0.data = taskConfig.reward1[0];
        this.item1.data = taskConfig.reward2[0];
        this.lv_txt.text = taskConfig.levellimit;
        this.time_txt.text = DateUtils.format_12(taskConfig.lasttime * DateUtils.MS_PER_MINUTE, 2);
        this.lv_img.source = ExpeditionConst.GetQualitySource(taskConfig.quality);
        if (GameGlobal.ExpeditionModel.recordIds.length == 0) {
            GameGlobal.ExpeditionModel.recordIds = GameGlobal.ExpeditionModel.getOptimalPetsDodTask(PetExpeditionDetailsPanel.taskId);
        }
        this.list.dataProvider = new eui.ArrayCollection(taskConfig.pet);
        var ratio = GameGlobal.ExpeditionModel.CalcuAllRate(PetExpeditionDetailsPanel.taskId, GameGlobal.ExpeditionModel.recordIds);
        this.ratio_txt.text = ratio + "%";
        this.desc_txt.text = PetExpeditionDetailsPanel.getdescStr(PetExpeditionDetailsPanel.taskId, GameGlobal.ExpeditionModel.recordIds);
    };
    PetExpeditionDetailsPanel.getdescStr = function (taskId, pets) {
        var str = "套装技能生效：";
        var petTaskItemObj = GameGlobal.Config.ExploreTaskItemConfig[taskId];
        var i;
        var len = petTaskItemObj.pet.length;
        var rate = 0;
        for (i = 0; i < len; i++) {
            var r = 0;
            var petInfo = GameGlobal.LingtongPetModel.GetInfo(pets[i]);
            ;
            if (petInfo) {
                if (petTaskItemObj.type == petInfo.suitConfigId && petInfo.getSuitId() > 0) {
                    var petHunSuitObj = GameGlobal.Config.BabyHunSuitConfig[petInfo.suitConfigId][petInfo.getSuitId() ? petInfo.getSuitId() - 1 : 0];
                    if (petHunSuitObj)
                        r += petHunSuitObj.attrs;
                }
            }
            rate += r;
        }
        str += rate == 0 ? "暂无" : ExpeditionConst.GetTaskTypeName(petTaskItemObj.type) + "类型任务探险成功率+" + rate + "%";
        return str;
    };
    PetExpeditionDetailsPanel.prototype.onTap = function (e) {
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[PetExpeditionDetailsPanel.taskId];
        switch (e.currentTarget) {
            case this.btn1:
                if (GameGlobal.ExpeditionModel.recordIds.length < taskConfig.petnum) {
                    UserTips.InfoTip("上阵灵童数量不足");
                    return;
                }
                if (GameGlobal.ExpeditionModel.taskUsedTimes <= 0) {
                    UserTips.ErrorTip("剩余次数不足");
                    return;
                }
                GameGlobal.ExpeditionModel.SendExpedtionStart(PetExpeditionDetailsPanel.taskId, GameGlobal.ExpeditionModel.recordIds);
                ViewManager.ins().close(PetExpeditionDetailsPanel);
                UserTips.InfoTip("开始探险成功");
                break;
            case this.btn2:
                GameGlobal.ExpeditionModel.recordIds = GameGlobal.ExpeditionModel.getOptimalPetsDodTask(PetExpeditionDetailsPanel.taskId);
                if (GameGlobal.ExpeditionModel.recordIds.length < taskConfig.pet.length) {
                    UserTips.InfoTip("灵童数量不足");
                }
                else {
                    UserTips.InfoTip("一键布阵成功");
                }
                this.list.dataProvider = new eui.ArrayCollection(taskConfig.pet);
                GameGlobal.MessageCenter.dispatch(MessageDef.PET_ADVENTURE_SELECT_PET);
                break;
            case this.detail_txt:
                ViewManager.ins().open(PetExpeditionSuitDetailsPanel);
                break;
        }
    };
    PetExpeditionDetailsPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return PetExpeditionDetailsPanel;
}(BaseEuiView));
__reflect(PetExpeditionDetailsPanel.prototype, "PetExpeditionDetailsPanel");
var PetExpeditionDetailsItem = (function (_super) {
    __extends(PetExpeditionDetailsItem, _super);
    function PetExpeditionDetailsItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PetExpeditionDetailsItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTap, this);
    };
    PetExpeditionDetailsItem.prototype._onTap = function (e) {
        PetExpeditionSelectPetPanel.taskOtherSite = this.itemIndex;
        ViewManager.ins().open(PetExpeditionSelectPetPanel);
    };
    PetExpeditionDetailsItem.prototype.dataChanged = function () {
        var taskConfig = GameGlobal.Config.ExploreTaskItemConfig[PetExpeditionDetailsPanel.taskId];
        var lingTongPetInfo = GameGlobal.LingtongPetModel.GetInfo(GameGlobal.ExpeditionModel.recordIds[this.itemIndex]);
        this.power_txt0.text = "";
        if (lingTongPetInfo) {
            this.icon0.data = lingTongPetInfo.getId();
            this.power_txt0.text = "战斗力：" + lingTongPetInfo.getPower();
            var itemCfg = GameGlobal.Config.ItemConfig[lingTongPetInfo.getId()];
            // this.name_txt0.text = itemCfg.name;
            // this.name_txt0.textColor = ItemBase.QUALITY_COLOR[itemCfg.quality]
            this.result_img.source = ExpeditionConst.GetFightResultImg(lingTongPetInfo.getPower(), PetExpeditionDetailsPanel.taskId, this.itemIndex);
            var state = ExpeditionConst.GetFightState(lingTongPetInfo.getPower(), PetExpeditionDetailsPanel.taskId, this.itemIndex);
            var rate = ExpeditionConst.GetFightRate(lingTongPetInfo.getPower(), PetExpeditionDetailsPanel.taskId, this.itemIndex);
            this.ratioEx_txt.text = rate + "%";
        }
        this.result_img.visible = this.power_txt0.visible = this.ratioEx_txt.visible = this.icon0.visible;
        var otherPet = this.data;
        this.icon1.data = otherPet.id;
        this.power_txt1.text = "战斗力：" + otherPet.ce;
        // this.name_txt1.text = GameGlobal.Config.BabyActivationConfig[otherPet.id].name;
    };
    return PetExpeditionDetailsItem;
}(eui.ItemRenderer));
__reflect(PetExpeditionDetailsItem.prototype, "PetExpeditionDetailsItem");
//# sourceMappingURL=PetExpeditionDetailsPanel.js.map