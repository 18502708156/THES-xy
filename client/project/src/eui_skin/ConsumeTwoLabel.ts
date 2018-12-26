class ConsumeTwoLabel extends eui.Component implements  eui.UIComponent {
    /////////////////////////////////////////////////////////////////////////////
    // ConsumeTwoLabelSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected priceicon: PriceIcon;
    protected typeImg: eui.Image;
    protected priceLabel: eui.Label;
    /////////////////////////////////////////////////////////////////////////////

	public Set(datas: {type: number, id: number, count: number}[]) {
		for (let data of datas) {
			this.Data(data)
		}
	}

	
	childrenCreated() {
		this.typeImg.addEventListener(egret.Event.COMPLETE, this._Complete, this)
	}

	private _Complete() {
		UIHelper.SetRatio(this.typeImg, 44, 44)
	}


	private Data(data: {type: number, id: number, count: number}) {
		if (data.type == 1) {
			this.typeImg.source = RewardData.GetCurrencyMiniRes(data.id)
			this.priceLabel.textFlow = ConsumeLabel.GetValueColor(GameGlobal.UserBag.GetCount(data.id), data.count)
		} else {
			this.priceicon.type = data.id
			this.priceicon.price = data.count
		}
		
	}

}