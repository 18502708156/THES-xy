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
var FirstChargePanel = (function (_super) {
    __extends(FirstChargePanel, _super);
    function FirstChargePanel() {
        var _this = _super.call(this) || this;
        _this.posY = 0;
        _this.hasPos = false;
        _this.skinName = 'FirstChargePanelSkin';
        return _this;
    }
    FirstChargePanel.prototype.childrenCreated = function () {
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.tabList, this.leftBtn, this.rightBtn, 152);
        this.itemList.itemRenderer = ItemBaseNotName;
        this.itemList.dataProvider = null;
        FirstChargePanel.lists = CommonUtils.GetArray(GameGlobal.Config.FirstRechargeConfig);
        var labels = [];
        for (var _i = 0, _a = FirstChargePanel.lists; _i < _a.length; _i++) {
            var config = _a[_i];
            labels.push('充值' + config.recharge + '元\n' + config.buttondes);
        }
        this.tabList.dataProvider = new eui.ArrayCollection(labels);
        this.tabList.itemRenderer = BtnTab5Item;
        this.tabList.selectedIndex = 1;
    };
    FirstChargePanel.prototype.onClick = function (e) {
        var config = FirstChargePanel.lists[this.tabList.selectedIndex];
        if (this.chargeBtn.label == '立即充值') {
            // RechargeWin.Open()
            GameGlobal.RechargeModel.sendRecharge(config.buyid);
        }
        else {
            GameGlobal.RechargeModel.sendRechargeFirstReward(config.id);
        }
    };
    FirstChargePanel.prototype.onItemClick = function (e) {
        this.UpdateContent();
    };
    FirstChargePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.AddClick(this.chargeBtn, this.onClick);
        this.AddItemClick(this.tabList, this.onItemClick);
        this.observe(MessageDef.RECHARGE_FIRST_UPDATE, this.UpdateContent);
    };
    FirstChargePanel.prototype._NewMovieObject = function () {
        var obj = new MovieObject;
        var scale = 1;
        obj.scaleX = obj.scaleY = scale;
        obj.x = (this.width * scale) >> 1;
        obj.y = (this.height * scale) >> 1;
        this.addChild(obj);
        return obj;
    };
    FirstChargePanel.prototype.onEnterFrame = function (e) {
        if (this._movie) {
            if (this.posY < -16) {
                this.hasPos = true;
            }
            else if (this.posY == 0) {
                this.hasPos = false;
            }
            if (this.hasPos) {
                this.posY++;
            }
            else {
                this.posY--;
            }
            this._movie.y = this.roleShowPanel.y + 54 + this.posY >> 0;
        }
    };
    FirstChargePanel.prototype.UpdateContent = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        UIHelper.ListRefresh(this.tabList);
        var config = FirstChargePanel.lists[this.tabList.selectedIndex];
        this.itemList.dataProvider = new eui.ArrayCollection(config.item);
        this.titleImg.source = config.title;
        if (this.roleShowPanel)
            this.roleShowPanel.ClearCache();
        if (this.tabList.selectedIndex == 3)
            this.roleShowPanel.y = 420;
        else
            this.roleShowPanel.y = 368;
        if (config.showtype == 0) {
            this.showImg.source = config.show;
            this.showImg.visible = true;
            this.roleShowPanel.visible = false;
            if (this._movie) {
                this._movie.ClearCache();
            }
        }
        else if (config.showtype == 1) {
            var roleShowData = new RoleShowData;
            roleShowData.clothID = config.show;
            this.roleShowPanel.Set(RoleShowDressType.ROLE, roleShowData);
            this.showImg.visible = false;
            this.roleShowPanel.visible = true;
            if (this._movie) {
                this._movie.ClearCache();
            }
        }
        else if (config.showtype == 3) {
            var fashionSkinConfig = GameGlobal.Config.FashionSkinConfig;
            var roleShowData = new RoleShowData;
            roleShowData.clothID = fashionSkinConfig[config.show][GameGlobal.actorModel.sex].pid;
            roleShowData.sex = GameGlobal.actorModel.sex;
            roleShowData.job = GameGlobal.actorModel.job;
            roleShowData.rideId = 2000105;
            this.roleShowPanel.SetAll(roleShowData);
            this.showImg.visible = false;
            this.roleShowPanel.visible = true;
            if (this._movie) {
                this._movie.ClearCache();
            }
        }
        else {
            if (!this._movie) {
                this._movie = this._NewMovieObject();
            }
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this._movie.LoadByUrl(ResDataPath.GetUIEffePath(config.show));
            this._movie.y = this.roleShowPanel.y + 54 >> 0;
            this.showImg.visible = this.roleShowPanel.visible = false;
        }
        this.powerTxt.textFlow = TextFlowMaker.generateTextFlow(config.powertitle);
        this.titleTxt.textFlow = TextFlowMaker.generateTextFlow(config.valuetitle);
        var num = GameGlobal.RechargeModel.rechargeNum;
        this.chargeTxt.text = '累计已充值' + num + '元';
        this.chargeBtn.enabled = true;
        UIHelper.ShowRedPoint(this.chargeBtn, false);
        if (num >= config.recharge) {
            if (GameGlobal.RechargeModel.GetFirstRewardState(config.id)) {
                this.chargeBtn.label = '已领取';
                this.chargeBtn.enabled = false;
            }
            else {
                UIHelper.ShowRedPoint(this.chargeBtn, true);
                this.chargeBtn.label = '领 取';
            }
        }
        else {
            this.chargeBtn.label = '立即充值';
        }
    };
    FirstChargePanel.RedPointCheck = function () {
        return GameGlobal.GrowUpModel.checkFirstChargeRedPoint();
    };
    FirstChargePanel.prototype.OnClose = function () {
        this.removeEvents();
        this.removeObserve();
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
    };
    FirstChargePanel.NAME = '充值';
    /////////////////////////////////////////////////////////////////////////////
    FirstChargePanel.lists = [];
    return FirstChargePanel;
}(BaseView));
__reflect(FirstChargePanel.prototype, "FirstChargePanel", ["ICommonWindowTitle"]);
var BtnTab5Item = (function (_super) {
    __extends(BtnTab5Item, _super);
    function BtnTab5Item() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    BtnTab5Item.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        var config = FirstChargePanel.lists[this.itemIndex];
        var num = GameGlobal.RechargeModel.rechargeNum;
        if (num >= config.recharge) {
            this.redPoint.visible = !GameGlobal.RechargeModel.GetFirstRewardState(this.itemIndex + 1);
        }
    };
    return BtnTab5Item;
}(eui.ItemRenderer));
__reflect(BtnTab5Item.prototype, "BtnTab5Item");
//# sourceMappingURL=FirstChargePanel.js.map