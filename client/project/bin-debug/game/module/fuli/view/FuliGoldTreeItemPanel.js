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
 * 福利_搖錢樹-道具弹窗
 */
var FuliGoldTreeItemPanel = (function (_super) {
    __extends(FuliGoldTreeItemPanel, _super);
    function FuliGoldTreeItemPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "FuliGoldTreeItemSkin";
        return _this;
    }
    FuliGoldTreeItemPanel.prototype.childrenCreated = function () {
        this._AddClick(this.okBtn, this._OnClick);
        this.Tab_CashCowBoxConfig = GameGlobal.Config.CashCowBoxConfig;
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
    };
    FuliGoldTreeItemPanel.prototype.OnOpen = function (index, needCount) {
        this.commonDialog.OnAdded(this);
        this.commonDialog.showReturnBtn(false);
        // this.commonDialog.dialogMask.alpha=0;
        this.commonDialog.title = "金币宝箱";
        this.describeLabel2.visible = false;
        // let lv=GameGlobal.FuliModel.FuliData.level+1;
        // let shakeCount=GameGlobal.FuliModel.FuliData.shake;
        // let maxCount=GameGlobal.Config.CashCowAmplitudeConfig[lv].needExp;
        //needCount=maxCount-shakeCount;
        var item = this.Tab_CashCowBoxConfig[index + 1].box;
        var count = this.Tab_CashCowBoxConfig[index + 1].time;
        this.describeLabel.textFlow = (new egret.HtmlTextParser).parser("<a color=0x6E330B>今日使用摇钱树</a><a color=0x00AD00>" + needCount + "次</a><a color=0x6E330B>,可额外获得:</a>");
        if (needCount <= 0) {
            this.describeLabel.visible = false;
        }
        if (GameGlobal.FuliModel.FuliData.drawBin[2] == 4) {
            this.describeLabel2.visible = true;
        }
        this.itemList.dataProvider = new eui.ArrayCollection(item);
        // if(GameGlobal.FuliModel.FuliData.drawBin[index-1]==3)
        // 	this.okBtn.label="领取";
        // else
        // 	this.okBtn.label="确定";
    };
    FuliGoldTreeItemPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.okBtn:
                ViewManager.ins().close(FuliGoldTreeItemPanel);
                break;
        }
    };
    FuliGoldTreeItemPanel.prototype.OnClose = function () {
        this.commonDialog.OnRemoved();
    };
    //skinName
    //FuliGoldTreeItemSkin.exml
    FuliGoldTreeItemPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    return FuliGoldTreeItemPanel;
}(BaseEuiView));
__reflect(FuliGoldTreeItemPanel.prototype, "FuliGoldTreeItemPanel");
//# sourceMappingURL=FuliGoldTreeItemPanel.js.map