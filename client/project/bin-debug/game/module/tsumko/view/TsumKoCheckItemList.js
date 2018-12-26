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
 * 八十一难 选择关卡列表
 */
var TsumKoCheckItemList = (function (_super) {
    __extends(TsumKoCheckItemList, _super);
    function TsumKoCheckItemList() {
        var _this = _super.call(this) || this;
        _this.chapterid = 0;
        return _this;
    }
    TsumKoCheckItemList.prototype.childrenCreated = function () {
        this.chapterid = GameGlobal.TsumKoBaseModel.chapterid;
        this.listCtrl = new ListLRBtnCtrl(this.checkpointList, this.beforeBtn, this.nextBtn, 214);
        this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.defaultValue);
        this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.updateList);
        this.observe(MessageDef.TSUMKO_UPDATE_CHECKPOINTLIST, this.listDefaultPos);
        this.checkpointList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onclick, this);
        this.listShow();
    };
    TsumKoCheckItemList.prototype.updateList = function () {
        UIHelper.ListRefresh(this.checkpointList);
    };
    TsumKoCheckItemList.prototype.listShow = function () {
        var list = [];
        var beganId = (this.chapterid - 1) * 9 + 1;
        for (var i = 0; i < 9; i++) {
            var config = GameGlobal.Config.DisasterFbConfig[beganId + i];
            list.push(config);
        }
        this.checkpointList.itemRenderer = TsumKoCheckpointListItem;
        this.checkpointList.dataProvider = new eui.ArrayCollection(list);
        var defaultId = this.defaultValue();
        // let index=defaultId-1;
        // this.selectedIndex(index);
        this.listDefaultPos();
        this.setListPos(defaultId);
        GameGlobal.TsumKoBaseModel.Record(defaultId);
        GameGlobal.TsumKoBaseModel.recordId = defaultId;
    };
    TsumKoCheckItemList.prototype.listDefaultPos = function () {
        var defaultId = this.defaultValue();
        GameGlobal.TsumKoBaseModel.recordId = defaultId;
        MessageCenter.ins().dispatch(MessageDef.CHOICECHECKPOINT);
        if (GameGlobal.TsumKoBaseModel.isCurBuy == false && GameGlobal.TsumKoBaseModel.isCurClear == false) {
            this.setListPos(defaultId);
            //let id=defaultId;
            // this.selectedIndex(defaultId);
        }
        this.selectedIndex(defaultId);
    };
    TsumKoCheckItemList.prototype.onclick = function (e) {
        var id = this.chapterid * 9 - 9 + e.itemIndex + 1;
        this.selectedIndex(id);
        GameGlobal.TsumKoBaseModel.recordId = id;
        MessageCenter.ins().dispatch(MessageDef.CHOICECHECKPOINT);
        GameGlobal.TsumKoBaseModel.Record(GameGlobal.TsumKoBaseModel.recordId);
    };
    //設置選中
    TsumKoCheckItemList.prototype.selectedIndex = function (id) {
        var newindex = 0;
        if (id > 0 && id % 9 != 0)
            newindex = Math.ceil(id % 9);
        else
            newindex = id - (id / 9 - 1) * 9;
        if (newindex - 1 <= 0)
            newindex = 0;
        else
            newindex -= 1;
        this.checkpointList.selectedIndex = newindex;
    };
    //默認值
    TsumKoCheckItemList.prototype.defaultValue = function () {
        var id = 0;
        if (GameGlobal.TsumKoBaseModel.chatXiD == 0) {
            var nowId = GameGlobal.TsumKoBaseModel.info_clear + 1;
            id = nowId;
            var nowChapterid = Math.ceil(nowId / 9);
            if (nowChapterid != GameGlobal.TsumKoBaseModel.chapterid) {
                id = this.chapterid * 9 - 9 + 1; //默認第一個
            }
            if (id <= 0)
                id = 1;
        }
        else
            id = GameGlobal.TsumKoBaseModel.chatXiD;
        return id;
    };
    //移動位置
    TsumKoCheckItemList.prototype.setListPos = function (id) {
        this.checkpointList.validateNow();
        var num = id - this.chapterid * 9;
        if (num <= 0)
            num = id - (this.chapterid - 1) * 9;
        if (num < 9 && num >= 6)
            this.checkpointList.scrollH = 1258;
        else if (num < 6 && num >= 3)
            this.checkpointList.scrollH = 629;
        else if (num < 3)
            this.checkpointList.scrollH = 0;
    };
    return TsumKoCheckItemList;
}(BaseView));
__reflect(TsumKoCheckItemList.prototype, "TsumKoCheckItemList");
//# sourceMappingURL=TsumKoCheckItemList.js.map