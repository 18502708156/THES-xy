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
var MoneyTreePanel = (function (_super) {
    __extends(MoneyTreePanel, _super);
    // descBtn
    function MoneyTreePanel() {
        var _this = _super.call(this) || this;
        _this.posY = 690;
        var posY2 = 50;
        _this.skinName = "MoneyTreeSkin";
        _this.mc1 = new MovieClip;
        _this.mc1.x = 120;
        _this.mc1.y = posY2;
        _this.mc2 = new MovieClip;
        _this.mc2.x = 280;
        _this.mc2.y = posY2;
        _this.mc3 = new MovieClip;
        _this.mc3.x = 560;
        _this.mc3.y = posY2;
        // this.expMc = new MovieClip
        // this.expMc.x = 87
        // this.expMc.y = this.posY
        // this.expMc.blendMode = egret.BlendMode.ADD
        _this.rect = new egret.Rectangle(-35, 0, 70, 60);
        // this.addChildAt(this.expMc, this.getChildIndex(this.mc_img) + 1)
        _this.baojiMc = new MovieClip;
        _this.baojiMc.x = 207;
        _this.baojiMc.y = 270;
        _this.movieExp = new MovieClip;
        return _this;
    }
    MoneyTreePanel.prototype.OnOpen = function () {
        this.observe(MessageDef.MONEY_INFO_CHANGE, this.refushInfo);
        this.AddClick(this.goUpBtn, this.onTap);
        this.AddClick(this.image1, this.onTap);
        this.AddClick(this.image2, this.onTap);
        this.AddClick(this.image3, this.onTap);
        this.AddClick(this.depictLabel2, this.onTap);
        this.refushInfo(!0);
    };
    MoneyTreePanel.prototype.OnClose = function () {
    };
    MoneyTreePanel.prototype.onTap = function (e) {
        switch (e.currentTarget) {
            case this.goUpBtn:
                if (MoneyTreeModel.ins().playNum >= MoneyTreeModel.ins().cruMaxNum)
                    return void (GameGlobal.actorModel.vipLv >= 10 ? UserTips.ins().showTips("|C:0xff0000&T:今日次数已用完|") : UserTips.ins().showTips("|C:0xff0000&T:提高vip等级，获得更多次数|"));
                if (GameGlobal.actorModel.yb >= (this.costNum))
                    return void MoneyTreeModel.ins().sendPlayYaoYao();
                UserTips.ins().showTips("|C:0xff0000&T:元宝不足|");
                break;
            case this.image1:
                ViewManager.ins().open(MoneyTreeBoxWin, 1);
                break;
            case this.image2:
                ViewManager.ins().open(MoneyTreeBoxWin, 2);
                break;
            case this.image3:
                ViewManager.ins().open(MoneyTreeBoxWin, 3);
                break;
            case this.depictLabel2:
                ViewManager.ins().open(VipMainPanel);
                break;
        }
    };
    MoneyTreePanel.prototype.refushInfo = function (e, t) {
        if (e === void 0) { e = false; }
        if (t === void 0) { t = 0; }
        var model = MoneyTreeModel.ins();
        var costConfig = model.getIndexCost();
        var infoConfig = model.getNowCoefficientinfo();
        var infoConfigData = model.getNowCoefficientinfo(1);
        //增加一次免费摇钱次数(由配表控制)
        var costStr = costConfig.yuanbao + "";
        if (costConfig.yuanbao == 0) {
            costStr = "本次免费";
            // this.cost.iconImg.visible = false
        }
        else {
            // this.cost.iconImg.visible = true
            var costStr_1 = costConfig.yuanbao + "";
        }
        // this.bar.maximum = model.maxNum
        this.bar.maximum = 55;
        if (model.playNum == model.maxNum) {
            this.depictLabel1.visible = !1, this.playNum.visible = !1, this.cost.visible = !1, this.getNum.text = "今日次数\n已全部用完";
        }
        else {
            this.depictLabel1.visible = !0, this.playNum.visible = !0, this.cost.visible = !0, this.playNum.text = "（今日使用：" + model.playNum + "/" + model.cruMaxNum + "）";
            this.costNum = costConfig.yuanbao, this.cost.setText(costStr);
            // this.getNum.text = "立即获得\n" + CommonUtils.overLength(Math.floor(costConfig.gold * infoConfig.rate / 100)) + "(+" + (infoConfig.rate - 100) + "%)金币";
            this.getNum.text = "立即获得\n" + CommonUtils.overLength(Math.floor(costConfig.gold * infoConfig.rate / 100)) + "金币";
        }
        this.add.text = "加成：" + (infoConfig.rate - 100) + "%";
        this.bar.value = model.playNum;
        e || this.moveExpMc();
        var s = 0;
        null == infoConfigData
            ? (this.addPoint.text = "已满级", this.mc_img.height = 76)
            : (this.addPoint.text = model.exp + "/" + infoConfigData.needExp, s = 60 * (.5 - model.exp / infoConfigData.needExp), this.mc_img.height = (76 / infoConfigData.needExp) * model.exp);
        this.rect.y = s;
        // this.expMc.mask = this.rect
        // this.expMc.scrollRect = new egret.Rectangle(-35, 5, 70, 60)
        this.refushBoxInfo();
        t > 1 && (this.baojiMc.loadFile(ResDataPath.GetUIEffePath("moneytreecrit"), !0, 1), this.addChild(this.baojiMc));
    };
    MoneyTreePanel.prototype.moveExpMc = function () {
        this.movieExp.x = 189, this.movieExp.y = 257, this.movieExp.loadFile(ResDataPath.GetUIEffePath("moneytreeexp"), !0, 1), this.addChild(this.movieExp);
        var e = egret.Tween.get(this.movieExp);
        e.to({
            y: 140,
            x: 48
        }, 420);
    };
    MoneyTreePanel.prototype.refushBoxInfo = function () {
        var moneyTree = MoneyTreeModel.ins();
        // this.image_1.visible = moneyTree.getOrderByIndex(0) >= 1, this.image_2.visible = moneyTree.getOrderByIndex(1) >= 1, this.image_3.visible = moneyTree.getOrderByIndex(2) >= 1;
        for (var t = 1; 4 > t; t++) {
            var i = this["mc" + t];
            moneyTree.checkBoxIsCanget(t) ? this.playEffect(i) : i.parent && DisplayUtils.removeFromParent(i);
        }
    };
    MoneyTreePanel.prototype.playEffect = function (e) {
        e.loadFile(ResDataPath.GetUIEffePath("taskBox"), !0, 100), this.addChild(e);
    };
    return MoneyTreePanel;
}(BaseView));
__reflect(MoneyTreePanel.prototype, "MoneyTreePanel");
//# sourceMappingURL=MoneyTreePanel.js.map