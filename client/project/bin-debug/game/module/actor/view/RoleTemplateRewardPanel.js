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
var RoleTemplateRewardPanel = (function (_super) {
    __extends(RoleTemplateRewardPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function RoleTemplateRewardPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "RoleTemplateRewardSkin";
        _this.list.itemRenderer = RoleTemplateRewardItem;
        var list = [];
        for (var type in GameGlobal.Config.ProgressRewardConfig) {
            list.push({ name: ItemConst.TYPE_NAME[UserTemplate.TEMPTYPE_TO_ITEMTYPE[type]], type: type });
        }
        list.sort(function (lhs, rhs) {
            return lhs - rhs;
        });
        _this.bar.dataProvider = new eui.ArrayCollection(list);
        _this.bar.selectedIndex = 0;
        _this._AddItemClick(_this.bar, _this._OnItemClick);
        return _this;
    }
    RoleTemplateRewardPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.mCommonWindowBg.OnAdded(this);
        var type = param[0];
        if (type != null) {
            var i = 0;
            for (var _a = 0, _b = this.bar.dataProvider.source; _a < _b.length; _a++) {
                var data = _b[_a];
                if (type == data.type) {
                    this.bar.selectedIndex = i;
                    break;
                }
                ++i;
            }
        }
        this._UpdateContent();
        this.observe(MessageDef.USER_TEMPLATE_RANK_REWARD_UPDATE_ALL___, this.UpdateList);
    };
    RoleTemplateRewardPanel.prototype._OnItemClick = function (e) {
        this._UpdateContent();
    };
    RoleTemplateRewardPanel.prototype._UpdateContent = function () {
        var item = this.bar.selectedItem;
        this.UpdateList();
    };
    RoleTemplateRewardPanel.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.bar);
        this.bar.validateNow();
        for (var i = 0, len = this.bar.dataProvider.length; i < len; i++) {
            var item = this.bar.getChildAt(i);
            UIHelper.ShowRedPoint(item, GameGlobal.SubRoles.mTemplate[this.bar.dataProvider.getItemAt(i).type].mRedPoint.Get(UserTemplateRedPoint.INDEX_REWARD));
        }
        var model = GameGlobal.SubRoles.mTemplate[this.bar.selectedItem.type];
        var list = [];
        var datas = GameGlobal.Config.ProgressRewardConfig[this.bar.selectedItem.type];
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            list.push(data);
        }
        var w = function (data) {
            var state = model.GetRewardState(data.id - 1);
            if (state == RewardState.Gotten) {
                return 10000 + data.id;
            }
            if (state == RewardState.CanGet) {
                return -10000 + data.id;
            }
            return data.id;
        };
        list.sort(function (lhs, rhs) {
            return w(lhs) - w(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(list);
    };
    RoleTemplateRewardPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return RoleTemplateRewardPanel;
}(BaseEuiView));
__reflect(RoleTemplateRewardPanel.prototype, "RoleTemplateRewardPanel");
var RoleTemplateRewardItem = (function (_super) {
    __extends(RoleTemplateRewardItem, _super);
    function RoleTemplateRewardItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    RoleTemplateRewardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseEffeNoName;
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    RoleTemplateRewardItem.prototype._OnClick = function () {
        var config = this.data;
        var model = GameGlobal.SubRoles.mTemplate[config.type];
        model.SendGetReward(config.id);
    };
    RoleTemplateRewardItem.prototype.dataChanged = function () {
        var config = this.data;
        this.title.text = ItemConst.TYPE_NAME[UserTemplate.TEMPTYPE_TO_ITEMTYPE[config.type]] + "进阶到" + config.progress + "阶奖励";
        this.list.dataProvider = new eui.ArrayCollection(config.reward);
        var type = (config.type);
        var model = GameGlobal.SubRoles.mTemplate[type];
        this.goBtn.visible = false;
        this.getImg.visible = false;
        if (model) {
            var state = model.GetRewardState(config.id - 1);
            this.goBtn.visible = state == RewardState.CanGet;
            this.getImg.visible = state == RewardState.Gotten;
        }
    };
    return RoleTemplateRewardItem;
}(eui.ItemRenderer));
__reflect(RoleTemplateRewardItem.prototype, "RoleTemplateRewardItem");
//# sourceMappingURL=RoleTemplateRewardPanel.js.map