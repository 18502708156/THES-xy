class MainCityView extends egret.DisplayObjectContainer {
	public constructor() {
		super();
		this.initMap()
	}

	//MapCity:eui.UIComponent

	city0: eui.UIComponent
	city1: eui.UIComponent
	city2: eui.UIComponent
	city3: eui.UIComponent

	public initMap() {
		let ConfigKing = GameGlobal.Config.KingCityConfig;
		let ConfigBase = GameGlobal.Config.KingBaseConfig
		let arry: any[] = ["citypos", "rcitypos", "xcitypos", "mcitypos"]
		for (let i = 0; i < 4; i++) {
			this["city" + i] = new MapCity();
			this["city" + i].citySrc(ConfigKing[i + 1][10].icon);
			this["city" + i].x = ConfigBase[arry[i]][0];
			this["city" + i].y = ConfigBase[arry[i]][1];
			this.addChild(this["city" + i]);
			this["city" + i]["cityName"].pixelHitTest = true
			this["city" + i]["cityName"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this)
		}
	}

	public setRoleHead(i, data) {
		this["city" + i].cityHead(data);
	}

	public click(e: egret.TouchEvent) {
		let index = 0;
		switch (e.currentTarget) {
			case this.city0["cityName"]:
				index = CityType.MINCITY;
				break;
			case this.city1["cityName"]:
				index = CityType.PERCITY;
				break;
			case this.city3["cityName"]:
				index = CityType.MOCITY;
				break;
			case this.city2["cityName"]:
				index = CityType.XIANCITY;
				break;
		}
		if(GameGlobal.CrossBattleModel.status == 1){
			return UserTips.InfoTip("活动还未开始")
		}
		GameGlobal.CrossBattleModel.sendKingCityData(index);
	}

}

enum CityType {
	MINCITY = 0,
	PERCITY = 1,
	XIANCITY = 2,
	MOCITY = 3
}
