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
 * 八十一难主介面List_Com
 */
var TsumKoListItem = (function (_super) {
    __extends(TsumKoListItem, _super);
    function TsumKoListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TsumKoListItem.prototype.childrenCreated = function () {
        var _this = this;
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.ins().open(TsumKoBasePanel, _this.data.chapterid);
        }, this);
        this.recordLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.ins().open(TsumKoBaseRecordPanel);
        }, this);
    };
    TsumKoListItem.prototype.dataChanged = function () {
        var data = this.data;
        this.bgImg.source = data.title; //bg
        this.checkpointNameLabel.text = data.name; //名字
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(data.monsterid)); //显示怪物
        var info_clear = GameGlobal.TsumKoBaseModel.info_clear; //已通关的关卡
        var num = Math.floor(info_clear / 9);
        this.goBtn.visible = true;
        this.notAdoptLabel.visible = false;
        //if(GameGlobal.TsumKoBaseModel.isAdopt==true)
        if (GameGlobal.TsumKoBaseModel.IsAllClearance(data.chapterid) == true) {
            this.adoptImg.visible = true;
        }
        else {
            this.adoptImg.visible = false;
        }
        // if(info_clear==0 || info_clear==9) 
        //     num+=1;
        if (num + 2 <= data.chapterid) {
            this.adoptImg.visible = false;
            this.notAdoptLabel.visible = true;
            this.goBtn.visible = false;
        }
    };
    return TsumKoListItem;
}(eui.ItemRenderer));
__reflect(TsumKoListItem.prototype, "TsumKoListItem");
//# sourceMappingURL=TsumKoListItem.js.map