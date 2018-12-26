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
 * @meaning: 称号界面
 *
 **/
var RoleTitlePanel = (function (_super) {
    __extends(RoleTitlePanel, _super);
    function RoleTitlePanel() {
        var _this = _super.call(this) || this;
        _this.mList = [];
        _this.skinName = "RideDressSkin";
        _this.list.itemRenderer = RoleTitleDressItem;
        _this.listCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 109);
        _this._AddItemClick(_this.list, _this._OnItemClick);
        _this._AddClick(_this.activeBtn, _this._OnClick);
        // this._AddClick(this.powerLabel, this.onInfoClick)
        _this._AddClick(_this.changeBtn, _this._OnChange);
        _this._AddClick(_this.getLabel, _this.onGuide);
        return _this;
    }
    RoleTitlePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.commonWindowBg.SetTitle("称号");
        this.commonWindowBg.OnAdded(this);
        this.UpdateList();
        this.list.selectedIndex = 0;
        this.UpdateContent();
        this.AddLoopTimer(1000, this.UpdateTimeGroup);
    };
    RoleTitlePanel.prototype.UpdateList = function () {
        var _this = this;
        var skinConfigList = this.mModel.GetSkinConfig();
        for (var _i = 0, skinConfigList_1 = skinConfigList; _i < skinConfigList_1.length; _i++) {
            var config = skinConfigList_1[_i];
            if (config.show == 1)
                this.mList.push(config);
        }
        var weight = function (config) {
            if (!config.hasOwnProperty("itemid"))
                return;
            if (_this.mModel.HasDress(config.skinid))
                return config.skinid - 1000;
            if (GameGlobal.UserBag.GetCount(config.itemid.id) > 0)
                return config.skinid - 10000;
            return config.skinid;
        };
        this.mList.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mList);
    };
    RoleTitlePanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    RoleTitlePanel.prototype._OnClick = function () {
        var config = this.mList[this.list.selectedIndex];
        this.mModel.SendActiveDress(config.skinid);
    };
    //改变称号
    RoleTitlePanel.prototype._OnChange = function () {
        var config = this.mList[this.list.selectedIndex];
        this.mModel.changDress(config.skinid);
    };
    //跳转引导
    RoleTitlePanel.prototype.onGuide = function () {
        var config = this.mList[this.list.selectedIndex];
        if (config && config.itemid.id)
            GainItemConfig.Guide(config.itemid.id);
    };
    RoleTitlePanel.prototype._OnItemClick = function (e) {
        this.UpdateContent();
    };
    RoleTitlePanel.prototype.UpdateContent = function () {
        var redList = [];
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var config_1 = _a[_i];
            var bDress = this.mModel.HasDress(config_1.skinid);
            var cur_1 = GameGlobal.UserBag.GetCount(config_1.itemid.id);
            var red = false;
            if ((!bDress) && cur_1) {
                red = true;
            }
            redList.push(red);
            config_1.__redPoint__ = red;
        }
        this.listCtrl.SetRedPointList(redList);
        this.listCtrl.OnRefresh();
        UIHelper.ListRefresh(this.list);
        var config = this.mList[this.list.selectedIndex];
        var itemConfig = GameGlobal.Config.ItemConfig[config.itemid.id];
        this.item.setItemData(config.itemid);
        this.item.isShowName(false);
        var cur = GameGlobal.UserBag.GetCount(config.itemid.id);
        var need = config.itemid.count;
        if (itemConfig) {
            this.nameLabel.text = itemConfig.name + ("(" + cur + "/" + need + ")");
        }
        this.activeBtn.visible = !this.mModel.HasDress(config.skinid) && cur >= need;
        //this.changeTitle();
        this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0);
        this.changeTitle();
        this.attrLabel.textColor = this.mModel.HasDress(config.skinid) ? Color.l_green_1 : Color.l_gray;
        this.allPowerLabel.text = "称号总战力：" + this.mModel.GetDressPower();
        this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount();
        // this.showPanel.SetBody(AppearanceConfig.GetPath(config.pid))
        this.imgStyle.source = config.icon;
        this.imgStyle.scaleX = 1.5;
        this.imgStyle.scaleY = 1.5;
        //途径还没有
        this.getLabel.text = "";
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower);
        this.timeGroup.visible = false;
        //显示激活
        var data = this.mModel.GetDressData(config.skinid);
        this.mDressData = data;
        if (!data) {
            this.groupItem.visible = true; //激活所需内容
            this.gaoupHave.visible = false; //已经有称号
            if (GainItemConfig.GetGainName(config.itemid.id) == "运营活动") {
                this.getLabel.text = GainItemConfig.GetGainName(config.itemid.id);
            }
            else {
                UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id));
            }
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
    RoleTitlePanel.prototype.UpdateTimeGroup = function () {
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
    //改變稱號文本
    RoleTitlePanel.prototype.changeTitle = function () {
        var config = this.mList[this.list.selectedIndex];
        var tID = config.skinid;
        var config2 = GameGlobal.Config.TitleAttrConf;
        //this.attrLabel.text="";
        if (config2[tID] != undefined) {
            var pow = config2[tID].attrpower;
            var str = config2[tID].des;
            this.attrLabel.text += "\n" + str + "+" + pow + "%";
            this.attrLabel.textAlign = "left";
        }
        else {
            var item = config.attrpower;
            this.attrLabel.textAlign = "left";
            this.attrLabel.text = AttributeData.getAttStr(item, 0);
        }
    };
    RoleTitlePanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_34);
    };
    RoleTitlePanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleTitlePanel;
}(BaseEuiView));
__reflect(RoleTitlePanel.prototype, "RoleTitlePanel", ["ICommonWindow"]);
var RoleTitleDressItem = (function (_super) {
    __extends(RoleTitleDressItem, _super);
    function RoleTitleDressItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleTitleDressItem.prototype.dataChanged = function () {
        var config = this.data;
        this.nameLabel.text = config.name;
        var panel = this.parent.parent.parent;
        var bDress = panel.mModel.HasDress(config.skinid);
        this.stateImg.source = bDress ? "ui_yuan" : "ui_yuan_quse";
        var cur = GameGlobal.UserBag.GetCount(config.itemid.id);
        this.imgRed.visible = this.data.__redPoint__;
    };
    return RoleTitleDressItem;
}(eui.ItemRenderer));
__reflect(RoleTitleDressItem.prototype, "RoleTitleDressItem");
//# sourceMappingURL=RoleTitlePanel.js.map