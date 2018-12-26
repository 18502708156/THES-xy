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
 * 福利_搖錢樹
 */
var FuliGoldTreePanel = (function (_super) {
    __extends(FuliGoldTreePanel, _super);
    function FuliGoldTreePanel() {
        var _this = _super.call(this) || this;
        _this.keyMax = 0;
        _this.boxIndex = 1;
        _this.str = "";
        _this.isShowVIPLabel = true;
        _this.scale = 0;
        //updateLabel
        _this.needCount = 0;
        _this.skinName = "FuliGoldTreeSkin";
        return _this;
    }
    FuliGoldTreePanel.CheckRedPoint = function () {
        return GameGlobal.FuliModel.mRedPoint.IsGoldTree() || GameGlobal.FuliModel.mRedPoint.IsGodTreeBox();
    };
    FuliGoldTreePanel.prototype.childrenCreated = function () {
        this._AddClick(this.goBtn, this._OnClick);
        this._AddClick(this.boxImg, this._OnClick);
        this.tab_CashCowLimitConfig = GameGlobal.Config.CashCowLimitConfig;
        this.tab_CashCowBasicConfig = GameGlobal.Config.CashCowBasicConfig;
        this.tab_CashCowAmplitudeConfig = GameGlobal.Config.CashCowAmplitudeConfig;
        this.tab_CashCowBoxConfig = GameGlobal.Config.CashCowBoxConfig;
        for (var key in this.tab_CashCowLimitConfig) {
            if (Number(key) != 0)
                this.keyMax++;
        }
    };
    FuliGoldTreePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FULI_GOLDTREE_INFO, this.update);
        this.observe(MessageDef.VIP_LEVEL_CHANGE, this.update);
        this.vipLabel();
        this.showNendMoney();
        this.UpdateImgShow();
        this.showBox();
        this.updateLabel();
    };
    FuliGoldTreePanel.prototype.vipLabel = function () {
        this.vipLv = UserVip.ins().lv;
        var ViplvUp = this.vipLv + 1;
        if (ViplvUp >= this.keyMax) {
            ViplvUp = this.keyMax;
            this.vipCountLabel.visible = false;
            this.isShowVIPLabel = false;
            return;
        }
        var count = this.tab_CashCowLimitConfig[ViplvUp].maxTime - this.tab_CashCowLimitConfig[this.vipLv].maxTime;
        if (ViplvUp == this.vipLv)
            this.vipCountLabel.visible = false;
        // let vip=UserVip.ins().lv+1;
        if (this.tab_CashCowLimitConfig[ViplvUp] == undefined)
            ViplvUp = UserVip.ins().lv;
        this.vipCountLabel.textFlow =
            (new egret.HtmlTextParser).parser("<a color=0x6E330B>vip" + ViplvUp +
                "可额外再摇</a><a color=0x00AD00>" + count + "次</a>");
        this.str = ("<a color=0x6E330B>提升至vip" + ViplvUp + ",可额外再摇</a><a color=0x00AD00>" + count + "次</a>");
    };
    FuliGoldTreePanel.prototype.update = function () {
        this.UpdateImgShow();
        this.showNendMoney();
        this.vipLabel();
        this.showBox();
        this.updateLabel();
    };
    FuliGoldTreePanel.prototype.UpdateImgShow = function () {
        var _this = this;
        this.ImgBg.visible = true;
        if (GameGlobal.FuliModel.FuliData.odds == 2) {
            this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "2beibaoji", "tudigong");
            this.playerLogoImg.source = "ui_fldt_tudigong";
        }
        else if (GameGlobal.FuliModel.FuliData.odds == 4) {
            this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "4beibaoji", "xingyunshen");
            this.playerLogoImg.source = "ui_fldt_xingyunshen";
        }
        else if (GameGlobal.FuliModel.FuliData.odds == 8) {
            this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "8beibaoji", "fushen");
            this.playerLogoImg.source = "ui_fldt_fushen";
        }
        else if (GameGlobal.FuliModel.FuliData.odds == 10) {
            this.imgSource(this.describeImg2, this.describeImg3, this.describeImg0, this.describeImg1, "10beibaoji", "caishen");
            this.playerLogoImg.source = "ui_fldt_caishen";
        }
        else {
            this.imgNotShow();
        }
        if (this.playerLogoImg.source != "") {
            this.goBtn.enabled = false;
            this.nowPlayerEff();
            this.playerLogoImg.scaleY = this.playerLogoImg.scaleX = 0;
            egret.Tween.get(this.playerLogoImg).to({ scaleY: 1.1, scaleX: 1.1 }, 700)
                .to({ scaleY: 0.9, scaleX: 0.9 }, 200).wait(1500).call(function () {
                _this.imgNotShow(1);
                _this.goBtn.enabled = true;
                if (_this.eff != undefined) {
                    _this.playerEffGroup.removeChild(_this.eff);
                    _this.eff = null;
                }
            }, this);
        }
    };
    FuliGoldTreePanel.prototype.nowPlayerEff = function () {
        if (this.eff)
            return;
        this.eff = new MovieClip;
        this.eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hyui_001"), true, 0);
        this.eff.x = this.playerLogoImg.x - 25;
        this.eff.y = this.playerLogoImg.y - 80;
        this.eff.scaleX = 1;
        this.eff.scaleY = 1;
        this.playerEffGroup.addChild(this.eff);
        this.playerEffGroup.setChildIndex(this.eff, 0);
    };
    FuliGoldTreePanel.prototype.showEff = function () {
        var imgScale = 0;
        this.scale += 0.1;
        this.playerLogoImg.scaleY = this.playerLogoImg.scaleX = this.scale;
        if (this.scale >= 1) {
            this.scale = 0;
            this.goBtn.visible = true;
        }
    };
    FuliGoldTreePanel.prototype.imgNotShow = function (notSet) {
        if (notSet == undefined) {
            this.describeImg0.source = "";
            this.describeImg1.source = "";
            this.describeImg2.source = "";
            this.describeImg3.source = "";
            this.playerLogoImg.source = "";
            this.ImgBg.visible = false;
        }
        else {
            this.describeImg2.source = "";
            this.describeImg3.source = "";
            this.playerLogoImg.source = "";
            this.ImgBg.visible = true;
        }
    };
    FuliGoldTreePanel.prototype.imgSource = function (img, img2, img3, img4, str, str2) {
        img.source = "ui_fldt_bm_" + str2 + "01";
        img2.source = "ui_fldt_bm_" + str;
        img3.source = "ui_fldt_bm_" + str2 + "01";
        img4.source = "ui_fldt_bm_" + str;
    };
    //showNeedMoney
    FuliGoldTreePanel.prototype.showNendMoney = function () {
        this.shake = GameGlobal.FuliModel.FuliData.shake + 1;
        var gold = this.tab_CashCowBasicConfig[this.shake].yuanbao;
        if (gold == 0) {
            this.consumeLabel.visible = false;
            this.freeLabel.visible = true;
        }
        else {
            this.freeLabel.visible = false;
            this.consumeLabel.visible = true;
            var item = {};
            item["type"] = 0;
            item["id"] = 2;
            item["count"] = gold;
            var arr = [];
            arr.push(item);
            this.consumeLabel.Set(arr);
        }
    };
    FuliGoldTreePanel.prototype.updateLabel = function () {
        this.countLabel.visible = true;
        this.label2.visible = true;
        this.ReceiveLabel.visible = true;
        this.vipMax = this.tab_CashCowLimitConfig[this.vipLv].maxTime;
        var shakeCount = GameGlobal.FuliModel.FuliData.shake;
        this.nowCountLabel.text = "今日次数:" + shakeCount + "/" + this.vipMax;
        var amplitude = GameGlobal.FuliModel.FuliData.amplitude;
        var gold = CommonUtils.overLength(Math.floor(this.tab_CashCowBasicConfig[this.shake].gold * amplitude / 100));
        //this.acquisitionLabel.text="立即获得"+gold+"银两";
        var addVal = "";
        var odds = GameGlobal.FuliModel.FuliData.odds;
        if (odds && FuliGoldTreePanel.ODDS[odds]) {
            addVal = " * " + odds + " ";
        }
        this.acquisitionLabel.textFlow = (new egret.HtmlTextParser).parser //6E330B
        ("<a color=0x6E330B>立即获得</a> <a color=0xFFeb04>" + gold + addVal + "</a> <a color=0x6E330B>银两</a>");
        var lv = GameGlobal.FuliModel.FuliData.level + 1;
        var maxCount = this.tab_CashCowAmplitudeConfig[lv].needExp;
        var openBoxCount = this.tab_CashCowBoxConfig[this.boxIndex + 1].time;
        this.needCount = openBoxCount - shakeCount;
        this.countLabel.text = this.needCount + "次";
        if (this.needCount <= 0) {
            this.countLabel.visible = false;
            this.label2.visible = false;
            UIHelper.ShowRedPoint(this.boxImg, true);
        }
        else {
            UIHelper.ShowRedPoint(this.boxImg, false);
        }
        var arrLength = GameGlobal.FuliModel.FuliData.drawBin.length;
        if (GameGlobal.FuliModel.FuliData.drawBin[arrLength - 1] == 4) {
            this.ReceiveLabel.visible = false;
            UIHelper.ShowRedPoint(this.boxImg, false);
        }
        //let nowCount=shakeCount-num;
        this.surplusCountLabel.text = GameGlobal.FuliModel.FuliData.exp + "/" + maxCount;
        //let lv=GameGlobal.FuliModel.FuliData.level;
        this.addLabel.text = "加成" + amplitude + "%";
    };
    FuliGoldTreePanel.prototype.showBox = function () {
        this.boxIndex = 0;
        var boxArr = GameGlobal.FuliModel.FuliData.drawBin;
        var isSetIndex = false;
        for (var i = 0; i < boxArr.length; i++) {
            if (boxArr[i] == 2 || boxArr[i] == 3) {
                this.boxIndex = i;
                isSetIndex = false;
                break;
            }
            else {
                isSetIndex = true;
            }
        }
        if (isSetIndex == true)
            this.boxIndex = boxArr.length - 1;
    };
    FuliGoldTreePanel.prototype.Play = function () {
        var item = new GoldFlyEff();
        item.mGap = 50;
        item.mCount = 16;
        item.mMax = 16;
        item.mSource = "ui_bm_qianb2";
        var pos = egret.$TempPoint;
        DisplayUtils.GetGlobalPos(this.effGroup, pos);
        var targetPos = new egret.Point;
        targetPos.x = 100; //561
        targetPos.y = 0;
        var view = ViewManager.ins().getView(MainTopPanel);
        if (view) {
            DisplayUtils.GetGlobalPos(view.god, targetPos);
        }
        item.Play(new egret.Rectangle(pos.x, pos.y, this.effGroup.width, this.effGroup.height), targetPos.x, targetPos.y);
    };
    FuliGoldTreePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goBtn:
                if (GameGlobal.FuliModel.FuliData.shake < this.vipMax) {
                    var needGold = this.tab_CashCowBasicConfig[this.shake].yuanbao;
                    // if(needGold!=0)
                    // {
                    //WarnWin.show("是否花费"+needGold+" 元宝？",()=>{
                    if (Checker.Money(2, needGold, true)) {
                        this.Play();
                        GameGlobal.FuliModel.playGold();
                    }
                    //},this);
                    // }
                    // else
                    // {
                    // 	this.Play();
                    // 		GameGlobal.FuliModel.playGold();
                    // }
                }
                else {
                    if (this.isShowVIPLabel == true)
                        ViewManager.ins().open(FuliGoldTreeVipPanel, this.str);
                }
                break;
            case this.boxImg:
                if (GameGlobal.FuliModel.FuliData.drawBin[this.boxIndex] == 3)
                    GameGlobal.FuliModel.playGoldBox(this.boxIndex + 1);
                else
                    ViewManager.ins().open(FuliGoldTreeItemPanel, this.boxIndex, this.needCount);
                break;
        }
    };
    FuliGoldTreePanel.prototype.OnClose = function () {
    };
    //skinName
    //FuliGoldTreeSkin.exml
    FuliGoldTreePanel.LAYER_LEVEL = LayerManager.UI_Main;
    FuliGoldTreePanel.ODDS = (_a = {},
        _a[2] = true,
        _a[4] = true,
        _a[8] = true,
        _a[10] = true,
        _a);
    return FuliGoldTreePanel;
}(BaseEuiView));
__reflect(FuliGoldTreePanel.prototype, "FuliGoldTreePanel");
var _a;
//# sourceMappingURL=FuliGoldTreePanel.js.map