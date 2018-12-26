class VipIcon extends eui.Component {
	/////////////////////////////////////////////////////////////////////////////
	// VipIconSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected icon: eui.Image;
	protected vipLabel: eui.BitmapLabel
	/////////////////////////////////////////////////////////////////////////////
	private m_onlyVip = true;
	private m_vipLv: number;

	public constructor() {
		super();
		this.skinName = "VipIconSkin";
	}

	childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tap, this);
	}
	/**onlyVip 不显示vip等级  只有vip*/
	setVipLv(vipLv: number, onlyVip = false) {
		this.m_vipLv = vipLv;
		this.m_onlyVip = onlyVip;
		this.updateSource()
		this.setFiltersGray()
	}

	private setFiltersGray() {
		this.filters = this.m_vipLv > 0 ? null : Color.GetFilter();
	}

	private updateSource() {
		let config = GameGlobal.Config.VipConfig[this.m_vipLv]
		if (config)
			this.icon.source = config.vipicon;
		this.vipLabel.text = `VIP${!this.m_onlyVip ? this.m_vipLv : ''}`;
	}

	private tap() {
		ViewManager.ins().open(VipMainPanel);
	}
}