/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 11:01
 * @meaning: 详情
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
var DestinyNiPanel = (function (_super) {
    __extends(DestinyNiPanel, _super);
    function DestinyNiPanel() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.tImgGet = []; //获得图片
        _this.tRankLabel = [];
        _this.nType = 0; //界面类型
        /////////////////////////////////////////////////////////////////////////////
        _this.mWindowHelpId = 37;
        _this.skinName = "DestinyNiSkin";
        _this.listView.itemRenderer = ItemBaseNotName;
        _this.list.itemRenderer = ItemBase;
        _this.gInfoLabel.text = "";
        _this.showType();
        return _this;
    }
    DestinyNiPanel.prototype.childrenCreated = function () {
        UIHelper.SetLinkStyleLabel(this.lbMore, "更多奖励"); //下划线
        for (var i = 0; i < 5; i++) {
            this.tRankLabel[i] = this["lb" + i];
        }
        for (var i = 0; i < 5; i++) {
            this.tImgGet[i] = this["imgGet" + i];
        }
    };
    DestinyNiPanel.prototype.showType = function () {
    };
    DestinyNiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.DESTINY_CHANGE, this.UpdateContent); //
        this.observe(MessageDef.DESTINY_GET_REWARD, this.upDataReward); //
        this.listView.dataProvider = new eui.ArrayCollection(GlobalConfig.ins().DestinyBaseConfig.rewardView); //更多奖励
        this._AddClick(this.btnBuy0, this.onClick);
        this._AddClick(this.btnBuy1, this.onClick);
        this._AddClick(this.btnBuy2, this.onClick);
        this._AddClick(this.lbMore, this.onClick);
        this.initInfo();
    };
    DestinyNiPanel.prototype.initInfo = function () {
    };
    DestinyNiPanel.prototype.UpdateContent = function () {
        this.setData();
        //更新信息
        for (var item in this.tRankLabel) {
            var label = this.tRankLabel[item];
            var tList = this.tDestinyServerInfo.msgData || {};
            var data = tList[item];
            if (tList && data) {
                var config = GameGlobal.Config.ItemConfig[data.id];
                var itemName = config.name || "";
                label.textFlow = TextFlowMaker.generateTextFlow("|C:0x0054ff&T:" + data.name + "|\u83B7\u5F97|C:" + Color.GetStr(ItemBase.QUALITY_COLOR[config.quality]) + "&T:" + itemName + "|");
            }
            else {
                label.text = "";
            }
        }
        var tGetImg = ["ui_mg_bm_sanxian_01", "ui_mg_bm_tianxian_01", "ui_mg_bm_jinxian_01", "ui_mg_bm_daluo_01", "ui_mg_bm_huenyuan_01"];
        var tHaveGetImg = ["ui_mg_bm_sanxian", "ui_mg_bm_tianxian", "ui_mg_bm_jinxian", "ui_mg_bm_daluo", "ui_mg_bm_huenyuan"];
        //逆命内容
        for (var item in this.tImgGet) {
            this.tImgGet[item].source = tGetImg[item];
        }
        //当前逆命仙丹
        var nStar = this.tDestinyServerInfo.star || 1;
        this.tImgGet[nStar - 1].source = tHaveGetImg[nStar - 1] || "";
        if (nStar == 5) {
            if (!this.effect) {
                this.effect = new MovieClip;
            }
            this.effect.LoadByUrl(ResDataPath.GetUIEffePath("eff_ui_zb_003"), -1, true);
            this.effGroup.addChild(this.effect);
        }
        else {
            if (this.effect) {
                DisplayUtils.removeFromParent(this.effect);
            }
        }
        //金额
        var tPrice0 = GlobalConfig.ins().DestinyBaseConfig.fourpay[0];
        var tPrice1 = GlobalConfig.ins().DestinyDrawConfig[nStar].starCoins;
        this.priceIcon0.setConfigData(tPrice0);
        this.priceIcon1.setConfigData(tPrice1);
    };
    DestinyNiPanel.prototype.upDataReward = function (_data) {
        //只对逆命奖励界面才更新
        if (_data) {
            this.gInfoLabel.text = "共逆命 " + _data.num + " 次，总共消耗银两 " + _data.cost;
            // this.lbGeInfo.text = "共逆命" + _data.num + "次消耗银两" + _data.cost
            var tList = [];
            for (var _i = 0, _a = _data.data; _i < _a.length; _i++) {
                var item = _a[_i];
                var data = { type: 1, id: item.id, count: item.count };
                tList.push(data);
            }
            this.list.dataProvider = new eui.ArrayCollection(tList);
            this.list.visible = false;
            this._SetTick();
        }
    };
    DestinyNiPanel.prototype._SetTick = function () {
        this.m_StartTime = egret.getTimer();
        TimerManager.ins().remove(this._DoUpdate, this);
        TimerManager.ins().doFrame(1, 0, this._DoUpdate, this);
    };
    DestinyNiPanel.prototype._DoUpdate = function () {
        this.list.visible = true;
        var time = egret.getTimer() - this.m_StartTime;
        var delay = DestinyNiPanel.DELAY;
        var duration = DestinyNiPanel.DURATION;
        for (var i = 0; i < this.list.numChildren; ++i) {
            var child = this.list.getChildAt(i);
            var itemIndex = child.itemIndex;
            var t = MathUtils.Clamp((time - itemIndex * delay) / duration, 0, 1);
            child.alpha = t;
        }
        if (time > this.list.dataProvider.length * delay + duration) {
            TimerManager.ins().remove(this._DoUpdate, this);
        }
    };
    DestinyNiPanel.prototype.setData = function () {
        this.tDestinyServerInfo = GameGlobal.DestinyController.getServerInfo();
    };
    DestinyNiPanel.prototype.onClick = function (e) {
        var buyNum = 0;
        switch (e.target) {
            // case this.btnInfo:
            // 	ViewManager.ins().open(ActivityDescPanel, GlobalConfig.ins().DestinyBaseConfig.rwnotice);
            // 	break
            case this.btnBuy0:
                buyNum = 1;
                break;
            case this.btnBuy1:
                buyNum = 50;
                break;
            case this.lbMore:
                ViewManager.ins().open(DestinyShow);
                break;
            case this.btnBuy2:
                if (this.tDestinyServerInfo.star >= 5) {
                    UserTips.InfoTip("已经点亮混元，请点击逆命按钮");
                    return;
                }
                var tPrice0 = GlobalConfig.ins().DestinyBaseConfig.fourpay[0];
                if (Checker.Data(tPrice0)) {
                    GameGlobal.DestinyManage.babyStartLight();
                }
                break;
        }
        var nStar = this.tDestinyServerInfo.star || 1;
        var tPrice1 = GlobalConfig.ins().DestinyDrawConfig[nStar].starCoins;
        if (buyNum && Checker.Data(tPrice1)) {
            GameGlobal.DestinyManage.babyStartGet(buyNum);
            // let addEff = "eff_ui_niming"
            // if (addEff) {
            // 	if (!this.effect) {
            // 		this.effect = new MovieObject
            // 		this.effect.touchEnabled = false
            // 	}
            // 	this.effect.x = 332
            // 	this.effect.y = 372
            // 	this.effect.LoadByUrl(ResDataPath.GetUIEffePath(addEff), 1, true, () => {
            // 		this.gMain.visible = false
            // 		this.gReward.visible = true
            // 		this.nType = 1
            // 		// this.UpdateContent()
            // 	})
            // 	this.gMain.addChild(this.effect);
            // } else {
            // 	if (this.effect) {
            // 		this.effect.ClearCache()
            // 		DisplayUtils.removeFromParent(this.effect)
            // 	}
            // }
        }
    };
    DestinyNiPanel.NAME = "逆命";
    DestinyNiPanel.DURATION = 200;
    DestinyNiPanel.DELAY = 50;
    return DestinyNiPanel;
}(BaseView));
__reflect(DestinyNiPanel.prototype, "DestinyNiPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=DestinyNiPanel.js.map