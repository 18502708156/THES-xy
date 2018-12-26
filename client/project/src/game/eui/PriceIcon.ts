class PriceIcon extends BaseView {

	public static readonly ICON_INTEGRATION = "mall_res_002"
    /////////////////////////////////////////////////////////////////////////////
    // PriceIconSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected priceLabel: eui.Label;
    protected iconImg: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	private _labelColor
	private _price
	private _myCount
	private _type

	childrenCreated()
	{
		super.childrenCreated()
		if(this._labelColor)
		{
			this.priceLabel.textColor = this._labelColor;
		}
		this.iconImg.addEventListener(egret.Event.COMPLETE, this._Complete, this)
	}

	private _Complete() {
		UIHelper.SetRatio(this.iconImg, 44, 44)
	}

    /**
     * 价格
     */
	getPrice() {
		return this._price;
	}

	get price() {
		return this._price;
	}

	setPrice(value, style = 0) {
		// if (value == this._price)
		// 	return;
		this._price = value;
		// egret.callLater(this.setText,this,this.getTxtStr(style))
		this.setText(this.getTxtStr(style))
	};

	setColor(color:number) {
		this.priceLabel.textColor = color
	}

	set price(value: number) {
		this.setPrice(value)
	}

	public setPriceData(type, value) {
		this.setType(type)
		this.setPrice(value, 3)
	}

	setMyCount(value) {
		if (value == this._myCount)
			return;
		this._myCount = value;
		// egret.callLater(this.setText,this,this.getTxtStr())
		this.setText(this.getTxtStr())
		
	};


	setEnoughCount(value)
	{
		if (value == this._myCount)
			return;
		this._myCount = value;
		this.setText(this.getTextEnough())
	}

	private getTxtStr(style = 0):string
	{
		if(this._myCount != undefined)
		{
			if(this._myCount >= this._price)
			{
				return "|C:0x019704&T:" + this._myCount +  "|/" + this._price;
			}else
			{
				return "|C:0xff0000&T:" + this._myCount +  "|/" + this._price;
			}
		}else
		{
			if(style == 1)
			    return "|C:0xff00&T:" + this._price + "|" 
			else if(style == 2)
			    return this._price > 1000000? "|C:0xff00&T:" + this._price / 10000 +'万' + "|" : "|C:0xff00&T:" + this._price + "|"  
			else if (style == 3)
			{
				let curNum
				if (GameGlobal.actorModel.IsCurrency(this._type)) 
					curNum = GameGlobal.actorModel.GetNum(this._type)
				else
					curNum = GameGlobal.UserBag.GetCount(this._type)

				return curNum >= this._price ? `|C:0x019704&T:${curNum}|/${this._price}` : `|C:0xfd0000&T:${curNum}|/${this._price}`
			}
			else
				return "" + this._price;
			   	 
		}
	}

	private getTextEnough(style = 0):string
	{
		if(this._myCount != undefined)
		{
			if(this._myCount >= this._price)
			{
				return "|C:0x019704&T:" + this._price +  "|" 
			}else
			{
				return "|C:0xff0000&T:" + this._price +  "|" 
			}
		}else
		{
			return  style > 0 ? "|C:0xff00&T:" + this._price + "|" : "" 
		}
	}


	public isEnough():boolean
	{
		if(this._myCount && this._myCount >= this._price)
		{
			return true;
		}	
		return false;
	}


	set text(str) {
		this.setText(str)
	}

	setText(str) {
		str += ""
		this.priceLabel.textFlow = TextFlowMaker.generateTextFlow(str);
	}

	setData(data) {
		let id
		if (egret.is(data, "RewardData")) {
			var awards = data;
			this._type = awards.id;
			this.setPrice(awards.count);
			this.setMyCount(awards.myCount)
		}
		else if (data) {
			var itemData = data;
			this._type = itemData.itemConfig.id;
			this.setPrice(itemData.count);
		}
		this.iconImg.source = RewardData.GetCurrencyMiniRes(this._type)
	};

	setConfigData(data)
	{
		if(data&&data.id&&data.count)
		{
			this.setType(data.id)
			this.setPrice(data.count)
		}
	}
	get type() {
		return this._type
	}

	set type(value: MoneyConst) {
		this.setType(value)
	}

	getType() {
		return this._type;
	};
	setType(value: MoneyConst) {
		if (this._type == value)
			return;
		this._type = value;
		var str = PriceIcon.GetResIcon(this._type)
		this.iconImg.source = str;
	};
	get labelColor() {
		return this._labelColor;
	}
	set labelColor(value) {
		if (this._labelColor != value) {
			this._labelColor = value;
			if(this.priceLabel) this.priceLabel.textColor = this._labelColor;
		}
	}

	get typeName(): string {
		return MoneyConstToName[this._type] || ""
	}

	static GetResIcon(_type: MoneyConst) {
		return RewardData.GetCurrencyMiniRes(_type)
	}
}