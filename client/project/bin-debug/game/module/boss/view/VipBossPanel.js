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
var VipBossPanel = (function (_super) {
    __extends(VipBossPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function VipBossPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "VipBossSkin";
        _this.list.itemRenderer = VipBossItem;
        _this.list.dataProvider = new eui.ArrayCollection([]);
        return _this;
    }
    VipBossPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateContent);
        GameGlobal.BossModel.sendCallVipBossList();
        this.UpdateContent();
    };
    VipBossPanel.prototype.OnClose = function () {
        this.removeObserve();
    };
    VipBossPanel.prototype.UpdateContent = function () {
        var list = GameGlobal.BossModel.getVipBossInfo();
        //更新一下开启状态 用于排序
        for (var item in list) {
            list[item].getOpenTime();
            list[item].getLeftTime();
        }
        list.sort(function (a, b) {
            if (a.nOpen === b.nOpen) {
                return b.nLeftTime - a.nLeftTime;
            }
            else {
                return b.nOpen - a.nOpen;
            }
        });
        var arr = [];
        var i;
        var len = list.length;
        for (i = 0; i < len; i++) {
            arr.push(list[i]);
            if (GameGlobal.actorModel.level < list[i].levelLimit) {
                break;
            }
        }
        var brr = [];
        var k;
        var index = list.length;
        for (k = 0; k < index; k++) {
            brr.push(list[k]);
            if (GameGlobal.actorModel.vipLv < list[k].viplvlimit) {
                break;
            }
        }
        list = arr.length > brr.length ? arr : brr;
        this.list.dataProvider.replaceAll(list);
    };
    VipBossPanel.NAME = "至尊BOSS";
    return VipBossPanel;
}(BaseView));
__reflect(VipBossPanel.prototype, "VipBossPanel", ["ICommonWindowTitle"]);
var VipBossItem = (function (_super) {
    __extends(VipBossItem, _super);
    function VipBossItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nState = 0; // 0初始值 1银两挑战
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    VipBossItem.prototype.childrenCreated = function () {
        this.goBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this);
        this.list.itemRenderer = ItemBaseNotName;
    };
    VipBossItem.prototype._OnClick = function () {
        if (!UserFb.FinishAndCheckFighting2()) {
            return;
        }
        //银两购买时需要检查
        if (this.nState === 1) {
            if (Checker.Money(this.data.costgold.id, this.data.costgold.count)) {
                GameGlobal.BossModel.sendVipbossChallenge(this.data.id);
            }
        }
        else if (this.nState === 2) {
            UserTips.ErrorTip('今天次数已经用完');
        }
        else {
            GameGlobal.BossModel.sendVipbossChallenge(this.data.id);
        }
    };
    VipBossItem.prototype.dataChanged = function () {
        var oData = this.data;
        if (oData.bossid) {
            var monsterCfg = GameGlobal.Config.MonstersConfig[oData.bossid];
            this.bossName.text = monsterCfg[GameGlobal.Config.MonstersConfig_keys.name]; //+ "(" +  monsterCfg[GameGlobal.Config.MonstersConfig_keys.level]+"级)"
            this.petShowPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(oData.bossid)));
        }
        var nVipLv = UserVip.ins().lv;
        var nLeftTime = (oData.vipCount[nVipLv] || 1);
        var mycount = nLeftTime - oData.daycount;
        if (oData.nOpen) {
            this.goBtn.visible = true;
            this.enterInfoLabel.visible = false;
            var isDie = false;
            if (oData.daycount >= nLeftTime)
                isDie = true;
            this.dieImg.visible = isDie;
            this.goBtn.visible = !isDie;
            this.gProp.visible = !isDie;
            if (!isDie) {
                //获取背包中的物品数量
                var nHave = GameGlobal.UserBag.GetCount(oData.cost.id);
                if (nHave && nHave >= oData.cost.count) {
                    this.priceIcon.setPrice(oData.cost.count);
                    this.priceIcon.setType(oData.cost.id);
                    this.nState = 0;
                }
                else {
                    this.priceIcon.setPrice(oData.costgold.count);
                    this.priceIcon.setType(oData.costgold.id);
                    this.nState = 1;
                }
                var strMore = "";
                if (oData.vipCount[nVipLv + 1]) {
                    strMore = "VIP" + (nVipLv + 1) + "可再挑战" + (oData.vipCount[nVipLv + 1] - oData.vipCount[nVipLv]) + "次";
                }
                if (mycount < 1) {
                    this.lbMore.text = strMore;
                }
                else {
                    this.lbMore.text = "";
                }
            }
            else {
                this.lbMore.text = "";
            }
            this.goBtn.label = oData.count < oData.needsuccess ? "挑 战" : "扫 荡";
        }
        else {
            this.goBtn.visible = false;
            this.enterInfoLabel.visible = true;
            this.enterInfoLabel.text = oData.levelLimit + "级或VIP" + oData.viplvlimit + "可挑战";
            this.dieImg.visible = false;
            this.gProp.visible = false;
            this.lbMore.text = "";
        }
        UIHelper.ShowRedPoint(this.goBtn, mycount > 0 && Checker.Money(oData.costgold.id, oData.costgold.count, false));
        this.times_txt.text = "剩余挑战：" + mycount;
        this.list.dataProvider = new eui.ArrayCollection(oData.showItem);
    };
    return VipBossItem;
}(eui.ItemRenderer));
__reflect(VipBossItem.prototype, "VipBossItem");
//# sourceMappingURL=VipBossPanel.js.map