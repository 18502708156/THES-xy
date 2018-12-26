class ActivityAdvanceTispPanel extends BaseEuiView {
	public static LAYER_LEVEL = LayerManager.UI_Popup;
    /////////////////////////////////////////////////////////////////////////////
    // AcitivityAdvanceTips.exml
    /////////////////////////////////////////////////////////////////////////////
    protected bg: eui.Component;
    protected iconBg: eui.Image;
    protected iocn: eui.Image;
    protected tips1Txt: eui.Label;
    protected tips2Txt: eui.Label;
    protected detailsTxt: eui.Label;
    protected auctionGroup: eui.Group;
    protected gainWayTxt: eui.Label;
    protected auctionList: eui.List;
    protected awardGroup: eui.Group;
    protected awardList: eui.List;
    protected btn: eui.Button;
    /////////////////////////////////////////////////////////////////////////////

	private m_pData = null;

	constructor() {
		super()
		this.skinName = "AcitivityAdvanceTips"
	}

	childrenCreated() {
		this.auctionList.itemRenderer = ItemBase;
		this.awardList.itemRenderer = ItemBase;
	}

	public OnOpen(...param: any[]) {
		this._AddClick(this.gainWayTxt, this.showTips)
		this._AddClick(this.btn, this.CloseSelf)
		this._AddClick(this.bg, this.CloseSelf)


		UIHelper.SetLinkStyleLabel(this.gainWayTxt);
		if (!param[0])
			return
		this.m_pData = param[0];
		this.updateCentent();
	}

	private showTips() {
		ActivityDescPanel.Show("     拍卖奖励由前五名帮会获得，排名越前奖励越好，奖励不会发放给个人，而是以帮会为单位进入拍卖行，售出后，收益平均给参与队员\n（0点通过邮寄发送奖励）", "说明")
	}

	updateCentent() {
		this.iocn.source = this.m_pData.iocn;
		this.tips1Txt.text = this.m_pData.tips1Txt;
		this.tips2Txt.text = this.m_pData.tips2Txt;
		this.detailsTxt.text = this.m_pData.detailsTxt;
		this.auctionGroup.visible = false;
		if (this.m_pData.auction) {
			this.auctionList.dataProvider = new eui.ArrayCollection(this.m_pData.auction);
			this.auctionGroup.visible = true;
			this.awardGroup.y = 707;
			this.btn.y = 864;
			this.iconBg.source = "ui_yg_bm_kfboss"
		}
		if (this.m_pData.award) {
			this.awardList.dataProvider = new eui.ArrayCollection(this.m_pData.award);
		}
	}
}