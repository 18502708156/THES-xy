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
var TianShenMainPanel = (function (_super) {
    __extends(TianShenMainPanel, _super);
    function TianShenMainPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mSelectIndex = 0;
        _this.skinName = "TianShenMainSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    TianShenMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.SetTabView([
            TabView.CreateTabViewData(TianShenUpLevelPanel, { skinName: "TianShenLevelUpSkin", mContext: this }),
            TabView.CreateTabViewData(TianShenBreachPanel, { skinName: "TianShenBreachSkin", mContext: this }),
            TabView.CreateTabViewData(TianShenHeChengPanel, { skinName: "TianShenHeChengSkin", mContext: this }),
            TabView.CreateTabViewData(TianShenBaoQiPanel, { skinName: "TianShenBaoQiSkin", mContext: this }),
        ]);
        this.list.itemRenderer = TianShenHeadItem;
        this.mTianShenList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalListConfig, "id");
        var weight = function (config) {
            var weightVal = config.id;
            var model = GameGlobal.TianShenModel;
            if (model.HasBattle() && model.mBattleID == config.id) {
                weightVal = weightVal - 100000;
                return weightVal;
            }
            if (model.HasTianShen(config.id)) {
                weightVal = weightVal - 10000;
            }
            return weightVal;
        };
        this.mTianShenList.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mTianShenList);
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
    };
    TianShenMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_23);
    };
    TianShenMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.TIANSHEN_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.TIANSHEN_UPDATE_BREACH, this.UpdateContent);
        this.observe(MessageDef.RP_BAG_TIANSHEN_ACT_ITEM, this.UpdateRedPoint);
        this.observe(MessageDef.RP_TIANSHEN, this.UpdateRedPoint);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.mListLRBtnCtrl.OnRefresh();
        this.UpdateContent();
    };
    TianShenMainPanel.prototype.OnClose = function () {
        this._ClosePetView();
        MainBottomPanel.CloseNav(this);
    };
    TianShenMainPanel.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.CheckTalRedPoint(1);
        this.mCommonWindowBg.CheckTalRedPoint(2);
        this.mCommonWindowBg.CheckTalRedPoint(3);
    };
    TianShenMainPanel.prototype._OnItemTap = function (e) {
        var index = e.itemIndex;
        this.mSelectIndex = index;
        this.UpdateContent();
    };
    TianShenMainPanel.prototype.UpdateContent = function () {
        UIHelper.ListRefresh(this.list);
        this.commonWindowBg.GetCurViewStackElement().UpdateContent();
        this._UpdatePetView();
    };
    TianShenMainPanel.prototype._UpdatePetView = function () {
        var id = this.mTianShenList[this.mSelectIndex].id;
        if (!GameGlobal.TianShenModel.HasTianShen(id)) {
            if (!this.mTianShenInactiveView) {
                this.mTianShenInactiveView = new TianShenInactiveView();
                this.mTianShenInactiveView.SetContext(this);
            }
            if (!this.mTianShenInactiveView.parent) {
                this.group.addChild(this.mTianShenInactiveView);
                this.mTianShenInactiveView.DoOpen([]);
            }
            this.mTianShenInactiveView.UpdateInfo(id);
        }
        else {
            this._ClosePetView();
        }
    };
    TianShenMainPanel.prototype._ClosePetView = function () {
        if (this.mTianShenInactiveView && this.mTianShenInactiveView.parent) {
            this.mTianShenInactiveView.DoClose();
            DisplayUtils.removeFromParent(this.mTianShenInactiveView);
        }
    };
    TianShenMainPanel.prototype.OnOpenIndex = function (selectedIndex) {
        this.showGroup.visible = true;
        switch (selectedIndex) {
            case 1:
                return Deblocking.Check(DeblockingType.TYPE_24);
            case 2:
                this.showGroup.visible = false;
                return Deblocking.Check(DeblockingType.TYPE_25);
            case 3:
                this.showGroup.visible = false;
                return Deblocking.Check(DeblockingType.TYPE_26);
        }
        return true;
    };
    TianShenMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return TianShenMainPanel;
}(BaseEuiView));
__reflect(TianShenMainPanel.prototype, "TianShenMainPanel", ["ICommonWindow"]);
var TianShenHeadItem = (function (_super) {
    __extends(TianShenHeadItem, _super);
    function TianShenHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    TianShenHeadItem.prototype.dataChanged = function () {
        var config = this.data;
        this.SetContent(config);
        var model = GameGlobal.TianShenModel;
        if (model.HasBattle() && model.mBattleID == config.id) {
            this.imgBattle.source = "ui_bm_chuzhan";
        }
        else {
            this.imgBattle.source = "";
        }
        this.redPoint.visible = GameGlobal.TianShenModel.IsRedPointTianShen(config.id);
    };
    TianShenHeadItem.prototype.SetContent = function (config) {
        this.lbName.text = config.name;
        this.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        this.lbLev.text = GameGlobal.TianShenModel.HasTianShen(config.id) ? (GameGlobal.TianShenModel.GetLevel(config.id) + "阶") : "";
        this.lbLev2.text = GameGlobal.TianShenModel.HasTianShen(config.id) ? GameGlobal.TianShenModel.GetBreachLvStr(config.id) : "";
        this.item.SetQuality(config.quality);
        this.item.setItemImg("resource/assets/image/head/tianshen/" + config.icon + ".png");
        this.item.setGray(!GameGlobal.TianShenModel.HasTianShen(config.id));
    };
    TianShenHeadItem.prototype.SetContentByInfo = function (mTianShenId) {
        this.SetContent(GameGlobal.Config.AirMarshalListConfig[mTianShenId]);
    };
    return TianShenHeadItem;
}(eui.ItemRenderer));
__reflect(TianShenHeadItem.prototype, "TianShenHeadItem");
//# sourceMappingURL=TianShenMainPanel.js.map