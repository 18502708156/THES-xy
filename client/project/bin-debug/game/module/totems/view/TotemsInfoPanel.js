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
/**
 * 图腾_Info介面
 */
var TotemsInfoPanel = (function (_super) {
    __extends(TotemsInfoPanel, _super);
    function TotemsInfoPanel() {
        var _this = _super.call(this) || this;
        _this.power = 0;
        _this.ID = 0;
        //titleName
        _this.titleName = "详细属性";
        _this.skinName = "TotemsInfoSkin";
        return _this;
    }
    TotemsInfoPanel.prototype.childrenCreated = function () {
    };
    TotemsInfoPanel.prototype.OnOpen = function (ID, power) {
        this.ID = ID;
        this.power = power;
        this.commonDialog.title = this.titleName;
        this.commonDialog.OnAdded(this);
        this.powerShow();
        this.isShowLabel();
        this.labelInfoShow();
        this.nameShow();
        this.totemsImgShow();
    };
    TotemsInfoPanel.prototype.totemsImgShow = function () {
        var Img = GameGlobal.Config.TotemsActConfig[this.ID].pic;
        this.totemsImg.source = Img;
    };
    TotemsInfoPanel.prototype.nameShow = function () {
        var name = GameGlobal.Config.TotemsActConfig[this.ID].name;
        this.totemsName.text = name;
    };
    TotemsInfoPanel.prototype.powerShow = function () {
        this.totalPower.text = this.power.toString();
    };
    TotemsInfoPanel.prototype.isShowLabel = function () {
        if (GameGlobal.TotemsModel.totemsDic[this.ID] != undefined) {
            this.LvGroup.visible = true;
            this.noImg.visible = false;
            var lv = GameGlobal.TotemsModel.totemsDic[this.ID].lv;
            this.LvLabel.text = lv + "级";
        }
        else {
            this.LvGroup.visible = false;
            this.noImg.visible = true;
        }
    };
    TotemsInfoPanel.prototype.labelInfoShow = function () {
        var attr;
        if (GameGlobal.TotemsModel.totemsDic[this.ID] != undefined) {
            var lv = GameGlobal.TotemsModel.totemsDic[this.ID].lv;
            attr = GameGlobal.Config.TotemsAttrsConfig[this.ID][lv].attr;
        }
        else
            attr = GameGlobal.Config.TotemsAttrsConfig[this.ID][0].attr;
        var str = "";
        var str2 = "";
        if (attr[0] != undefined) {
            str = AttributeData.TYPE_TO_NAME[attr[0].type];
            str2 = AttributeData.getAttStrByType(attr[0]);
            this.label0.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>" + str2 + "</b>");
        }
        if (attr[1] != undefined) {
            str = AttributeData.TYPE_TO_NAME[attr[1].type];
            str2 = AttributeData.getAttStrByType(attr[1]);
            this.label1.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>" + str2 + "</b>");
        }
        if (attr[2] != undefined) {
            str = AttributeData.TYPE_TO_NAME[attr[2].type];
            str2 = AttributeData.getAttStrByType(attr[2]);
            this.label2.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>" + str + "</a><b color=0x00AD00>" + str2 + "</b>");
        }
    };
    TotemsInfoPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    TotemsInfoPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return TotemsInfoPanel;
}(BaseEuiView));
__reflect(TotemsInfoPanel.prototype, "TotemsInfoPanel");
//# sourceMappingURL=TotemsInfoPanel.js.map