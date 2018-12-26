class AnswerRankItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RankDataItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected trank: eui.Label;
	protected tname: eui.Label;
	protected tpower: eui.Label;
	protected tOther: eui.Label;
	protected con: eui.Group;

	protected imgBg: eui.Image;


	/////////////////////////////////////////////////////////////////////////////
	private rewardList: IconWithText[];

	public constructor() {
		super();
		this.rewardList = [];


	}

	
	public childrenCreated() {
		this.tOther.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClick, this)
	}	


	protected dataChanged(): void {
		if (!this.data) {
			return;
		}


		let data = this.data 
		if(data.rank)
		{
			this.setTxtColorByRank(data.rank);
			this.trank.text = data.rank + '';
			this.imgBg.visible = data.rank%2 ? true :false
		}


		this.tname.text = data.name  || "";
		this.tpower.text = data.point || "";

		// UIHelper.SetLinkStyleLabel(this.tOther, "查看")
		

	}



	private _OnClick(e: egret.TouchEvent)
	{
		var view =  e.target
		var nY = this.y
	}

	private setTxtColorByRank(rank): void {
		let color = 0x6E330B;
		switch (rank) {
			case 1:
				color = 0xd27701;
				break;
			case 2:
				color = 0xc400fd;
				break;
			case 3:
				color = 0x2F6FF6;
				break;
		}
		this.trank.textColor = this.tname.textColor = color;
	}
}

