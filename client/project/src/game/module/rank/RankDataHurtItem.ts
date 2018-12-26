class RankDataHurtItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RankDataItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected trank: eui.Label;
	protected tname: eui.Label;
	protected tpower: eui.Label;
	protected con: eui.Group;

	protected imgBg: eui.Image;

	/////////////////////////////////////////////////////////////////////////////

	public constructor() {
		super();
		this.currentState = "three"
	}



	private setPower(str) {
		if (str.length > 4) {
			var wNum = Math.floor(Number(str) / 1000);
			str = wNum / 10 + "万";
		}
		this.tpower.text = str;
	}

	protected dataChanged(): void {
		if (!this.data) {
			return;
		}
		let data: Sproto.rank_data = this.data as Sproto.rank_data;
		this.setTxtColorByRank(data.rank);
		this.trank.text = data.rank + '';
		this.tname.text = data.name;
		this.setPower(data.value + '');

		this.imgBg.visible = data.rank%2 ? true :false
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
