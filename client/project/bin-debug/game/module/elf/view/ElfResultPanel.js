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
var ElfResultPanel = (function (_super) {
    __extends(ElfResultPanel, _super);
    function ElfResultPanel() {
        var _this = _super.call(this) || this;
        _this._DataList = [];
        _this.skinName = "ElfResultSkin";
        _this.dataGroup.itemRenderer = ItemBase;
        return _this;
    }
    ElfResultPanel.prototype.OnOpen = function () {
        var _this = this;
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        if (!param[0])
            return;
        this._luckRet = param[0];
        this.currentState = "reward";
        this.elfGroup.visible = false;
        this.jttyGroup.visible = false;
        this.bg.height = GameGlobal.StageUtils.GetHeight();
        this.bg.width = GameGlobal.StageUtils.GetWidth();
        this.observe(MessageDef.LUCK_RET_ANIM, this.updateLuckRet);
        this._AddItemClick(this.dataGroup, this._onItmeClick);
        this._AddClick(this.elfGroup, this._onTap);
        this._AddClick(this.norOneCallBtn, this._onTap);
        this._AddClick(this.ybTenCallBtn, this._onTap);
        this._AddClick(this.ybOneCallBtn, (this._onTap));
        this._AddClick(this.bg, function () {
            _this._AnimFinish();
        });
        this._AddClick(this.closeBtn, function () {
            _this.CloseSelf();
        });
        this.updateCnetent();
    };
    ElfResultPanel.prototype.updateCnetent = function () {
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            egret.Tween.removeTweens(this.dataGroup.getChildAt(i));
        }
        this.dataGroup.dataProvider = new eui.ArrayCollection(this._luckRet.rewards);
        this.dataGroup.validateNow();
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            this.dataGroup.getChildAt(i).alpha = 0;
            this.dataGroup.getChildAt(i).touchEnabled = false;
        }
        this._SetTick();
        this._DataList = this._luckRet.rewards;
        var config = GameGlobal.Config.CallDrawConfig;
        var item = config[1][0].cost;
        this.priceIcon1.setPrice(item.count);
        this.priceIcon1.setType(item.id);
        this.priceIcon1.setColor(Color.White);
        item = config[2][0].cost;
        this.priceIcon0.setType(item.id);
        this.priceIcon0.setPrice(item.count);
        this.priceIcon0.setColor(Color.White);
        item = config[3][0].cost;
        this.priceIcon2.setType(item.id);
        this.priceIcon2.setPrice(item.count);
        this.priceIcon2.setColor(Color.White);
        var info = GameGlobal.TreasureHuntModel.mInfo;
        if (!info) {
            return;
        }
        var callbaseConfig = GameGlobal.Config.CallbaseConfig;
        this.counterTxt.text = "\u4ECA\u5929\u5269\u4F59\u6B21\u6570\uFF1A" + (callbaseConfig.maxtime - info.babydaylist[0]);
        var str = "";
        var name = "";
        var itemConfig = GameGlobal.Config.CallDrawConfig[this._luckRet.index][0].rewards[0];
        if (itemConfig.type == 1) {
            name = GameGlobal.Config.ItemConfig[itemConfig.id].name;
            str = name + "*|C:0xFEEDC2&T:" + itemConfig.count + "|\u53CA\u4EE5\u4E0B\u7269\u54C1";
        }
        else {
            if (itemConfig.id == 1)
                name = "银两";
            else if (itemConfig.id == 1)
                name = "元宝";
            else if (itemConfig.id == 1)
                name = "绑元";
            str = name + "*|C:0xFEEDC2&T:" + itemConfig.count + "|\u53CA\u4EE5\u4E0B\u7269\u54C1";
        }
        this.rewardTipsTxt.textFlow = TextFlowMaker.generateTextFlow(str);
    };
    ElfResultPanel.prototype.updateLuckRet = function (rep) {
        this._luckRet = rep;
        this.updateCnetent();
    };
    ElfResultPanel.prototype._onItmeClick = function (e) {
    };
    ElfResultPanel.prototype._onTap = function (e) {
        var config = GameGlobal.Config.CallDrawConfig;
        var callbaseConfig = GameGlobal.Config.CallbaseConfig;
        var item = config[1][0].cost;
        switch (e.currentTarget) {
            case this.elfGroup:
                this._ContinuePlay();
                break;
            case this.norOneCallBtn:
                var info = GameGlobal.TreasureHuntModel.mInfo;
                if (!info) {
                    return;
                }
                if (callbaseConfig.maxtime > info.babydaylist[0]) {
                    if (Checker.Money(item.id, item.count)) {
                        GameGlobal.TreasureHuntModel.SendTreasure(4, 1);
                        this.currentState = "reward";
                    }
                }
                else
                    GameGlobal.UserTips.showTips("今天抽奖次数已用完");
                break;
            case this.ybOneCallBtn:
                item = config[2][0].cost;
                if (Checker.Money(item.id, item.count)) {
                    GameGlobal.TreasureHuntModel.SendTreasure(4, 2);
                    this.currentState = "reward";
                }
                break;
            case this.ybTenCallBtn:
                item = config[3][0].cost;
                if (Checker.Money(item.id, item.count)) {
                    GameGlobal.TreasureHuntModel.SendTreasure(4, 3);
                    this.currentState = "reward";
                }
                break;
            default:
                break;
        }
    };
    ElfResultPanel.prototype._PlayItemMv = function (child) {
        var mv = new MovieClip;
        mv.blendMode = egret.BlendMode.ADD;
        mv.x = 50;
        mv.y = 50;
        mv.scaleX = mv.scaleY = 1.5;
        mv.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_qhui_002"), true, 1);
        child.addChild(mv);
    };
    ElfResultPanel.prototype._showGetElfEff = function () {
        this._Mc = new MovieClip;
        this._Mc.blendMode = egret.BlendMode.ADD;
        this._Mc.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_hyui_001"), true, -1);
        this.effGroup.addChild(this._Mc);
    };
    ElfResultPanel.prototype._SetTick = function () {
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            var child = this.dataGroup.getChildAt(i);
            egret.Tween.removeTweens(child);
            var tween = egret.Tween.get(child);
            tween.wait(child.itemIndex * ElfResultPanel.DELAY + 0.1).call(this._PlayTweenResult, this, [child.itemIndex]).to({
                alpha: 1
            }, ElfResultPanel.DURATION).call(this._PlayTweenResult2, this, [child.itemIndex]);
        }
    };
    ElfResultPanel.prototype._PlayTweenResult = function (itemIndex) {
        var child = this.dataGroup.getChildAt(itemIndex);
        if (child != null) {
            this._PlayItemMv(child);
        }
        var itemid = this._DataList[itemIndex].id;
        var showIds = GameGlobal.Config.CallbaseConfig.ltongitem;
        for (var _i = 0, showIds_1 = showIds; _i < showIds_1.length; _i++) {
            var val = showIds_1[_i];
            if (itemid == val.itemid) {
                this._ShowGetElf(val.ltid);
                break;
            }
        }
    };
    ElfResultPanel.prototype._PlayTweenResult2 = function (itemIndex) {
        if (itemIndex == this._luckRet.rewards.length - 1) {
            this._AnimFinish();
        }
    };
    ElfResultPanel.prototype._AnimFinish = function () {
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            var child = this.dataGroup.getChildAt(i);
            egret.Tween.removeTweens(child);
            child.alpha = 1;
            this.dataGroup.getChildAt(i).touchEnabled = true;
        }
        if (this._luckRet.index == 1)
            this.currentState = "normal";
        else
            this.currentState = "yb";
    };
    // 显示灵童
    ElfResultPanel.prototype._ShowGetElf = function (ElfId) {
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            var child = this.dataGroup.getChildAt(i);
            egret.Tween.pauseTweens(child);
        }
        this.dataGroup.visible = false;
        this.elfGroup.visible = true;
        this.elfGroup.touchEnabled = true;
        TimerManager.ins().doTimer(3000, 1, this._ContinuePlay, this);
        LingtongViewHelper.SetRole(this.showPanel, ElfId);
        this.jttyGroup.visible = true;
        var skillConfig = GameGlobal.Config.BabyActivationConfig;
        this.nameBitTxt.text = skillConfig[ElfId].name;
        this._showGetElfEff();
    };
    // 继续播放获得动画
    ElfResultPanel.prototype._ContinuePlay = function () {
        if (!this.elfGroup.visible) {
            return;
        }
        this.effGroup.removeChild(this._Mc);
        TimerManager.ins().remove(this._ContinuePlay, this);
        this.elfGroup.visible = false;
        this.jttyGroup.visible = false;
        this.elfGroup.touchEnabled = false;
        this.dataGroup.visible = true;
        for (var i = 0; i < this.dataGroup.numChildren; ++i) {
            var child = this.dataGroup.getChildAt(i);
            egret.Tween.resumeTweens(child);
        }
    };
    ElfResultPanel.LAYER_LEVEL = LayerManager.UI_Popup;
    ElfResultPanel.DURATION = 300;
    ElfResultPanel.DELAY = 500;
    return ElfResultPanel;
}(BaseEuiView));
__reflect(ElfResultPanel.prototype, "ElfResultPanel");
//# sourceMappingURL=ElfResultPanel.js.map