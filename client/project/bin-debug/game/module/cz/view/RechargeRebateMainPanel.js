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
var RechargeRebateMainPanel = (function (_super) {
    __extends(RechargeRebateMainPanel, _super);
    function RechargeRebateMainPanel() {
        var _this = _super.call(this) || this;
        _this.selectBtnType = 0;
        _this.skinName = "RechargeRebateMainSkin";
        _this.mListLRBtnCtrl = new ListLRBtnCtrl(_this.list, _this.leftBtn, _this.rightBtn, 130);
        var ActivitySumBtnConfig = GameGlobal.Config.ActivitySumBtnConfig;
        _this.dataList = [];
        _this.listIcon = [];
        var list = [];
        for (var Config in ActivitySumBtnConfig) {
            if (ActivitySumBtnConfig[Number(Config)].openId == 5) {
                var BaseModel = GameGlobal.ActivityKaiFuModel.GetActivityDataById(Number(Config));
                if (BaseModel) {
                    if (BaseModel.openState) {
                        _this.dataList.push(Number(Config));
                        //let wlist = RechargeRebateMainPanel.WelfareIcon.slice()
                        //for (let data of wlist) {
                        list.push(TabView.CreateTabViewData({ type: 1, cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" }.cls));
                        _this.listIcon.push({ type: 1, id: Number(Config), cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" });
                        //}
                    }
                }
            }
        }
        //let wlist = RechargeRebateMainPanel.WelfareIcon.slice()
        // for (let data of wlist) {
        // 	list.push(TabView.CreateTabViewData(data.cls))
        // }
        _this.tabEuiView.tabChildren = list;
        _this.list.itemRenderer = RechargeBtnItem;
        _this.list.dataProvider = new eui.ArrayCollection(_this.listIcon);
        _this._AddItemClick(_this.list, _this.OnClickMenu);
        return _this;
    }
    RechargeRebateMainPanel.prototype.OnClickMenu = function (e) {
        this.openPage(e.itemIndex);
    };
    RechargeRebateMainPanel.prototype.openPage = function (index) {
        var data = this.dataList[index];
        // if (data.type) {
        // 	KaiFuActivityPanel.OPEN_JIJIE_TYPE = data.type;
        // }
        //GameGlobal.MessageCenter.dispatch(MessageDef.ACTIVITY_JIJIE_CHANGE_TITILE, data.title)
        this.index = index;
        if (!data) {
            return;
        }
        this.tabEuiView.OpenIndex(this.index, data);
        // this.tabEuiView.selectedIndex = this.index;
        // (this.tabEuiView.getElementAt(index) as any).DoOpen(data.actid)
        // if (this.list.selectedIndex != this.index) {
        // 	this.list.selectedIndex = this.index
        // } else {
        // 	(<any>this.tabEuiView.getElementAt(this.index)).OnOpen(data.actid);
        // }
    };
    RechargeRebateMainPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        // this.observe(MessageDef.RP_SIGN_UPDATE, this.UpdateListRedPoint)
        //this.selectBtnType = param[0] || 0
        this.index = 0;
        // if (this.selectBtnType) {
        // 	let i = 0
        // 	for (let data of RechargeRebateMainPanel.WelfareIcon) {
        // 		if (data.type == this.selectBtnType) {
        // 			index = i
        // 			break
        // 		}
        // 		++i
        // 	}
        // }
        //this.tabEuiView.selectedIndex = index
        //this.tabEuiView.OpenIndex(index, this.dataList[index])
        this.list.selectedIndex = this.index;
        this.mListLRBtnCtrl.OnRefresh();
        this.mCommonWindowBg.OnAdded(this);
        this.openPage(this.index);
        this.UpdateListRedPoint();
    };
    RechargeRebateMainPanel.prototype.OnClose = function () {
        this.tabEuiView.CloseView();
        this.mCommonWindowBg.OnRemoved();
    };
    RechargeRebateMainPanel.prototype.UpdateListRedPoint = function () {
        for (var i = 0; i < this.list.numChildren; ++i) {
            var child = this.list.getChildAt(i);
            if (child && child["UpdateRedPoint"]) {
                child["UpdateRedPoint"]();
            }
        }
    };
    RechargeRebateMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    // 福利大厅图标列表
    RechargeRebateMainPanel.WelfareIcon = [
        { type: 1, cls: RechargeRebatePanel, icon: "ui_bm_chongzhifanli" },
    ];
    return RechargeRebateMainPanel;
}(BaseEuiView));
__reflect(RechargeRebateMainPanel.prototype, "RechargeRebateMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=RechargeRebateMainPanel.js.map