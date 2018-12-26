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
var VipMainPanel = (function (_super) {
    __extends(VipMainPanel, _super);
    function VipMainPanel() {
        var _this = _super.call(this) || this;
        _this.vmodel = GameGlobal.VipModel;
        _this.skinName = "VipMainSkin";
        return _this;
    }
    VipMainPanel.prototype.childrenCreated = function () {
        this.commonWindowBg.title = "VIP";
        this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list0, this.leftBtn, this.rightBtn, 110);
        this.mListLRBtnCtrl.mNotVisible = true;
        this.mListLRBtnCtrl.OnRefresh();
        this.vmodel.getVipConfig();
        this.list0.itemRenderer = ItemBaseNotName;
    };
    VipMainPanel.prototype.OnOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.commonWindowBg.OnAdded(this);
        // GameGlobal.PalyerInfoModel.sendOtherId(this.palyerId);
        // this.observe(MessageDef.PALYER_INFO, this.updateContent)
        this._AddClick(this.btnNext, this._OnClick);
        this._AddClick(this.btnPrev, this._OnClick);
        this._AddClick(this.btnRecharge, this._OnClick);
        this._AddClick(this.btnReceived, this._OnClick);
        this.observe(MessageDef.UPDATA_VIP_AWARDS, this.updateContent);
        this.changeExpBar();
        this.vip = GameGlobal.actorModel.vipLv || 1;
        this.updateAwardsList(this.vip);
        this.updateContent();
        this.vipLabel.text = GameGlobal.actorModel.vipLv + "";
    };
    VipMainPanel.prototype.updateContent = function () {
        // this.changeExpBar();
        this.changeExpBar();
        if (VipMainPanel.OPEN_TO_VIP_PAGE) {
            this.vip = VipMainPanel.OPEN_TO_VIP_PAGE;
            VipMainPanel.OPEN_TO_VIP_PAGE = null;
        }
        else {
            for (var i = 1; i <= UserVip.ins().lv; i++) {
                if (UserVip.ins().CheckRedPoint(i)) {
                    this.vip = i;
                    this.gotoDes(i);
                    break;
                }
                if (i == UserVip.ins().lv) {
                    this.vip = UserVip.ins().lv >= UserVip.MAX_LV ? UserVip.MAX_LV : UserVip.ins().lv + 1;
                }
            }
        }
        this.gotoDes(this.vip);
    };
    VipMainPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    VipMainPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.btnNext:
                this.nextVipDes();
                break;
            case this.btnPrev:
                this.prevVipDes();
                break;
            case this.btnRecharge:
                RechargeWin.Open();
                ViewManager.ins().close(VipMainPanel);
                break;
            case this.btnReceived:
                UserVip.ins().sendGetAwards(this.vip);
                break;
        }
    };
    VipMainPanel.prototype.nextVipDes = function () {
        if (this.vip <= this.vmodel.configData.length) {
            if (this.vip == this.vmodel.configData.length) {
                this.vip = this.vmodel.configData.length;
            }
            else {
                ++this.vip;
            }
            if (this.vip > 1) {
                this.btnPrev.visible = true;
            }
            this.gotoDes(this.vip);
        }
    };
    VipMainPanel.prototype.gotoDes = function (vipLv) {
        var vipDec = this.vmodel.getVipDes(vipLv);
        this.vipDes.textFlow = TextFlowMaker.generateTextFlow(vipDec);
        this.vipLabel2.text = "VIP " + vipLv + " 特权";
        this.vipLabel3.text = "VIP " + vipLv + " 礼包";
        // this.vipTipsLabel.text = this.vmodel.getVipsDes(vipLv)
        this.updateAwardsList(vipLv);
        this.changeBtnState();
    };
    VipMainPanel.prototype.changeBtnState = function () {
        if (this.vip > 1)
            this.redPoint1Img.visible = UserVip.ins().CheckRedPoint(this.vip - 1);
        else
            this.redPoint1Img.visible = false;
        if (this.vip < UserVip.MAX_LV)
            this.redPoint2Img.visible = UserVip.ins().CheckRedPoint(this.vip + 1);
        else
            this.redPoint2Img.visible = false;
        var state = BitUtil.Has(UserVip.ins().state, this.vip);
        if (state) {
            this.received.visible = true;
            this.btnReceived.visible = false;
        }
        else {
            this.received.visible = false;
        }
        if (this.vip > GameGlobal.actorModel.vipLv) {
            this.btnReceived.visible = false;
        }
        else {
            if (GameGlobal.actorModel.vipLv) {
                var state_1 = BitUtil.Has(UserVip.ins().state, this.vip);
                if (state_1) {
                    this.received.visible = true;
                    this.btnReceived.visible = false;
                }
                else {
                    this.btnReceived.visible = true;
                }
            }
            else {
                this.btnReceived.visible = false;
            }
        }
        //按钮显示
        if (this.vip <= 1) {
            this.btnPrev.visible = false;
        }
        else {
            this.btnPrev.visible = true;
        }
    };
    VipMainPanel.prototype.prevVipDes = function () {
        if (this.vip <= this.vmodel.configData.length) {
            --this.vip;
            if (this.vip <= 1) {
                // this.btnPrev.visible = false
                this.vip = 1;
            }
            this.gotoDes(this.vip);
        }
    };
    //更新vip等级奖励
    VipMainPanel.prototype.updateAwardsList = function (vip) {
        var awardsData = this.vmodel.getVipAward(vip);
        this.list0.dataProvider = new eui.ArrayCollection(awardsData);
        // this.list0.validateNow();
        // this.listScroll.validateNow()
        if (awardsData.length >= 5) {
            // this.list0.width = 500
            this.leftBtn.visible = true;
            this.rightBtn.visible = true;
        }
        else {
            this.leftBtn.visible = false;
            this.rightBtn.visible = false;
        }
        this.giftImg.source = GameGlobal.Config.VipConfig[this.vip].giftSrc;
        this.tipsImg.source = GameGlobal.Config.VipConfig[this.vip].tipsSrc;
    };
    VipMainPanel.prototype.getBarInfo = function () {
        var nextConfig = GlobalConfig.ins().VipConfig[this.vip + 1];
        var curNeedYb = UserVip.ins().exp;
        var curNeedYb = UserVip.ins().exp;
        if (nextConfig) {
            this.bar.maximum = nextConfig.needYb;
            this.bar.value = curNeedYb;
        }
        else {
            // str = "VIP等级已满";
            this.bar.labelDisplay.visible = false;
            this.bar.maximum = 1;
            this.bar.value = 1;
        }
    };
    /**经验进度条改变 */
    VipMainPanel.prototype.changeExpBar = function () {
        var vipData = UserVip.ins();
        var config = GlobalConfig.ins().VipConfig[vipData.lv];
        var curLv = 0;
        var curNeedYb = vipData.exp;
        if (config) {
            curLv = vipData.lv;
        }
        var nextConfig = GlobalConfig.ins().VipConfig[curLv + 1];
        var nextNeedYb = 0;
        var ybValue = 0;
        var str = "";
        if (nextConfig) {
            nextNeedYb = nextConfig.needYb - curNeedYb;
            var needYb = nextNeedYb - ybValue;
            str = "|C:0xfff7e5&T:再充值|C:0xffed21&T:" + nextNeedYb + "元||C:0xfff7e5&T:成为||C:0xffed21&T:VIP" + (vipData.lv + 1) + "|";
            // str = "|C:0xFFFFFF&T:可成为|C:0xeebe3b&T: VIP " + (vipData.lv + 1) + "|"
            this.bar.maximum = nextConfig.needYb;
            this.bar.value = curNeedYb;
            // this.priceIcon.price = nextNeedYb
            // this.desGroup.visible = true
        }
        else {
            // this.desGroup.visible = false
            str = "VIP等级已满";
            this.bar.labelDisplay.visible = false;
            this.bar.maximum = 1;
            this.bar.value = 1;
        }
        this.tipLabel.textFlow = TextFlowMaker.generateTextFlow(str);
        // this.vipLevelLabel.text = curLv + ""
    };
    VipMainPanel.LAYER_LEVEL = LayerManager.UI_Main;
    VipMainPanel.OPEN_TO_VIP_PAGE = 0;
    return VipMainPanel;
}(BaseEuiView));
__reflect(VipMainPanel.prototype, "VipMainPanel", ["ICommonWindow"]);
//# sourceMappingURL=VipMainPanel.js.map