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
var ChangeLinerWin = (function (_super) {
    __extends(ChangeLinerWin, _super);
    /////////////////////////////////////////////////////////////////////////////
    function ChangeLinerWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "ChangeLinerSkin";
        _this._AddClick(_this.btnChange, _this._OnClick);
        return _this;
    }
    ChangeLinerWin.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "切换线路";
        this.observe(MessageDef.CHANNEL_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.CHANNEL_UPDATE_LIST, this.UpdateList);
        GameGlobal.CommonRaidModel.SendGetChannelInfo();
        this.list.itemRenderer = LinerItem;
        this.UpdateContent();
    };
    ChangeLinerWin.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    ChangeLinerWin.prototype.UpdateContent = function () {
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (info) {
            this.labLine.text = info.channelid + "\u7EBF";
            this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.people);
            GameGlobal.CommonRaidModel.mRecordChannelId = info.channelid;
        }
        var channelInfos = GameGlobal.CommonRaidModel.mChannelInfos;
        this.list.dataProvider = new eui.ArrayCollection(channelInfos);
    };
    ChangeLinerWin.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    ChangeLinerWin.prototype._OnClick = function (e) {
        var info = GameGlobal.CommonRaidModel.mMainCityInfo;
        if (!info) {
            return;
        }
        var lineNo = GameGlobal.CommonRaidModel.mRecordChannelId;
        if (lineNo == info.channelid) {
            this.CloseSelf();
            return;
        }
        GameGlobal.CommonRaidModel.SendEnterCity(lineNo);
        this.CloseSelf();
    };
    ChangeLinerWin.LAYER_LEVEL = LayerManager.UI_Popup;
    return ChangeLinerWin;
}(BaseEuiView));
__reflect(ChangeLinerWin.prototype, "ChangeLinerWin");
var LinerItem = (function (_super) {
    __extends(LinerItem, _super);
    function LinerItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /////////////////////////////////////////////////////////////////////////////
    LinerItem.prototype.childrenCreated = function () {
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnClicked, this);
    };
    LinerItem.prototype.dataChanged = function () {
        var info = this.data;
        this.btn.label = info.id + "\u7EBF";
        this.btn.enabled = info.id != GameGlobal.CommonRaidModel.mRecordChannelId;
        this.imgPoint.source = GameGlobal.CommonRaidModel.GetPointSource(info.count);
    };
    LinerItem.prototype._OnBtnClicked = function (e) {
        GameGlobal.CommonRaidModel.mRecordChannelId = this.data.id;
        GameGlobal.CommonRaidModel.RefreshChannelList();
    };
    return LinerItem;
}(eui.ItemRenderer));
__reflect(LinerItem.prototype, "LinerItem");
//# sourceMappingURL=ChangeLinerWin.js.map