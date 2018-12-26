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
var FateFadeView = (function (_super) {
    __extends(FateFadeView, _super);
    function FateFadeView() {
        var _this = _super.call(this) || this;
        _this.ID = 0; //表ID
        _this.skinName = "FateFadeViewSkin";
        _this.mCount = 5;
        _this._AddClick(_this, _this.CloseSelf);
        _this._AddClick(_this.enterBtn, _this._onClick);
        return _this;
    }
    FateFadeView.prototype.OnOpen = function (id) {
        this.fateModelItem.typeView = 1;
        this.funcNoticeConfigTab = GameGlobal.Config.FuncNoticeConfig;
        this.fateModelItem.scaleX = this.fateModelItem.scaleY = 1.5;
        this.ID = id;
        this.showEff();
        this.showModel();
        this.describe();
        this.showItem();
        this.AddTimer(1000, 5, this._DoUpdate);
    };
    FateFadeView.prototype.OnClose = function () {
    };
    FateFadeView.prototype.showModel = function () {
        var modelType = this.funcNoticeConfigTab[this.ID].type;
        var pid = this.funcNoticeConfigTab[this.ID].pid;
        if (pid != undefined) {
            if (pid[1] != undefined)
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[this.ID].pid[0], this.funcNoticeConfigTab[this.ID].pid[1]);
            else if (pid[0] != undefined)
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[this.ID].pid[0]);
            else
                this.fateModelItem.showModelType(modelType, this.funcNoticeConfigTab[this.ID].pid);
        }
    };
    FateFadeView.prototype._DoUpdate = function () {
        this.mCount--;
        this.enterBtn.label = "确定(" + this.mCount.toString() + "s)";
        if (this.mCount == 0) {
            ViewManager.ins().close(this);
        }
    };
    FateFadeView.prototype.showEff = function () {
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hht_001"), true, 0);
        eff.x = this.pointImg.x;
        eff.y = this.pointImg.y;
        eff.scaleX = 2.3;
        eff.scaleY = 2.3;
        this.group.addChild(eff);
    };
    FateFadeView.prototype.describe = function () {
        this.describeLabel.text = "";
        this.describeLabel.text = "解锁" + this.funcNoticeConfigTab[this.ID].des4;
    };
    FateFadeView.prototype.showItem = function () {
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this.itemList.dataProvider = new eui.ArrayCollection(this.funcNoticeConfigTab[this.ID].reward);
    };
    FateFadeView.prototype._onClick = function (e) {
        switch (e.currentTarget) {
            case this.enterBtn:
                ViewManager.ins().close(this);
                break;
        }
    };
    FateFadeView.LAYER_LEVEL = LayerManager.UI_Popup;
    return FateFadeView;
}(BaseEuiView));
__reflect(FateFadeView.prototype, "FateFadeView");
//# sourceMappingURL=FateFadeView.js.map