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
var LingLongTaItemCom = (function (_super) {
    __extends(LingLongTaItemCom, _super);
    function LingLongTaItemCom() {
        var _this = _super.call(this) || this;
        _this.totalLayer = 400;
        _this.skinName = "LingLongTaItemSkin";
        return _this;
    }
    LingLongTaItemCom.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBaseNotName;
    };
    LingLongTaItemCom.prototype.onUpdate = function (data, n) {
        var config;
        var nowLy = data.layer || 0;
        var baseLayer = Math.floor(nowLy / 3) * 3;
        config = GameGlobal.Config.WildgeeseFbConfig[baseLayer + n];
        if (config && config.id <= data.layer) {
            this.pass_img.visible = true;
        }
        else {
            this.pass_img.visible = false;
        }
        if (config) {
            this.visible = true;
            this.lvTxt.text = "第" + config.id + "层";
            this.itemList.dataProvider = new eui.ArrayCollection(config.firstAwardshow);
            this.showPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(config.monsterId)));
        }
        else {
            this.visible = false;
        }
    };
    return LingLongTaItemCom;
}(eui.Component));
__reflect(LingLongTaItemCom.prototype, "LingLongTaItemCom");
//# sourceMappingURL=LingLongTaItemCom.js.map