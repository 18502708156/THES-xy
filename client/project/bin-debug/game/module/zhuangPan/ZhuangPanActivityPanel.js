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
var ZhuangPanActivityPanel = (function (_super) {
    __extends(ZhuangPanActivityPanel, _super);
    function ZhuangPanActivityPanel() {
        var _this = _super.call(this) || this;
        _this.dataList = [];
        _this.listIcon = [];
        _this.activityIconList = [];
        _this.index = 0;
        _this.skinName = "KaiFuActivityPanelSkin";
        return _this;
    }
    ZhuangPanActivityPanel.prototype.childrenCreated = function () {
        var serverDay = GameServer.serverOpenDay;
        var ActivityConfig = GameGlobal.Config.ActivityConfig;
        var ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig;
        this.dataList = [];
        for (var Config in ActivitySumBtnConfig) {
            if (ActivitySumBtnConfig[Number(Config)].openId == 4) {
                this.dataList.push(Number(Config));
            }
        }
        for (var i = 0; i < this.dataList.length; i++) {
            var id = this.dataList[i];
            var cls = void 0;
            if (ActivityConfig[id].activityType == 6) {
                cls = ZhuangPanShopPanel;
            }
            if (ActivityConfig[id].activityType == 26) {
                cls = zheKouBasePanel;
            }
            var BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(id);
            if (BaseModel) {
                if (BaseModel.openState) {
                    this.activityIconList.push({ cls: cls, icon: ActivitySumBtnConfig[id].icon, actid: id, title: ActivityConfig[id].tabicon });
                }
            }
        }
        // this.activityIconList.push({ cls: ZhuangPanShopPanel, icon: "ui_jchd_bt_xiaofeizhuanpan", actid: 23, title: "消费转盘" });
        // this.activityIconList.push({ cls: ZhuangPanShopPanel, icon: "ui_jchd_bt_chongzhizhuanpan", actid: 24, title: "充值转盘" });
        // this.activityIconList.push({ cls: ZheKouShopPanel, icon: "ui_zc_bm_qitianzunxiang", actid: 25, title: "折扣商店" });
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list, this.leftBtn, this.rightBtn, 130);
        var list = [];
        this.listIcon = [];
        for (var _i = 0, _a = this.activityIconList; _i < _a.length; _i++) {
            var data = _a[_i];
            list.push(TabView.CreateTabViewData(data.cls));
            this.listIcon.push(this.UpdateList(data.icon, false));
        }
        this.tabEuiView.tabChildren = list;
        this.list.itemRenderer = KaiFuBtnItem;
        this.list.dataProvider = new eui.ArrayCollection(this.listIcon);
    };
    ZhuangPanActivityPanel.prototype.UpdateList = function (icon, redPoint) {
        return { icon: icon, redPoint: redPoint };
    };
    ZhuangPanActivityPanel.prototype.OnClickMenu = function (e) {
        this.openPage(e.itemIndex);
    };
    ZhuangPanActivityPanel.prototype.openPage = function (index) {
        var data = this.activityIconList[index];
        // if (data.type) {
        // 	KaiFuActivityPanel.OPEN_JIJIE_TYPE = data.type;
        // }
        //GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_JIJIE_CHANGE_TITILE, data.title)
        this.index = index;
        if (!data) {
            return;
        }
        this.tabEuiView.OpenIndex(this.index, data.actid);
        // this.tabEuiView.selectedIndex = this.index;
        // (this.tabEuiView.getElementAt(index) as any).DoOpen(data.actid)
        // if (this.list.selectedIndex != this.index) {
        // 	this.list.selectedIndex = this.index
        // } else {
        // 	(<any>this.tabEuiView.getElementAt(this.index)).OnOpen(data.actid);
        // }
    };
    ZhuangPanActivityPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (param[0]) {
            this.index = param[0];
        }
        this.list.selectedIndex = 0;
        if (param[1]) {
            for (var i = 0; i < this.activityIconList.length; i++) {
                if (this.activityIconList[i].cls == param[1]) {
                    this.index = i;
                    break;
                }
            }
        }
        this.mListLRBtnCtrl.OnRefresh();
        this.observe(MessageDef.ACTIVITY_ADVANCED_INFO, this.UpdateContent);
        this.observe(MessageDef.ACTIVITY_UPDATE, this.getUpList);
        this.AddItemClick(this.list, this.OnClickMenu);
        this.openPage(this.index);
        this.UpdateContent();
    };
    ZhuangPanActivityPanel.prototype.UpdateContent = function () {
        var i;
        var len = this.activityIconList.length;
        for (i = 0; i < len; i++) {
            var data = this.activityIconList[i];
            data.redPoint = false;
            var actId = data.actid;
            var actData = GameGlobal.ActivityKaiFuModel.GetActivityDataById(actId);
        }
        var array = this.list.dataProvider;
        array.replaceAll(this.listIcon);
        this.getUpList();
    };
    ZhuangPanActivityPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
    };
    ZhuangPanActivityPanel.prototype.getUpList = function () {
        var ActivityConfig = GameGlobal.Config.ActivityConfig;
        this.listIcon = [];
        for (var i = 0; i < this.activityIconList.length; i++) {
            var index = GameGlobal.ActivityKaiFuModel.jingCaiRedPoint(ActivityConfig[this.activityIconList[i].actid].activityType, this.activityIconList[i].actid, i);
            this.listIcon.push(this.UpdateListRedPoint(index));
        }
        var array = this.list.dataProvider;
        array.replaceAll(this.listIcon);
    };
    ZhuangPanActivityPanel.prototype.UpdateListRedPoint = function (i) {
        return this.UpdateList(this.activityIconList[i[0]].icon, i[1]);
    };
    ZhuangPanActivityPanel.LAYER_LEVEL = LayerManager.UI_Main;
    ZhuangPanActivityPanel.NAME = "精彩活动";
    return ZhuangPanActivityPanel;
}(BaseEuiView));
__reflect(ZhuangPanActivityPanel.prototype, "ZhuangPanActivityPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=ZhuangPanActivityPanel.js.map