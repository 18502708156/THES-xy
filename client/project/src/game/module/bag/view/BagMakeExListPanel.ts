/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/2 14:11
 * @meaning: 熔炼额外界面listpanel
 * 
 **/
class BagMakeExListPanel extends BaseView implements ICommonWindowTitle {

	public static readonly NAME = "熔炼"


	_mails
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // MailListSkin.exml
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected listView: eui.List
    protected allReceiveBtn: eui.Button
	bgbg

	tList = []
    ////////////////////////////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super()
		this.skinName = "BagMakeListSkin"
		this._mails = []
		this.listView.itemRenderer = BagMakeExItem
	}

	public OnOpen() {
		this.allReceiveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		this.observe(MessageDef.CHANGE_ITEM, this.UpdateContent)
		this.observe(MessageDef.BAG_DEAL_SMELT,this.UpdateContent)
		this.UpdateContent()
	}

	public OnClose() {
		this.allReceiveBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this)
		GameGlobal.MessageCenter.removeListener(MessageDef.CHANGE_ITEM, this.UpdateContent, this)
	}

	onTap(e) {
		switch (e.currentTarget) {
			case this.allReceiveBtn:
				let idx = this.tList
				let tSmelt = []
				for (const item in this.tList) {
					if(this.tList[item].select)
					{
						tSmelt.push(this.tList[item])
					}
				}
				if(tSmelt.length)
				{
					UserEquip.ins().sendSmeltEquip(tSmelt)
				}
				else
				{
					UserTips.ins().showTips("请勾选熔炼装备")
				}
		}
	}


	UpdateContent(): void {
		let list = UserBag.ins().getBagSortQualityEquips(5, 0, 1)

		let weight = (config) => {
			return config.itemConfig.quality
		}

		list.sort(function(lhs, rhs) {
			return weight(lhs) - weight(rhs)
		})
		this.tList = []
		for(let i = 0;i<12;i++)
		{
			if(list[i])
			this.tList.push(list[i])
		}
		this.listView.dataProvider = new eui.ArrayCollection(this.tList);
	}
}