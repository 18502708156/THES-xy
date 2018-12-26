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
var KaiFuQiTianActivityPanel = (function (_super) {
    __extends(KaiFuQiTianActivityPanel, _super);
    function KaiFuQiTianActivityPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.index = -1;
        _this.tabDatas = [
            { cls: KaiFuQiTianFuLiPanel, label: "每日福利" },
            // { cls: KaiFuQiTianOtherPanel, label: "竞技场" },
            { cls: KaiFuQiTianShopPanel, label: "低价贩售" },
        ];
        _this.dayListData = [
            { id: 1, day: 1 },
            { id: 2, day: 2 },
            { id: 3, day: 3 },
            { id: 4, day: 4 },
            { id: 5, day: 5 },
            { id: 6, day: 6 },
        ];
        _this.skinName = "KaiFuQiTianActivityPanelSkin";
        return _this;
    }
    KaiFuQiTianActivityPanel.prototype.childrenCreated = function () {
        var list = [];
        list.push(TabView.CreateTabViewData(KaiFuQiTianFuLiPanel));
        // list.push(TabView.CreateTabViewData(KaiFuQiTianOtherPanel))
        list.push(TabView.CreateTabViewData(KaiFuQiTianShopPanel));
        this.tabEuiView.tabChildren = list;
        this.dayList.itemRenderer = QiTianDayButtonItem;
        this.dayList.dataProvider = new eui.ArrayCollection(this.dayListData);
        this.tabBar.itemRenderer = QiTianTabItem;
        this.tabBar.dataProvider = new eui.ArrayCollection(this.tabDatas);
    };
    KaiFuQiTianActivityPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.ACTIVITY_UPDATE, this.UpdateContent);
        this.AddTimer(1000, 0, this.updateTime);
        KaiFuQiTianActivityPanel.OPEN_SHOW_DAY = Math.min(GameServer.serverOpenDay, 7);
        this.index = 0;
        this.AddItemClick(this.dayList, this.OnClickDayMenu);
        this.AddItemClick(this.tabBar, this.OnClickTabMenu);
        this.AddClick(this.sevenDay_btn, this.onClick);
        this.AddClick(this.look_btn, this.onClick);
        this.UpdateContent();
        this.updateTime();
        var petId = GameGlobal.Config.WeekEnjoyBaseConfig.petid;
        var config;
        if ((petId + "").indexOf("9") == 0) {
            //宠物
            config = GameGlobal.Config.petBiographyConfig[petId];
        }
        else {
            config = GameGlobal.Config.partnerBiographyConfig[petId];
        }
        if (config)
            this.petShowPanel.SetBody(PetConst.GetSkin(config.id));
        this.petShowPanel.scaleX = -0.4;
        this.petShowPanel.scaleY = 0.4;
    };
    KaiFuQiTianActivityPanel.prototype.updateTime = function () {
        var activityData = GameGlobal.ActivityKaiFuModel.GetActivityDataByType(ActivityKaiFuFuncType.ACT_17_ArenaTarget);
        if (activityData) {
            this.time_label.textFlow = TextFlowMaker.generateTextFlow(activityData.getRemindTimeString());
        }
        else {
            this.time_label.text = "活动未开启";
        }
    };
    KaiFuQiTianActivityPanel.prototype.UpdateContent = function () {
        var serverDay = GameServer.serverOpenDay;
        this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1;
        //改变第二个标签的名字
        var curDataTab2Name = GameGlobal.Config.WeekEnjoyBaseConfig.name[KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1];
        // this.tabDatas[1].label = curDataTab2Name;
        var d;
        var dLen = 7;
        for (d = 0; d < dLen; d++) {
            var dRed = false;
            var i = void 0;
            var len = this.tabDatas.length;
            for (i = 0; i < len; i++) {
                var b = this.tabDatas[i].cls["RedPoint"](d + 1);
                if (d + 1 == KaiFuQiTianActivityPanel.OPEN_SHOW_DAY)
                    this.tabDatas[i].redPoint = b;
                if (b)
                    dRed = true;
            }
            if (d == dLen - 1) {
                UIHelper.ShowRedPoint(this.sevenDay_btn, dRed);
            }
            else {
                this.dayListData[d].redPoint = dRed;
            }
        }
        this.dayList.dataProvider.replaceAll(this.dayListData);
        this.tabBar.dataProvider.replaceAll(this.tabDatas);
        // this.dayListData[i] = this.tabDatas[i].cls["RedPoint"]();
        if (KaiFuQiTianActivityPanel.OPEN_SHOW_DAY == 7) {
            this.dayList.selectedIndex = -1;
            this.seventhDaySelected_icon.visible = true;
        }
        else {
            this.seventhDaySelected_icon.visible = false;
        }
        this.openPage(this.index);
    };
    KaiFuQiTianActivityPanel.prototype.OnClickDayMenu = function (e) {
        var day = e.itemIndex + 1;
        this.changeDayFunc(day);
    };
    KaiFuQiTianActivityPanel.prototype.changeDayFunc = function (day) {
        var serverDay = GameServer.serverOpenDay;
        if (day > serverDay + 1) {
            this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1;
            UserTips.ins().showTips("活动未开启，请第" + day + "天再来");
            return;
        }
        // if (day < serverDay)
        // {
        // 	this.dayList.selectedIndex = KaiFuQiTianActivityPanel.OPEN_SHOW_DAY - 1
        // 	UserTips.ins().showTips("活动已经关闭");
        // 	return;
        // }
        KaiFuQiTianActivityPanel.OPEN_SHOW_DAY = day;
        this.UpdateContent();
    };
    KaiFuQiTianActivityPanel.prototype.OnClickTabMenu = function (e) {
        this.index = e.itemIndex;
        this.UpdateContent();
    };
    KaiFuQiTianActivityPanel.prototype.onClick = function (e) {
        if (e.currentTarget == this.look_btn) {
            var petId = GameGlobal.Config.WeekEnjoyBaseConfig.petid;
            var config = void 0;
            if ((petId + "").indexOf("9") == 0) {
                //宠物
                config = GameGlobal.Config.petBiographyConfig[petId];
                if (config)
                    ViewManager.ins().open(PetInfoPanel, config);
            }
            else {
                config = GameGlobal.Config.partnerBiographyConfig[petId];
                if (config)
                    ViewManager.ins().open(XianLvInfoPanel, config);
            }
        }
        else if (e.currentTarget == this.sevenDay_btn) {
            this.changeDayFunc(7);
        }
    };
    KaiFuQiTianActivityPanel.prototype.openPage = function (index) {
        this.tabEuiView.selectedIndex = this.index;
        if (this.tabBar.selectedIndex == this.index) {
            this.tabEuiView.getElementAt(this.index).OnOpen();
        }
        this.tabBar.selectedIndex = this.index;
    };
    KaiFuQiTianActivityPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
    };
    KaiFuQiTianActivityPanel.prototype.UpdateListRedPoint = function () {
        // for (let i = 0; i < this.iconList.numChildren; ++i) {
        // 	let child = this.iconList.getChildAt(i)
        // 	if (child && child["UpdateRedPoint"]) {
        // 		child["UpdateRedPoint"]()
        // 	}
        // }
    };
    KaiFuQiTianActivityPanel.LAYER_LEVEL = LayerManager.UI_Main;
    KaiFuQiTianActivityPanel.NAME = "七天尊享";
    return KaiFuQiTianActivityPanel;
}(BaseEuiView));
__reflect(KaiFuQiTianActivityPanel.prototype, "KaiFuQiTianActivityPanel", ["ICommonWindowTitle"]);
var QiTianDayButtonItem = (function (_super) {
    __extends(QiTianDayButtonItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QiTianDayButtonItem() {
        return _super.call(this) || this;
    }
    QiTianDayButtonItem.prototype.dataChanged = function () {
        this.labelDisplay.text = "第" + this.data.day + "天";
        this.redPoint.visible = this.data.redPoint;
    };
    return QiTianDayButtonItem;
}(eui.ItemRenderer));
__reflect(QiTianDayButtonItem.prototype, "QiTianDayButtonItem");
var QiTianTabItem = (function (_super) {
    __extends(QiTianTabItem, _super);
    /////////////////////////////////////////////////////////////////////////////
    function QiTianTabItem() {
        return _super.call(this) || this;
    }
    QiTianTabItem.prototype.dataChanged = function () {
        this.labelDisplay.text = this.data.label;
        this.redPoint.visible = this.data.redPoint;
    };
    return QiTianTabItem;
}(eui.ItemRenderer));
__reflect(QiTianTabItem.prototype, "QiTianTabItem");
//# sourceMappingURL=KaiFuQiTianActivityPanel.js.map