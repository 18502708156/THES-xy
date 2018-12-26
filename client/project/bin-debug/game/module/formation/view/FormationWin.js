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
var FormationWin = (function (_super) {
    __extends(FormationWin, _super);
    function FormationWin() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mSelectIndex = 0;
        _this.mFormationList = [];
        _this.skinName = "FormationMainSkin";
        _this.commonWindowBg.SetTitle("阵型");
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 112);
        return _this;
    }
    FormationWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_113);
    };
    FormationWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = FormationItem;
        this.mFormationList = CommonUtils.GetArray(GameGlobal.Config.FormationListConfig, "id");
        var model = GameGlobal.FormationModel;
        var getWeight = function (config) {
            var confId = config.id;
            if (model.IsUsed(confId)) {
                return confId - 100000;
            }
            if (model.HasFormation(confId)) {
                return confId - 10000;
            }
            return confId;
        };
        this.mFormationList.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(this.mFormationList);
        this.list.selectedIndex = this.mSelectIndex;
        this._AddItemClick(this.list, this._OnItemTap);
    };
    FormationWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.FORMATION_UPDATE_INFO, this.UpdateList);
        this.commonWindowBg.OnAdded(this);
        this.mListLRBtnCtrl.OnRefresh();
        this.UpdateContent();
    };
    FormationWin.prototype.OnClose = function () {
        this._CloseFormationView();
    };
    FormationWin.prototype._OnItemTap = function (e) {
        var index = e.itemIndex;
        this.mSelectIndex = index;
        this.UpdateContent();
    };
    FormationWin.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    FormationWin.prototype.UpdateContent = function () {
        this.UpdateInfoView();
    };
    FormationWin.prototype.UpdateInfoView = function () {
        var id = this.mFormationList[this.mSelectIndex].id;
        if (!this.mFormationInfoPanel) {
            this.mFormationInfoPanel = new FormationInfoPanel;
        }
        if (!this.mFormationInfoPanel.parent) {
            this.group.addChild(this.mFormationInfoPanel);
            this.mFormationInfoPanel.DoOpen([]);
        }
        this.mFormationInfoPanel.UpdateContent(id);
    };
    FormationWin.prototype._CloseFormationView = function () {
        if (this.mFormationInfoPanel && this.mFormationInfoPanel.parent) {
            this.mFormationInfoPanel.DoClose();
            DisplayUtils.removeFromParent(this.mFormationInfoPanel);
        }
    };
    FormationWin.LAYER_LEVEL = LayerManager.UI_Main;
    return FormationWin;
}(BaseEuiView));
__reflect(FormationWin.prototype, "FormationWin", ["ICommonWindow"]);
var FormationItem = (function (_super) {
    __extends(FormationItem, _super);
    function FormationItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    FormationItem.prototype.childrenCreated = function () {
    };
    FormationItem.prototype.dataChanged = function () {
        var config = this.data;
        var model = GameGlobal.FormationModel;
        if (model.IsUsed(config.id))
            this.imgBattle.source = "ui_zx_bm_xuanyon";
        else
            this.imgBattle.source = "";
        FormationItem.SetContent(this, config);
        this.UpdateRedPoint();
    };
    FormationItem.SetContent = function (comp, config) {
        comp.lbName.text = config.name;
        comp.lbName.textColor = ItemBase.GetColorByQuality(config.quality);
        comp.lbLev.text = "";
        comp.item.SetQuality(config.quality);
        comp.item.setItemImg(config.item);
        comp.item.setGray(!GameGlobal.FormationModel.HasFormation(config.id));
    };
    FormationItem.prototype.UpdateRedPoint = function () {
        this.redPoint.visible = GameGlobal.FormationModel.mRedPoint.IsRedAct(this.data.id)
            || GameGlobal.FormationModel.mRedPoint.IsRedLevel(this.data.id)
            || GameGlobal.FormationModel.mRedPoint.IsRedSkill(this.data.id)
            || GameGlobal.FormationModel.mRedPoint.IsRedSoul(this.data.id)
            || GameGlobal.FormationModel.mRedPoint.IsRedDrug(this.data.id);
    };
    return FormationItem;
}(eui.ItemRenderer));
__reflect(FormationItem.prototype, "FormationItem");
//# sourceMappingURL=FormationWin.js.map