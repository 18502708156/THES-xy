class MiniMap extends eui.Component implements eui.UIComponent {
	public bg: eui.Image
	public all: eui.Group

	private imgList: eui.Image[] = []

	public constructor() {
		super();
	}

	public _setBg(str) {
		this.bg.source = str;
	}

	public _setRole(handle: MoveTeam) {
		let mem = handle.mMember[0]
		if (!mem) {
			console.warn("not found mem => ")
			return
		}
		let img = this.imgList.pop() || new eui.Image
		img.visible = true
		img.x = mem.mTarget.x / 15;
		img.y = mem.mTarget.y / 15;
		let color = GameGlobal.CrossBattleModel.TYPECOLOR[GameGlobal.CrossBattleModel.getPlayerCamp(handle.mMasterHandle)]
		img.source = color
		img.name = handle.mMasterHandle.toString()
		this.all.addChild(img);
	}

	public _removeRole(handle: MoveTeam) {
		DisplayUtils.removeFromParent(this.getChildByName(handle.mMasterHandle.toString()))
	}

	public _removeAll() {
		for (let data of this.all.$children) {
			data.visible = false
			this.imgList.push(data as eui.Image)
		}
		this.all.removeChildren();
	}

	public citySet(num: number) {
		for (let i = 0; i < 4; i++) {
			let city = this["city" + i] as MiniMapCityInfoItem
			city.citySet(i)
		}
	}
}

class MiniMapCityInfoItem extends eui.Component implements eui.UIComponent {

	public typeImg: eui.Image;
	public pro: eui.ProgressBar;
	public constructor() {
		super();
		this.skinName = "MiniMapCityInfoSkin"
	}

	childrenCreated() {
		this.pro.labelDisplay.visible = false
	}

	public citySet(num: number) {
		let data = GameGlobal.CrossBattleModel.getCitysInfo(num)
		if (!data) {
			return
		}
		this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[data.currcamp]
		this.pro.maximum = data.maxhp;
		this.pro.value = data.currhp;
	}
}

class MapCity extends eui.Component implements eui.UIComponent {
	public cityName: eui.Image;
	public list: eui.List;

	public constructor() {
		super();
		this.skinName = "MapCitySkin"
		this.list.itemRenderer = HeadItem
	}
     
	public citySrc(src:string) {
		this.cityName.source = src
	}

	public cityHead(data) {
        this.list.dataProvider = new eui.ArrayCollection(data)
	} 

}