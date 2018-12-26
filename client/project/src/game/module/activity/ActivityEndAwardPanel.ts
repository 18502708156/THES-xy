class ActivityEndAwardPanel extends BaseEuiView {

	public static LAYER_LEVEL = LayerManager.UI_Popup;
	/////////////////////////////////////////////////////////////////////////////
	// AcivityEndAwardSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected commonDialog: CommonDialog;
	protected whiteBgshort: eui.Image;
	protected whiteBglength: eui.Image;
	protected rankBg: eui.Image;
	protected awardGroup: eui.Group;
	protected awardList: eui.List;
	protected auctionGroup: eui.Group;
	protected auctionList: eui.List;
	protected icon1: eui.Component;
	protected icon2: eui.Component;
	protected rankTxt: eui.Label;
	protected closeBtn: eui.Button;
	protected cloudNineGroup: eui.Group;
	protected roleShowPanel: RoleShowPanel;
	protected cloudNineNameTxt: eui.Label;
	/////////////////////////////////////////////////////////////////////////////

	private m_pData: activityEndAwardData;
	public constructor() {
		super();
		this.skinName = "AcivityEndAwardSkin"
		this.awardList.itemRenderer = ItemBase
		this.auctionList.itemRenderer = ItemBase
	}

	public OnOpen(...param: any[]) {
		this.commonDialog.OnAdded(this);
		this.commonDialog.notClickMask = true;
		if (param[0]) {
			this.m_pData = param[0]
			this.commonDialog.title = this.m_pData.paneltitle;
			this.updateCentent()
		}
		this._AddClick(this.closeBtn, this.tap)
	}

	tap() {
		this.CloseSelf()
	}

	updateCentent() {
		this.rankTxt.text = this.m_pData.rankTxt;

		this.cloudNineGroup.visible = false;
		if (this.m_pData.shows) {
			this.cloudNineNameTxt.text = this.m_pData.shows.name + `  S.${this.m_pData.shows.serverid}`;
			let roleShowData = new RoleShowData();
			roleShowData.sex = this.m_pData.shows.sex;
			roleShowData.job = this.m_pData.shows.job;
			roleShowData.shows = this.m_pData.shows.shows;
			this.roleShowPanel.SetAll(roleShowData);
			this.cloudNineGroup.visible = true;
		}

		this.icon1.visible = false;
		if (this.m_pData.icon1) {
			let icon1 = (this.icon1 as messageIcon)
			icon1.icon.source = this.m_pData.icon1.iconSrc
			icon1.iconbg.source = this.m_pData.icon1.iconBgSrc
			icon1.titleNameTxt.text = this.m_pData.icon1.titleName;
			icon1.nameTxt.text = this.m_pData.icon1.name;
			if (this.m_pData.icon1.banghuiTxt)
				icon1.banghuiTxt.text = this.m_pData.icon1.banghuiTxt
			this.icon1.visible = true;
			if (this.m_pData.icon2)
				this.icon1.x = 113;

		}

		this.icon2.visible = false;
		if (this.m_pData.icon2) {
			let icon2 = (this.icon2 as messageIcon)
			icon2.icon.source = this.m_pData.icon2.iconSrc
			icon2.iconbg.source = this.m_pData.icon2.iconBgSrc
			icon2.titleNameTxt.text = this.m_pData.icon2.titleName;
			icon2.nameTxt.text = this.m_pData.icon2.name;
			this.icon2.visible = true;
		}

		this.auctionGroup.visible = false;
		if (this.m_pData.auction) {
			this.auctionList.dataProvider = new eui.ArrayCollection(this.m_pData.auction);
			this.auctionGroup.visible = true;
		} else {//没有拍卖奖励情况
			this.awardGroup.y = 670;
			this.whiteBglength.visible = false;
			this.rankBg.visible = this.rankTxt.text != '';
		}

		this.awardGroup.visible = false;
		if (this.m_pData.award) {
			this.awardGroup.visible = true;
			this.awardList.dataProvider = new eui.ArrayCollection(this.m_pData.award);
		}
	}

	public OnClose() {
		GameGlobal.CommonRaidModel.MapLeave()
	}
}

interface messageIcon extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// ActivityEndAwardIconSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	nameTxt: eui.Label;
	titleNameTxt: eui.Label;
	icon: eui.Image;
	iconbg: eui.Image;
	banghuiTxt: eui.Label
	/////////////////////////////////////////////////////////////////////////////

}

class activityEndAwardData {
	paneltitle: string
	icon1: { titleName, name, iconSrc, iconBgSrc, banghuiTxt }
	icon2: { titleName, name, iconSrc, iconBgSrc, banghuiTxt }
	rankTxt: string;
	auction: any;
	award: any
	shows
}