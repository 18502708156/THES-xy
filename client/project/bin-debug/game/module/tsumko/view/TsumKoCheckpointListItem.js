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
 * 選擇關卡列表Com
 */
var TsumKoCheckpointListItem = (function (_super) {
    __extends(TsumKoCheckpointListItem, _super);
    function TsumKoCheckpointListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TsumKoCheckpointListItem.prototype.childrenCreated = function () {
        this.openBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            ViewManager.ins().open(TsumKoBaseBagItemPlanel);
        }, this);
    };
    TsumKoCheckpointListItem.prototype.dataChanged = function () {
        var data = this.data;
        var info_clear = GameGlobal.TsumKoBaseModel.info_clear; //已通关的关卡
        if (data != undefined) {
            var isClearance = GameGlobal.TsumKoBaseModel.IsClearance(data.chapterid, data.sectionid); //是否通过
            var isGatePass = GameGlobal.TsumKoBaseModel.IsGatePass(data.chapterid, data.sectionid); //是否购买过
            this.extraPanel.SetBodyId(MonstersConfig.GetAppId(data.monsterid));
            this.title.text = data.name;
            this.itemList.itemRenderer = ItemBase;
            this.itemList.dataProvider = new eui.ArrayCollection([]);
            if (isClearance == true) {
                this.recordLabel.visible = false;
                this.notAdoptLabel.visible = false;
                this.itemList.visible = false; //perdayreward
                this.itemList.dataProvider = new eui.ArrayCollection(data.perdayreward);
                // GameGlobal.TsumKoBaseModel.isAdopt=true;
                this.clearanceImg.visible = true;
                if (isGatePass == true) {
                    this.openBtn.visible = false;
                    this.itemList.visible = true;
                }
                else {
                    this.itemList.visible = false;
                    this.openBtn.visible = true;
                }
            }
            else {
                // GameGlobal.TsumKoBaseModel.isAdopt=false;
                this.clearanceImg.visible = false;
                this.openBtn.visible = false;
                this.itemList.visible = true;
                this.itemList.dataProvider = new eui.ArrayCollection(data.firstreward);
                this.notAdoptLabel.visible = true;
                this.recordLabel.visible = false;
                if (GameGlobal.TsumKoBaseModel.info_clear + 1 == data.id) {
                    this.notAdoptLabel.visible = false;
                    this.recordLabel.visible = true;
                }
                if (GameGlobal.TsumKoBaseModel.info_clear >= data.id) {
                    this.notAdoptLabel.visible = false;
                    this.itemList.dataProvider = new eui.ArrayCollection(data.perdayreward);
                }
                else {
                    this.itemList.dataProvider = new eui.ArrayCollection(data.firstreward);
                }
            }
        }
    };
    return TsumKoCheckpointListItem;
}(eui.ItemRenderer));
__reflect(TsumKoCheckpointListItem.prototype, "TsumKoCheckpointListItem");
//# sourceMappingURL=TsumKoCheckpointListItem.js.map