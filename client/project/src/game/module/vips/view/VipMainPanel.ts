class VipMainPanel extends BaseEuiView implements ICommonWindow {
	public static LAYER_LEVEL = LayerManager.UI_Main

	//vip 0 的时候依然显示vip 1 的奖励内容 by al 修改 18.5.17

	/////////////////////////////////////////////////////////////////////////////
	// VipMainSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonWindowBg: CommonWindowBg;
	protected vipLabel: eui.BitmapLabel;
	protected btnRecharge: eui.Button;
	protected tipLabel: eui.Label;
	// protected vipTipsLabel: eui.Label;
	protected bar: eui.ProgressBar;
	protected thumb: eui.Image;
	protected labelDisplay: eui.Label;
	protected vipLabel3: eui.Label;
	protected btnNext: eui.Button;
	protected btnPrev: eui.Button;
	protected vipLabel2: eui.Label;
	protected received: eui.Image;
	protected btnReceived: eui.Button;
	protected vipDes: eui.Label;
	protected list0: eui.List;
	protected listScroll: eui.Scroller
	protected rightBtn: eui.Button;
	protected leftBtn: eui.Button;
	protected redPoint1Img: eui.Image;
	protected redPoint2Img: eui.Image;
	protected giftImg: eui.Image;
	protected tipsImg: eui.Image;
	/////////////////////////////////////////////////////////////////////////////


	private mListLRBtnCtrl: ListLRBtnCtrl;


	public constructor() {
		super()
		this.skinName = "VipMainSkin";

	}
	public childrenCreated() {
		this.commonWindowBg.title = "VIP"

		this.mListLRBtnCtrl = new ListLRBtnCtrl(this.list0, this.leftBtn, this.rightBtn, 110)
		this.mListLRBtnCtrl.mNotVisible = true;
		this.mListLRBtnCtrl.OnRefresh();

		this.vmodel.getVipConfig()

		this.list0.itemRenderer = ItemBaseNotName
	}
	public static OPEN_TO_VIP_PAGE = 0



	public OnOpen(...args: any[]) {
		this.commonWindowBg.OnAdded(this)

		// GameGlobal.PalyerInfoModel.sendOtherId(this.palyerId);
		// this.observe(MessageDef.PALYER_INFO, this.updateContent)
		this._AddClick(this.btnNext, this._OnClick)
		this._AddClick(this.btnPrev, this._OnClick)
		this._AddClick(this.btnRecharge, this._OnClick)
		this._AddClick(this.btnReceived, this._OnClick)
		this.observe(MessageDef.UPDATA_VIP_AWARDS, this.updateContent)


		this.changeExpBar();

		this.vip = GameGlobal.actorModel.vipLv || 1
		this.updateAwardsList(this.vip)

		this.updateContent()

		this.vipLabel.text = GameGlobal.actorModel.vipLv + ""
	}

	private vmodel = GameGlobal.VipModel
	private vip: number
	private updateContent() {

		// this.changeExpBar();
		this.changeExpBar();
		if (VipMainPanel.OPEN_TO_VIP_PAGE) {
			this.vip = VipMainPanel.OPEN_TO_VIP_PAGE
			VipMainPanel.OPEN_TO_VIP_PAGE = null;
		} else {
			for (let i = 1; i <= UserVip.ins().lv; i++) {
				if (UserVip.ins().CheckRedPoint(i)) {
					this.vip = i;
					this.gotoDes(i);
					break
				}
				if (i == UserVip.ins().lv) {
					this.vip = UserVip.ins().lv >= UserVip.MAX_LV ? UserVip.MAX_LV : UserVip.ins().lv + 1;
				}
			}
		}
		this.gotoDes(this.vip);
	}

	public OnClose() {
		this.commonWindowBg.OnRemoved()
	}

	private _OnClick(e: egret.TouchEvent) {
		switch (e.currentTarget) {
			case this.btnNext:
				this.nextVipDes()
				break;
			case this.btnPrev:
				this.prevVipDes()
				break;
			case this.btnRecharge:
				RechargeWin.Open()
				ViewManager.ins().close(VipMainPanel)
				break;
			case this.btnReceived:
				UserVip.ins().sendGetAwards(this.vip)
				break;
		}
	}

	private nextVipDes() {
		if (this.vip <= this.vmodel.configData.length) {
			if (this.vip == this.vmodel.configData.length) {
				this.vip = this.vmodel.configData.length;
			} else {
				++this.vip
			}
			if (this.vip > 1) {
				this.btnPrev.visible = true
			}
			this.gotoDes(this.vip)
		}

	}

	private gotoDes(vipLv) {
		let vipDec = this.vmodel.getVipDes(vipLv)
		this.vipDes.textFlow = TextFlowMaker.generateTextFlow(vipDec)
		this.vipLabel2.text = "VIP " + vipLv + " 特权"
		this.vipLabel3.text = "VIP " + vipLv + " 礼包"
		// this.vipTipsLabel.text = this.vmodel.getVipsDes(vipLv)
		this.updateAwardsList(vipLv)
		this.changeBtnState()
	}

	private changeBtnState() {
		if (this.vip > 1)
			this.redPoint1Img.visible = UserVip.ins().CheckRedPoint(this.vip - 1)
		else
			this.redPoint1Img.visible = false;
		if (this.vip < UserVip.MAX_LV)
			this.redPoint2Img.visible = UserVip.ins().CheckRedPoint(this.vip + 1)
		else
			this.redPoint2Img.visible = false;

		let state = BitUtil.Has(UserVip.ins().state, this.vip)
		if (state) {
			this.received.visible = true
			this.btnReceived.visible = false
		} else {
			this.received.visible = false
		}

		if (this.vip > GameGlobal.actorModel.vipLv) {
			this.btnReceived.visible = false
		} else {

			if (GameGlobal.actorModel.vipLv) {
				let state = BitUtil.Has(UserVip.ins().state, this.vip)
				if (state) {
					this.received.visible = true
					this.btnReceived.visible = false
				} else {
					this.btnReceived.visible = true
				}
			}
			else {
				this.btnReceived.visible = false
			}

		}

		//按钮显示
		if (this.vip <= 1) {
			this.btnPrev.visible = false
		}
		else {
			this.btnPrev.visible = true
		}


	}


	private prevVipDes() {
		if (this.vip <= this.vmodel.configData.length) {
			--this.vip
			if (this.vip <= 1) {
				// this.btnPrev.visible = false
				this.vip = 1;
			}
			this.gotoDes(this.vip)
		}

	}


	//更新vip等级奖励
	private updateAwardsList(vip: number) {
		let awardsData = this.vmodel.getVipAward(vip)
		this.list0.dataProvider = new eui.ArrayCollection(awardsData)

		// this.list0.validateNow();

		// this.listScroll.validateNow()
		if (awardsData.length >= 5) {
			// this.list0.width = 500
			this.leftBtn.visible = true
			this.rightBtn.visible = true
		} else {
			this.leftBtn.visible = false
			this.rightBtn.visible = false
		}
		this.giftImg.source = GameGlobal.Config.VipConfig[this.vip].giftSrc
		this.tipsImg.source = GameGlobal.Config.VipConfig[this.vip].tipsSrc
	}

	private getBarInfo() {
		var nextConfig = GlobalConfig.ins().VipConfig[this.vip + 1];
		var curNeedYb = UserVip.ins().exp;
		var curNeedYb = UserVip.ins().exp;
		if (nextConfig) {
			this.bar.maximum = nextConfig.needYb;
			this.bar.value = curNeedYb;
		} else {
			// str = "VIP等级已满";
			this.bar.labelDisplay.visible = false;
			this.bar.maximum = 1;
			this.bar.value = 1;
		}
	}


	/**经验进度条改变 */
	private changeExpBar() {

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
	}
}

