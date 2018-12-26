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
var RoleRideDressPanel = (function (_super) {
    __extends(RoleRideDressPanel, _super);
    function RoleRideDressPanel() {
        var _this = _super.call(this) || this;
        _this.mList = [];
        _this.skinName = "RideDressSkin";
        _this.list.itemRenderer = RoleRideDressItem;
        _this.listCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 109);
        _this._AddItemClick(_this.list, _this._OnItemClick);
        _this._AddClick(_this.activeBtn, _this._OnClick);
        _this._AddClick(_this.getLabel, _this._OnClick);
        _this._AddClick(_this.changeBtn, _this._OnClick);
        return _this;
    }
    RoleRideDressPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mModel = param[0];
        this.observe(this.mModel.mMsgDefUpdate, this.UpdateContent);
        this.mCommonWindowBg.SetTitle("皮肤");
        this.commonWindowBg.OnAdded(this);
        this.UpdateList();
        this.list.selectedIndex = 0;
        if (param[1]) {
            for (var key in this.mList) {
                if (this.mList[key].skinid == param[1])
                    this.list.selectedIndex = parseInt(key);
            }
        }
        this.UpdateContent();
    };
    RoleRideDressPanel.prototype.UpdateList = function () {
        var _this = this;
        this.mList = CommonUtils.copyDataHandler(this.mModel.GetSkinConfig());
        var weight = function (config) {
            var skinid = config.skinid;
            if (_this.mModel.HasDress(skinid)) {
                return -100000 - skinid;
            }
            var cur = GameGlobal.UserBag.GetCount(config.itemid.id);
            var need = config.itemid.count;
            if (cur >= need) {
                return -10000 - skinid;
            }
            return skinid;
        };
        this.mList.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mList);
    };
    RoleRideDressPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    RoleRideDressPanel.prototype._OnClick = function (e) {
        var config = this.mList[this.list.selectedIndex];
        switch (e.currentTarget) {
            case this.activeBtn:
                this.mModel.SendActiveDress(config.skinid);
                break;
            case this.getLabel:
                GainItemConfig.Guide(config.itemid.id);
                break;
            case this.changeBtn:
                this.mModel.SendDress(config.skinid);
                break;
        }
    };
    RoleRideDressPanel.prototype._OnItemClick = function (e) {
        this.UpdateContent();
    };
    RoleRideDressPanel.prototype.UpdateContent = function () {
        var redList = [];
        for (var _i = 0, _a = this.mList; _i < _a.length; _i++) {
            var data = _a[_i];
            var cur_1 = GameGlobal.UserBag.GetCount(data.itemid.id);
            var need_1 = data.itemid.count;
            var state = !this.mModel.HasDress(data.skinid) && cur_1 >= need_1;
            data.__redPoint__ = state;
            redList.push(state);
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
        var hasDress = this.mModel.HasDress(config.skinid);
        this.activeBtn.visible = !hasDress && cur >= need;
        this.attrLabel.text = AttributeData.getAttStr(config.attrpower, 0);
        this.attrLabel.textColor = hasDress ? Color.l_green_1 : Color.l_gray;
        this.allPowerLabel.text = "皮肤总战力：" + this.mModel.GetDressPower();
        this.activeCountLabel.text = "已激活数：" + this.mModel.GetActiveDressCount();
        if (this.mModel.mTemplateType == UserTemplate.TYPE_RIDE) {
            this.ridePanel.SetBodyId(config.pid);
        }
        else {
            this.showPanel.SetBody(AppearanceConfig.GetUIPath(config.pid));
        }
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config.attrpower);
        if (this.groupItem.visible = !hasDress) {
            UIHelper.SetLinkStyleLabel(this.getLabel, GainItemConfig.GetGainName(config.itemid.id));
        }
        this.gaoupHave.visible = hasDress;
        this.imgHave.visible = config.skinid == this.mModel.mDressId;
        this.changeBtn.visible = !this.imgHave.visible;
    };
    RoleRideDressPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleRideDressPanel;
}(BaseEuiView));
__reflect(RoleRideDressPanel.prototype, "RoleRideDressPanel", ["ICommonWindow"]);
var RoleRideDressItem = (function (_super) {
    __extends(RoleRideDressItem, _super);
    function RoleRideDressItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    RoleRideDressItem.prototype.dataChanged = function () {
        var config = this.data;
        this.nameLabel.text = config.name;
        var panel = this.parent.parent.parent;
        this.stateImg.source = panel.mModel.HasDress(config.skinid) ? "ui_yuan" : "ui_yuan_quse";
        this.imgRed.visible = this.data.__redPoint__;
    };
    return RoleRideDressItem;
}(eui.ItemRenderer));
__reflect(RoleRideDressItem.prototype, "RoleRideDressItem");
//# sourceMappingURL=RoleRideDressPanel.js.map