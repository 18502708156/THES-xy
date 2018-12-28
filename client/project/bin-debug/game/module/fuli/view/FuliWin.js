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
var FuliWin = (function (_super) {
    __extends(FuliWin, _super);
    function FuliWin() {
        var _this = _super.call(this) || this;
        _this.selectBtnType = 0;
        _this.mWList = [];
        _this.index = 0;
        _this.skinName = "FuliMainSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 130);
        var config = GameGlobal.Config.LvRewardConfig;
        var showLvPanel = true;
        for (var key in config) {
            showLvPanel = (GameGlobal.FuliModel.FuliData.lvMark & 1 << config[key].id) < 1;
            if (showLvPanel)
                break;
        }
        var wlist = _this.mWList = FuliWin.WelfareIcon.slice();
        if (!showLvPanel) {
            for (var i = 0; i < wlist.length; i++) {
                if (wlist[i].cls == FuliLvGiftBagPanel) {
                    wlist.splice(i, 1);
                    break;
                }
            }
        }
        // 西游福利
        if (!Deblocking.Check(GameGlobal.Config.WelfareBaseConfig.opentype, true)) {
            for (var i = 0; i < wlist.length; i++) {
                if (wlist[i].cls == FuliPracticePanel) {
                    wlist.splice(i, 1);
                    break;
                }
            }
        }
        var list = [];
        for (var _i = 0, wlist_1 = wlist; _i < wlist_1.length; _i++) {
            var data = wlist_1[_i];
            list.push(TabView.CreateTabViewData(data.cls));
        }
        _this.tabEuiView.tabChildren = list;
        _this.list.itemRenderer = FuliBtnItem;
        _this.list.dataProvider = new eui.ArrayCollection(wlist);
        _this._AddItemClick(_this.list, _this.OnClickMenu);
        return _this;
    }
    FuliWin.prototype.OnClickMenu = function (e) {
        if (this.tabEuiView.GetElementCls(e.itemIndex) == FuliPracticePanel) {
            var tabId = GameGlobal.Config.WelfareBaseConfig.opentype;
            if (Deblocking.Check(tabId) == true) {
                this.index = e.itemIndex;
                this.tabEuiView.selectedIndex = this.index;
            }
        }
        else {
            this.index = e.itemIndex;
            this.tabEuiView.selectedIndex = this.index;
        }
    };
    FuliWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.RP_SIGN_UPDATE, this.UpdateListRedPoint);
        this.observe(MessageDef.FULI_GOLDTREE_INFO, this.UpdateListRedPoint);
        this.selectBtnType = param[0] || 0;
        var index = 0;
        if (this.selectBtnType) {
            var i = 0;
            for (var _a = 0, _b = FuliWin.WelfareIcon; _a < _b.length; _a++) {
                var data = _b[_a];
                if (data.type == this.selectBtnType) {
                    index = i;
                    break;
                }
                ++i;
            }
        }
        this.tabEuiView.selectedIndex = index;
        this.list.selectedIndex = index;
        this.mCommonWindowBg.OnAdded(this);
        this.UpdateListRedPoint();
    };
    FuliWin.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
        this.mCommonWindowBg.OnRemoved();
    };
    FuliWin.prototype.UpdateListRedPoint = function () {
        // for (let i = 0; i < this.list.numChildren; ++i) {
        // 	let child = this.list.getChildAt(i)
        // 	if (child && child["UpdateRedPoint"]) {
        // 		child["UpdateRedPoint"]()
        // 	}
        // }
        var list = [];
        for (var _i = 0, _a = this.mWList; _i < _a.length; _i++) {
            var data = _a[_i];
            var showRedPoint = false;
            if (data.cls && data.cls && data.cls["CheckRedPoint"]) {
                showRedPoint = data.cls["CheckRedPoint"](data.id);
            }
            data.__redPoint__ = showRedPoint;
            list.push(showRedPoint);
        }
        UIHelper.ListRefresh(this.list);
        this.mListLRBtnCtrl.SetRedPointList(list);
        this.mListLRBtnCtrl.OnRefresh();
    };
    FuliWin.LAYER_LEVEL = LayerManager.UI_Main;
    /////////////////////////////////////////////////////////////////////////////
    // 福利大厅图标列表
    FuliWin.WelfareIcon = [
        { type: 1, cls: FuliSignBoardPnael, icon: "ui_fldt_bt_qiandao" },
        { type: 2, cls: FuliGiveGoldMainPanel, icon: "ui_fldt_bt_songbaiwanyuanbao" },
        { type: 3, cls: FuliLvGiftBagPanel, icon: "ui_fldt_bt_libao" },
        { type: 10, cls: FuliGoldTreePanel, icon: "ui_fldt_bt_yaoqianshu" },
        { type: 4, cls: FuliMonthlyCardPanel, icon: "ui_fldt_bt_yueka" },
        { type: 9, cls: FuliForeverCardPanel, icon: "ui_fldt_bt_zhongshenka" },
        // { type: 5, cls: FuliWeeklyCardPanel, icon: "ui_fldt_bt_zhouka" },
        { type: 6, cls: FuliPracticePanel, icon: "ui_fldt_bt_fuli" },
        { type: 7, cls: FuliActivationCodePanel, icon: "ui_fldt_bt_jihuoma" },
        { type: 8, cls: FuliNoticePanel, icon: "ui_fldt_bt_youxigonggao" },
    ];
    return FuliWin;
}(BaseEuiView));
__reflect(FuliWin.prototype, "FuliWin", ["ICommonWindow"]);
//# sourceMappingURL=FuliWin.js.map