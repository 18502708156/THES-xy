/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:57
 * @meaning: 法宝分解详情
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
var TreasureResolvePanel = (function (_super) {
    __extends(TreasureResolvePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TreasureResolvePanel() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.tHave = []; //持有列表
        _this.tCheckBox = []; //选择框
        _this.skinName = "TreasureResolvePanelSkin";
        _this.listView.itemRenderer = TreasureHoldIcon;
        return _this;
    }
    TreasureResolvePanel.prototype.childrenCreated = function () {
        for (var i = 0; i < 6; i++) {
            var item = this["checkBox" + i];
            item.labelDisplay.textColor = ItemBase.QUALITY_COLOR[i];
            this.tCheckBox[i] = item;
            item.addEventListener(egret.Event.CHANGE, this.chage, this);
        }
    };
    TreasureResolvePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent); //法宝数据变化
        this.observe(MessageDef.TREASURE_LOCK, this.upList); //上锁变化
        this._AddClick(this.btnDress, this.onClick);
    };
    TreasureResolvePanel.prototype.upList = function () {
        this.setData();
        var tList = [];
        for (var item in this.tHave) {
            if (this.tHave[item].id) {
                tList.push(this.tHave[item]);
            }
        }
        this.listView.dataProvider.replaceAll(tList);
    };
    TreasureResolvePanel.prototype.UpdateContent = function () {
        this.setData();
        var tList = [];
        for (var item in this.tHave) {
            if (this.tHave[item].id) {
                tList.push(this.tHave[item]);
            }
        }
        // (this.listView.dataProvider as eui.ArrayCollection).replaceAll(tList);
        this.listView.dataProvider = new eui.ArrayCollection(tList);
        this.lbGet.text = this.getResolveNum();
    };
    //点击选择框改变内容
    TreasureResolvePanel.prototype.chage = function () {
        this.UpdateContent();
    };
    TreasureResolvePanel.prototype.setData = function () {
        this.tHave = GameGlobal.TreasureModel.getHaveList();
    };
    TreasureResolvePanel.prototype.getResolveNum = function () {
        var nNums = 0;
        var tHaveData = GameGlobal.TreasureModel.getHaveList();
        var pConfig = GlobalConfig.ins().SpellsResDecomposeConfig;
        for (var item in this.tCheckBox) {
            var pBox = this.tCheckBox[item];
            if (pBox.selected) {
                for (var index in tHaveData) {
                    if (tHaveData[index].quality == item) {
                        nNums = nNums + pConfig[tHaveData[index].id].count;
                    }
                }
            }
        }
        return nNums + "";
    };
    TreasureResolvePanel.prototype.getResolveData = function () {
        var tList = [];
        var tHaveData = GameGlobal.TreasureModel.getHaveList();
        for (var item in this.tCheckBox) {
            var pBox = this.tCheckBox[item];
            if (pBox.selected) {
                for (var index in tHaveData) {
                    if (tHaveData[index].quality == item) {
                        tList.push(tHaveData[index].spellsId);
                    }
                }
            }
        }
        return tList;
    };
    TreasureResolvePanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.btnDress:
                if (this.getResolveData().length) {
                    GameGlobal.TreasureModel.sendSpellsResSmelt(this.getResolveData());
                }
                break;
        }
    };
    TreasureResolvePanel.RedPointCheck = function () {
        return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_RESOLVE_TREASURE);
    };
    TreasureResolvePanel.NAME = "分解";
    return TreasureResolvePanel;
}(BaseView));
__reflect(TreasureResolvePanel.prototype, "TreasureResolvePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=TreasureResolvePanel.js.map