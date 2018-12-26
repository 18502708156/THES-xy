class RankDataItem extends eui.ItemRenderer {

	/////////////////////////////////////////////////////////////////////////////
	// RankDataItemSkin.exml
	/////////////////////////////////////////////////////////////////////////////
	protected trank: eui.Label;
	protected tname: eui.Label;
	protected tpower: eui.Label;
	protected con: eui.Group;

	protected imgBg: eui.Image;

	/////////////////////////////////////////////////////////////////////////////
	private rewardList: IconWithText[];

	public constructor() {
		super();
		this.currentState = "four"
		this.rewardList = [];
	}

	private showContent(rank): void {
		let config = GameGlobal.Arena.getRankRewards(rank);
		if (config) {
			let i = 0, len = config.length;
			let rewardCon: IconWithText;
			for (i; i < len; i++) {
				rewardCon = this.rewardList[i];
				if (!rewardCon) {
					rewardCon = new IconWithText();
					rewardCon.x = 0;
					this.con.addChild(rewardCon);
					this.rewardList.push(rewardCon);
				}
				rewardCon.setIcon(config[i].id);
				rewardCon.setCount(config[i].count + '');
				rewardCon.y = rewardCon.height * i >> 0;
			}
		}
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
		this.showContent(data.rank);

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

class IconWithText extends eui.Component {
	private icon: eui.Image;
	private count: eui.Label;

	public constructor() {
		super();
		this.icon = new eui.Image();
		this.icon.x = 0, this.icon.y = 0;
		this.addChild(this.icon);

		this.count = new eui.Label();
		this.count.textColor = 0xd27701;
		this.count.size = 24;
		this.count.x = 32;
		this.count.y = 0;
		this.addChild(this.count);
	}

	public setIcon(type): void {
		this.icon.source = RewardData.GetCurrencyMiniRes(type);
		this.icon.y = MoneyConst.yuanbao == type ? 6 : 0;
	}

	public setCount(str) {
		if (str.length > 4) {
			var wNum = Math.floor(Number(str) / 1000);
			str = wNum / 10 + "万";
		}
		this.count.text = str;
	}
}

