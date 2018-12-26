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
var GangListWin = (function (_super) {
    __extends(GangListWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function GangListWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangListSkin";
        _this.commonWindowBg.SetTitle("帮会列表");
        _this.commonWindowBg["helpBtn"].visible = true;
        _this.commonWindowBg.setHelp(21, "规则说明");
        _this._AddClick(_this.btnCreate, _this._OnClick);
        GameGlobal.GangModel.SendGetGangList();
        return _this;
    }
    GangListWin.openCheck = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        return Deblocking.Check(DeblockingType.TYPE_50);
    };
    GangListWin.prototype.childrenCreated = function () {
        this.listGang.itemRenderer = GangItem;
        this.btnCreate.visible = !GameGlobal.GangModel.HasGang();
    };
    GangListWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_UPDATE_LIST, this.UpdateContent);
        this.observe(MessageDef.GANG_UPDATE_APPLIED_LIST, this.UpdateList);
        this.observe(MessageDef.GANG_INIT, this.InitGang);
        this.commonWindowBg.OnAdded(this);
    };
    GangListWin.prototype.UpdateContent = function () {
        var gangList = GameGlobal.GangModel.gangList;
        gangList.sort(function (lhs, rhs) {
            return rhs.mMemberCount - lhs.mMemberCount;
        });
        this.listGang.dataProvider = new eui.ArrayCollection(gangList);
        GameGlobal.GangModel.SendGetApplyList();
    };
    GangListWin.prototype.InitGang = function () {
        ViewManager.ins().open(GangMainWin);
        ViewManager.ins().close(this);
    };
    GangListWin.prototype.OnClose = function () {
    };
    GangListWin.prototype._OnClick = function (e) {
        ViewManager.ins().open(GangCreateView);
    };
    GangListWin.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.listGang);
    };
    GangListWin.LAYER_LEVEL = LayerManager.UI_Main;
    return GangListWin;
}(BaseEuiView));
__reflect(GangListWin.prototype, "GangListWin", ["ICommonWindow"]);
var GangItem = (function (_super) {
    __extends(GangItem, _super);
    function GangItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    GangItem.prototype.childrenCreated = function () {
        this.btnApply.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClick, this);
    };
    GangItem.prototype.dataChanged = function () {
        var gangInfo = this.data;
        this.btnApply.name = gangInfo.mGangId;
        this.imgFace.source = ResDataPath.GetHeadImgName(gangInfo.mJob, gangInfo.mSex);
        this.labListNo.text = "" + (this.itemIndex + 1);
        this.labBangName.text = gangInfo.mGangName + "\uFF08Lv." + gangInfo.mLevel + "\uFF09";
        this.labBangMaster.text = "\u3010\u5E2E\u4E3B\u3011\uFF1A" + gangInfo.mGangMasterName;
        this.labMemberCount.text = "\u4EBA\u6570\uFF1A" + gangInfo.mMemberCount + "/" + GangConst.GetMaxMemberCount(gangInfo.mLevel);
        var powerTip = gangInfo.mNeedPower >= 10000 ? Math.floor(gangInfo.mNeedPower / 10000) + "\u4E07" : gangInfo.mNeedPower;
        this.labPowerTip.text = "\u9700\u6218\u529B\uFF1A" + powerTip;
        this.labPowerTip.visible = gangInfo.mNeedPower > 0;
        if (GameGlobal.GangModel.HasGang()) {
            this.btnApply.visible = false;
            this.labPowerTip.visible = false;
            return;
        }
        if (GameGlobal.GangModel.IsApplied(gangInfo.mGangId)) {
            this.btnApply.label = "已申请";
            if (this.btnApply.filters == null)
                this.btnApply.filters = Color.GetFilter();
        }
        else {
            this.btnApply.label = "申请";
            this.btnApply.filters = null;
        }
    };
    GangItem.prototype._OnBtnClick = function (e) {
        var gangId = parseInt(e.currentTarget.name);
        if (GameGlobal.GangModel.IsApplied(gangId))
            return;
        var gangInfo = this.data;
        if (gangInfo.mMemberCount >= GangConst.GetMaxMemberCount(gangInfo.mLevel)) {
            UserTips.ins().showTips("该帮会人数已满，不可申请");
            return;
        }
        if (gangInfo && gangInfo.mNeedPower) {
            if (GameGlobal.actorModel.power < gangInfo.mNeedPower) {
                UserTips.ins().showTips("战力不足");
                return;
            }
        }
        if (GameGlobal.GangModel.mAppliedCount >= GameGlobal.Config.GuildConfig.applycount) {
            UserTips.ins().showTips("\u6700\u591A\u53EF\u540C\u65F6\u5411" + GameGlobal.Config.GuildConfig.applycount + "\u4E2A\u5E2E\u4F1A\u7533\u8BF7");
            return;
        }
        GameGlobal.GangModel.SendJoinGang(gangId);
    };
    return GangItem;
}(eui.ItemRenderer));
__reflect(GangItem.prototype, "GangItem");
//# sourceMappingURL=GangListWin.js.map