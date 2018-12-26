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
var RmbGiftPanel = (function (_super) {
    __extends(RmbGiftPanel, _super);
    function RmbGiftPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this._activityId = 9;
        _this._rechargeId = 0;
        _this.skinName = 'RmbGiftPanelSkin';
        return _this;
    }
    RmbGiftPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
        this.itemList.dataProvider = null;
    };
    RmbGiftPanel.prototype.onClick = function (e) {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (!activityData)
            return;
        if (activityData.canGetRecordByIndex(activityData.reachday + 1)) {
            var config = activityData.GetConfig()[activityData.reachday];
            GameGlobal.ActivityKaiFuModel.sendReward(this._activityId, config.index);
            return;
        }
        GameGlobal.RechargeModel.sendRecharge(this._rechargeId);
    };
    RmbGiftPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.dialogMask, this.CloseSelf);
        this.AddClick(this.dialogCloseBtn, this.CloseSelf);
        this.AddClick(this.chargeBtn, this.onClick);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.updateContent);
        this.updateContent();
    };
    RmbGiftPanel.prototype.updateContent = function () {
        this.setCurContent();
        this.setNextContent();
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (!activityData)
            return;
        this.chargeBtn.label = activityData.canGetRecordByIndex(activityData.reachday + 1) ? "领取奖励" : "立即购买";
    };
    RmbGiftPanel.prototype.setCurContent = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (!activityData) {
            return;
        }
        if (activityData.AllGotten()) {
            this.CloseSelf();
            return;
        }
        this.chargeBtn.visible = activityData.runday > activityData.reachday;
        this.labTip.visible = !this.chargeBtn.visible;
        if (!TimerManager.ins().isExists(this.updateTime, this)) {
            this.AddTimer(1000, 0, this.updateTime);
        }
        this.updateTime();
        var config = activityData.GetConfig()[activityData.reachday];
        if (!config) {
            return;
        }
        this.itemList.dataProvider = new eui.ArrayCollection(config.gift);
        this.titleImg.source = config.title;
        this.titleLabel.text = config.name;
        this._rechargeId = config.rechargeid;
        this.nameTxt.text = config.showname;
        this.valueTxt.textFlow = TextFlowMaker.generateTextFlow(config.des);
        this.power.text = config.power;
        this.showImg.visible = config.showtype == 0;
        this.rideShowPanel.visible = config.showtype == 1;
        this.roleShowPanel.visible = config.showtype == 2;
        if (config.showtype == 0) {
            this.showImg.source = config.show;
        }
        else if (config.showtype == 2) {
            var clothid = void 0;
            if (config.showg && GameGlobal.actorModel.sex == 1) {
                clothid = config.showg;
            }
            else {
                clothid = config.show;
            }
            var role = SubRoles.ins().GetRoleData();
            var skinConfig = GameGlobal.Config.RideSkinConfig[role.mRideId];
            var showData = new RoleShowData;
            showData.job = GameGlobal.actorModel.job;
            showData.sex = GameGlobal.actorModel.sex;
            showData.clothID = clothid;
            showData.rideId = skinConfig ? skinConfig.pid : 0;
            this.roleShowPanel.SetAll(showData);
        }
        else {
            if (config.showg && GameGlobal.actorModel.sex == 1) {
                this.rideShowPanel.SetBodyId(config.showg);
            }
            else {
                this.rideShowPanel.SetBodyId(config.show);
            }
        }
        this.setCurPos(config);
    };
    RmbGiftPanel.prototype.updateTime = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var date = new Date(GameServer.serverTimeMilli);
        var restTime = DateUtils.MS_PER_DAY - (date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()) * 1000;
        this.timeTxt.text = DateUtils.format_1(restTime);
    };
    RmbGiftPanel.prototype.setNextContent = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this._activityId);
        if (!activityData)
            return;
        var config = activityData.GetConfig()[activityData.reachday + 1];
        this.nextGroup.visible = config != null && activityData.reachday < activityData.runday;
        if (!this.nextGroup.visible)
            return;
        this.labNextPower.text = "\u6218\u529B\u76F4\u5347 " + config.power;
        this.nextShowImg.visible = config.showtype == 0;
        this.nextRideShowPanel.visible = config.showtype == 1;
        this.nextRoleShowPanel.visible = config.showtype == 2;
        if (config.showtype == 0) {
            this.nextShowImg.source = config.show;
        }
        else if (config.showtype == 2) {
            var clothid = void 0;
            if (config.showg && GameGlobal.actorModel.sex == 1) {
                clothid = config.showg;
            }
            else {
                clothid = config.show;
            }
            var role = SubRoles.ins().GetRoleData();
            var skinConfig = GameGlobal.Config.RideSkinConfig[role.mRideId];
            var showData = new RoleShowData;
            showData.job = GameGlobal.actorModel.job;
            showData.sex = GameGlobal.actorModel.sex;
            showData.clothID = clothid;
            showData.rideId = skinConfig ? skinConfig.pid : 0;
            this.nextRoleShowPanel.SetAll(showData);
        }
        else {
            if (config.showg && GameGlobal.actorModel.sex == 1)
                this.nextRideShowPanel.SetBodyId(config.showg);
            else
                this.nextRideShowPanel.SetBodyId(config.show);
        }
        this.setNextPos(config);
    };
    RmbGiftPanel.prototype.setCurPos = function (config) {
        this.rideShowPanel.y = 380;
        var aniType = config.itemtype;
        if (aniType == 2) {
            this.rideShowPanel.y = 490;
        }
    };
    RmbGiftPanel.prototype.setNextPos = function (config) {
        this.nextRideShowPanel.y = 120;
        this.nextRideShowPanel.x = 94;
        this.nextShowImg.y = 21;
        var aniType = config.itemtype;
        if (aniType == 2) {
            this.nextRideShowPanel.x = 110;
            this.nextRideShowPanel.y = 170;
            return;
        }
        if (aniType == 3) {
            this.nextRideShowPanel.y = 95;
            return;
        }
        if (aniType == 4) {
            this.nextShowImg.y = 0;
            return;
        }
        if (aniType == 6) {
            this.nextShowImg.y = 0;
        }
    };
    RmbGiftPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return RmbGiftPanel;
}(BaseEuiView));
__reflect(RmbGiftPanel.prototype, "RmbGiftPanel");
//# sourceMappingURL=RmbGiftPanel.js.map