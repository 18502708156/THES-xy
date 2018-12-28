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
var KaiFuActivityPanel = (function (_super) {
    __extends(KaiFuActivityPanel, _super);
    function KaiFuActivityPanel() {
        var _this = _super.call(this) || this;
        _this.activityIconList = [];
        _this.skinName = "KaiFuActivityPanelSkin";
        return _this;
    }
    KaiFuActivityPanel.sortByType = function (a, b) {
        return a.type - b.type;
    };
    KaiFuActivityPanel.prototype.GetTargetIconList = function () {
        var iconList = [];
        var btnList = ActivitySumBtnConfig.GetOpenList(2);
        for (var key in btnList) {
            var data = btnList[key];
            var actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(data.id);
            if (actData && actData.openState) {
                data.activityType = ActivityConfig.GetActTypeById(data.id);
                if (data.activityType == ActivityKaiFuFuncType.ACT_22_OrangePetTarget && actData.AllGotten()) {
                    continue;
                }
                iconList.push(data);
            }
        }
        iconList.sort(KaiFuActivityPanel.sortByType);
        return iconList;
    };
    KaiFuActivityPanel.prototype.GetJijieIconList = function () {
        var list = [];
        var serverDay = GameServer.serverOpenDay;
        var ProgressCrazyBaseConfig = GameGlobal.Config.ProgressCrazyBaseConfig;
        if (serverDay <= ProgressCrazyBaseConfig.initialorder.length) {
            var type = ProgressCrazyBaseConfig.initialorder[serverDay - 1];
            list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99990_JiJie, cls: KaiFuJiJiePanel, icon: ProgressCrazyBaseConfig.probtn[type - 1], title: "进阶狂欢" });
            list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99991_JiJieRank, cls: KaiFuJiJieRankPanel, icon: ProgressCrazyBaseConfig.rankbtn[type - 1], title: "进阶排行" });
            list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99992_JiJieShop, cls: KaiFuJiJieShopPanel, icon: "ui_bm_zhekoushangdian", title: "折扣商店" });
            list.push({ jijieType: type, activityType: ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge, cls: KaiFuLeiJiReChargePanel, icon: "ui_bm_leijichongzhi", title: "累计充值" });
        }
        else {
            var i = void 0;
            var index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.progressorder.length;
            var arr = ProgressCrazyBaseConfig.progressorder[index];
            var len = arr.length;
            for (i = 0; i < len; i++) {
                list.push({ jijieType: arr[i], activityType: ActivityKaiFuFuncType.ACT_99990_JiJie, cls: KaiFuJiJiePanel, icon: ProgressCrazyBaseConfig.probtn[arr[i] - 1], title: "进阶狂欢" });
            }
            index = (serverDay - ProgressCrazyBaseConfig.initialorder.length - 1) % ProgressCrazyBaseConfig.rechargeorder.length;
            list.push({ jijieType: ProgressCrazyBaseConfig.shoporder[index], activityType: ActivityKaiFuFuncType.ACT_99992_JiJieShop, cls: KaiFuJiJieShopPanel, icon: "ui_bm_zhekoushangdian", title: "折扣商店" });
            list.push({ jijieType: ProgressCrazyBaseConfig.rechargeorder[index], activityType: ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge, cls: KaiFuLeiJiReChargePanel, icon: "ui_bm_leijichongzhi", title: "累计充值" });
        }
        return list;
    };
    KaiFuActivityPanel.prototype.childrenCreated = function () {
        var list1 = this.GetJijieIconList();
        var list2 = this.GetTargetIconList();
        this.activityIconList = [];
        this.activityIconList = this.activityIconList.concat(list1);
        this.activityIconList = this.activityIconList.concat(list2);
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 126);
        var list = [];
        for (var _i = 0, _a = this.activityIconList; _i < _a.length; _i++) {
            var data = _a[_i];
            list.push(TabView.CreateTabViewData(ActivityDataFactory.GetPanel(data.activityType), { jijieType: data.jijieType, _activityId: data.id }));
        }
        this.tabEuiView.tabChildren = list;
        this.list.itemRenderer = KaiFuBtnItem;
        this.list.dataProvider = new eui.ArrayCollection(this.activityIconList);
    };
    KaiFuActivityPanel.prototype.UpdateRedList = function () {
        for (var _i = 0, _a = this.activityIconList; _i < _a.length; _i++) {
            var data = _a[_i];
            var redPoint = false;
            if (data.activityType == ActivityKaiFuFuncType.ACT_99990_JiJie) {
                if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(data.jijieType) == true) {
                    redPoint = true;
                }
            }
            else if (data.activityType == ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge) {
                if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedReCharge() == true) {
                    redPoint = true;
                }
            }
            else if (data.activityType == ActivityKaiFuFuncType.ACT_99992_JiJieShop) {
                if (GameGlobal.ActivityKaiFuModel.RedPointAdvanceShop()) {
                    redPoint = true;
                }
            }
            else {
                var actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(data.id);
                if (actData && actData.hasReward()) {
                    redPoint = true;
                }
            }
            data.__redPoint__ = redPoint;
        }
    };
    KaiFuActivityPanel.prototype.OnClickMenu = function (e) {
        this.openPage(e.itemIndex);
    };
    KaiFuActivityPanel.prototype.openPage = function (index) {
        var data = this.activityIconList[index];
        this.tabEuiView.selectedIndex = index;
        this.list.selectedIndex = index;
    };
    KaiFuActivityPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var data = param[0];
        var index = 0;
        if (data && data.val) {
            var val = data.val;
            if (data.isId) {
                for (var i = 0; i < this.activityIconList.length; i++) {
                    if (this.activityIconList[i].id == val) {
                        index = i;
                        break;
                    }
                }
            }
            else {
                for (var i = 0; i < this.activityIconList.length; i++) {
                    if (this.activityIconList[i].activityType == val) {
                        index = i;
                        break;
                    }
                }
            }
        }
        if (index && index > 3) {
            this.mListLRBtnCtrl.SetLeftIndex(index);
        }
        this.mListLRBtnCtrl.OnRefresh();
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_INFO, this.UpdateContent);
        this.AddItemClick(this.list, this.OnClickMenu);
        this.openPage(index);
        this.UpdateContent();
    };
    KaiFuActivityPanel.prototype.UpdateContent = function () {
        this.UpdateRedList();
        UIHelper.ListRefresh(this.list);
        var list = [];
        for (var _i = 0, _a = this.activityIconList; _i < _a.length; _i++) {
            var data = _a[_i];
            list.push(data.__redPoint__ ? true : false);
        }
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
        var view = this.tabEuiView.getElementAt(this.tabEuiView.selectedIndex);
        if (view && view.UpdateContent) {
            view.UpdateContent();
        }
    };
    KaiFuActivityPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
    };
    KaiFuActivityPanel.LAYER_LEVEL = LayerManager.UI_Main;
    KaiFuActivityPanel.NAME = "开服活动";
    return KaiFuActivityPanel;
}(BaseEuiView));
__reflect(KaiFuActivityPanel.prototype, "KaiFuActivityPanel", ["ICommonWindowTitle"]);
var KaiFuBtnItem = (function (_super) {
    __extends(KaiFuBtnItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function KaiFuBtnItem() {
        return _super.call(this) || this;
    }
    KaiFuBtnItem.prototype.dataChanged = function () {
        var data = this.data;
        // 七天尊享
        if (data.id == 15) {
            var curday = Math.min(GameServer.serverOpenDay, 7);
            var config = GameGlobal.Config.ActivityType17Config[15];
            var source = "";
            for (var key in config) {
                if (config[key].day == curday) {
                    source = config[key].info.btn;
                    break;
                }
            }
            this.icon.source = source;
        }
        else {
            this.icon.source = data.icon;
        }
        this.redPoint.visible = this.data.__redPoint__;
        // let redPoint = false
        // if (data.activityType == ActivityKaiFuFuncType.ACT_99990_JiJie) {
        // 	if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedUpLevelByType(data.jijieType) == true) {
        // 		redPoint = true;
        // 	}
        // } else if (data.activityType == ActivityKaiFuFuncType.ACT_99993_LeiJiReCharge) {
        // 	if (GameGlobal.ActivityKaiFuModel.RedPointAdvancedReCharge() == true) {
        // 		redPoint = true;
        // 	}
        // } else {
        // 	let actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(this.data.id);
        // 	if (actData && actData.hasReward()) {
        // 		redPoint = true;
        // 	}
        // }
        // this.redPoint.visible = redPoint
    };
    return KaiFuBtnItem;
}(eui.ItemRenderer));
__reflect(KaiFuBtnItem.prototype, "KaiFuBtnItem");
//# sourceMappingURL=KaiFuActivityPanel.js.map