class MailItem extends eui.ItemRenderer {

	tipLabel
	nameLabel
	dateLabel
	treasure
	rate
	give//奖励图片组

	public constructor() {
		super()

		this.skinName = "MailItemSkin"
		this.tipLabel = null
	}

	dataChanged() {
		
		var e = this.data;

		//只有在未读未领取的东西才会有物品图标显示
		if(e.receive===0)
		{
			this.give.visible = true	
		}
		else
		{
			this.give.visible = false	
		} 

		let exStr = e.type ? "(已读)" : "(未读)";
		let exColor = e.type ? Color.l_normal : Color.l_green_1
		e instanceof MailData && (this.nameLabel.textFlow = TextFlowMaker.generateTextFlow(`|T:${e.title}|C:${exColor}&T:${exStr}|`), 
		this.dateLabel.text = DateUtils.getFormatBySecond(e.times, 2))
		
	}
}