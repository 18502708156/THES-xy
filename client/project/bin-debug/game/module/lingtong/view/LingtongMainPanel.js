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
var LingtongMainPanel = (function (_super) {
    __extends(LingtongMainPanel, _super);
    function LingtongMainPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mSelectIndex = 0;
        _this.mPetList = [];
        _this.skinName = "LingtongMainSkin";
        _this.mCommonWindowBg.title = "灵童";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    LingtongMainPanel.prototype.childrenCreated = function () {
        var list = [
            TabView.CreateTabViewData(LingtongUpLevelPanel, { mContext: this }),
            TabView.CreateTabViewData(LingtongYuMainPanel, { mContext: this }),
            TabView.CreateTabViewData(DestinyPanel),
            TabView.CreateTabViewData(LingtongCompositionPanel),
        ];
        this.viewStack.tabChildren = list;
        this.mCommonWindowBg.SetViewStack(this.viewStack);
        // if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
        // 	list.push(TabView.CreateTabViewData(DestinyPanel))
        // }
        this.list.itemRenderer = LingtongHeadItem;
        this.list.dataProvider = new eui.ArrayCollection();
        this.ResortList();
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
    };
    LingtongMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var openIndex = param[0] || 0;
        this.showGroup.visible = openIndex != 2 && openIndex != 3;
        this.mCommonWindowBg.OnAdded(this, openIndex);
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.ResortList);
        this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.ResortList);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.observe(MessageDef.DESTINY_RP, this.UpdateRedPoint);
        this.observe(MessageDef.LINGTONG_BATTLE, this.ResortList);
        this.observe(MessageDef.LINGTONG_ACTIVE, this.ResortList);
        this.UpdateContent();
        this.UpdateRedPoint();
    };
    LingtongMainPanel.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    LingtongMainPanel.prototype.UpdateRedPoint = function () {
        this.ResortList();
        var redPoint = GameGlobal.LingtongAttrModel.mRedPoint;
        this.mCommonWindowBg.ShowTalRedPoint(0, redPoint.Get(LingtongAttrRedPoint.INDEX_LEVEL) || redPoint.Get(LingtongAttrRedPoint.INDEX_SKILL) || redPoint.Get(LingtongAttrRedPoint.INDEX_ACTIVE));
        this.mCommonWindowBg.ShowTalRedPoint(1, redPoint.Get(LingtongAttrRedPoint.INDEX_YUL) || redPoint.Get(LingtongAttrRedPoint.INDEX_YUH) || redPoint.Get(LingtongAttrRedPoint.INDEX_SUIT) || redPoint.Get(LingtongAttrRedPoint.INDEX_RANK));
        this.mCommonWindowBg.ShowTalRedPoint(3, redPoint.Get(LingtongAttrRedPoint.INDEX_COMPOSITION));
        if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
            this.mCommonWindowBg.ShowTalRedPoint(2, GameGlobal.DestinyController.mRedPoint.IsRedPoint());
        }
    };
    LingtongMainPanel.prototype.ResortList = function () {
        this.mPetList = CommonUtils.GetArray(GameGlobal.Config.BabyActivationConfig, "type");
        var model = GameGlobal.LingtongPetModel;
        var getWeight = function (config) {
            var confId = config.type;
            if (model.HasBattle(confId)) {
                return model.GetBattlePos(confId) - 10000000;
            }
            if (model.IsActive(confId)) {
                var quality = GameGlobal.Config.BabyActivationConfig[confId].quality;
                return confId - 1000000 - quality * 10000;
            }
            else {
                if (GameGlobal.LingtongAttrModel.mRedPoint.IsAct(confId)) {
                    return confId - 100000;
                }
            }
            return confId;
        };
        this.mPetList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        var selId = null;
        if (this.list.selectedItem) {
            selId = this.list.selectedItem.type;
        }
        this.list.dataProvider.replaceAll(this.mPetList);
        if (selId) {
            var index = 0;
            for (var _i = 0, _a = this.mPetList; _i < _a.length; _i++) {
                var data = _a[_i];
                if (data.type == selId) {
                    this.list.selectedIndex = index;
                    this.mSelectIndex = index;
                    break;
                }
                ++index;
            }
        }
        var list = [];
        for (var _b = 0, _c = this.mPetList; _b < _c.length; _b++) {
            var data = _c[_b];
            list.push(LingtongHeadItem.RedPoint(data.id));
        }
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
    };
    LingtongMainPanel.prototype._OnItemTap = function (e) {
        var index = e.itemIndex;
        this.mSelectIndex = index;
        if (!GameGlobal.LingtongPetModel.IsActive(this.mPetList[index].type)) {
            var selectedIndex = this.commonWindowBg.viewStack.selectedIndex;
            if (selectedIndex == 1 || selectedIndex == 2) {
                this.commonWindowBg.SetTabIndex(0);
            }
        }
        var data = this.commonWindowBg.GetCurViewStackElement();
        if (data.UpdateSelect) {
            data.UpdateSelect();
        }
    };
    LingtongMainPanel.prototype.UpdateContent = function () {
    };
    LingtongMainPanel.prototype.OnOpenIndex = function (openIndex) {
        if (openIndex == 1) {
            if (!GameGlobal.LingtongPetModel.IsActive(this.mPetList[this.mSelectIndex].type)) {
                UserTips.InfoTip("请先激活");
                return false;
            }
        }
        else if (openIndex == 2) {
            if (!GameGlobal.LingtongPetModel.HasActive()) {
                UserTips.InfoTip("请先激活");
                return false;
            }
            if (!Deblocking.Check(DeblockingType.TYPE_120)) {
                return false;
            }
        }
        this.showGroup.visible = openIndex != 2 && openIndex != 3;
        return true;
    };
    LingtongMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var index = param[0] || 0;
        if (index == 1) {
            if (!GameGlobal.LingtongPetModel.HasActive()) {
                UserTips.InfoTip("请先激活");
                return false;
            }
        }
        if (index == 2) {
            if (!GameGlobal.LingtongPetModel.HasActive()) {
                UserTips.InfoTip("请先激活");
                return false;
            }
            if (!Deblocking.Check(DeblockingType.TYPE_120)) {
                return false;
            }
        }
        return Deblocking.Check(DeblockingType.TYPE_116);
    };
    LingtongMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return LingtongMainPanel;
}(BaseEuiView));
__reflect(LingtongMainPanel.prototype, "LingtongMainPanel", ["ICommonWindow"]);
var LingtongHeadItem = (function (_super) {
    __extends(LingtongHeadItem, _super);
    function LingtongHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    LingtongHeadItem.prototype.dataChanged = function () {
        var config = this.data;
        var id = config.type;
        var index = GameGlobal.LingtongPetModel.mBattleList.indexOf(id);
        if (index == 0) {
            this.imgBattle.source = "ui_bm_chuzhan";
        }
        else if (index == -1) {
            this.imgBattle.source = "";
        }
        else {
            this.imgBattle.source = "ui_bm_beizhan";
        }
        this.item.SetQuality(LingtongInfo.GetQuality(id));
        this.item.setItemImg(LingtongConst.GetHeadIcon(id));
        this.item.setGray(!GameGlobal.LingtongPetModel.IsActive(id));
        this.UpdateRedPoint();
    };
    LingtongHeadItem.prototype.UpdateRedPoint = function () {
        this.redPoint.visible = LingtongHeadItem.RedPoint(this.data.type);
    };
    LingtongHeadItem.RedPoint = function (petId) {
        if (GameGlobal.LingtongAttrModel.mRedPoint.IsRedLingtong(petId)) {
            return true;
        }
        return false;
    };
    return LingtongHeadItem;
}(eui.ItemRenderer));
__reflect(LingtongHeadItem.prototype, "LingtongHeadItem");
//# sourceMappingURL=LingtongMainPanel.js.map