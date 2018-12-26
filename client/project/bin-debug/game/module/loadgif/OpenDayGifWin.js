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
var OpenDayGifWin = (function (_super) {
    __extends(OpenDayGifWin, _super);
    function OpenDayGifWin() {
        var _this = _super.call(this) || this;
        _this.skinName = "OpenDayGifSkin";
        _this.commonWindowBg.SetTitle("登陆送元宝");
        return _this;
    }
    OpenDayGifWin.prototype.childrenCreated = function () {
        this.list.itemRenderer = OpenDayGifItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
    };
    OpenDayGifWin.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.LOGINDAYGIF, this.UpdateContent);
        this.UpdateContent();
    };
    OpenDayGifWin.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    OpenDayGifWin.prototype._OnClicked = function (e) {
    };
    OpenDayGifWin.prototype.UpdateContent = function () {
        var Config = GameGlobal.Config.LoginRewardConfig;
        var ConfigData = [];
        var openDay = GameServer.serverOpenDay < 7;
        for (var data in Config) {
            if (openDay && Config[data].day >= 8) {
                continue;
            }
            ConfigData.push(Number(data));
        }
        var model = OpenDayGifModel.ins();
        var weight = function (num) {
            var skinid = Number(num);
            if (skinid <= model.tolDay && !BitUtil.Has(model.receivemark, skinid - 1)) {
                return -100000 + skinid;
            }
            if (skinid > model.tolDay) {
                return -10000 + skinid;
            }
            if (BitUtil.Has(model.receivemark, skinid - 1)) {
                return -1000 + skinid;
            }
        };
        ConfigData.sort(function (lhs, rhs) {
            return weight(lhs) - weight(rhs);
        });
        this.list.dataProvider = new eui.ArrayCollection(ConfigData);
        if (model.tolDay > ConfigData.length) {
            this.tipImg.source = Config[ConfigData.length].item;
        }
        else {
            this.tipImg.source = Config[model.tolDay || 1].item;
        }
    };
    OpenDayGifWin.LAYER_LEVEL = LayerManager.UI_Main;
    return OpenDayGifWin;
}(BaseEuiView));
__reflect(OpenDayGifWin.prototype, "OpenDayGifWin", ["ICommonWindow"]);
var OpenDayGifItem = (function (_super) {
    __extends(OpenDayGifItem, _super);
    function OpenDayGifItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenDayGifItem.prototype.childrenCreated = function () {
        this.list.itemRenderer = ItemBaseNotName;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
    };
    OpenDayGifItem.prototype._OnClick = function () {
        OpenDayGifModel.ins().getLoginReward(this.data);
    };
    OpenDayGifItem.prototype.dataChanged = function () {
        var Config = GameGlobal.Config.LoginRewardConfig[this.data];
        this.tipsTxt.text = "第" + this.data + "天";
        if (this.data - OpenDayGifModel.ins().tolDay > 0) {
            if (this.data - OpenDayGifModel.ins().tolDay == 1) {
                this.mtzl.visible = true;
                this.tip2.text = "";
            }
            else {
                this.mtzl.visible = false;
                this.tip2.text = "还差" + (this.data - OpenDayGifModel.ins().tolDay) + "天";
            }
        }
        else {
            this.tip2.text = "";
            this.mtzl.visible = false;
        }
        this.list.dataProvider = new eui.ArrayCollection(Config.showitem2);
        this.getted_img.visible = BitUtil.Has(OpenDayGifModel.ins().receivemark, this.data - 1);
        this.btn.visible = this.data <= OpenDayGifModel.ins().tolDay && !this.getted_img.visible;
        this.tip2.visible = !(this.getted_img.visible || this.getted_img.visible);
        UIHelper.ShowRedPoint(this.btn, this.btn.visible);
        this.item.data = Config.showitem;
    };
    return OpenDayGifItem;
}(eui.ItemRenderer));
__reflect(OpenDayGifItem.prototype, "OpenDayGifItem");
//# sourceMappingURL=OpenDayGifWin.js.map