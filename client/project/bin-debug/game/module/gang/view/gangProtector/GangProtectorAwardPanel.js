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
var GangProtectorAwardPanel = (function (_super) {
    __extends(GangProtectorAwardPanel, _super);
    function GangProtectorAwardPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.defendInfo = new GangProtectorInfo();
        return _this;
    }
    GangProtectorAwardPanel.prototype.childrenCreated = function () {
        this.awardList.itemRenderer = GangPAwardItem;
        this.awardList.dataProvider = new eui.ArrayCollection([]);
    };
    GangProtectorAwardPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_UPDATA_PROTECTOR_INFO, this.upDataProtectorInfo);
        GameGlobal.GangModel.sendGetProtectorInfo();
    };
    GangProtectorAwardPanel.prototype.upDataProtectorInfo = function (rsp) {
        this.defendInfo = GameGlobal.GangModel.protectorInfo;
        this.UpdateContent();
    };
    GangProtectorAwardPanel.prototype.UpdateContent = function () {
        var itemLists = [];
        var config = GameGlobal.Config.GuildEverydayConfig;
        var rewardMarks = [];
        if (!this.defendInfo) {
            return;
        }
        if (this.defendInfo.rewardMark != null) {
            rewardMarks = CommonUtils.uintToVecBool(this.defendInfo.rewardMark, 32);
        }
        var awardIndex = 0;
        for (var key in config) {
            var hasGet = false;
            if (awardIndex < rewardMarks.length) {
                hasGet = rewardMarks[awardIndex];
            }
            itemLists.push({ "id": config[key].id, "exp": config[key].exp, "reward": config[key].reward, "curExp": this.defendInfo.todayActive, "hasGet": hasGet });
            awardIndex++;
        }
        var getWeight = function (config) {
            var confId = config.id;
            if (!config.hasGet)
                return confId + 1000;
            return confId;
        };
        itemLists.sort(function (lhs, rhs) {
            return getWeight(lhs) - getWeight(rhs);
        });
        this.awardList.dataProvider = new eui.ArrayCollection(itemLists);
    };
    GangProtectorAwardPanel.prototype.OnClose = function () {
    };
    GangProtectorAwardPanel.NAME = "每日奖励";
    return GangProtectorAwardPanel;
}(BaseView));
__reflect(GangProtectorAwardPanel.prototype, "GangProtectorAwardPanel", ["ICommonWindowTitle"]);
var GangPAwardItem = (function (_super) {
    __extends(GangPAwardItem, _super);
    function GangPAwardItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangPAwardItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBase;
        this.list.dataProvider = new eui.ArrayCollection([]);
        this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GangPAwardItem.prototype.dataChanged = function () {
        var rewards = this.data.reward;
        this.list.dataProvider.replaceAll(rewards);
        for (var i = 0; i < this.list.numElements; i++) {
            this.list.getVirtualElementAt(i).isShowName(false);
        }
        var color = this.data.curExp >= this.data.exp ? Color.l_green_1 : Color.Red;
        var text = "\u4ECA\u65E5\u6D3B\u8DC3\u70B9\u8FBE\u5230" + this.data.exp + " (|C:" + color + "&T:" + this.data.curExp + "|/" + this.data.exp + ")";
        this.desc_label.textFlow = TextFlowMaker.generateTextFlow(text);
        if (this.data.curExp >= this.data.exp) {
            this.btnApply.enabled = this.data.hasGet;
            this.btnApply.label = this.data.hasGet ? "领 取" : "已领取";
        }
        else {
            this.btnApply.enabled = false;
            this.btnApply.label = "未达成";
        }
    };
    GangPAwardItem.prototype._OnBtnClick = function (e) {
        if (this.data.exp <= this.data.curExp) {
            GameGlobal.GangModel.sendGetProtectorEveryDataAward(this.data.id);
        }
        else {
            UserTips.ins().showTips("活跃点还没达到");
        }
    };
    GangPAwardItem.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.btnApply)
            this.btnApply.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    return GangPAwardItem;
}(eui.ItemRenderer));
__reflect(GangPAwardItem.prototype, "GangPAwardItem");
//# sourceMappingURL=GangProtectorAwardPanel.js.map