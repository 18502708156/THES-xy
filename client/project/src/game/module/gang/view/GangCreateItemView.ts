class GangCreateItemView extends eui.Component {

	/////////////////////////////////////////////////////////////////////////////
    // GangCreateItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected labTitle: eui.Label;
    protected labMaxMemTip: eui.Label;
    protected labCopyTip: eui.Label;
	protected labLevelTip: eui.Label;
	protected labVipLevelTip: eui.Label;
	protected priceIcon: PriceIcon;
	protected imgChoose: eui.Image;
	protected imgDouble: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	private mIdx: number

	public constructor() {
		super()
	}

	public SetItemInfo(level) {
		this.mIdx = level
		let config = GameGlobal.Config.GuildCreateConfig[level]
		this.labTitle.text = `${level}级帮会`
		this.labMaxMemTip.text = `帮会成员上限：${GangConst.GetMaxMemberCount(level)}人`
		this.labCopyTip.text = level > 1 ? `开启${level}级副本` : ""
		this.labLevelTip.text = `1.等级达到${config.level}级`
		this.labVipLevelTip.text = `2.VIP等级达到${config.vipLv}级`

		this.priceIcon.type = config.cost.id
		this.priceIcon.price = config.cost.count
	}

	public SetDoubleImg(b) {
		this.imgDouble.visible = b
	}

	public SetChooseInfo(chooseIdx) {
		this.imgChoose.visible = this.mIdx == chooseIdx
	}
}