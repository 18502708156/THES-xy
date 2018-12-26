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
var KaiFuTargetFightPanel = (function (_super) {
    __extends(KaiFuTargetFightPanel, _super);
    function KaiFuTargetFightPanel() {
        var _this = _super.call(this) || this;
        _this.canGetCount = 0;
        _this.skinName = "KaiFuTargetFightPanelSkin";
        _this.activityType = ActivityKaiFuFuncType.ACT_22_OrangePetTarget;
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 114);
        return _this;
    }
    KaiFuTargetFightPanel.prototype.childrenCreated = function () {
        this.list.itemRenderer = TargetGuanQiaItem;
        this.list.dataProvider = new eui.ArrayCollection();
        this.awardList.itemRenderer = ItemBaseNotName;
        this.awardList.dataProvider = new eui.ArrayCollection();
        this.bar.snapInterval = 0;
        this.bar.maximum = 100;
        this.bar.labelFunction = function (cur, max) {
            //return Math.floor(cur * 100 / max) + "%"
            return "";
        };
    };
    KaiFuTargetFightPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.list.selectedIndex = -1;
        this.AddClick(this.getwayLabel, this._OnClick);
        this.AddClick(this.challenge_btn, this._OnClick);
        this.AddClick(this.leftBtn, this._OnClick);
        this.AddClick(this.rightBtn, this._OnClick);
        this.AddItemClick(this.list, this.itemClick);
        this.UpdateContent();
        this.AddLoopTimer(1000, this.updateTime);
        if (this.list.selectedIndex >= 5) {
            this.mListLRBtnCtrl.SetLeftIndex(5);
        }
        this.mListLRBtnCtrl.OnRefresh();
        this.setAwardPetIcon();
    };
    KaiFuTargetFightPanel.prototype.setAwardPetIcon = function () {
        var config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        var itemData = config[0].showitem2;
        this.awardPetIcon.data = itemData.id;
        this.awardPetName_label.text = config[0].showtext;
        //this.awardPetName_label.text = itemConfig.name;
    };
    KaiFuTargetFightPanel.prototype.itemClick = function (e) {
        this.setCurInfo();
    };
    KaiFuTargetFightPanel.prototype.UpdateContent = function () {
        if (!this.visible)
            return;
        if (!this._activityId)
            return;
        var arrlist = this.getReward();
        this.list.dataProvider.replaceAll(arrlist);
        if (this.list.selectedIndex == -1)
            this.list.selectedIndex = 0;
        this.setCurInfo();
        this.setProgressBarData();
    };
    KaiFuTargetFightPanel.prototype.setProgressBarData = function () {
        var curCount = 0;
        if (this.leftBtn.visible == true) {
            if (this.canGetCount >= 5) {
                curCount = 5;
            }
            else {
                curCount = this.canGetCount - 1;
            }
        }
        else {
            if (this.canGetCount > 5) {
                curCount = this.canGetCount - 5 - 1;
            }
            else {
                curCount = -1;
            }
        }
        this.bar.value = curCount * 25;
        for (var i = 0; i < this.progressIconGroup.numChildren; i++) {
            if (i <= curCount) {
                this.progressIconGroup.getChildAt(i).source = "ui_yuan";
            }
            else {
                this.progressIconGroup.getChildAt(i).source = "ui_yuan_quse";
            }
        }
    };
    KaiFuTargetFightPanel.prototype.setCurInfo = function () {
        var itemData = this.list.selectedItem;
        if (itemData == null)
            return;
        var config = itemData.cfg;
        var awards = config.showreward;
        this.roleShowpanel.Clear();
        if (config.bossid) {
            this.roleShowpanel.SetBody(PetConst.GetSkin(config.bossid));
        }
        this.guanQia_label.text = "第 " + config.gid + " 关";
        var petConfig = GameGlobal.Config.petBiographyConfig[config.bossid];
        if (petConfig != null) {
            this.powerLabel.text = ItemConfig.CalcAttrScoreValue(petConfig.attrs);
        }
        this.challenge_btn.label = "挑 战";
        this.awardList.dataProvider = new eui.ArrayCollection(awards);
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(config.Id);
        if (activityData == null)
            return;
        var canGet = activityData.canGetRecordByIndex(config.gid);
        var hasGet = activityData.GetRecordByIndex(config.gid);
        this.challenge_btn.visible = true;
        this.hasGet_img.visible = false;
        if (canGet && !hasGet) {
            this.challenge_btn.label = "领 取";
        }
        else if (!canGet && !hasGet) {
            this.challenge_btn.label = "挑 战";
        }
        else if (hasGet) {
            this.challenge_btn.visible = false;
            this.hasGet_img.visible = true;
        }
        UIHelper.ShowRedPoint(this.challenge_btn, canGet && !hasGet);
    };
    KaiFuTargetFightPanel.prototype.updateTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (activityData) {
            this.time_txt.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString());
        }
        else {
            this.time_txt.text = "活动未开启";
        }
    };
    KaiFuTargetFightPanel.prototype.getReward = function () {
        this.canGetCount = 0;
        var arr = [];
        var config = ActivityConst.GetConfigByActityType(this.activityType)[this._activityId];
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        var i;
        var len = config.length;
        for (i = 0; i < len; i++) {
            var cfgObj = config[i];
            if (cfgObj.Id != this._activityId) {
                continue;
            }
            var o = {};
            o.cfg = cfgObj;
            o.actType = this.activityType;
            if (activityData) {
                var canGet = activityData.canGetRecordByIndex(cfgObj.gid);
                var hasGet = activityData.GetRecordByIndex(cfgObj.gid);
                if (canGet || hasGet) {
                    this.canGetCount++;
                }
                if (this.list.selectedIndex == -1) {
                    if (!canGet && !hasGet) {
                        this.list.selectedIndex = i;
                    }
                }
            }
            arr.push(o);
        }
        return arr;
    };
    KaiFuTargetFightPanel.prototype._OnClick = function (e) {
        if (this.list.selectedItem == null)
            return;
        var itemData = this.list.selectedItem;
        if (e.currentTarget == this.getwayLabel) {
            var petId = itemData.cfg.bossid;
            var petConfig = GameGlobal.Config.petBiographyConfig[petId];
            if (petConfig)
                ViewManager.ins().open(PetInfoPanel, petConfig);
        }
        else if (e.currentTarget == this.challenge_btn) {
            if (this.challenge_btn.label == "挑 战") {
                GameGlobal.ActivityKaiFuModel.sendPetFightInfo(itemData.cfg.Id);
            }
            else if (this.challenge_btn.label == "领 取") {
                GameGlobal.ActivityKaiFuModel.sendReward(itemData.cfg.Id, itemData.cfg.gid);
            }
        }
        else if (e.currentTarget == this.leftBtn) {
            this.setProgressBarData();
        }
        else if (e.currentTarget == this.rightBtn) {
            this.setProgressBarData();
        }
    };
    KaiFuTargetFightPanel.prototype.OnClose = function () {
    };
    return KaiFuTargetFightPanel;
}(BaseView));
__reflect(KaiFuTargetFightPanel.prototype, "KaiFuTargetFightPanel");
var TargetGuanQiaItem = (function (_super) {
    __extends(TargetGuanQiaItem, _super);
    function TargetGuanQiaItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    TargetGuanQiaItem.prototype.childrenCreated = function () {
    };
    TargetGuanQiaItem.prototype.dataChanged = function () {
        if (this.data == null)
            return;
        var type = this.data.type;
        var cfgObj = this.data.cfg;
        var itemId = cfgObj.showitem.id;
        var itemConfig = GameGlobal.Config.ItemConfig[itemId];
        this.item.setData(itemConfig);
        this.lbName.text = itemConfig.name;
        this.lbName.textColor = ItemBase.QUALITY_COLOR[itemConfig.quality];
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(cfgObj.Id);
        if (activityData) {
            var canGet = activityData.canGetRecordByIndex(cfgObj.gid);
            var hasGet = activityData.GetRecordByIndex(cfgObj.gid);
            this.hasGetAward_img.visible = canGet || hasGet;
            UIHelper.ShowRedPoint(this, canGet && hasGet);
        }
    };
    return TargetGuanQiaItem;
}(eui.ItemRenderer));
__reflect(TargetGuanQiaItem.prototype, "TargetGuanQiaItem");
//# sourceMappingURL=KaiFuTargetFightPanel.js.map