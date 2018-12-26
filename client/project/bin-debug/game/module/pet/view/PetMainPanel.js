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
var PetMainPanel = (function (_super) {
    __extends(PetMainPanel, _super);
    function PetMainPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mSelectIndex = 0;
        _this.mPetList = [];
        _this.skinName = "PetMainSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    PetMainPanel.prototype.childrenCreated = function () {
        this.viewStack.tabChildren = [
            TabView.CreateTabViewData(PetUpLevelPanel, { skinName: "PetUpLevelSkin", mContext: this }),
            TabView.CreateTabViewData(PetSkillPanel, { skinName: "PetSkillSkin", mContext: this }),
            TabView.CreateTabViewData(PetTonglPanel, { mContext: this }),
            TabView.CreateTabViewData(PetShouhPanel, { mContext: this }),
        ];
        this.commonWindowBg.SetViewStack(this.viewStack);
        this.list.itemRenderer = PetHeadItem;
        this.ResortList();
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
    };
    PetMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_11);
    };
    PetMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.PET_UPATE_INFO, this.UpdateList);
        this.observe(MessageDef.PET_ACTIVE, this.UpdateActive);
        this.commonWindowBg.OnAdded(this, args.length ? args[0] : 0);
        this.CheckShowGroup(args.length ? args[0] : 0);
        this.mListLRBtnCtrl.OnRefresh();
        this.UpdateContent();
        this.observe(MessageDef.RP_BAG_PET_ACT_ITEM, this.UpdateRedPoint);
        this.observe(MessageDef.RP_PET, this.UpdateRedPoint);
        this.observe(MessageDef.YUANFEN_UPDATE_LIST, this.UpdateRedPoint);
        this.UpdateRedPoint();
        this.observe(GameGlobal.PetTonglModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex2);
        this.observe(GameGlobal.PetTonglModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex2);
        this.UpdateRedPointIndex2();
        this.observe(GameGlobal.PetShouhModel.GetItemRpUpdateMsg(), this.UpdateRedPointIndex3);
        this.observe(GameGlobal.PetShouhModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPointIndex3);
        this.UpdateRedPointIndex3();
        this.observe(MessageDef.ACTIVITY_ADVANCED_ICON_SHOW, this.updateJiJieBtnPng);
        this.updateJiJieBtnPng();
    };
    PetMainPanel.prototype.updateJiJieBtnPng = function () {
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(2), [ActivityKaiFuJiJieType.pet_soul]);
        ActivityKaiFuModel.ShowJiJieKuangHuanIcon(this.commonWindowBg.tabBar.getChildAt(3), [ActivityKaiFuJiJieType.pet_psychic]);
    };
    PetMainPanel.prototype.UpdateRedPoint = function () {
        this.commonWindowBg.CheckTalRedPoint(0);
        this.commonWindowBg.CheckTalRedPoint(1);
        UIHelper.ListRefresh(this.list);
    };
    PetMainPanel.prototype.UpdateRedPointIndex2 = function () {
        this.commonWindowBg.CheckTalRedPoint(2);
    };
    PetMainPanel.prototype.UpdateRedPointIndex3 = function () {
        this.commonWindowBg.CheckTalRedPoint(3);
    };
    PetMainPanel.prototype.OnClose = function () {
        this._ClosePetView();
        MainBottomPanel.CloseNav(this);
    };
    PetMainPanel.prototype._OnItemTap = function (e) {
        var index = e.itemIndex;
        this.mSelectIndex = index;
        this.UpdateContent();
    };
    PetMainPanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    PetMainPanel.prototype.ResortList = function () {
        this.mPetList = CommonUtils.GetArray(GameGlobal.Config.petBiographyConfig, "id");
        var model = GameGlobal.PetModel;
        var getWeight = function (config) {
            var confId = config.id;
            if (model.HasBattle(confId)) {
                return model.GetBattlePos(confId) - 10000000;
            }
            if (model.HasPet(confId)) {
                var quality = GameGlobal.Config.petBiographyConfig[confId].quality;
                return confId - 1000000 - quality * 10000;
            }
            else {
                if (model.mRedPoint.IsRedAct(confId)) {
                    return confId - 100000;
                }
            }
            return confId;
        };
        this.mPetList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mPetList);
        var list = [];
        for (var _i = 0, _a = this.mPetList; _i < _a.length; _i++) {
            var data = _a[_i];
            list.push(PetHeadItem.RedPoint(data.id));
        }
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
    };
    PetMainPanel.prototype.UpdateActive = function () {
        this.ResortList();
        this.UpdateContent();
    };
    PetMainPanel.prototype.UpdateContent = function () {
        this.commonWindowBg.GetCurViewStackElement().UpdateContent();
        this._UpdatePetView();
    };
    PetMainPanel.prototype._UpdatePetView = function () {
        var id = this.mPetList[this.mSelectIndex].id;
        if (!GameGlobal.PetModel.HasPet(id)) {
            if (!this.mPetInactiveView) {
                this.mPetInactiveView = new PetInactiveView;
            }
            if (!this.mPetInactiveView.parent) {
                this.group.addChild(this.mPetInactiveView);
                this.mPetInactiveView.DoOpen([]);
            }
            this.mPetInactiveView.UpdateContent(id);
        }
        else {
            this._ClosePetView();
        }
    };
    PetMainPanel.prototype._ClosePetView = function () {
        if (this.mPetInactiveView && this.mPetInactiveView.parent) {
            this.mPetInactiveView.DoClose();
            DisplayUtils.removeFromParent(this.mPetInactiveView);
        }
    };
    PetMainPanel.prototype.OnOpenIndex = function (selectedIndex) {
        this.CheckShowGroup(selectedIndex);
        switch (selectedIndex) {
            case 1:
                return Deblocking.Check(DeblockingType.TYPE_12);
            case 2:
                return Deblocking.Check(DeblockingType.TYPE_13);
            case 3:
                return Deblocking.Check(DeblockingType.TYPE_14);
        }
        return true;
    };
    PetMainPanel.prototype.CheckShowGroup = function (selectedIndex) {
        this.showGroup.visible = true;
        switch (selectedIndex) {
            case 2:
            case 3:
                this.showGroup.visible = false;
                break;
        }
    };
    PetMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return PetMainPanel;
}(BaseEuiView));
__reflect(PetMainPanel.prototype, "PetMainPanel", ["ICommonWindow"]);
var PetHeadItem = (function (_super) {
    __extends(PetHeadItem, _super);
    function PetHeadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ///////////////////////////////////////////////////////////////////////////// 
    PetHeadItem.prototype.dataChanged = function () {
        var config = this.data;
        var index = GameGlobal.PetModel.mBattleList.indexOf(config.id);
        if (index == 0) {
            this.imgBattle.source = "ui_bm_chuzhan";
        }
        else if (index == -1) {
            this.imgBattle.source = "";
        }
        else {
            this.imgBattle.source = "ui_bm_beizhan";
        }
        PetHeadItem.SetContent(this, config);
        var info = GameGlobal.PetModel.GetPetInfo(config.id);
        if (info && info.mName) {
            this.lbName.text = info.mName;
        }
        this.imgShen.visible = config.type == 2;
        this.UpdateRedPoint();
    };
    PetHeadItem.SetContent = function (comp, config) {
        comp.lbName.text = config.name;
        comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        comp.lbLev.text = GameGlobal.PetModel.HasPet(config.id) ? ("Lv." + GameGlobal.PetModel.GetLevel(config.id)) : "";
        comp.item.SetQuality(config.quality);
        comp.item.setItemImg(PetConst.GetHeadIcon(config.id));
        if (!config.gray)
            comp.item.setGray(!GameGlobal.PetModel.HasPet(config.id));
    };
    PetHeadItem.SetContentByInfo = function (comp, info) {
        this.SetContent(comp, GameGlobal.Config.petBiographyConfig[info.mPetId]);
        comp.lbName.text = info.mName;
    };
    PetHeadItem.prototype.UpdateRedPoint = function () {
        this.redPoint.visible = PetHeadItem.RedPoint(this.data.id);
    };
    PetHeadItem.RedPoint = function (id) {
        return GameGlobal.PetModel.IsRedPointPet(id) || GameGlobal.PetModel.HasPet(id) && !GameGlobal.PetModel.HasBattle(id) && GameGlobal.PetModel.mRedPoint.Get(PetModelRedPoint.INDEX_BATTLE);
    };
    return PetHeadItem;
}(eui.ItemRenderer));
__reflect(PetHeadItem.prototype, "PetHeadItem");
//# sourceMappingURL=PetMainPanel.js.map