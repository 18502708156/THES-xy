/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/7/3 21:15
 * @meaning: 命格分解界面
 *
 **/
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
var DestinyResovePanel = (function (_super) {
    __extends(DestinyResovePanel, _super);
    function DestinyResovePanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tHave = []; //持有列表
        _this.tCheckBox = []; //选择框
        _this.skinName = "DestinyResolveSkin";
        _this.listView.itemRenderer = DestinyResolveItem;
        return _this;
        // this.commonWindowBg.returnBtn.visible = false
    }
    DestinyResovePanel.prototype.childrenCreated = function () {
        for (var i = 1; i < 6; i++) {
            var item = this["checkBox" + i];
            item.labelDisplay.textColor = ItemBase.QUALITY_COLOR[i];
            this.tCheckBox[i] = item;
            item.addEventListener(egret.Event.CHANGE, this.chage, this);
            item.selected = GameGlobal.DestinyController.tSelectList[i];
        }
    };
    DestinyResovePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //命格数据变化
        this.observe(MessageDef.DESTINY_SMELT, this.SmeltUpdate); //物品变化
        this._AddClick(this.btnDress, this.onClick);
        this.UpdateContent();
    };
    DestinyResovePanel.prototype.SmeltUpdate = function () {
        var i = 0;
        for (var _i = 0, _a = this.tHave; _i < _a.length; _i++) {
            var oldData = _a[_i];
            if (oldData != null) {
                var item = this.listView.getChildAt(i);
                if (item && egret.is(item, "DestinyResolveItem")) {
                    item.PlayEff();
                }
            }
            ++i;
        }
        this.UpdateContent();
    };
    DestinyResovePanel.prototype.UpdateContent = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tHave);
    };
    DestinyResovePanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    //点击选择框改变内容
    DestinyResovePanel.prototype.chage = function () {
        for (var index in this.tCheckBox) {
            var pBox = this.tCheckBox[index];
            GameGlobal.DestinyController.tSelectList[index] = pBox.selected;
            if ((parseInt(index) > 3) && pBox.selected && GameGlobal.DestinyController.bShowResolveTip) {
                this.showTip(Number(index));
                return;
            }
        }
        this.UpdateContent();
    };
    //显示二次确认框
    DestinyResovePanel.prototype.showTip = function (index) {
        var _this = this;
        //弹出提示
        ViewManager.ins().open(TipByBox, null, GameGlobal.DestinyController.bShowResolveTip, null, null, function (sure) {
            if (sure) {
                GameGlobal.DestinyController.tSelectList[index] = true;
                _this.tCheckBox[index].selected = true;
                _this.UpdateContent();
            }
            else {
                GameGlobal.DestinyController.tSelectList[index] = false;
                _this.tCheckBox[index].selected = false;
            }
        });
    };
    DestinyResovePanel.prototype.setData = function () {
        this.tHave = [];
        var bag = UserBag.ins().GetBagStarBySort();
        var tAllBag = {};
        var tSelect = GameGlobal.DestinyController.tSelectList;
        //按品质区分
        for (var item in bag) {
            var pBag = bag[item];
            if (!tAllBag[pBag.itemConfig.quality]) {
                tAllBag[pBag.itemConfig.quality] = [];
            }
            tAllBag[pBag.itemConfig.quality].push(CommonUtils.copyDataHandler(pBag));
        }
        //根据品质先后添加
        var addNums = 0;
        for (var item in tAllBag) {
            var tListBag = tAllBag[item];
            for (var index in tListBag) {
                var pBag = tListBag[index];
                if (tSelect[pBag.itemConfig.quality] && (addNums < 9)) {
                    this.tHave[addNums] = pBag;
                    addNums++;
                }
            }
        }
        for (var i = 0; i < 9; i++) {
            if (!this.tHave[i]) {
                this.tHave[i] = null;
            }
        }
    };
    DestinyResovePanel.prototype.getResolveData = function () {
        var tList = [];
        var tHaveData = this.tHave;
        for (var item in this.tCheckBox) {
            var pBox = this.tCheckBox[item];
            if (pBox.selected) {
                for (var index in tHaveData) {
                    if (tHaveData[index]) {
                        if (tHaveData[index].itemConfig.quality == item) {
                            var ob = { id: 0, num: 0 };
                            ob.id = tHaveData[index].configID;
                            ob.num = tHaveData[index].count;
                            tList.push(ob);
                        }
                    }
                }
            }
        }
        return tList;
    };
    DestinyResovePanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnDress:
                if (this.getResolveData().length)
                    GameGlobal.DestinyManage.babyStartSmelt(this.getResolveData());
                break;
        }
    };
    DestinyResovePanel.RedPointCheck = function () {
        // return GameGlobal.TreasureController.mRedPoint.Get(TreasureRedPoint.INDEX_RESOLVE_TREASURE)
        return false;
    };
    DestinyResovePanel.LAYER_LEVEL = LayerManager.UI_Main_2;
    DestinyResovePanel.NAME = "分解命格";
    return DestinyResovePanel;
}(BaseEuiView));
__reflect(DestinyResovePanel.prototype, "DestinyResovePanel", ["ICommonWindow"]);
//# sourceMappingURL=DestinyResovePanel.js.map