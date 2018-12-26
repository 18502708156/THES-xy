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
var GangCreateView = (function (_super) {
    __extends(GangCreateView, _super);
    function GangCreateView() {
        var _this = _super.call(this) || this;
        _this.skinName = "GangCreateSkin";
        _this._AddClick(_this.item1, _this._OnClick);
        _this._AddClick(_this.item2, _this._OnClick);
        _this._AddClick(_this.btnCreate, _this._OnClick);
        _this.list.itemRenderer = ItemBaseNotName;
        return _this;
    }
    GangCreateView.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.GANG_INIT, this.InitGang);
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        this.commonDialog.title = "创建帮会";
        this.input.textColor = 0x755E4F;
        this.input.text = "";
        UIHelper.SetInputMaxChar(this.input, 12);
        this.item1.SetItemInfo(1);
        this.item2.SetItemInfo(2);
        this.ChooseItem(1);
        var curReceiveCount = GameGlobal.GangModel.receiveCount;
        var maxReceiveCount = GameGlobal.Config.GuildConfig.creatrewardcount;
        this.item1.SetDoubleImg(curReceiveCount < maxReceiveCount);
        this.item2.SetDoubleImg(curReceiveCount < maxReceiveCount);
        var text = GameGlobal.Config.GuildConfig.des;
        this.labTip.text = text.replace("%s", "" + maxReceiveCount);
        this.labCount.text = "\u5E2E\u4F1A\u6570\u91CF\uFF1A" + curReceiveCount + "/" + maxReceiveCount;
        this.list.dataProvider = new eui.ArrayCollection(GameGlobal.Config.GuildConfig.creatreward);
    };
    GangCreateView.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    GangCreateView.prototype.ChooseItem = function (idx) {
        this.mChooseIdx = idx;
        this.item1.SetChooseInfo(this.mChooseIdx);
        this.item2.SetChooseInfo(this.mChooseIdx);
    };
    GangCreateView.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnCreate:
                var gangName = this.input.text;
                if (gangName == "") {
                    UserTips.ins().showTips("帮会名字不可为空");
                    return;
                }
                var config = GameGlobal.Config.GuildCreateConfig[this.mChooseIdx];
                var needLv = config.level;
                var needVipLv = config.vipLv;
                if (!Checker.Level(null, needLv)) {
                    return;
                }
                if (!Checker.VipLevel(needVipLv)) {
                    return;
                }
                if (!Checker.Money(config.cost.id, config.cost.count)) {
                    return;
                }
                GameGlobal.GangModel.SendCreateGang(this.mChooseIdx, gangName);
                break;
            case this.item1:
                this.ChooseItem(1);
                break;
            case this.item2:
                this.ChooseItem(2);
                break;
        }
    };
    GangCreateView.prototype.InitGang = function () {
        UserTips.ins().showTips("创建帮会成功");
        ViewManager.ins().close(this);
    };
    GangCreateView.LAYER_LEVEL = LayerManager.UI_Popup;
    return GangCreateView;
}(BaseEuiView));
__reflect(GangCreateView.prototype, "GangCreateView");
//# sourceMappingURL=GangCreateView.js.map