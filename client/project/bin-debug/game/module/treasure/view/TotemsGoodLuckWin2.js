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
 * 图腾寻宝
 */
var TotemsGoodLuckWin2 = (function (_super) {
    __extends(TotemsGoodLuckWin2, _super);
    function TotemsGoodLuckWin2() {
        var _this = _super.call(this) || this;
        _this.m_PosIndex = 0;
        _this.effDic = {};
        _this.skinName = "TotemsGoodLuckSkin";
        _this.list.itemRenderer = TreasureLabelItem;
        _this._AddClick(_this.btn0, _this._OnClick);
        _this._AddClick(_this.btn1, _this._OnClick);
        _this._AddClick(_this.btn2, _this._OnClick);
        _this._AddClick(_this.getway, _this._OnClick);
        return _this;
    }
    TotemsGoodLuckWin2.prototype.childrenCreated = function () {
        GameGlobal.Config.AccSignInConfig;
        var config = GameGlobal.Config.TotemsLotteryConfig; //TotemsLotteryBaseConfig
        var configData1 = config[1][0];
        this.priceIcon0.type = configData1.cost.id;
        this.priceIcon0.price = configData1.cost.count;
        this.rewardIcon0.type = configData1.rewards[0].id;
        this.rewardIcon0.price = configData1.rewards[0].count;
        var configData2 = config[2][0];
        this.priceIcon1.type = configData2.cost.id;
        this.priceIcon1.price = configData2.cost.count;
        this.rewardIcon1.type = configData2.rewards[0].id;
        this.rewardIcon1.price = configData2.rewards[0].count;
        var configData3 = config[3][0];
        this.priceIcon2.type = configData3.cost.id;
        this.priceIcon2.price = configData3.cost.count;
        this.rewardIcon2.type = configData3.rewards[0].id;
        this.rewardIcon2.price = configData3.rewards[0].count;
        var items = this.GetShowItmes();
        for (var i = 0; i < this.group.numChildren; i++) {
            var item = this.group.getChildAt(i);
            var itemData = items[i];
            if (!itemData) {
                continue;
            }
            item.data = itemData;
            //Add Eff
            var effArr = GameGlobal.Config.TotemsLotteryBaseConfig.effitem;
            for (var x = 0; x < effArr.length; x++) {
                if (effArr[x] == itemData.id)
                    this.addTypeEff(item, itemData);
            }
        }
        //this.luckLabel.textFlow = TextFlowMaker.generateTextFlow(this.GetShowText())
        // this.luckbar.maximum = GameGlobal.Config.TotemsLotteryBaseConfig.luckpro
        // this.luckbar.value = 0
    };
    TotemsGoodLuckWin2.prototype.GetShowItmes = function () {
        return GameGlobal.Config.TotemsLotteryBaseConfig.showitem1 || [];
    };
    TotemsGoodLuckWin2.prototype.GetShowText = function () {
        return GameGlobal.Config.TotemsLotteryBaseConfig.lucktext1 || "";
    };
    // private UpdateLuckBar() {
    // 	this.luckbar.value = GameGlobal.TreasureHuntModel.GetLuck()
    // }
    TotemsGoodLuckWin2.prototype.OnOpen = function () {
        this.observe(MessageDef.LUCK_RET_ANIM, this._StartAnim);
        this.observe(MessageDef.LUCK_RECORD, this._UpdateInfo);
        // this.observe(MessageDef.LUCK_RET_SUC, this._UpdateRetData)
        // this._UpdateRetData()
        this._UpdateInfo();
        this.timeDoEff();
        GameGlobal.TreasureHuntModel.SendGetInfo();
        // this.fristGetItem.data = GameGlobal.Config.TotemsLotteryBaseConfig.firstitme
    };
    TotemsGoodLuckWin2.prototype.OnClose = function () {
        if (this.mRetData) {
            ViewManager.ins().open(TreasureResultPanel, this.mRetData);
            this.mRetData = null;
        }
    };
    TotemsGoodLuckWin2.prototype.UpdateContent = function () {
    };
    TotemsGoodLuckWin2.prototype._UpdateInfo = function () {
        //this.UpdateLuckBar()
        var info = GameGlobal.TreasureHuntModel.mInfo;
        if (!info) {
            return;
        }
        if (!info.records) {
            return;
        }
        this.list.dataProvider = new eui.ArrayCollection(info.totemsrecords.reverse());
    };
    // private _UpdateRetData() {
    // 	let info = GameGlobal.TreasureHuntModel.mInfo
    // 	// this.fristGet.visible = info && (info.counts[2] || 0) < 1
    // }
    TotemsGoodLuckWin2.prototype._StartAnim = function (data) {
        var _this = this;
        this.mRetData = data;
        this.selectImg.visible = true;
        this.m_PosIndex = 0;
        this.GetPos(0);
        TimerManager.ins().doTimer(80, MathUtils.limitInteger(8, 18), this._UpdateAnimPos, this, function () {
            if (_this.mRetData) {
                ViewManager.ins().open(TreasureResultPanel, _this.mRetData);
                _this.mRetData = null;
                _this.selectImg.visible = false;
            }
        });
    };
    TotemsGoodLuckWin2.prototype.GetPos = function (index) {
        var child = this.group.getChildAt(index);
        if (child) {
            var point = egret.$TempPoint;
            child.localToGlobal(child.itemIcon.x, child.itemIcon.y, point);
            this.globalToLocal(point.x, point.y, point);
            this.selectImg.x = point.x - 10;
            this.selectImg.y = point.y - 10;
            var scale = index == 0 || index == 6 || index == 3 || index == 9 ? 1 : 0.85;
            this.selectImg.scaleX = this.selectImg.scaleY = scale;
        }
        return null;
    };
    TotemsGoodLuckWin2.prototype._UpdateAnimPos = function () {
        this.GetPos(++this.m_PosIndex % this.group.numChildren);
    };
    TotemsGoodLuckWin2.prototype.addEff = function (item, string, count) {
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2(string), true, count); //"ui_eff_q003"
        eff.x = 55;
        eff.y = 53;
        eff.scaleX = 1.1;
        eff.scaleY = 1.1;
        item.addChild(eff);
        return eff;
    };
    TotemsGoodLuckWin2.prototype.addTypeEff = function (item, itemData) {
        var itemConfig = GlobalConfig.ins().ItemConfig[itemData.id];
        var type = itemConfig.quality;
        if (type == 4) {
            this.addEff(item, "ui_eff_q002", 0);
            this.addEff(item, "ui_eff_q003", 1);
            ;
            this.effDic[type] = item;
        }
        else if (type == 5) {
            this.addEff(item, "ui_eff_q001", 0);
            this.addEff(item, "ui_eff_q003", 1);
            this.effDic[type] = item;
        }
    };
    TotemsGoodLuckWin2.prototype.timeDoEff = function () {
        var _this = this;
        TimerManager.ins().doTimer(3000, 0, function () {
            for (var key in _this.effDic) {
                if (key == "4") {
                    _this.addEff(_this.effDic[key], "ui_eff_q003", 1);
                }
                if (key == "5") {
                    _this.addEff(_this.effDic[key], "ui_eff_q003", 1);
                }
            }
        }, this);
    };
    TotemsGoodLuckWin2.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btn0:
                this.BuyHunt(1);
                break;
            case this.btn1:
                this.BuyHunt(2);
                break;
            case this.btn2:
                this.BuyHunt(3);
                break;
            case this.getway:
                var datas = GameGlobal.Config.TotemsLotteryBaseConfig.text;
                var desc = [];
                for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
                    var data = datas_1[_i];
                    var item = GameGlobal.Config.ItemConfig[data.id];
                    if (!item) {
                        continue;
                    }
                    desc.push(StringUtils.repeatStr("   ", 5) + this.complementByChar(item.name, 12) + data.rate + "%");
                }
                ActivityDescPanel.Show(desc.join("\n"), "奖励说明");
                break;
        }
    };
    TotemsGoodLuckWin2.prototype.complementByChar = function (str, length) {
        str = str + "";
        var byteLen = str.length;
        return str + StringUtils.repeatStr("   ", length - byteLen);
    };
    TotemsGoodLuckWin2.prototype.BuyHunt = function (type) {
        if (this.mRetData) {
            return;
        }
        var config = GameGlobal.Config.TotemsLotteryConfig[type][0];
        if (Checker.Money(config.cost.id, config.cost.count)) {
            GameGlobal.TreasureHuntModel.SendTreasure(3, type);
        }
    };
    TotemsGoodLuckWin2.NAME = "图腾寻宝";
    /////////////////////////////////////////////////////////////////////////////
    // TotemsGoodLuckSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    TotemsGoodLuckWin2.LAYER_LEVEL = LayerManager.UI_Main;
    return TotemsGoodLuckWin2;
}(BaseView));
__reflect(TotemsGoodLuckWin2.prototype, "TotemsGoodLuckWin2", ["ICommonWindowTitle"]);
//# sourceMappingURL=TotemsGoodLuckWin2.js.map