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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/25 21:15
 * @meaning: 时装界面
 *
 **/
var RoleSkinPanel = (function (_super) {
    __extends(RoleSkinPanel, _super);
    function RoleSkinPanel() {
        var _this = _super.call(this) || this;
        _this.mList = [];
        _this.skinName = "RideDressSkin";
        _this.list.itemRenderer = RoleSkinDressItem;
        _this.listCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 109);
        _this._AddItemClick(_this.list, _this._OnItemClick);
        _this._AddClick(_this.activeBtn, _this._OnClick);
        // this._AddClick(this.powerLabel, this.onInfoClick)
        _this._AddClick(_this.getLabel, _this.onGuide);
        _this._AddClick(_this.changeBtn, _this._OnChange);
        return _this;
    }
    RoleSkinPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.commonWindowBg.SetTitle("时装");
        this.commonWindowBg.OnAdded(this);
        this.UpdateList();
        this.list.selectedIndex = 0;
        this.listCtrl.OnRefresh();
        this.UpdateContent();
        this.AddLoopTimer(1000, this.UpdateTimeGroup);
    };
    /**获取角色的对应类型皮肤ID*/
    RoleSkinPanel.prototype.getSkinId = function () {
        var role = SubRoles.ins().GetRoleData();
        var skinid = role.mRideId;
        return skinid;
    };
    RoleSkinPanel.prototype.UpdateList = function () {
        var _this = this;
        this.mList = CommonUtils.copyDataHandler(this.mModel.GetSkinConfig());
        var weight = function (data) {
            var config = data[GameGlobal.actorModel.sex];
            var skinid = config.skinid;
            var cur = GameGlobal.UserBag.GetCount(config.itemid.id) || 0;
            if (cur > 0) {
                return 0;
            }
            else {
                if (_this.mModel.HasDress(config.skinid)) {
                    return 1;
                }
                else {
                    return 2;
                }
            }
        };
        this.mList.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mList);
    };
    RoleSkinPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    RoleSkinPanel.prototype._OnClick = function () {
        var config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
        this.mModel.SendActiveDress(config.skinid);
    };
    //改变时装
    RoleSkinPanel.prototype._OnChange = function () {
        var config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
        this.mModel.changDress(config.skinid);
    };
    //跳转引导
    RoleSkinPanel.prototype.onGuide = function () {
        var config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
        if (config && config.itemid.id)
            GainItemConfig.Guide(config.itemid.id);
    };
    RoleSkinPanel.prototype._OnItemClick = function (e) {
        this.UpdateContent();
    };
    // private onInfoClick(e: eui.ItemTapEvent) {
    // 	//详情
    //     let config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
    //      ViewManager.ins().open(RoleTemplateAttrPanel, this.mModel, this.name,config.pid,config.attrpower )
    // }
    RoleSkinPanel.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.list);
        var config = this.mList[this.list.selectedIndex][GameGlobal.actorModel.sex];
        var itemConfig = GameGlobal.Config.ItemConfig[config.itemid.id];
        this.item.setItemData(config.itemid);
        this.item.isShowName(false);
        var cur = GameGlobal.UserBag.GetCount(config.itemid.id);
        var need = config.itemid.count;
        if (itemConfig) {
            this.nameLabel.text = itemConfig.name + ("(" + cur + "/" + need + ")");
        }
        this.activeBtn.visible = !this.mModel.HasDress(config.skinid) && cur >= need;
        this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0);
        this.attrLabel.textColor = this.mModel.HasDress(config.skinid) ? Color.l_green_1 : Color.l_gray;
        this.allPowerLabel.text = "时装总战力：" + this.mModel.GetDressPower();
        this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount();
        //模型
        var skinConfig = GameGlobal.Config.RideSkinConfig[this.getSkinId()];
        var showData = new RoleShowData;
        showData.job = GameGlobal.actorModel.job;
        showData.sex = GameGlobal.actorModel.sex;
        showData.clothID = config.pid;
        showData.rideId = skinConfig ? skinConfig.pid : 0;
        this.roleShowPanel.SetAll(showData);
        //途径还没有
        this.getLabel.text = "";
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower);
        this.timeGroup.visible = false;
        //显示激活
        var data = this.mModel.GetDressData(config.skinid);
        this.mDressData = data;
        //显示激活
        if (!this.mModel.HasDress(config.skinid)) {
            this.groupItem.visible = true; //激活所需内容
            this.gaoupHave.visible = false; //已经有称号
            UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id));
        }
        else {
            this.groupItem.visible = false; //激活所需内容
            this.gaoupHave.visible = true; //已经有称号
            if (this.mModel.getWearId() === config.skinid) {
                this.changeBtn.visible = false;
                this.imgHave.visible = true;
            }
            else {
                this.changeBtn.visible = true;
                this.imgHave.visible = false;
            }
            this.UpdateTimeGroup();
        }
    };
    RoleSkinPanel.prototype.UpdateTimeGroup = function () {
        if (this.mDressData && this.mDressData.term) {
            this.timeGroup.visible = true;
            var time = this.mDressData.term - GameServer.serverTime;
            if (time > 0) {
                this.timeLabel.text = DateUtils.format_1(time * 1000);
            }
            else {
                this.timeLabel.text = "已过期";
            }
        }
        else {
            this.timeGroup.visible = false;
        }
    };
    RoleSkinPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_33);
    };
    RoleSkinPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleSkinPanel;
}(BaseEuiView));
__reflect(RoleSkinPanel.prototype, "RoleSkinPanel", ["ICommonWindow"]);
var RoleSkinDressItem = (function (_super) {
    __extends(RoleSkinDressItem, _super);
    function RoleSkinDressItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleSkinDressItem.prototype.dataChanged = function () {
        var config = this.data[GameGlobal.actorModel.sex];
        this.nameLabel.text = config.name;
        var panel = this.parent.parent.parent;
        var bDress = panel.mModel.HasDress(config.skinid);
        this.stateImg.source = bDress ? "ui_yuan" : "ui_yuan_quse";
        var cur = GameGlobal.UserBag.GetCount(config.itemid.id);
        if ((!bDress) && cur) {
            this.imgRed.visible = true;
        }
        else {
            this.imgRed.visible = false;
        }
    };
    return RoleSkinDressItem;
}(eui.ItemRenderer));
__reflect(RoleSkinDressItem.prototype, "RoleSkinDressItem");
//# sourceMappingURL=RoleSkinPanel.js.map