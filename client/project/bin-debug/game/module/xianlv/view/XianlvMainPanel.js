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
var XianlvMainPanel = (function (_super) {
    __extends(XianlvMainPanel, _super);
    function XianlvMainPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mSelectIndex = 0;
        _this.mXianlvList = [];
        _this.skinName = "XianlvMainSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    XianlvMainPanel.prototype.childrenCreated = function () {
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(XianlvUpLevelPanel, { skinName: "XianlvUpLevelSkin", mContext: this }),
            TabView.CreateTabViewData(XianlvupStarPanel, { skinName: "XianlvupStarSkin", mContext: this }),
            TabView.CreateTabViewData(XianlvFzPanel, { mContext: this }),
            TabView.CreateTabViewData(XianlvXwPanel, { mContext: this }),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.list.itemRenderer = XianlvHeadItem;
        this.mXianlvList = CommonUtils.GetArray(GameGlobal.Config.partnerBiographyConfig, "id");
        var weight = function (config) {
            var weightVal = config.id;
            var model = GameGlobal.XianlvModel;
            if (model.HasBattle(config.id)) {
                var battlePos = model.GetBattlePos(config.id);
                weightVal = battlePos - 10000000;
                return weightVal;
            }
            if (model.HasXianlv(config.id)) {
                var quality = GameGlobal.Config.partnerBiographyConfig[config.id].quality;
                weightVal = weightVal - 1000000 - quality * 10000;
            }
            else {
                if (model.mRedPoint.IsRedAct(config.id)) {
                    return config.id - 100000;
                }
            }
            return weightVal;
        };
        this.mXianlvList.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mXianlvList);
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
        this._AddClick(this.help, this._click);
    };
    XianlvMainPanel.prototype._click = function () {
        this.commonWindowBg.setHelp(5, "规则说明");
    };
    XianlvMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this, param[0] || 0);
        this.OnOpenIndex(param[0] || 0);
        this.observe(MessageDef.XIANLV_UPATE_INFO, this.UpdateContent);
        this.observe(MessageDef.RP_BAG_XIANLV_ACT_ITEM, this.UpdateRedPointIndex);
        this.observe(MessageDef.RP_XIANLV, this.UpdateRedPointIndex);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPointIndex);
        this.UpdateRedPointIndex();
        this.observe(GameGlobal.XianlvFzModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex2);
        this.observe(GameGlobal.XianlvFzModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex2);
        this.UpdateRedPointIndex2();
        this.observe(GameGlobal.XianlvXwModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex3);
        this.observe(GameGlobal.XianlvXwModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex3);
        this.UpdateRedPointIndex3();
        this.mListLRBtnCtrl.OnRefresh();
        this.UpdateContent();
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.updateJiJieBtnPng();
    };
    XianlvMainPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.xianlv_position]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.xianlv_circle]);
    };
    XianlvMainPanel.prototype.OnClose = function () {
        this._ClosePetView();
        MainBottomPanel.CloseNav(this);
    };
    XianlvMainPanel.prototype._OnItemTap = function (e) {
        var index = e.itemIndex;
        this.mSelectIndex = index;
        this.UpdateContent();
    };
    XianlvMainPanel.prototype.UpdateList = function () {
        var list = [];
        for (var _i = 0, _a = this.mXianlvList; _i < _a.length; _i++) {
            var data = _a[_i];
            list.push(XianlvHeadItem.RedPoint(data.id));
        }
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
        UIHelper.ListRefresh(this.list);
    };
    XianlvMainPanel.prototype.UpdateContent = function () {
        this.UpdateList();
        this.commonWindowBg.GetCurViewStackElement().UpdateContent();
        this._UpdatePetView();
    };
    XianlvMainPanel.prototype._UpdatePetView = function () {
        var id = this.mXianlvList[this.mSelectIndex].id;
        if (!GameGlobal.XianlvModel.HasXianlv(id)) {
            if (!this.mXianlvInactiveView) {
                this.mXianlvInactiveView = new XianlvInactiveView();
                this.mXianlvInactiveView.SetContext(this);
            }
            if (!this.mXianlvInactiveView.parent) {
                this.group.addChild(this.mXianlvInactiveView);
                this.mXianlvInactiveView.DoOpen([]);
            }
            this.mXianlvInactiveView.UpdateInfo(id);
        }
        else {
            this._ClosePetView();
        }
    };
    XianlvMainPanel.prototype.UpdateRedPointIndex = function () {
        this.UpdateList();
        this.commonWindowBg.CheckTalRedPoint(0);
        this.commonWindowBg.CheckTalRedPoint(1);
    };
    XianlvMainPanel.prototype.UpdateRedPointIndex2 = function () {
        this.commonWindowBg.CheckTalRedPoint(2);
    };
    XianlvMainPanel.prototype.UpdateRedPointIndex3 = function () {
        this.commonWindowBg.CheckTalRedPoint(3);
    };
    XianlvMainPanel.prototype._ClosePetView = function () {
        if (this.mXianlvInactiveView && this.mXianlvInactiveView.parent) {
            this.mXianlvInactiveView.DoClose();
            DisplayUtils.removeFromParent(this.mXianlvInactiveView);
        }
    };
    XianlvMainPanel.prototype.OnOpenIndex = function (openIndex) {
        var showList = openIndex == 0 || openIndex == 1;
        this.showGroup.visible = showList;
        return true;
    };
    XianlvMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_15);
    };
    XianlvMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return XianlvMainPanel;
}(BaseEuiView));
__reflect(XianlvMainPanel.prototype, "XianlvMainPanel", ["ICommonWindow"]);
var XianlvHeadItem = (function (_super) {
    __extends(XianlvHeadItem, _super);
    function XianlvHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XianlvHeadItem.prototype.childrenCreated = function () {
        this.starGroup.itemRenderer = XianlvStar;
        this.starGroup.visible = true;
    };
    XianlvHeadItem.prototype.dataChanged = function () {
        var config = this.data;
        XianlvHeadItem.SetContent(this, config);
        var model = GameGlobal.XianlvModel;
        if (model.HasBattle(config.id)) {
            this.imgBattle.source = "ui_bm_chuzhan";
        }
        else {
            this.imgBattle.source = "";
        }
        if (this.mStarList == null) {
            this.mStarList = [];
        }
        var info = model.GetXianlvInfo(config.id);
        if (this.starGroup.numChildren != info.mStar) {
            this.mStarList.length = info.mStar;
            this.starGroup.dataProvider = new eui.ArrayCollection(this.mStarList);
        }
        this.redPoint.visible = XianlvHeadItem.RedPoint(config.id);
    };
    XianlvHeadItem.RedPoint = function (id) {
        return GameGlobal.XianlvModel.IsRedPointXianlv(id) || GameGlobal.XianlvModel.mRedPoint.IsRedRank(id);
    };
    XianlvHeadItem.SetContent = function (comp, config) {
        comp.lbName.text = config.name;
        comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        comp.lbLev.text = GameGlobal.XianlvModel.HasXianlv(config.id) ? (GameGlobal.XianlvModel.GetLevel(config.id) + "阶") : "";
        comp.item.SetQuality(config.quality);
        comp.item.setItemImg("resource/assets/image/head/xianlv/" + config.icon + ".png");
        comp.item.setGray(!GameGlobal.XianlvModel.HasXianlv(config.id));
    };
    XianlvHeadItem.SetContentByInfo = function (comp, info) {
        this.SetContent(comp, GameGlobal.Config.partnerBiographyConfig[info.mXianlvId]);
    };
    return XianlvHeadItem;
}(eui.ItemRenderer));
__reflect(XianlvHeadItem.prototype, "XianlvHeadItem");
var XianlvStar = (function (_super) {
    __extends(XianlvStar, _super);
    function XianlvStar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XianlvStar;
}(eui.ItemRenderer));
__reflect(XianlvStar.prototype, "XianlvStar");
//# sourceMappingURL=XianlvMainPanel.js.map