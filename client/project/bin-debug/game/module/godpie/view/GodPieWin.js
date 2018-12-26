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
var GodPieWin = (function (_super) {
    __extends(GodPieWin, _super);
    function GodPieWin() {
        var _this = _super.call(this) || this;
        // protected redPoint: eui.Image
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        _this.m_CurIndex = 0;
        _this.m_List = null;
        _this.skinName = "GodPieWinSkin";
        _this.list.itemRenderer = ItemBaseEffe;
        _this.list2.itemRenderer = GodPieListItem;
        _this.menuList.itemRenderer = GodPieItem;
        _this.menuList.dataProvider = _this.m_DataList = new eui.ArrayCollection();
        return _this;
    }
    GodPieWin.prototype.GetDataList = function () {
        if (this.m_List == null) {
            this.m_List = GameGlobal.GodPieModel.TopDataProvider();
        }
        return this.m_List;
    };
    GodPieWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        //	GameGlobal.MessageCenter.addListener(MessageDef.GOGPIE_UPDATE, this.updataview, this)     //派发更新
        // this.rightEff = new MovieClip
        // this.rightEff.x = this.rightBtn.x
        // this.rightEff.y = this.rightBtn.y + 5
        // this.leftEff = new MovieClip
        // this.leftEff.scaleX = -1
        // this.leftEff.x = this.leftBtn.x + 38
        // this.leftEff.y = this.leftBtn.y + 5
        // this.updataview()
        GameGlobal.GodPieModel.SetShowState();
        var showIndex = param[0] || 0;
        this.menuList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTabTouch, this);
        this.AddClick(this.btnSend, this.onClick);
        this.AddClick(this.btnSet, this.onClick);
        // this.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
        // this.rightBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this)
        this.m_List = GameGlobal.GodPieModel.TopDataProvider();
        if (this.m_List.length < 1) {
            this.CloseSelf();
            return;
        }
        this.observe(MessageDef.GOGPIE_UPDATE, this.UpdateList);
        this.observe(MessageDef.GOGPIE_UPDATE, this.UpdateContent);
        TimerManager.ins().doTimer(1000, 0, this._DoUpdate, this);
        this.UpdateList();
        this.m_CurIndex = -1;
        this._UpdateSel(showIndex);
        this.btnSet.selected = FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GOD_PIE);
    };
    GodPieWin.prototype.UpdateList = function () {
        if (this.m_List == null) {
            this.m_List = [];
        }
        var list = GameGlobal.GodPieModel.TopDataProvider();
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var info = list_1[_i];
            var existInfo = false;
            for (var _a = 0, _b = this.m_List; _a < _b.length; _a++) {
                var oldInfo = _b[_a];
                if (info.config.gtype == oldInfo.config.gtype && info.config.gid == oldInfo.config.gid) {
                    existInfo = true;
                    break;
                }
            }
            if (!existInfo) {
                this.m_List.push(info);
            }
        }
        this.m_CurIndex = MathUtils.Clamp(this.m_CurIndex, 0, this.m_List.length - 1);
        this.m_DataList.replaceAll(this.m_List);
    };
    GodPieWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
        this.menuList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTabTouch, this);
        TimerManager.ins().removeAll(this);
    };
    GodPieWin.prototype.onClick = function (e) {
        switch (e.currentTarget) {
            case this.btnSend:
                if (this.GetCurInfo() == null)
                    return;
                var index = GodPieModel.GetInfoIndex(this.GetCurInfo());
                GodPieWin.BuyData(this.GetCurInfo(), index);
                break;
            case this.btnSet:
                if (this.GetCurInfo() == null) {
                    return;
                }
                if (!this.btnSet.selected) {
                    UserTips.ins().showTips("开启推送");
                }
                else {
                    UserTips.ins().showTips("关闭推送");
                }
                // GameGlobal.GodPieModel.Sendnopop(info.config.payType, info.config.gid, this.btnSet.selected)
                FuncOpenModel.SetData(FuncOpenModel.SAVE_GOD_PIE, this.btnSet.selected);
                break;
        }
    };
    GodPieWin.prototype.onTabTouch = function (e) {
        this._UpdateSel(this.menuList.selectedIndex);
    };
    GodPieWin.prototype._UpdateSel = function (index) {
        if (this.m_CurIndex == index) {
            return;
        }
        this.list.selectedIndex = index;
        this.m_CurIndex = MathUtils.Clamp(index, 0, this.GetDataList().length - 1);
        this.UpdateContent();
    };
    GodPieWin.prototype._DoUpdate = function () {
        var info = this.GetCurInfo();
        if (info == null) {
            return;
        }
        if (GodPieModel.IsFinish(info)) {
            this.date.text = '活动结束';
        }
        else {
            this.date.text = DateUtils.format_5((info.config.endTime - GameServer.serverTime) * 1000, 4);
        }
        this.desc.textFlow = TextFlowMaker.generateTextFlow(info.config.content);
    };
    GodPieWin.prototype._UpdateListContent = function (info) {
        // showType
        var list = [];
        for (var i = 0, len = info.config.awards.length; i < len; ++i) {
            list.push({ index: i, info: info });
        }
        var getWeight = function (config) {
            if (GodPieModel.GetInfoStateByIndex(config.info, config.index) == RewardState.Gotten)
                return config.index + 10000;
            return config.index;
        };
        list.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.list2.dataProvider = new eui.ArrayCollection(list);
    };
    GodPieWin.prototype._ShowGroupType = function (type) {
        this.listGroup.visible = type == 1;
        this.activityGroup.visible = !this.listGroup.visible;
    };
    GodPieWin.BuyData = function (info, index) {
        if (GodPieModel.IsFinish(info)) {
            UserTips.InfoTip("活动结束");
            return;
        }
        if (info.config.condType == GodPieCondType.TYPE_03 && info.info.steps[index] < info.config.targets[index]) {
            RechargeWin.Open();
            return;
        }
        var conditionStr = "";
        if ((info.config.condType == 1 || info.config.condType == 2) && info.info.step < info.config.targets[index]) {
            UserTips.ErrorTip("条件不满足");
            return;
        }
        if (info.config.gtype == 2) {
            if (Checker.Money(MoneyConst.yuanbao, info.config.prices[index] || 0)) {
                GameGlobal.GodPieModel.Sendbuy(info.config.payType, info.config.gid, index + 1);
            }
        }
        else {
            GameGlobal.GodPieModel.Sendbuy(info.config.payType, info.config.gid, index + 1);
        }
    };
    GodPieWin.ShowTargetData = function (contion, consumeLabel, list, buyGroup, geted, send, info, pageIndex) {
        var conditionStr = "";
        if (info.config.condType != 0) {
            var targetValue = info.config.targets[pageIndex];
            if (targetValue) {
                var str = info.info.step + "/" + targetValue;
                if (info.config.condType == 1) {
                    conditionStr = "需充值（" + str + "）金额";
                }
                else if (info.config.condType == 2) {
                    conditionStr = "需消费（" + str + "）元宝";
                }
                else if (info.config.condType == GodPieCondType.TYPE_03) {
                    var str_1 = GodPieModel.GetBuyCountStr(info, pageIndex);
                    conditionStr = "\u5355\u7B14\u5145\u503C" + targetValue + "\u5143\u6863\u4F4D\u5373\u53EF\u83B7\u5F97" + ("" + str_1);
                }
            }
        }
        contion.text = conditionStr;
        UIHelper.SetVisible(contion, conditionStr.length > 0);
        var award = info.config.awards[pageIndex];
        list.dataProvider = new eui.ArrayCollection(RewardData.ToRewardDatas(award.items));
        buyGroup.visible = info.config.endTime - GameServer.serverTime >= 0;
        var rewardState = GodPieModel.GetInfoStateByIndex(info, pageIndex);
        geted.visible = rewardState == RewardState.Gotten;
        buyGroup.visible = rewardState != RewardState.Gotten;
        var showRedFlag = info.config.condType == GodPieCondType.TYPE_03 && info.info.steps[pageIndex] >= info.config.targets[pageIndex];
        UIHelper.ShowRedPoint(send, showRedFlag);
        var consume = info.config.prices[pageIndex] || 0;
        UIHelper.SetVisible(consumeLabel, consume > 1);
        if (consume > 1) {
            if (info.config.gtype == 1) {
                consumeLabel.text = consume + "元购买";
            }
            else if (info.config.gtype == 2) {
                consumeLabel.text = consume + "元宝购买";
            }
        }
        if (info.config.condType != GodPieCondType.TYPE_03 && consumeLabel.visible) {
            consumeLabel.text += GodPieModel.GetBuyCountStr(info, pageIndex);
        }
        if (info.config.condType == GodPieCondType.TYPE_03) {
            send.label = info.info.steps[pageIndex] < info.config.targets[pageIndex] ? "前往充值" : "领取";
        }
        else {
            send.label = consumeLabel.visible ? "购买" : "获取";
        }
    };
    GodPieWin.prototype.UpdateContent = function () {
        var info = this.GetDataList()[this.m_CurIndex];
        if (info == null) {
            this.listGroup.visible = false;
            this.activityGroup.visible = false;
            return;
        }
        this._DoUpdate();
        this._ShowGroupType(info.config.showType);
        if (info.config.showType == 1) {
            this._UpdateListContent(info);
            return;
        }
        var pageIndex = GodPieModel.GetInfoIndex(info);
        GodPieWin.ShowTargetData(this.contion, this.consumeLabel, this.list, this.buyGroup, this.geted, this.btnSend, info, pageIndex);
    };
    GodPieWin.prototype.GetCurInfo = function () {
        return this.GetDataList()[this.m_CurIndex];
    };
    GodPieWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GodPieWin;
}(BaseEuiView));
__reflect(GodPieWin.prototype, "GodPieWin");
var GodPieItem = (function (_super) {
    __extends(GodPieItem, _super);
    function GodPieItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    GodPieItem.prototype.dataChanged = function () {
        var data = this.data;
        // this.nameLabel.textFlow = TextFlowMaker.generateTextFlow(data.config.headtext)
        // this.icon.source = GodPieModel.GODPIE_ICONLIST[this.itemIndex % GodPieModel.GODPIE_ICONLIST.length]
        this.redPoint.visible = GodPieModel.GetInfoStateByIndex(data, GodPieModel.GetInfoIndex(data)) == RewardState.CanGet;
    };
    return GodPieItem;
}(eui.ItemRenderer));
__reflect(GodPieItem.prototype, "GodPieItem");
//# sourceMappingURL=GodPieWin.js.map