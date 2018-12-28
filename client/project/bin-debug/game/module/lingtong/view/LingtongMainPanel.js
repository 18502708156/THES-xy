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
        _this.skinName = UIHelper.PANEL;
        _this.mCommonWindowBg.title = "灵童";
        return _this;
    }
    LingtongMainPanel.prototype.childrenCreated = function () {
        var list = [
            TabView.CreateTabViewData(LingtongUpLevelPanel),
            TabView.CreateTabViewData(LingtongSkillPanel),
            TabView.CreateTabViewData(LingtongRankPanel),
        ];
        if (Deblocking.IsDeblocking(DeblockingType.TYPE_120)) {
            list.push(TabView.CreateTabViewData(DestinyPanel));
            // list.push(TabView.CreateTabViewData(DestinyNiPanel))
        }
        this.mCommonWindowBg.SetTabView(list);
    };
    LingtongMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this, param[0] || 0);
        this.observe(MessageDef.LINGTONG_UPDATE_INFO, this.UpdateContent);
        this.observe(GameGlobal.LingtongModel.GetItemRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(GameGlobal.LingtongModel.GetItemEquipRpUpdateMsg(), this.UpdateRedPoint);
        this.observe(MessageDef.RP_LINGTONG, this.UpdateRedPoint);
        this.UpdateContent();
        this.UpdateRedPoint();
    };
    LingtongMainPanel.prototype.OnClose = function () {
        this.mCommonWindowBg.OnRemoved();
    };
    LingtongMainPanel.prototype.UpdateRedPoint = function () {
        this.mCommonWindowBg.CheckTalRedPoint(0);
        this.mCommonWindowBg.CheckTalRedPoint(1);
        this.mCommonWindowBg.CheckTalRedPoint(2);
    };
    LingtongMainPanel.prototype.UpdateContent = function () {
        if (GameGlobal.LingtongAttrModel.IsActive()) {
            this.mCommonWindowBg.GetCurViewStackElement().UpdateContent();
        }
        this._UpdatePetView();
    };
    LingtongMainPanel.prototype._UpdatePetView = function (index) {
        if (index === void 0) { index = null; }
        if (index == null) {
            index = this.mCommonWindowBg.viewStack.selectedIndex;
        }
        if (index == 3) {
            if (this.mPetInactiveView) {
                this.mPetInactiveView.visible = false;
            }
            this.mCommonWindowBg.viewStack.visible = true;
        }
        else {
            if (!GameGlobal.LingtongAttrModel.IsActive()) {
                if (!this.mPetInactiveView) {
                    this.mPetInactiveView = new LingtongInactiveView;
                }
                this.mPetInactiveView.visible = true;
                if (!this.mPetInactiveView.parent) {
                    this.addChild(this.mPetInactiveView);
                    this.mPetInactiveView.DoOpen([]);
                }
                this.mPetInactiveView.UpdateContent();
                this.mCommonWindowBg.viewStack.visible = false;
            }
            else {
                this.mCommonWindowBg.viewStack.visible = true;
                this._ClosePetView();
            }
        }
    };
    LingtongMainPanel.prototype._ClosePetView = function () {
        if (this.mPetInactiveView && this.mPetInactiveView.parent) {
            this.mPetInactiveView.DoClose();
            DisplayUtils.removeFromParent(this.mPetInactiveView);
        }
    };
    LingtongMainPanel.prototype.OnOpenIndex = function (openIndex) {
        if (!GameGlobal.LingtongAttrModel.IsActive() && openIndex != 3) {
            if (openIndex != 0) {
                UserTips.InfoTip("请先激活灵童");
            }
        }
        this._UpdatePetView(openIndex);
        return true;
    };
    LingtongMainPanel.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_116);
        // return true
    };
    LingtongMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return LingtongMainPanel;
}(BaseEuiView));
__reflect(LingtongMainPanel.prototype, "LingtongMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=LingtongMainPanel.js.map